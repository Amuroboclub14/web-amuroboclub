// app/api/login/route.js
import { cookies } from "next/headers";

export async function POST(req) {
  const body = await req.json();
  const { username, password, uid } = body;

  // Handle Firebase Auth login
  if (uid) {
    const cookieStore = cookies();
    cookieStore.set({
      name: "auth",
      value: "true",
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24,
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  // Fallback to environment variables
  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    const cookieStore = cookies();
    cookieStore.set({
      name: "auth",
      value: "true",
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24,
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  return new Response(JSON.stringify({ success: false }), { status: 401 });
}
