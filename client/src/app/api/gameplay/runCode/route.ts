import { NextRequest, NextResponse } from "next/server";
import { OutputEntry, RunCodeStatuses } from "../RunCodeStatuses";
import { PROGRAMMING_LANGUAGES } from "@/app/components/settings/settingsUtils";

export async function POST(request: NextRequest) {
    try {
        const requestData = await request.json();
        const sourceCode: string = requestData.sourceCode;
        const languageId: number = requestData.languageId;

        if (languageId != PROGRAMMING_LANGUAGES['JavaScript'].id) {
            return NextResponse.json({
                output: "Language not supported yet.",
            }, { status: 400 });
        }

        const logs: OutputEntry[] = [];

        const sandboxConsole = {
            // eslint-disable-next-line
            log: (...args: any[]) => logs.push({ 
                type: "log", 
                content: args.map(String).join("\n"), 
            }),
            // eslint-disable-next-line
            error: (...args: any[]) => logs.push({ 
                type: "error", 
                content: "[error] " + args.map(String).join("\n") 
            }),
            // eslint-disable-next-line
            warn: (...args: any[]) => logs.push({
                type: "warn",
                content: "[warn] " + args.map(String).join("\n")
            }),
        }

        // eslint-disable-next-line
        let fn: Function;

        try {
            fn = new Function(
                "console",
                `"use strict";
                const window = undefined;
                const globalThis = undefined;
                const document = undefined;

                ${sourceCode}
                `
            );
        // eslint-disable-next-line
        } catch (syntaxErr: any) {
            return NextResponse.json({
                code: RunCodeStatuses.COMPILE_ERROR,
                output: `Syntax error: ${syntaxErr.message}`
            }, { status: 400 })
        }

        try {
            fn.call(null, sandboxConsole);
        // eslint-disable-next-line
        } catch (runtimeErr: any) {
            logs.push({
                type: "error",
                content: `[runtime error] ${runtimeErr.message}`
            });
        }

        return NextResponse.json({
            output: [
                { type: "error", content: "[error] This has not been implemented yet..." },
                { type: "log", content: "[log] This has not been implemented yet..." },
                { type: "warn", content: "[warn] This has not been implemented yet..." },
            ],
        }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ 
            message: `Failed to process request: ${error}` 
        }, { status: 500 });
    }
}