import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { getCheckoutItem, getStripePriceId } from "@/lib/store/catalog";

function getBaseUrl(request: Request) {
  return process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
}

function backToStore(request: Request, error: string) {
  const url = new URL("/store", getBaseUrl(request));
  url.searchParams.set("error", error);
  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return backToStore(request, "Stripe is not configured on the server.");
  }

  const supabase = await createClient();
  if (!supabase) {
    return backToStore(request, "Supabase is not configured.");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = new URL("/auth", getBaseUrl(request));
    url.searchParams.set("next", "/store");
    return NextResponse.redirect(url, { status: 303 });
  }

  const formData = await request.formData();
  const itemKey = String(formData.get("itemKey") ?? "");
  const item = getCheckoutItem(itemKey);

  if (!item) {
    return backToStore(request, "Unknown checkout item.");
  }

  const price = getStripePriceId(item);
  if (!price) {
    return backToStore(request, `${item.name} is missing its Stripe Price ID.`);
  }

  const baseUrl = getBaseUrl(request);
  const stripe = new Stripe(secret);
  const session = await stripe.checkout.sessions.create({
    mode: item.mode,
    customer_email: user.email ?? undefined,
    client_reference_id: user.id,
    line_items: [{ price, quantity: 1 }],
    success_url: `${baseUrl}/store?checkout=success`,
    cancel_url: `${baseUrl}/store?checkout=cancelled`,
    metadata: {
      user_id: user.id,
      item_key: item.key,
      item_type: item.kind,
      coin_amount: String(item.coinAmount ?? 0),
    },
    subscription_data:
      item.mode === "subscription"
        ? {
            metadata: {
              user_id: user.id,
              item_key: item.key,
              item_type: item.kind,
            },
          }
        : undefined,
  });

  if (!session.url) {
    return backToStore(request, "Stripe did not return a checkout URL.");
  }

  return NextResponse.redirect(session.url, { status: 303 });
}
