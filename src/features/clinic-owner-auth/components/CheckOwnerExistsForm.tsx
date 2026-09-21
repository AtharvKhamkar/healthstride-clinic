"use client";

import { useOwnerRegistration } from "../hooks/useOwnerRegistration";

export function CheckOwnerExistsForm() {
  const {
    emailInput,
    setEmailInput,
    handleCheckOwnerExists,
    isLoading,
    error,
  } = useOwnerRegistration();

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 glass-panel border-b border-outline-variant/20 shadow-sm">
        <div className="flex justify-between items-center w-full px-4 md:px-10 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-primary font-bold">
              <span className="material-symbols-outlined text-[32px]">
                health_and_safety
              </span>
              <span className="font-headline-md text-headline-md tracking-tight">
                HealthStride
              </span>
            </div>
          </div>
          <nav className="hidden md:flex gap-6">
            <a
              className="text-primary font-bold border-b-2 border-primary pb-1 font-label-md text-label-md"
              href="#"
            >
              Welcome
            </a>
            <a
              className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors"
              href="#"
            >
              Clinic
            </a>
            <a
              className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors"
              href="#"
            >
              Account
            </a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="font-label-md text-label-md text-primary px-6 py-2 border border-primary/20 rounded-full hover:bg-primary-container/10 transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </header>

      <main className="grow pt-24 pb-12 px-4 md:px-10 max-w-7xl mx-auto w-full flex flex-col md:grid md:grid-cols-2 gap-6">
        {/* Left: Brand Section */}
        <section className="flex flex-col justify-center gap-6 py-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1 text-primary font-bold">
              <span className="material-symbols-outlined text-[32px]">
                health_and_safety
              </span>
              <span className="font-headline-md text-headline-md tracking-tight">
                HealthStride
              </span>
            </div>
            <h1 className="font-display-lg text-[40px] md:text-display-lg text-on-surface leading-tight">
              Start managing patient health{" "}
              <span className="text-primary-container">smarter</span>
            </h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant max-w-md">
              Connect your doctors, patients, and health insights in one secure
              platform designed for modern medical clinics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: "group", label: "Manage Doctors" },
              { icon: "monitoring", label: "Monitor Clinic Growth" },
              { icon: "verified_user", label: "Secure Health Platform" },
              { icon: "analytics", label: "Health Analytics" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
                <span className="font-body-md text-body-md font-semibold">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Right: Registration Card (email check form) */}
        <section className="flex items-center justify-center py-6">
          <div className="w-full max-w-md bento-card bg-surface-container-lowest p-6 soft-shadow flex flex-col gap-6 border border-outline-variant/20">
            <div className="flex flex-col gap-2">
              <div className="w-12 h-12 bg-primary-container/20 rounded-full flex items-center justify-center mb-2">
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Welcome to HealthStride
              </h2>
              <p className="text-body-md font-body-md text-on-surface-variant">
                Step 1 of 7: Verify your clinic&apos;s business identity
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <label
                  className="font-label-md text-label-md text-on-surface-variant"
                  htmlFor="clinic-email"
                >
                  Clinic Email
                </label>
                <input
                  id="clinic-email"
                  type="email"
                  className="w-full px-4 py-3 bg-surface-container-low border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md text-body-md"
                  placeholder="e.g. contact@cityhealth.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {error && (
                <p className="font-body-md text-body-md text-error">{error}</p>
              )}

              <button
                type="button"
                className={`w-full py-3 bg-primary-container text-on-primary-container font-semibold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
                  isLoading || !emailInput
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                }`}
                onClick={handleCheckOwnerExists}
                disabled={isLoading || !emailInput}
              >
                {isLoading ? "Checking..." : "Continue"}
                {!isLoading && (
                  <span className="material-symbols-outlined text-[20px]">
                    arrow_forward
                  </span>
                )}
              </button>

              <div className="flex items-center justify-center gap-2">
                <div className="h-px grow bg-outline-variant/30" />
                <span className="text-label-md font-label-md text-outline">
                  OR REGISTER WITH
                </span>
                <div className="h-px grow bg-outline-variant/30" />
              </div>

              <button
                type="button"
                className="flex items-center justify-center gap-2 py-3 border border-outline-variant rounded-xl hover:bg-surface-container transition-colors w-full"
              >
                <span className="material-symbols-outlined text-[20px]">
                  cloud
                </span>
                <span className="font-label-md text-label-md">Google</span>
              </button>
            </div>

            <p className="text-center text-label-md font-label-md text-on-surface-variant mt-4">
              Already have an account?{" "}
              <a
                className="text-primary font-bold hover:underline"
                href="/login"
              >
                Sign In
              </a>
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-outline-variant/10 bg-surface">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <span className="text-label-md font-label-md text-primary">
              HealthStride
            </span>
            <span className="font-body-md text-body-md text-on-surface-variant">
              © 2024. All rights reserved.
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              "Privacy Policy",
              "Terms of Service",
              "Help Center",
              "Contact Support",
            ].map((t) => (
              <a
                key={t}
                className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors"
                href="#"
              >
                {t}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
