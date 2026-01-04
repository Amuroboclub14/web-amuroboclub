import { cookies } from "next/headers";

export async function POST(req) {
  const cookieStore = cookies();
  cookieStore.set({
    name: "auth",
    value: "",
    path: "/",
    maxAge: 0, // delete cookie
  });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
