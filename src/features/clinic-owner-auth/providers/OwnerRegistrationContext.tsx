"use client";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import {
  CheckOwnerExistsResponse,
  OwnerLoginRequest,
  OwnerLoginResponse,
  OwnerRegisterRequest,
  OwnerRegistrationResponse,
} from "../types/owner-registration-types";
import { useApiClient } from "@/src/providers/ApiClientProvider";
import { OwnerRegistrationApi } from "../api/owner-registration-api";

export type AuthStep = "check-email" | "register" | "verify-otp" | "login";

interface OwnerRegistrationContextValue {
  step: AuthStep;
  isLoading: boolean;
  error: string | null;
  user: OwnerLoginResponse | null;
  checkOwnerExists: (email: string) => Promise<CheckOwnerExistsResponse | null>;
  register: (
    req: OwnerRegisterRequest,
  ) => Promise<OwnerRegistrationResponse | null>;
  login: (req: OwnerLoginRequest) => Promise<OwnerLoginResponse | null>;
}

const OwnerRegistrationContext =
  createContext<OwnerRegistrationContextValue | null>(null);

export function OwnerRegistrationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const apiClient = useApiClient();
  const api = new OwnerRegistrationApi(apiClient);

  const [step, setStep] = useState<AuthStep>("check-email");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<OwnerLoginResponse | null>(null);

  //check owner exists
  const checkOwnerExists = useCallback(
    async (emailValue: string): Promise<CheckOwnerExistsResponse | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await api.checkOwnerExists({ email: emailValue });

        if (!res.success || !res.data) {
          setError(res.message || "Unable to verify email.");
          return null;
        }

        setEmail(emailValue);
        return res.data;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [api],
  );

  const register = useCallback(
    async (
      req: OwnerRegisterRequest,
    ): Promise<OwnerRegistrationResponse | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await api.register(req);

        if (!res.success || !res.data) {
          setError(res.message || "Registration failed");
          return null;
        }

        return res.data;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [api],
  );

  const login = useCallback(
    async (req: OwnerLoginRequest): Promise<OwnerLoginResponse | null> => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await api.login(req);
        if (!res.success || !res.data) {
          setError(res.message || "Login failed.");
          return null;
        }
        setUser(res.data);
        setEmail(res.data.email);
        return res.data;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [api],
  );

  return (
    <OwnerRegistrationContext.Provider
      value={{
        step,
        isLoading,
        error,
        user,
        checkOwnerExists,
        register,
        login,
      }}
    >
      {children}
    </OwnerRegistrationContext.Provider>
  );
}

export function useOwnerRegistrationContext(): OwnerRegistrationContextValue {
  const ctx = useContext(OwnerRegistrationContext);
  if (!ctx)
    throw new Error("useRegistration must be used within RegistrationProvider");
  return ctx;
}
