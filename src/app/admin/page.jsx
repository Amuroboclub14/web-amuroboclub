import { cookies } from "next/headers";
import AdminDashboard from "./AdminDashboard";
import LoginForm from "./LoginForm";

export default function AdminPage() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get("auth");

  // Check if user is authenticated
  const isAuthenticated = authCookie?.value === "true";

  if (isAuthenticated) {
    return <AdminDashboard />;
  }

  return <LoginForm />;
}
