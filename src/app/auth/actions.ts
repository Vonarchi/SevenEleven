"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function safeNextPath(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return "/lobby";
  }

  return value;
}

function redirectWithMessage(
  kind: "error" | "notice",
  message: string,
  next: string,
): never {
  const params = new URLSearchParams({
    [kind]: message,
    next,
  });

  redirect(`/auth?${params.toString()}`);
}

export async function authenticate(formData: FormData) {
  const supabase = await createClient();
  const next = safeNextPath(formData.get("next"));

  if (!supabase) {
    redirectWithMessage("error", "Supabase is not configured.", next);
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const intent = formData.get("intent");

  if (!email || !password) {
    redirectWithMessage("error", "Email and password are required.", next);
  }

  if (intent === "sign-up") {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: next,
      },
    });

    if (error) {
      redirectWithMessage("error", error.message, next);
    }

    if (!data.session) {
      redirectWithMessage("notice", "Check your email to confirm your account.", next);
    }

    redirect(next);
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirectWithMessage("error", error.message, next);
  }

  redirect(next);
}
