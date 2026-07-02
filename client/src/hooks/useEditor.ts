// "use client";

import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import type * as Monaco from "monaco-editor";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { PRESET_THEMES } from "@/components/themes/themes";
import { PROGRAMMING_LANGUAGES } from "@/utils/settings";
import { useToast } from "@/contexts/ToastContext";

// import { RefObject, use, useCallback, useEffect, useRef, useState } from "react";
// import * as monaco from "monaco-editor";
// import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
// import { PRESET_THEMES } from "@/components/themes/themes";
// import { PROGRAMMING_LANGUAGES } from "@/utils/settings";
// import { useToast } from "@/contexts/ToastContext";

// type EditorHookParams = {
//     /** A reference to the container element for the editor */
//     containerRef: RefObject<HTMLDivElement | null>
//     /** The reference to the editor instance */
//     editorRef: RefObject<monaco.editor.IStandaloneCodeEditor | null>;
//     /** The options for configuring the editor */
//     editorOptions: monaco.editor.IStandaloneDiffEditorConstructionOptions;
//     /** Fires when the editor content changes */
//     onChange: (code: string) => void;
// }

// export default function useEditor({ containerRef, editorRef, editorOptions, onChange }: EditorHookParams) {
//     const userPreference = useUserPreferenceStore(state => state.userPreference);
//     const [isEditorReady, setIsEditorReady] = useState(false);
//     const isInitializedRef = useRef(false);

//     const { openPopup } = useToast(); 

//     type PatchedPyrightProvider = InstanceType<typeof import("@/utils/lsp")["PatchedPyrightProvider"]>;
//     const pyrightProviderRef = useRef<PatchedPyrightProvider | null>(null);

//     const stopAllProviders = useCallback(async () => {
//         const pyrightProvider = pyrightProviderRef.current;
//         if (pyrightProvider) {
//             await pyrightProvider.stopDiagnostics();
//             pyrightProviderRef.current = null;
//         }
//     }, []);

//     // mount the code editor once
//     useEffect(() => {
//         if (!containerRef.current) return;

//         const container = containerRef.current;
//         let resizeObserver: ResizeObserver | null = null;
//         let cancelled = false;

//         const init = async () => {
//             if (!isInitializedRef.current) {
//                 const editor = monaco.editor.create(
//                     container,
//                     editorOptions
//                 );

//                 editorRef.current = editor;

//                 resizeObserver = new ResizeObserver(() => {
//                     editor!.layout();
//                 });

//                 resizeObserver.observe(container);

//                 monaco.editor.defineTheme(
//                     PRESET_THEMES[userPreference.editorOptions.theme].monacoEditorAlias,
//                     PRESET_THEMES[userPreference.editorOptions.theme].theme
//                 );

//                 editor.onKeyDown((e: monaco.IKeyboardEvent) => {
//                     if (e.keyCode === monaco.KeyCode.Escape) {
//                         const domNode = editor!.getDomNode();
//                         if (domNode && domNode.contains(document.activeElement)) {
//                             (document.activeElement as HTMLElement).blur();
//                         }
//                     }
//                 });

//                 editor.onDidChangeModelContent(() => {
//                     const code = editor!.getValue();
//                     onChange(code);
//                 });

//                 if (cancelled) {
//                     editor.dispose();
//                     editorRef.current = null;
//                     return;
//                 }

//                 setIsEditorReady(true);
//                 isInitializedRef.current = true;
//             }
//         }

//         init();

//         return () => {
//             cancelled = true;
//             isInitializedRef.current = false;
//             resizeObserver?.disconnect();

//             try {
//                 editorRef.current?.dispose();
//             } catch (err: unknown) {
//                 // ignore
//             }
//             editorRef.current = null;
//             setIsEditorReady(false);
//         }
//     }, []);

//     // re-run language-specific setip when the language changes
//     useEffect(() => {
//         // alert(isEditorReady);

//         if (
//             !containerRef.current 
//             || !editorRef.current
//             || !isEditorReady
//         ) return;

//         const editor = editorRef.current;
//         const model = editor.getModel();
//         if (!model) return;

//         let cancelled = false;

//         const switchLanguage = async () => {
//             // stop existing provider
//             await stopAllProviders();

//             // update the model language
//             monaco.editor.setModelLanguage(
//                 model,
//                 PROGRAMMING_LANGUAGES[userPreference.language].monacoEditorAlias
//             );

//             if (!userPreference.enableEnhancedLanguageSupport) {
//                 return;
//             }

//             if (userPreference.language === "Python") {
//                 if (!pyrightProviderRef.current) {
//                     const { PatchedPyrightProvider } = await import("@/utils/lsp");
//                     const provider = new PatchedPyrightProvider();
//                     pyrightProviderRef.current = provider;

//                     openPopup(
//                         "Initializing Python language server",
//                         "info",
//                         -1,
//                         true
//                     );

//                     await provider.init(monaco);
//                     if (cancelled) return;
//                 }

//                 const provider = pyrightProviderRef.current;

//                 await provider.setupDiagnostics(editor);
//                 if (cancelled) {
//                     await provider.stopDiagnostics();
//                     return;
//  ``               };

//                 openPopup(
//                     "Enhanced Python language support is ready",
//                     "success",
//                     3
//                 );
//             } else if (userPreference.language === "JavaScript") {
//                 openPopup(
//                     "Enhanced JavaScript language support is ready",
//                     "success",
//                     3
//                 );
//             } else {
//                 // Setup for other languages if needed
//                 openPopup(
//                     "This language does not have enhanced support, but you can still code in it.",
//                     "warning",
//                     5
//                 );
//             }
//         }

//         switchLanguage();

//         return () => {
//             cancelled = true;
//             stopAllProviders();
//         }
//     }, [userPreference.language, isEditorReady]);
// }

type EditorHookParams = {
    /** A reference to the container element for the editor */
    monacoRef: RefObject<typeof Monaco | null>;
    /** The reference to the editor instance */
    editorRef: RefObject<Monaco.editor.IStandaloneCodeEditor | null>;
}

export default function useEditor({ monacoRef, editorRef }: EditorHookParams) {
    const userPreference = useUserPreferenceStore(state => state.userPreference);
    const [isEditorReady, setIsEditorReady] = useState(false);

    const { openPopup } = useToast(); 

    type PatchedPyrightProvider = InstanceType<typeof import("@/utils/lsp")["PatchedPyrightProvider"]>;

    const pyrightProviderRef = useRef<PatchedPyrightProvider | null>(null);

    const init = useCallback(() => {
        if (!monacoRef.current || !editorRef.current) return;

        const monaco = monacoRef.current;
        // const editor = editorRef.current;

        // set theme
        monaco.editor.defineTheme(
            PRESET_THEMES[userPreference.editorOptions.theme].monacoEditorAlias,
            PRESET_THEMES[userPreference.editorOptions.theme].theme
        );
    }, []);

    useEffect(() => {
        init();
        setIsEditorReady(true);
    }, []);

    const stopAllProviders = useCallback(async () => {
        const pyrightProvider = pyrightProviderRef.current;
        if (pyrightProvider) {
            await pyrightProvider.stopDiagnostics();
            pyrightProviderRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (
            !monacoRef.current
            || !editorRef.current
            || !isEditorReady
        ) return;

        const monaco = monacoRef.current;
        const editor = editorRef.current;
        const model = editor.getModel();
        if (!model) return;

        let cancelled = false;

        const switchLanguage = async () => {
            // stop existing provider
            await stopAllProviders();

            // update the model language
            monaco.editor.setModelLanguage(
                model,
                PROGRAMMING_LANGUAGES[userPreference.language].monacoEditorAlias
            );

            if (!userPreference.enableEnhancedLanguageSupport) {
                return;
            }

            if (userPreference.language === "Python") {
                if (!pyrightProviderRef.current) {
                    const { PatchedPyrightProvider } = await import("@/utils/lsp");
                    const provider = new PatchedPyrightProvider();
                    pyrightProviderRef.current = provider;

                    openPopup(
                        "Initializing Python language server",
                        "info",
                        -1,
                        true
                    );

                    await provider.init(monaco);
                    if (cancelled) return;
                }

                const provider = pyrightProviderRef.current;

                await provider.setupDiagnostics(editor);
                if (cancelled) {
                    await provider.stopDiagnostics();
                    return;
 ``               };

                openPopup(
                    "Enhanced Python language support is ready",
                    "success",
                    3
                );
            } else if (userPreference.language === "JavaScript") {
                openPopup(
                    "Enhanced JavaScript language support is ready",
                    "success",
                    3
                );
            } else {
                // Setup for other languages if needed
                openPopup(
                    "This language does not have enhanced support, but you can still code in it.",
                    "warning",
                    5
                );
            }
        }

        switchLanguage();

        return () => {
            cancelled = true;
            stopAllProviders();
        }
    }, [userPreference.language, isEditorReady]);
}