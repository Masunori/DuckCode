import { delay } from "../fakeApiUtils";
import { jwtDecode } from "jwt-decode";

// dummy username: newuser 
// dummy password: securepassword

/**
 * Sends a POST request to the server to fetch the user data when the user logs in.
 * 
 * @param {string} username The username
 * @param {string} password The password
 * @returns The JSON representing the user's information.
 */
export async function signup(username, password, email) {
    const GAMEPLAY_API_HTTP = process.env.REACT_APP_GAMEPLAY_API_HTTP;

    const response = await fetch(`${GAMEPLAY_API_HTTP}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
        })
    })
        .then(async res => {
            const data = await res.json();
            console.log("Response: ", res.status, data);
            return data;
        })
        .then(data => jwtDecode(data.token));

    return response;
}

export async function signupFake(username, password, email) {     
    return delay(1000, {
        status: 'success',
    });
}