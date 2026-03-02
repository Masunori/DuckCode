import { cookies } from "next/headers";

export async function getQuestionById(qid: string) {
    const accessToken = (await cookies()).get('accessToken')?.value;
    const refreshToken = (await cookies()).get('refreshToken')?.value;

    const cookieHeader = JSON.stringify({
        accessToken: accessToken,
        refreshToken: refreshToken,
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_CLIENT_URL}/api/question/get_question_by_id?qid=${qid}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookieHeader,
        },
    });

    const data = await response.json();

    return {
        status: response.status,
        data: data.data,
    };
}
