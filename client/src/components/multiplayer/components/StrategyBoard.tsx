"use client";

import { isKeyCombo, MULTIPLAYER_KEY_BINDINGS } from "@/components/settings/settingsUtils";
import { keyboardManager } from "@/lib/utils/keyboardManager";
import "@excalidraw/excalidraw/index.css";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { useShallow } from "zustand/shallow";
import styles from "../page.module.css";
import { useMultiplayerGameplayStore } from "@/lib/multiplayer/hooks/useMultiplayerGameplayStore";

const Excalidraw = dynamic(
    async () => (await import("@excalidraw/excalidraw")).Excalidraw,
    {
        ssr: false,
    },
);

export default function StrategyBoard() {
    const [dragDisabled, setDragDisabled] = useState(false);
    const [excalidrawApi, setExcalidrawApi] = useState<ExcalidrawImperativeAPI | null>(null);

    const [isBoardOpen, setIsBoardOpen] = useMultiplayerGameplayStore(
        useShallow(state => [state.isBoardOpen, state.setIsBoardOpen])
    );

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (isKeyCombo(e, MULTIPLAYER_KEY_BINDINGS["TOGGLE_CANVAS"].combo)) {
                setIsBoardOpen(prev => !prev);
                return true;
            }

            return false;
        }

        keyboardManager.register("toggle-board", "CANVAS_KEY_PRIORITY", handleKeyDown);
        return () => {
            keyboardManager.unregister("toggle-board");
        }
    }, [setIsBoardOpen]);

    return (
        <>
            {isBoardOpen && <div className={styles.strategyBoardOverlay}>
                <Rnd
                    bounds="parent"
                    default={{
                        x: 100,
                        y: 100,
                        width: 640,
                        height: 360,
                    }}
                    className={styles.strategyBoard}
                    disableDragging={dragDisabled}
                    onDragStop={() => {
                        excalidrawApi?.refresh();
                    }}
                >
                    <div className={styles.excalidraw}>
                        <Excalidraw
                            excalidrawAPI={(api) => setExcalidrawApi(api)}
                            onPointerDown={() => setDragDisabled(true)}
                            onPointerUp={() => setDragDisabled(false)}
                            theme={"dark"}
                        />
                    </div>
                </Rnd>
            </div>}
        </>
    )
}