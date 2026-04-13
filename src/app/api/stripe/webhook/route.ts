import Stripe from "stripe";

/**
 * Stripe webhook — fulfill coin packs + VIP subscription events.
 * Use service role on Supabase to write wallets + wallet_transactions + subscriptions.
 *
 * TODO: Verify signature with STRIPE_WEBHOOK_SECRET.
 * TODO: Idempotency keys on wallet_transactions (Stripe event id).
 * TODO: Map Price IDs to coin amounts in env or database config table.
 */
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
    case "checkout.session.completed":
      // TODO: credit coins or attach subscription row
      break;
    case "invoice.paid":
      // TODO: VIP renewal benefits
      break;
    default:
      break;
  }

  return Response.json({ received: true });
}
