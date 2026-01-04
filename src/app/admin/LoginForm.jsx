"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export default function LoginForm() {
  const [email, setEmail] = useState(""); // Changed from username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Sign in with Firebase Auth using email
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Check if user is admin
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists() && userDoc.data().isAdmin) {
        // Set cookie for middleware
        await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uid: user.uid }),
        });

        router.push("/admin");
        router.refresh();
      } else {
        setError("Access denied. Admin privileges required.");
        await auth.signOut();
      }
    } catch (error) {
      setError("Invalid credentials or access denied.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center items-center mt-20 space-y-5"
    >
      <h2 className="text-xl font-bold">Admin Login</h2>

      <input
        type="email" // Changed to email type
        value={email} // Changed from username
        onChange={(e) => setEmail(e.target.value)} // Changed handler
        placeholder="Email Address" // Changed placeholder
        className="border px-3 py-2 rounded"
        required
        disabled={isLoading}
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="border px-3 py-2 rounded"
        required
        disabled={isLoading}
      />

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
}
