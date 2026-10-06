"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Dialog from "./Dialog";

export default function AuthForm() {
  const [checkEmailOpen, setCheckEmailOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    
    if (error) {
      console.error("Error signing up:", error.message);
      return;
    }

    setCheckEmailOpen(true);
  }

  return (
    <div className="bg-surface rounded-md shadow-sm p-8 w-full max-w-sm">
      <h1 className="text-xl font-semibold mb-6">Sign Up</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm text-gray-600">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

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
          Sign Up
        </button>
      </form>

      <button className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-800 transition-colors">
        Already have an account? <Link href="/login">Sign in</Link>
      </button>

      <Dialog
        open={checkEmailOpen}
        onClose={() => setCheckEmailOpen(false)}
        title="Check your email"
        message="A confirmation email has been sent to your email address. Please check your inbox and follow the instructions to complete the sign-up process."
      />
    </div>
  );
}
