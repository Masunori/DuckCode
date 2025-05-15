import fs from 'fs/promises';
import path from 'path';
import { PASSWORD_CONDITIONS, USERNAME_CONDITIONS } from "@/app/portal/components/fieldConditions";
import { NextRequest, NextResponse } from 'next/server';
import { SignupStatuses } from '@/app/api/portal/signup/SignupStatuses';

type User = {
    id: number;
    name: string;
    email: string;
    password: string;
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const username = formData.get('username')?.toString() || '';
        const email = formData.get('email')?.toString() || '';
        const password = formData.get('password')?.toString() || '';
        const confirmPassword = formData.get('confirmPassword')?.toString() || '';

        const filePath = path.join(process.cwd(), 'src', 'app', 'api', 'portal', 'dummyUserDB.json');
        const file = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(file);
        const users: User[] = data.users;

        const listOfErrors: SignupStatuses[] = [];

        const isValidUsername = Object.entries(USERNAME_CONDITIONS).every((condition) => {
            return condition[1].checkFn(username); // [key, condition]
        });
        if (!isValidUsername) {
            listOfErrors.push(SignupStatuses.INVALID_USERNAME);
        }

        const isValidEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})*$/.test(email);
        if (!isValidEmail) {
            listOfErrors.push(SignupStatuses.INVALID_EMAIL);
        }

        const isValidPassword = Object.entries(PASSWORD_CONDITIONS).every((condition) => {
            return condition[1].checkFn(password); // [key, condition]
        });
        if (!isValidPassword) {
            listOfErrors.push(SignupStatuses.INVALID_PASSWORD);
        }

        const isPasswordMatch = password === confirmPassword;
        if (!isPasswordMatch) {
            listOfErrors.push(SignupStatuses.MISMATCH_CONFIRM_PASSWORD);
        }

        const userExists = users.some((user => user.name === username));
        if (userExists) {
            listOfErrors.push(SignupStatuses.USERNAME_TAKEN);
        }

        const emailExists = users.some((user => user.email === email));
        if (emailExists) {
            listOfErrors.push(SignupStatuses.EMAIL_USED);
        }

        if (listOfErrors.length > 0) {
            return NextResponse.json({ 
                code: listOfErrors, 
                message: "There are some errors in your input. Please check the error codes for more information." 
            }, { status: 400 });
        }

        const newUser: User = {
            id: users.length + 1,
            name: username,
            email: email,
            password: password,
        };
        data.users.push(newUser);
        await fs.writeFile(filePath, JSON.stringify(data, null, 4));

        return NextResponse.json({ 
            message: "User registered successfully" 
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            message: `Failed to process request: ${error}` 
        }, { status: 500 });
    }
}