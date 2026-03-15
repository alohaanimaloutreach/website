import type { APIRoute } from 'astro';
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return new Response(
        JSON.stringify({ success: false, error: 'Name and email are required' }),
        { status: 400 }
      );
    }

    await resend.contacts.create({
      email,
      firstName: name,
      audienceId: import.meta.env.RESEND_AUDIENCE_ID,
    });

    return new Response(JSON.stringify({ success: true }));
  } catch (err: any) {
    console.error('Newsletter signup error:', err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
};
