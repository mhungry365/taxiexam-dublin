"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const supabase = createSupabaseBrowserClient();
    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } }
          });

    setLoading(false);
    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    if (mode === "register" && !result.data.session) {
      setMessage("Check your email to confirm your account, then log in.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card className="mx-auto max-w-md p-6 shadow-soft">
      <h1 className="text-3xl font-black text-navy">{mode === "login" ? "Welcome back" : "Create your account"}</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {mode === "login" ? "Continue your TaxiPass Dublin study plan." : "Start tracking your four-week SPSV prep plan."}
      </p>
      <form onSubmit={submit} className="mt-6 grid gap-4">
        {mode === "register" && (
          <label className="grid gap-2 text-sm font-semibold">
            Full name
            <Input value={fullName} onChange={(event) => setFullName(event.target.value)} required />
          </label>
        )}
        <label className="grid gap-2 text-sm font-semibold">
          Email
          <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label className="grid gap-2 text-sm font-semibold">
          Password
          <Input type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        {message && <p className="rounded-md bg-cream p-3 text-sm font-semibold text-navy">{message}</p>}
        <Button disabled={loading}>{loading ? "Working..." : mode === "login" ? "Login" : "Register"}</Button>
      </form>
      <p className="mt-5 text-sm text-muted-foreground">
        {mode === "login" ? "New here?" : "Already registered?"}{" "}
        <Link className="font-bold text-teal" href={mode === "login" ? "/register" : "/login"}>
          {mode === "login" ? "Create an account" : "Login"}
        </Link>
      </p>
    </Card>
  );
}
