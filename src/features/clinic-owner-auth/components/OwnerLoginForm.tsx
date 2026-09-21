"use client";

import { useState } from "react";
import { useOwnerRegistration } from "../hooks/useOwnerRegistration";

export function OwnerLoginForm() {
  const {
    loginEmail,
    setLoginEmail,
    loginPassword,
    setLoginPassword,
    handleLogin,
    isLoading,
    error,
  } = useOwnerRegistration();

  // UI-only state (password visibility toggle) — not business logic
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-surface text-on-background font-body-md min-h-screen flex flex-col md:flex-row">
      {/* ───────── Left: Branding & Features ───────── */}
      <section className="relative w-full md:w-1/2 min-h-[60vh] md:min-h-screen flex items-center justify-center px-4 md:px-10 py-10 overflow-hidden bg-linear-to-br from-surface-container-low to-surface-container">
        {/* Background atmospheric blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-tertiary/5 rounded-full blur-3xl" />

        <div className="relative z-10 w-full max-w-xl flex flex-col gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                health_and_safety
              </span>
            </div>
            <span className="font-headline-md text-headline-md text-primary tracking-tight">
              HealthStride
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="font-headline-lg text-[28px] md:text-headline-lg text-on-background max-w-md">
              Welcome back to HealthStride
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-lg">
              Manage your clinic, doctors, and patient health operations from
              one secure platform.
            </p>
          </div>

          {/* Feature checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {[
              "Manage Doctors",
              "Track Clinic Growth",
              "Monitor Usage",
              "Secure Platform",
            ].map((feat) => (
              <div
                key={feat}
                className="flex items-center gap-2 p-2 bg-white/40 rounded-xl border border-outline-variant/10"
              >
                <span
                  className="material-symbols-outlined text-tertiary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                <span className="font-body-md text-body-md text-on-surface">
                  {feat}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Right: Login Form ───────── */}
      <main className="w-full md:w-1/2 flex items-center justify-center px-4 md:px-10 py-10 bg-surface">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="md:hidden flex items-center gap-1 mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[18px]">
                health_and_safety
              </span>
            </div>
            <span className="font-title-lg text-title-lg text-primary font-bold">
              HealthStride
            </span>
          </div>

          <div className="bento-card p-6 soft-shadow">
            <div className="text-center mb-6">
              <h2 className="font-headline-md text-headline-md text-on-background mb-1">
                Welcome Back
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Sign in to continue managing your clinic
              </p>
            </div>

            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
            >
              {/* Email */}
              <div className="space-y-1">
                <label
                  className="font-label-md text-label-md text-on-surface-variant block px-2"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <input
                    id="email"
                    type="email"
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-body-md text-body-md"
                    placeholder="clinic.admin@healthstride.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    disabled={isLoading}
                  />
                  <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors">
                    mail
                  </span>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label
                  className="font-label-md text-label-md text-on-surface-variant block px-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative group">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-body-md text-body-md"
                    placeholder="••••••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors cursor-pointer"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? "visibility_off" : "visibility"}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20 transition-colors"
                  />
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    Remember Me
                  </span>
                </label>
                <a
                  className="font-label-md text-label-md text-primary hover:underline decoration-2 underline-offset-4 transition-all"
                  href="#"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Error */}
              {error && (
                <p className="font-body-md text-body-md text-error text-center">
                  {error}
                </p>
              )}

              {/* Sign In */}
              <button
                type="submit"
                className={`w-full py-3 bg-primary text-white rounded-xl font-headline-md text-headline-md shadow-md hover:bg-primary-container active:scale-[0.98] transition-all duration-200 mt-4 ${isLoading || !loginEmail || !loginPassword ? "opacity-60 cursor-not-allowed" : ""}`}
                disabled={isLoading || !loginEmail || !loginPassword}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Security divider */}
            <div className="mt-6 pt-6 border-t border-outline-variant/10">
              <div className="relative flex justify-center items-center mb-6">
                <span className="bg-white px-4 font-label-md text-label-md text-outline uppercase tracking-widest z-10">
                  Secure Access
                </span>
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-outline-variant/10" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: "lock", label: "Encrypted Login" },
                  { icon: "verified_user", label: "HIPAA Ready" },
                  { icon: "shield_with_heart", label: "Secure Health" },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center">
                      <span
                        className="material-symbols-outlined text-primary"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {icon}
                      </span>
                    </div>
                    <span className="font-label-md text-[10px] text-on-surface-variant text-center uppercase leading-tight">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer meta */}
          <p className="text-center mt-6 font-label-md text-label-md text-outline">
            © 2024 HealthStride Analytics. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}
