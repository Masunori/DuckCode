"use client";

import { Rnd } from "react-rnd";
import styles from "../page.module.css";
import dynamic from "next/dynamic";
import "@excalidraw/excalidraw/index.css";
import { useEffect, useState } from "react";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import { isKeyCombo, MULTIPLAYER_KEY_BINDINGS } from "@/app/components/settings/settingsUtils";
import { keyboardManager } from "@/app/utils/keyboardManager";
import { useBoardController } from "../hooks/useBoardController";
import { useShallow } from "zustand/shallow";

const Excalidraw = dynamic(
    async () => (await import("@excalidraw/excalidraw")).Excalidraw,
    {
        ssr: false,
    },
);

export default function StrategyBoard() {
    const [dragDisabled, setDragDisabled] = useState(false);
    const [excalidrawApi, setExcalidrawApi] = useState<ExcalidrawImperativeAPI | null>(null);

    const [isBoardOpen, setIsBoardOpen] = useBoardController(
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