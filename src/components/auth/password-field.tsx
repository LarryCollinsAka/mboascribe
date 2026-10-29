"use client";

import { useMemo, useState } from "react";

export function PasswordField({ label, name = "password", autoComplete, showRules = false }: { label: string; name?: string; autoComplete: string; showRules?: boolean }) {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("");
  const rules = useMemo(() => [
    [value.length >= 10, "10+ characters"],
    [/[a-z]/.test(value), "Lowercase letter"],
    [/[A-Z]/.test(value), "Uppercase letter"],
    [/\d/.test(value), "Number"],
  ] as const, [value]);

  return <label>
    <span>{label}</span>
    <span className="password-wrap">
      <input name={name} type={visible ? "text" : "password"} autoComplete={autoComplete} minLength={showRules ? 10 : undefined} value={value} onChange={(e) => setValue(e.target.value)} required />
      <button className="password-toggle" type="button" onClick={() => setVisible((v) => !v)} aria-label={visible ? "Hide password" : "Show password"}>{visible ? "Hide" : "Show"}</button>
    </span>
    {showRules && <span className="password-rules" aria-live="polite">{rules.map(([ok, text]) => <small className={ok ? "rule-ok" : ""} key={text}>{ok ? "✓" : "○"} {text}</small>)}</span>}
  </label>;
}
