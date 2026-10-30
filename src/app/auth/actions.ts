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

  const strongPassword = password.length >= 10 && /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password);
  if (!strongPassword) {
    redirect(withMessage(`/${locale}/signup`, "error", "Password must be 10+ characters and include uppercase, lowercase and a number."));
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

export async function workerSignup(formData: FormData) {
  const locale = getLocale(formData);
  const displayName=readText(formData,"displayName"),email=readText(formData,"email"),password=readText(formData,"password");
  const services=readText(formData,"services"),languages=readText(formData,"languages"),experience=readText(formData,"experience"),availability=readText(formData,"availability"),specializations=readText(formData,"specializations");
  if(!displayName||!email||!password||!services||!languages) redirect(withMessage(`/${locale}/signup/worker`,"error","Name, email, password, services and languages are required."));
  if(!(password.length>=10&&/[a-z]/.test(password)&&/[A-Z]/.test(password)&&/\d/.test(password))) redirect(withMessage(`/${locale}/signup/worker`,"error","Password must be 10+ characters and include uppercase, lowercase and a number."));
  const supabase=await createClient(); const {data,error}=await supabase.auth.signUp({email,password,options:{data:{display_name:displayName,preferred_locale:locale,account_type:"worker"}}});
  if(error||!data.user) redirect(withMessage(`/${locale}/signup/worker`,"error",error?.message??"Could not create worker account."));
  const {db}=await import("@/db"); const {profiles,workerApplications}=await import("@/db/schema");
  await db.insert(profiles).values({id:data.user.id,displayName,preferredLocale:locale}).onConflictDoNothing();
  await db.insert(workerApplications).values({profileId:data.user.id,services,languages,experience,availability,specializations}).onConflictDoNothing();
  redirect(withMessage(`/${locale}/login`,"message","Worker application created. Confirm your email. Your work portal will activate after review and approval."));
}
