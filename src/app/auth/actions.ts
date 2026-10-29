"use server";

import { redirect } from "next/navigation";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { createClient } from "@/lib/supabase/server";

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getLocale(formData: FormData): Locale {
  const value = readText(formData, "locale");
  return isLocale(value) ? value : defaultLocale;
}

function withMessage(path: string, kind: "error" | "message", text: string) {
  return `${path}?${kind}=${encodeURIComponent(text)}`;
}

export async function login(formData: FormData) {
  const locale = getLocale(formData);
  const email = readText(formData, "email");
  const password = readText(formData, "password");

  if (!email || !password) {
    redirect(withMessage(`/${locale}/login`, "error", "Email and password are required."));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(withMessage(`/${locale}/login`, "error", error.message));
  }

  redirect(`/${locale}/dashboard`);
}

export async function signup(formData: FormData) {
  const locale = getLocale(formData);
  const displayName = readText(formData, "displayName");
  const email = readText(formData, "email");
  const password = readText(formData, "password");

  if (!displayName || !email || !password) {
    redirect(withMessage(`/${locale}/signup`, "error", "Name, email and password are required."));
  }

  if (password.length < 8) {
    redirect(withMessage(`/${locale}/signup`, "error", "Use a password with at least 8 characters."));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName, preferred_locale: locale },
    },
  });

  if (error || !data.user) {
    redirect(withMessage(`/${locale}/signup`, "error", error?.message ?? "Could not create account."));
  }

  if (data.session) {
    redirect(`/${locale}/dashboard`);
  }

  redirect(
    withMessage(
      `/${locale}/login`,
      "message",
      "Account created. Check your email to confirm your address, then sign in.",
    ),
  );
}

export async function logout(formData: FormData) {
  const locale = getLocale(formData);
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(`/${locale}/login`);
}
