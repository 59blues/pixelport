"use client";

import { useState } from "react";
import {supabase} from "@/lib/supabaseClient";
import Link from "next/link";

export default function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
            console.error("Error signing up:", error.message);
            return;
        }
    }
  }

  return (
    <div className="bg-surface rounded-md shadow-sm p-8 w-full max-w-sm">
      <h1 className="text-xl font-semibold mb-6">
        Sign In
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm text-gray-600">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm text-gray-600">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        <button
          type="submit"
          className="mt-2 bg-nav-base text-white rounded-md py-2 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Sign In
        </button>
      </form>

      <button
        className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        Dont have an account? <Link href="/signup">Sign up</Link>
      </button>
    </div>
  );
}
