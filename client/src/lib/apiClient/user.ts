import { decodeUserPrefs, encodeUserPrefs } from "@/app/userPrefs/userPrefSerializer";
import { PRISTINE_USER_PREFERENCE, User, userPreference } from "@/app/userPrefs/userPrefsUtils";

const BASE_URL = "https://6ce54a6328be.ngrok-free.app/"

const LOGIN_API = BASE_URL + "auth/login";
const SIGNUP_API = BASE_URL + "auth/register";
const SIGNUP_SEND_CODE_API = BASE_URL + "auth/request-otp";
const RESET_PASSWORD_SEND_CODE_API = BASE_URL + "auth/request-otp";
const RESET_PASSWORD_VERIFY_CODE_API = BASE_URL + "auth/verify-otp";
const RESET_PASSWORD_VERIFY_NEW_PASSWORD_API = "/api/portal/resetPassword/verifyNewPassword";
const GET_PROFILE_API = BASE_URL + "auth/me";

export async function login(email: string, password: string) {
    const response = await fetch(LOGIN_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
        credentials: "include",
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
            userData: {
                username: username,
                email: email,
                password: password,
                confirmPassword: confirmPassword,
            }
        }),
        credentials: "include",
    });

    const data = await response.json();

    console.log(response.status, data);

    return {
        status: response.status,
        data
    };
}

export async function getVerificationCode(email: string) {
    const response = await fetch(RESET_PASSWORD_SEND_CODE_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
        }),
        credentials: "include",
    });

    const data = await response.json();

    return {
        status: response.status,
        data
    };
}

export async function verifyCode(email: string, code: string) {
    const response = await fetch(RESET_PASSWORD_VERIFY_CODE_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            inputOTP: code,
        }),
        credentials: "include",
    });

    const data = await response.json();
    console.log(data, response.status);

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
    const response = await fetch(RESET_PASSWORD_VERIFY_NEW_PASSWORD_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
            confirmPassword: confirmPassword
        }),
        credentials: "include",
    });

    const data = await response.json();

    return {
        status: response.status,
        data
    };
}

export async function getProfile() {
    const response = await fetch(GET_PROFILE_API, {
        method: 'POST',
        headers: {
            'Content-Type': "application/json",
        },
        credentials: 'include',
    });



    // if (!response.ok) {
    //     return {
    //         status: response.status,
    //         data: null,
    //     }
    // }

    const data = await response.json();

    console.log(data);

    const user = data.data;
    user.userPreference = user.userPreference === ""
        ? structuredClone(PRISTINE_USER_PREFERENCE)
        : decodeUserPrefs(user.userPreference as string);

    return {
        status: response.status,
        data: user as User,
    }
}

export async function updateSettings(userPreference: userPreference) {
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