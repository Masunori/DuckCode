"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { PRESET_THEMES } from "@/components/themes/themes";
import { PROGRAMMING_LANGUAGES } from "@/components/settings/settingsUtils";
import { useToast } from "@/contexts/ToastContext";

type EditorHookParams = {
    /** A reference to the container element for the editor */
    containerRef: RefObject<HTMLDivElement | null>
    /** The reference to the editor instance */
    editorRef: RefObject<monaco.editor.IStandaloneCodeEditor | null>;
    /** The options for configuring the editor */
    editorOptions: monaco.editor.IStandaloneDiffEditorConstructionOptions;
    /** Fires when the editor content changes */
    onChange: (code: string) => void;
}

export default function useEditor({ containerRef, editorRef, editorOptions, onChange }: EditorHookParams) {
    const userPreference = useUserPreferenceStore(state => state.userPreference);
    const isInitializedRef = useRef(false);
    const [isEditorReady, setIsEditorReady] = useState(false);

    const { openPopup } = useToast(); 

    type MonacoPyrightProvider = InstanceType<typeof import("monaco-pyright-lsp")["MonacoPyrightProvider"]>;
    const pyrightProviderRef = useRef<MonacoPyrightProvider | null>(null);

    // mount the code editor once
    useEffect(() => {
        if (!containerRef.current || isInitializedRef.current) return;

        const container = containerRef.current;

        let cancelled = false;
        let resizeObserver: ResizeObserver | null = null;

        const init = async () => {
            pyrightProviderRef.current = await import("monaco-pyright-lsp")
                .then(module => new module.MonacoPyrightProvider());

            const editor = monaco.editor.create(
                container,
                editorOptions
            );

            editorRef.current = editor;

            resizeObserver = new ResizeObserver(() => {
                editor!.layout();
            });

            resizeObserver.observe(container);

            monaco.editor.defineTheme(
                PRESET_THEMES[userPreference.editorOptions.theme].monacoEditorAlias,
                PRESET_THEMES[userPreference.editorOptions.theme].theme
            );

            editor.onKeyDown((e: monaco.IKeyboardEvent) => {
                if (e.keyCode === monaco.KeyCode.Escape) {
                    const domNode = editor!.getDomNode();
                    if (domNode && domNode.contains(document.activeElement)) {
                        (document.activeElement as HTMLElement).blur();
                    }
                }
            });

            editor.onDidChangeModelContent(() => {
                const code = editor!.getValue();
                onChange(code);
            });

            setIsEditorReady(true);
        }

        init();

        return () => {
            cancelled = true;
            pyrightProviderRef.current?.stopDiagnostics();
            resizeObserver?.disconnect();

            const editor = editorRef.current;

            if (editor) {
                editor.dispose();
                editorRef.current = null;
            }
        }
    }, []);

    // re-run language-specific setip when the language changes
    useEffect(() => {
        if (
            !containerRef.current 
            || !editorRef.current
            || !isEditorReady
        ) return;

        const editor = editorRef.current;
        const model = editor.getModel();

        if (!model) return;

        let cancelled = false;

        const switchLanguage = async () => {
            await pyrightProviderRef.current?.stopDiagnostics();
            pyrightProviderRef.current = null;

            monaco.editor.setModelLanguage(
                model,
                PROGRAMMING_LANGUAGES[userPreference.language].monacoEditorAlias
            );

            if (userPreference.language === "Python") {
                const { MonacoPyrightProvider } = await import("monaco-pyright-lsp");
                pyrightProviderRef.current = new MonacoPyrightProvider();

                openPopup(
                    "Initializing Python language server",
                    "info",
                    -1,
                    true
                );

                if (cancelled) return;
                
                await pyrightProviderRef.current.setupDiagnostics(editor);

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
            pyrightProviderRef.current?.stopDiagnostics();
            pyrightProviderRef.current = null;
        }
    }, [userPreference.language, isEditorReady]);
}