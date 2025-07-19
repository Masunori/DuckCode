import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { Question } from "@/app/(withContext)/gameplay/gameplayUtils";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const difficulty = Number(searchParams.get("cur_point"));

    const questions: Question[] = JSON.parse(readFileSync("./dummyQuestionDB.json", 'utf-8'));

    const filteredQuestions = questions.filter(qn => Math.abs(qn.difficulty - difficulty) <= 200);
    const qn = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];

    setTimeout(() => NextResponse.json({
        question: qn,
    }, { status: 200 }), 1500);

    return NextResponse.json({
        question: qn
    }, { status: 200 });
}