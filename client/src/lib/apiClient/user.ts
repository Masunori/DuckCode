import { decodeUserPrefs, encodeUserPrefs } from "@/app/userPrefs/userPrefSerializer";
import { UserPreference } from "@/app/userPrefs/userPrefsUtils";

const BASE_URL = "https://f90b7d86a21b.ngrok-free.app/"

const LOGIN_API = BASE_URL + "auth/login";
const SIGNUP_API = "/api/portal/signup";
const REST_PASSWORD_SEND_CODE_API = "/api/portal/resetPassword/sendVerificationCode";
const REST_PASSWORD_VERIFY_CODE_API = "/api/portal/resetPassword/verifyOtp";
const REST_PASSWORD_VERIFY_NEW_PASSWORD_API = "/api/portal/resetPassword/verifyNewPassword";

export async function login(email: string, password: string) {
    const response = await fetch(LOGIN_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        })
    });

    const data = await response.json();

    return {
        status: response.status,
        data
    };
}

export async function signUp(
    username: string,
    email: string,
    password: string,
    confirmPassword: string
) {
    const response = await fetch(SIGNUP_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
            confirmPassword: confirmPassword,
        })
    });

    const data = await response.json();

    return {
        status: response.status,
        data
    };
}

export async function getVerificationCode(email: string) {
    const response = await fetch(REST_PASSWORD_SEND_CODE_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
        })
    });

    const data = await response.json();

    return {
        status: response.status,
        data
    };
}

export async function verifyCode(email: string, code: number) {
    const response = await fetch(REST_PASSWORD_VERIFY_CODE_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            code: code,
        })
    });

    const data = await response.json();

    return {
        status: response.status,
        data
    };
}

export async function verifyNewPassword(
    email: string,
    password: string,
    confirmPassword: string
) {
    const response = await fetch(REST_PASSWORD_VERIFY_NEW_PASSWORD_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
            confirmPassword: confirmPassword
        })
    });

    const data = await response.json();

    return {
        status: response.status,
        data
    };
}

export async function getProfile() {
    const response = await fetch(BASE_URL + "user/profile", {
        method: 'GET',
        credentials: 'include',
    });

    const data = await response.json();
    data.userPreference = decodeUserPrefs(data.userPreference as string);

    return {
        status: response.status,
        data
    };
}

export async function updateSettings(userPreference: UserPreference) {
    const encoded = encodeUserPrefs(userPreference);

    const response = await fetch(BASE_URL + "user/updateSettings", {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
            userPreference: encoded,
        })
    });

    return {
        status: response.status,
        data: null
    }
}