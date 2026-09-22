"use client";

import { useOwnerRegistration } from "../hooks/useOwnerRegistration";
import { Gender } from "../types/owner-registration-types";
import { AuthHeader } from "../../../shared/components/layout/AuthHeader";
import { AuthFooter } from "../../../shared/components/layout/AuthFooter";
import { Button, Card, Input, Label, Select } from "@/src/shared/components/ui";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/shared/components/ui/select";

export function OwnerRegistrationForm() {
  const {
    registrationForm: f,
    updateRegistration,
    handleRegister,
    goBack,
    isLoading,
    error,
  } = useOwnerRegistration();

  return (
    <div className="bg-surface font-body-md text-on-surface min-h-screen flex flex-col overflow-x-hidden">
      <AuthHeader />

      <main className="flex flex-1 items-start justify-center py-6 px-4 md:px-0">
        <Card className="w-full max-w-3xl p-6">
          <div className="flex flex-col gap-2 border-b border-outline-variant/10 pb-6">
            <h1 className="text-xl font-semibold text-primary">
              Create Clinic Owner Account
            </h1>
            <p className="text-sm text-on-surface-variant">
              Provide your personal details to set up your clinic owner profile.
            </p>
          </div>

          <form
            className="flex flex-col gap-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField id="firstName" label="First Name">
                <Input
                  id="firstName"
                  value={f.firstName}
                  placeholder="e.g. Atharv"
                  onChange={(e) =>
                    updateRegistration("firstName", e.target.value)
                  }
                />
              </FormField>

              <FormField id="middleName" label="Middle Name (Optional)">
                <Input
                  id="middleName"
                  value={f.middleName ?? ""}
                  onChange={(e) =>
                    updateRegistration("middleName", e.target.value)
                  }
                />
              </FormField>

              <FormField id="lastName" label="Last Name">
                <Input
                  id="lastName"
                  value={f.lastName}
                  placeholder="e.g. Khamkar"
                  onChange={(e) =>
                    updateRegistration("lastName", e.target.value)
                  }
                />
              </FormField>

              <FormField id="email" label="Email">
                <Input
                  id="email"
                  type="email"
                  value={f.email}
                  placeholder="owner@clinic.com"
                  onChange={(e) => updateRegistration("email", e.target.value)}
                />
              </FormField>

              {/* Gender — shadcn Radix Select */}
              <FormField id="gender" label="Gender">
                <GenderSelect
                  value={f.gender}
                  onSelect={(v) => updateRegistration("gender", v as Gender)}
                />
              </FormField>

              <FormField id="birth_date" label="Date of Birth">
                <Input
                  id="birth_date"
                  type="date"
                  value={f.birth_date ?? ""}
                  onChange={(e) =>
                    updateRegistration("birth_date", e.target.value)
                  }
                />
              </FormField>

              <FormField id="phoneNumber" label="Phone Number">
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={f.phoneNumber}
                  placeholder="+919876543210"
                  onChange={(e) =>
                    updateRegistration("phoneNumber", e.target.value)
                  }
                />
              </FormField>

              <FormField id="countryCodeId" label="Country Code ID">
                <Input
                  id="countryCodeId"
                  value={f.countryCodeId}
                  placeholder="country_code_id"
                  onChange={(e) =>
                    updateRegistration("countryCodeId", e.target.value)
                  }
                />
              </FormField>

              <FormField id="password" label="Password">
                <Input
                  id="password"
                  type="password"
                  value={f.password}
                  placeholder="Min 8 characters"
                  onChange={(e) =>
                    updateRegistration("password", e.target.value)
                  }
                />
              </FormField>

              <FormField id="roleId" label="Role ID">
                <Input
                  id="roleId"
                  value={f.roleId}
                  placeholder="role_id"
                  onChange={(e) => updateRegistration("roleId", e.target.value)}
                />
              </FormField>

              <FormField id="profile_photo_key" label="Profile Photo Key">
                <Input
                  id="profile_photo_key"
                  value={f.profile_photo_key}
                  placeholder="profile-photo-key"
                  onChange={(e) =>
                    updateRegistration("profile_photo_key", e.target.value)
                  }
                />
              </FormField>
            </div>

            {error && <p className="text-sm text-error text-center">{error}</p>}

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-outline-variant/10 pt-6 mt-4">
              <Button variant="outline" type="button" onClick={goBack}>
                <span className="material-symbols-outlined text-base">
                  arrow_back
                </span>
                Back
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-base">
                      progress_activity
                    </span>
                    Processing...
                  </>
                ) : (
                  <>
                    Continue to OTP
                    <span className="material-symbols-outlined text-base">
                      arrow_forward
                    </span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </main>

      <AuthFooter />
    </div>
  );
}

/* ───────── reusable/form helpers (feature-local, uses shadcn Label) ───────── */

function FormField({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-wide text-on-surface-variant"
      >
        {label}
      </Label>
      {children}
    </div>
  );
}

function GenderSelect({
  value,
  onSelect,
}: {
  value: Gender;
  onSelect: (v: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onSelect}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select gender" />
      </SelectTrigger>
      <SelectContent>
        {Object.values(Gender).map((g) => (
          <SelectItem key={g} value={g}>
            {g}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
