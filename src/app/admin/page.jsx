"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  // Check localStorage on mount to stay logged in
  useEffect(() => {
    if (localStorage.getItem("loggedIn") === "true") {
      setLoggedIn(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      setLoggedIn(true);
      localStorage.setItem("loggedIn", "true"); // persist client-side
    } else {
      setError("Invalid credentials");
    }
  };

  const handleLogout = async () => {
    setLoggedIn(false);
    localStorage.removeItem("loggedIn");
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
  };

  if (loggedIn) {
    return (
      <div className="text-center mt-20">
        <h1>Welcome to Admin Panel 🚀</h1>
        <button
          onClick={handleLogout}
          className="mt-5 bg-red-500 text-white px-4 py-2"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center items-center mt-20 space-y-5"
    >
      <h2 className="text-xl font-bold">Admin Login</h2>

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="border px-3 py-2"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="border px-3 py-2"
      />

      <button type="submit" className="bg-blue-500 text-white px-4 py-2">
        Login
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
