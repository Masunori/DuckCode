"use client";

import { useEffect } from "react";
import { usePopup } from "../contexts/PopupContext";
import styles from "./popup.module.css";
import { GENERAL_KEY_BINDINGS, isKeyCombo } from "../settings/settingsUtils";
import { keyboardManager, POPUP_KEY_PRIORITY } from "@/app/utils/keyboardManager";
import { motion, AnimatePresence } from "motion/react";

export default function Popup() {
    const { isPopupOpen, popupMessage, confirmMessage, cancelMessage, confirmFn, cancelFn } = usePopup();

    // when the popup is on, disable all keyboard events, except:
    // - the confirm button (Enter)
    // - the cancel button (Escape)
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (!isPopupOpen) {
                return false;
            }

            if (isKeyCombo(event, GENERAL_KEY_BINDINGS["CONFIRM_POPUP"].combo)
                || (isKeyCombo(event, GENERAL_KEY_BINDINGS["CANCEL_POPUP"].combo) && cancelMessage !== null)) {
                event.preventDefault();
                confirmFn();
                return true;
            } else if (isKeyCombo(event, GENERAL_KEY_BINDINGS["CANCEL_POPUP"].combo)) {
                event.preventDefault();
                if (cancelMessage !== null) {
                    cancelFn();
                }
                return true;
            }

            return false;
        }

        keyboardManager.register("popup", POPUP_KEY_PRIORITY, handleKeyDown);
        return () => {
            keyboardManager.unregister("popup");
        }
    })

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
                            onClick={cancelMessage !== null ? cancelFn : () => {}}
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