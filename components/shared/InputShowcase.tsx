"use client";

import { Mail, Search, User } from "lucide-react";
import { MainInput } from "@/components/shared/MainInput";

export function InputShowcase() {
  return (
    <section className="space-y-4 rounded-xl bg-surface p-4 shadow-sm sm:p-6">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">
        Inputs
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <MainInput
          label="Full name"
          placeholder="Sara Ahmed"
          startIcon={<User />}
          hint="Visible on your profile"
        />
        <MainInput
          label="Email"
          type="email"
          placeholder="you@company.com"
          startIcon={<Mail />}
          required
        />
        <MainInput
          label="Password"
          type="password"
          placeholder="Enter password"
          defaultValue="secret123"
          required
        />
        <MainInput
          label="Search"
          placeholder="Search employees…"
          startIcon={<Search />}
        />
        <MainInput
          as="textarea"
          label="Notes"
          placeholder="Write a short note…"
          containerClassName="sm:col-span-2"
          hint="Supports multi-line text"
        />
        <MainInput
          label="With error"
          placeholder="Invalid value"
          error="This field is required"
          containerClassName="sm:col-span-2"
        />
      </div>
    </section>
  );
}
