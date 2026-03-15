import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const { amount, interval } = await request.json();

    if (!amount || amount < 1) {
      return new Response(JSON.stringify({ error: 'Invalid amount' }), { status: 400 });
    }

    const amountInCents = Math.round(amount * 100);

    if (interval === 'monthly') {
      // Create a price for the recurring amount
      const price = await stripe.prices.create({
        unit_amount: amountInCents,
        currency: 'usd',
        recurring: { interval: 'month' },
        product_data: {
          name: `Monthly Donation: $${amount}/mo`,
        },
      });

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: price.id, quantity: 1 }],
        success_url: `${new URL(request.url).origin}/donate/thank-you`,
        cancel_url: `${new URL(request.url).origin}/donate`,
      });

      return new Response(JSON.stringify({ url: session.url }));
    }

    // One-time payment
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: `One-Time Donation: $${amount}` },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${new URL(request.url).origin}/donate/thank-you`,
      cancel_url: `${new URL(request.url).origin}/donate`,
    });

    return new Response(JSON.stringify({ url: session.url }));
  } catch (err: any) {
    console.error('Stripe checkout error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
