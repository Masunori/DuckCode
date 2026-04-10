import { PLKeys } from "@/components/settings/settingsUtils";
import { UserPreference } from "../userPrefsTypes";

export type Fragment = {
    fontSize: number;
    language: PLKeys;
    significantButtonColor: string;
    significantButtonHoverColor: string;
    gameplayLayout: string;
    editorOptions: { 
        theme: string;
        enableMinimap: boolean;
        lineNumbers: string;
        renderWhiteSpace: string;
        tabSize: number;
        wordWrap: string;
        wordWrapColumn: number;
    };
}

export function encode(p: UserPreference): Partial<Fragment> {
    return {
        fontSize: p.fontSize,
        language: p.language,
        significantButtonColor: p.significantButtonColor,
        significantButtonHoverColor: p.significantButtonHoverColor,
        gameplayLayout: p.gameplayLayout,
        editorOptions: { 
            theme: p.editorOptions.theme,
            enableMinimap: p.editorOptions.enableMinimap,
            lineNumbers: p.editorOptions.lineNumbers,
            renderWhiteSpace: p.editorOptions.renderWhiteSpace,
            tabSize: p.editorOptions.tabSize,
            wordWrap: p.editorOptions.wordWrap,
            wordWrapColumn: p.editorOptions.wordWrapColumn,
        }
    };
}

export const PRISTINE: Fragment = {
    fontSize: 16,
    language: "JavaScript",
    significantButtonColor: '#007fff',
    significantButtonHoverColor: '#0560bc',
    gameplayLayout: "Default",
    editorOptions : {
        theme: "Visual Studio - Dark",
        enableMinimap: true,
        lineNumbers: "On",
        renderWhiteSpace: "None",
        tabSize: 4,
        wordWrap: "Off",
        wordWrapColumn: 80,
    }
}

export function decode(raw: any): Fragment {
    const target = structuredClone(PRISTINE);

    target.fontSize = raw.fontSize ?? PRISTINE.fontSize;
    target.language = raw.language ?? PRISTINE.language;
    target.significantButtonColor = raw.significantButtonColor ?? PRISTINE.significantButtonColor;
    target.significantButtonHoverColor = raw.significantButtonHoverColor ?? PRISTINE.significantButtonHoverColor;
    target.gameplayLayout = raw.gameplayLayout ?? PRISTINE.gameplayLayout;
    target.editorOptions = { 
        theme: raw.editorOptions.theme ?? PRISTINE.editorOptions.theme,
        enableMinimap: raw.editorOptions.enableMinimap ?? PRISTINE.editorOptions.enableMinimap,
        lineNumbers: raw.editorOptions.lineNumbers ?? PRISTINE.editorOptions.lineNumbers,
        renderWhiteSpace: raw.editorOptions.renderWhiteSpace ?? PRISTINE.editorOptions.renderWhiteSpace,
        tabSize: raw.editorOptions.tabSize ?? PRISTINE.editorOptions.tabSize,
        wordWrap: raw.editorOptions.wordWrap ?? PRISTINE.editorOptions.wordWrap,
        wordWrapColumn: raw.editorOptions.wordWrapColumn ?? PRISTINE.editorOptions.wordWrapColumn,
    };
    return target;
} 
