import { Question } from "@/app/(withContext)/gameplay/gameplayUtils";
import { PROGRAMMING_LANGUAGES } from "@/app/components/settings/settingsUtils";
import { readFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const requestData = await request.json();
        // const sourceCode: string = requestData.sourceCode;
        const languageId: number = requestData.languageId;
        const qid: number = requestData.qid;
        
        if (languageId !== PROGRAMMING_LANGUAGES['JavaScript'].id) {
            return NextResponse.json({
                output: "Language not supported yet.",
            }, { status: 400 });
        }

        const questions: Question[] = JSON.parse(readFileSync('./dummyQuestionDB.json', 'utf-8'));
        const question = questions.find(qn => qn.qid === qid);
        
        if (!question) {
            throw new Error("Question not found!");
        }

        const testCases = question.publicTestCases;
        const userAnswers = [];
        const wrongCase = Math.random() < 0.5 ? Math.floor(Math.random() * testCases.length) : testCases.length;

        let i: number;
        for (i = 0; i < testCases.length; i++) {
            userAnswers.push({
                tid: testCases[i].tid,
                actualOutput: i === wrongCase ? "" : testCases[i].expectedOutput,
                statusId: i === wrongCase ? 5 : 1,
                message: i === wrongCase ? "Wrong Answer" : 'Accepted',
            })
        }

        return NextResponse.json({
            results: userAnswers,
        }, { status: 200 });                
    } catch (error) {
        console.log(error);
        return NextResponse.json({ 
            message: `Failed to process request: ${error}` 
        }, { status: 500 });
    }
}