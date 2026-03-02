import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const accessToken = formData.get('accessToken') as string;
        const refreshToken = formData.get('refreshToken') as string;
        const provider = formData.get('provider') as string;

        if (!accessToken || !refreshToken || !provider) {
            return new NextResponse('Missing tokens or provider', { status: 400 });
        }

        (await cookies()).set('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax', // or 'None' if cross-site redirect needed
            maxAge: 7 * 24 * 60 * 60, // 1 week
            path: '/',
        });

        (await cookies()).set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax', // or 'None' if cross-site redirect needed
            maxAge: 7 * 24 * 60 * 60, // 1 week
            path: '/',
        });

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_CLIENT_URL}home`, {
            status: 302
        });

    } catch (error) {
        console.error('Error processing OAuth callback:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}