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
        const formData = await request.formData();
        const username = formData.get('username')?.toString() || '';
        const password = formData.get('password')?.toString() || '';

        const filePath = path.join(process.cwd(), 'src', 'app', 'api', 'portal', 'dummyUserDB.json');
        const file = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(file);
        const users: User[] = data.users;

        const userExists = users.some((user => user.name === username && user.password === password));
        if (!userExists) {
            return NextResponse.json({ 
                message: "Username or password is incorrect!" 
            }, { status: 401 });
        }

        return NextResponse.json({ 
            message: "Login successful!" 
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ 
            message: `Failed to process request: ${error}` 
        }, { status: 500 });
    }
}