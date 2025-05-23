import { NextRequest, NextResponse } from "next/server";
import { ResetPasswordStatuses } from "../resetPasswordStatuses";

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        // Check if the email is valid
        const isValidEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})*$/.test(email);
        if (!isValidEmail) {
            return NextResponse.json({
                code: ResetPasswordStatuses.INVALID_CLIENT_SIDE_CREDENTIALS,
            }, { status: 400 });
        }

        return NextResponse.json({
            code: ResetPasswordStatuses.CODE_SENT,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            message: `An error occurred while sending the verification code: ${error}`,
        }, { status: 500 });
    }
}