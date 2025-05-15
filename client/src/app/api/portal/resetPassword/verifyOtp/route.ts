import { NextRequest, NextResponse } from "next/server";
import { ResetPasswordStatuses } from "../resetPasswordStatuses";

export async function POST(request: NextRequest) {
    try {
        const { email, code } = await request.json();

        console.log(email); // email is not used in this function, but it's here for consistency

        // Check if the verification code is valid
        if (code !== "123456") {
            return NextResponse.json({
                code: ResetPasswordStatuses.WRONG_VERIFICATION_CODE
            }, { status: 400 });
        }

        return NextResponse.json({
            code: ResetPasswordStatuses.VERIFICATION_SUCCESS
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            message: `An error occurred while verifying the OTP: ${error}`
        }, { status: 500 });
    }
}