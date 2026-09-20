export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',
    PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
}

export enum DevicePlatform {
    IOS = 'IOS',
    ANDROID = 'ANDROID',
    WEB = 'WEB',
}

// Requests

export interface CheckOwnerExistsRequest { email: string; }

export interface OwnerRegisterRequest {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    countryCodeId: string;
    phoneNumber: string;
    password: string;
    roleId: string;
    profile_photo_key: string;
    birth_date?: string;
    gender: Gender;
}

export interface OwnerEmailVerificationRequest { email: string; otp: string; }

export interface OwnerLoginRequest {
    email: string;
    password: string;
    platform: DevicePlatform;
    deviceInfo?: string;
}

// Response data

export interface CheckOwnerExistsResponse { isExists: boolean; isVerified: boolean; }

export interface OwnerRegistrationResponse { isRegistered: boolean; userId: string; expiresAt: string; }

export interface OwnerVerificationResponse { isVerified: boolean; }

export interface OwnerLoginResponse {
    userId: string; email: string; firstName: string;
    middleName?: string; lastName: string | null;
    countryCode: string; phoneNumber?: string | null;
    profileImage?: string | null; gender: Gender;
    clinicName: string; role: string; isVerified: boolean;
    accessToken: string; refreshToken: string;
    isDisabled?: boolean; isDeleted?: boolean;
}
