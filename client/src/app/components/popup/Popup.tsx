"use client";

import { useEffect } from "react";
import { usePopup } from "../contexts/PopupContext";
import styles from "./popup.module.css";

export default function Popup() {
    const { isPopupOpen, popupMessage, confirmMessage, cancelMessage, confirmFn, cancelFn } = usePopup();

    // when the popup is on, disable all keyboard events
    useEffect(() => {
        function disableAllKeys(event: KeyboardEvent) {
            if (isPopupOpen) {
                event.preventDefault();
            }
        }

        window.addEventListener('keydown', disableAllKeys);
        return () => {
            window.removeEventListener('keydown', disableAllKeys);
        }
    })

    return (
        <div className={styles.popupOverlay} style={{
            visibility: isPopupOpen ? "visible" : "hidden"
        }}>
            <div 
                className={styles.popup}
                style={{
                    transform: `translateY(${isPopupOpen ? "0" : "-100%"})`
                }}
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
            </div>
        </div>
    )
}