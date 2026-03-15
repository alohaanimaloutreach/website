import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email is required' }), { status: 400 });
    }

    // Find the customer by email
    const customers = await stripe.customers.list({ email, limit: 1 });

    if (customers.data.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No donor account found with that email' }),
        { status: 404 }
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: `${new URL(request.url).origin}/donate`,
    });

    return new Response(JSON.stringify({ url: session.url }));
  } catch (err: any) {
    console.error('Donor portal error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
