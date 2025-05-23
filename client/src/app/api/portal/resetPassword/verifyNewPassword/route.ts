import fs from 'fs/promises';
import path from 'path';
import { PASSWORD_CONDITIONS } from "@/app/portal/components/fieldConditions";
import { NextRequest, NextResponse } from "next/server";
import { ResetPasswordStatuses } from "../resetPasswordStatuses";

type User = {
    id: number;
    name: string;
    email: string;
    password: string;
}

export async function POST(request: NextRequest) {
    try {
        const { email, password, confirmPassword } = await request.json();
    
        const isValidPassword = Object.entries(PASSWORD_CONDITIONS).every((condition) => {
            return condition[1].checkFn(password); // [key, condition]
        });
        if (!isValidPassword) {
            return NextResponse.json({
                code: ResetPasswordStatuses.INVALID_CLIENT_SIDE_CREDENTIALS,
            }, { status: 400 });
        }

        const isPasswordMatch = password === confirmPassword;
        if (!isPasswordMatch) {
            return NextResponse.json({
                code: ResetPasswordStatuses.INVALID_CLIENT_SIDE_CREDENTIALS,
            }, { status: 400 });
        }

        const filePath = path.join(process.cwd(), 'src', 'app', 'api', 'portal', 'dummyUserDB.json');
        const file = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(file);
        const users: User[] = data.users;

        const user = users.find(user => user.email === email); // user confirms to exist at this stage
        if (!user) {
            return NextResponse.json({
                code: ResetPasswordStatuses.INVALID_EMAIL,
            }, { status: 400 });
        }
        
        if (user.password === password) {
            return NextResponse.json({
                code: ResetPasswordStatuses.SAME_PASSWORD,
            }, { status: 400 });
        }

        user.password = password; // update the password
        await fs.writeFile(filePath, JSON.stringify(data, null, 2)); // write the updated data back to the file

        return NextResponse.json({
            code: ResetPasswordStatuses.PASSWORD_RESET_SUCCESS,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            message: `An error occurred while verifying the new password: ${error}`,
        }, { status: 500 });
    }
}