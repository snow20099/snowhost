const POSTMARK_API_TOKEN = process.env.POSTMARK_API_TOKEN!;

export async function POST(req: Request) {
  const { email, verificationLink } = await req.json();

  if (!email || !verificationLink) {
    return new Response(JSON.stringify({ error: "Missing email or link" }), { status: 400 });
  }

  const res = await fetch("https://api.postmarkapp.com/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "X-Postmark-Server-Token": POSTMARK_API_TOKEN,
    },
    body: JSON.stringify({
      From: "info@snowhost.cloud",
      To: email,
      Subject: "Please verify your email",
      HtmlBody: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
      TextBody: `Please verify your email by clicking on this link: ${verificationLink}`,
    }),
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Failed to send verification email" }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
