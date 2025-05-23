import fs from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

type User = {
    id: number;
    name: string;
    email: string;
    password: string;
}

export async function POST(request: NextRequest) {
    try {
        const requestData = await request.json();
        const username = requestData.username;
        const password = requestData.password;

        const filePath = path.join(process.cwd(), 'src', 'app', 'api', 'portal', 'dummyUserDB.json');
        const file = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(file);
        const users: User[] = data.users;

        const user = users.find((user => user.name === username && user.password === password));
        if (!user) {
            return NextResponse.json({ 
                message: "Username or password is incorrect!" 
            }, { status: 401 });
        }

        return NextResponse.json({ 
            message: "Login successful!",
            user: user,
        }, { status: 303 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ 
            message: `Failed to process request: ${error}` 
        }, { status: 500 });
    }
}