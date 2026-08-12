// Vercel serverless function — contact form -> Resend.
// Requires the RESEND_API_KEY environment variable in the Vercel dashboard.

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const FROM = process.env.RESEND_FROM || 'Portfolio Contact <onboarding@resend.dev>';
const TO = process.env.RESEND_TO || 'itsmebk2007@gmail.com';

function respond(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export default async function handler(req) {
  if (req.method !== 'POST') return respond(405, { error: 'Method not allowed' });

  let payload;
  try {
    payload = await req.json();
  } catch {
    return respond(400, { error: 'Invalid JSON body' });
  }

  const name = (payload.name || '').toString().trim();
  const email = (payload.email || '').toString().trim();
  const message = (payload.message || '').toString().trim();

  if (!name || !email || !message) {
    return respond(400, { error: 'Missing required fields: name, email, message' });
  }
  if (name.length > 120 || email.length > 320 || message.length > 10000) {
    return respond(400, { error: 'Input too long' });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return respond(400, { error: 'Invalid email address' });
  }

  if (!RESEND_API_KEY) {
    return respond(503, { error: 'Email service is not configured yet.' });
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email,
        subject: `Portfolio contact: ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`
      })
    });
    if (!res.ok) {
      const err = await res.text().catch(() => '');
      return respond(502, { error: `Email service error (${res.status})` });
    }
    return respond(200, { received: true });
  } catch {
    return respond(502, { error: 'Email service unavailable' });
  }
}
