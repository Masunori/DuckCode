"use client";

import { keyboardManager } from "@/lib/utils/keyboardManager";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { usePopup } from "@/contexts/PopupContext";
import styles from "./popup.module.css";

export default function Popup() {
    const { isPopupOpen, popupMessage, confirmMessage, cancelMessage, confirmFn, cancelFn, handleKeyBinding } = usePopup();

    // when the popup is on, disable all keyboard events, except:
    // - the confirm button (Enter)
    // - the cancel button (Escape)
    useEffect(() => {
        if (isPopupOpen) {
            keyboardManager.register("popup", "POPUP_KEY_PRIORITY", handleKeyBinding);
        }

        return () => {
            keyboardManager.unregister("popup");
        }
    }, [handleKeyBinding, isPopupOpen]);

    return (
        <AnimatePresence>
            {isPopupOpen && (
                <>
                    <motion.div
                        className={styles.popupOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    ></motion.div>
                    <motion.div
                        className={styles.popup}
                        initial={{ opacity: 0, x: "-50%", y: "-100%" }}
                        animate={{ opacity: 1, x: "-50%", y: "0%" }}
                        exit={{ opacity: 0, x: "-50%", y: "-100%" }}
                        transition={{ duration: 0.25 }}
                    >
                        <p
                            className={styles.popupMessage}
                        >{popupMessage}</p>
                        <button
                            style={{
                                display: cancelMessage === null ? "none" : "block"
                            }}
                            onClick={cancelMessage !== null ? cancelFn : () => { }}
                            className={styles.popupCancelButton}
                        >{cancelMessage ?? ""}</button>
                        <button
                            onClick={confirmFn}
                            className={styles.popupConfirmButton}
                        >{confirmMessage}</button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}