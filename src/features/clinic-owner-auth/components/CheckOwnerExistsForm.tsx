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
    <main className="flex flex-1 w-full max-w-md mx-auto flex-col justify-center py-12 px-4">
      <div className="bento-card w-full flex flex-col gap-5">
        <h2 className="font-headline-md text-headline-md text-on-surface">
          Welcome to HealthStride
        </h2>
        <div className="flex flex-col gap-2">
          <label
            className="font-label-md text-label-md text-on-surface-variant"
            htmlFor="email"
          >
            Clinic Email
          </label>
          <input
            id="email"
            type="email"
            className="form-input w-full"
            placeholder="contact@cityhealth.com"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
        </div>
        {error && (
          <p className="font-body-md text-body-md text-error">{error}</p>
        )}
        <button
          type="button"
          className="btn-primary w-full"
          onClick={handleCheckOwnerExists}
          disabled={isLoading || !emailInput}
        >
          {isLoading ? "Checking..." : "Continue"}
        </button>
      </div>
    </main>
  );
}
