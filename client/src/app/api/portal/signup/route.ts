import fs from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { SignupStatuses } from '@/app/api/portal/signup/SignupStatuses';
import { PRISTINE_USER, User } from '@/app/userPrefs/userPrefsUtils';

export async function POST(request: NextRequest) {
    try {
        const requestData = await request.json();

        const username = requestData.username;
        const email = requestData.email;
        const password = requestData.password;

        const filePath = path.join(process.cwd(), 'src', 'app', 'api', 'portal', 'dummyUserDB.json');
        const file = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(file);
        const users: User[] = data.users;

        const listOfErrors: SignupStatuses[] = [];

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

        const newUser: User = structuredClone(PRISTINE_USER);
        newUser.name = username;
        newUser.email = email;
        newUser.password = password;

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