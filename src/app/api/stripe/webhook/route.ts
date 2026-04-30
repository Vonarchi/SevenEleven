import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/service";

async function fulfillCheckoutSession(event: Stripe.Event, session: Stripe.Checkout.Session) {
  const service = createServiceClient();
  if (!service) {
    throw new Error("Supabase service role is not configured.");
  }

  const userId = session.metadata?.user_id ?? session.client_reference_id;
  if (!userId) {
    throw new Error("Checkout session is missing user metadata.");
  }

  if (session.mode === "payment" && session.metadata?.item_type === "coin_pack") {
    const amount = Number(session.metadata.coin_amount ?? 0);

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Checkout session is missing a valid coin amount.");
    }

    const { error } = await service.rpc("credit_wallet", {
      p_user_id: userId,
      p_amount: amount,
      p_type: "coin_purchase",
      p_source: "stripe_checkout",
      p_metadata: {
        stripe_event_id: event.id,
        stripe_session_id: session.id,
        stripe_payment_intent_id:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id,
        item_key: session.metadata.item_key,
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  if (session.mode === "subscription") {
    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

    const { error } = await service.from("subscriptions").upsert(
      {
        user_id: userId,
        stripe_customer_id:
          typeof session.customer === "string" ? session.customer : session.customer?.id,
        stripe_subscription_id: subscriptionId,
        plan: session.metadata?.item_key ?? "vip-monthly",
        status: "active",
      },
      { onConflict: "stripe_subscription_id" },
    );

    if (error) {
      throw new Error(error.message);
    }

    await service.from("profiles").update({ vip_status: true }).eq("id", userId);
  }
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret || !webhookSecret) {
    return Response.json(
      { error: "Stripe is not configured on the server." },
      { status: 501 },
    );
  }

  const stripe = new Stripe(secret);
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return Response.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid payload";
    return Response.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      await fulfillCheckoutSession(event, event.data.object as Stripe.Checkout.Session);
      break;
    }
    case "customer.subscription.deleted": {
      const service = createServiceClient();
      const subscription = event.data.object as Stripe.Subscription;

      if (service) {
        await service
          .from("subscriptions")
          .update({ status: subscription.status })
          .eq("stripe_subscription_id", subscription.id);

        const userId = subscription.metadata?.user_id;
        if (userId) {
          await service.from("profiles").update({ vip_status: false }).eq("id", userId);
        }
      }
      break;
    }
    default:
      break;
  }

  return Response.json({ received: true });
}
