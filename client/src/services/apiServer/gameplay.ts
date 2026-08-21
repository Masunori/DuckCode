import { cookies } from "next/headers";

export async function getQuestionById(qid: string) {
    const cookieHeader = (await cookies()).toString();

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
