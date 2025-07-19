import { PLKeys } from "@/app/components/settings/settingsUtils";
import { create } from "zustand";

type CodeByUser = {
    [userId: string]: string;
}

type CodeEditorState = {
    codeByUser: CodeByUser;
    readOnlyTabs: string[];
    programmingLanguage: PLKeys;

    setCodeForUser: (userId: string, code: string) => void;
    setReadOnlyTabs: (tabs: string[]) => void;
    setProgrammingLanguage: (language: PLKeys) => void;
}

export const useCodeEditorStore = create<CodeEditorState>((set) => ({
    codeByUser: { },
    programmingLanguage: "JavaScript",
    readOnlyTabs: [],

    setCodeForUser: (userId, code) => 
        set((state) => ({
            codeByUser: { ...state.codeByUser, [userId]: code }
        })),
    setProgrammingLanguage: (language) => set({ programmingLanguage: language }),
    setReadOnlyTabs: (tabs) => set({ readOnlyTabs: tabs }),
}));