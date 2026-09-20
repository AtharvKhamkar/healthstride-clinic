'use client';
import { useRouter } from 'next/navigation';
import { useOwnerRegistrationContext } from "../providers/OwnerRegistrationContext";
import { useState } from "react";


export function useOwnerRegistration() {
    const ctx = useOwnerRegistrationContext();
    const router = useRouter();

    const [emailInput, setEmailInput] = useState('');


    const handleCheckOwnerExists = async () => {
        const res = await ctx.checkOwnerExists(emailInput);
        if (!res) return;
        if (!res.isExists) router.push('/register');
        else if (!res.isVerified) router.push('/verify-otp');
        else router.push('/login');
    };


    return {
        isLoading: ctx.isLoading,
        error: ctx.error,

        // check-email
        emailInput,
        setEmailInput,
        handleCheckOwnerExists,

    };
}
