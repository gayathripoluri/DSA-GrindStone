"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-accent text-[#0b0c0f] hover:brightness-110 active:scale-[0.98]",
    secondary: "bg-surface-2 text-text border border-border hover:border-text-dim",
    ghost: "text-text-dim hover:text-text",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
