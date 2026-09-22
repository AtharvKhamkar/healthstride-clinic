'use client';
import { useRouter } from 'next/navigation';
import { useOwnerRegistrationContext } from "../providers/OwnerRegistrationContext";
import { useState } from "react";
import { DevicePlatform, Gender, OwnerRegisterRequest } from '../types/owner-registration-types';

type StringKey = Exclude<OwnerRegisterRequest, 'gender'>;

export function useOwnerRegistration() {
    const ctx = useOwnerRegistrationContext();
    const router = useRouter();

    //Check owner exists form state
    const [emailInput, setEmailInput] = useState('');

    //Owner registration form state
    const [registrationForm, setRegistrationForm] = useState<OwnerRegisterRequest>({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        countryCodeId: '',
        phoneNumber: '',
        password: '',
        roleId: '',
        profile_photo_key: '',
        birth_date: '',
        gender: Gender.MALE
    })
    //Owner login form state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const handleCheckOwnerExists = async () => {
        const res = await ctx.checkOwnerExists(emailInput);
        if (!res) return;
        if (!res.isExists) router.push('/register');
        else if (!res.isVerified) router.push('/verify-otp');
        else router.push('/login');
    };

    const updateRegistration = (key: string, value: string) => {
        setRegistrationForm((prev) => ({ ...prev, [key]: value }));
    }

    const handleRegister = async () => {
        const res = await ctx.register(registrationForm);
        if (!res) return;
        router.push(`/verify-otp?email=${encodeURIComponent(registrationForm.email)}`)
    }

    const handleLogin = async () => {
        const res = await ctx.login({
            email: loginEmail,
            password: loginPassword,
            platform: DevicePlatform.WEB,
            deviceInfo:
                typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        });
        if (!res) return;

        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('accessToken', res.accessToken);
            localStorage.setItem('refreshToken', res.refreshToken);
        }

        router.push('/dashboard');
    };

    const goBack = () => router.back();

    return {
        isLoading: ctx.isLoading,
        error: ctx.error,
        user: ctx.user,

        // check-email
        emailInput,
        setEmailInput,
        handleCheckOwnerExists,

        // registration
        registrationForm,
        updateRegistration,
        handleRegister,

        // login
        loginEmail,
        setLoginEmail,
        loginPassword,
        setLoginPassword,
        handleLogin,

        goBack,

    };
}
