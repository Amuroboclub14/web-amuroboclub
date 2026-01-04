import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get("auth");
  
  const isAuthenticated = authCookie?.value === "true";
  
  return Response.json({ authenticated: isAuthenticated });
}