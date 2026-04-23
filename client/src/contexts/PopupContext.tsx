'use client';

import React, { createContext, useContext, useState } from "react";
import { GENERAL_KEY_BINDINGS, isKeyCombo } from '@/lib/utils/keyBindings';

type PopupContextType = {
    isPopupOpen: boolean;
    closePopup: () => void;

    openPopupWith: (
        popupMessage: string,
        confirmMessage: string,
        cancelMessage: string | null,
        confirm: () => void,
        cancelFn: () => void,
    ) => void;

    popupMessage: string;
    confirmMessage: string;
    cancelMessage: string | null;
    confirmFn: () => void;
    cancelFn: () => void;
    handleKeyBinding: (e: KeyboardEvent) => boolean;
}

const PopupContext = createContext<PopupContextType | null>(null);

export function PopupProvider({ children }: { children: React.ReactNode }) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const openPopup = () => { setIsPopupOpen(true); };
    const closePopup = () => { setIsPopupOpen(false); };

    const [popupMessage, setPopupMessage] = useState<string>("Popup opened!");
    const [confirmMessage, setConfirmMessage] = useState<string>("Confirm");
    const [cancelMessage, setCancelMessage] = useState<string | null>("Cancel");
    const [onConfirm, setOnConfirm] = useState<() => void>(() => openPopup);
    const [onCancel, setOnCancel] = useState<() => void>(() => closePopup);

    /**
     * Open the popup.\
     * **NOTE**: if a popup is just to provide information, and you only want the user to acknowledge the information instead of having 
     * two actions, set cancelMessage to "null".
     * 
     * @param popupMessage The message displayed in the popup. Default: `"Popup opened!"`.
     * @param confirmMessage The information on the confirm action button. Default: `"Confirm"`.
     * @param cancelMessage The information on the cancel action button. Default: `"Cancel"`.
     * @param confirmFn The function executed if the user confirms. The user does not need to manually close the popup. Default: `() => {}`.
     * @param cancelFn The function executed if the user confirms. The user does not need to manually close the popup. Default: `() => {}`.
     */
    const openPopupWith = (
        popupMessage: string = "Popup opened!",
        confirmMessage: string = "Confirm",
        cancelMessage: string | null = "Cancel",
        confirmFn: () => void = () => { },
        cancelFn: () => void = () => { }
    ) => {
        setPopupMessage(popupMessage);
        setConfirmMessage(confirmMessage);
        setCancelMessage(cancelMessage);

        function confirmAndClose() {
            confirmFn();
            closePopup();
        }

        function cancelAndClose() {
            cancelFn();
            closePopup();
        }

        setOnConfirm(() => confirmAndClose);
        setOnCancel(() => cancelAndClose);

        openPopup();
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (isKeyCombo(event, GENERAL_KEY_BINDINGS["CONFIRM_POPUP"].combo)) {
            event.preventDefault();
            onConfirm();
            return true;
        } else if (isKeyCombo(event, GENERAL_KEY_BINDINGS["CANCEL_POPUP"].combo)) {
            event.preventDefault();
            if (cancelMessage !== null) {
                onCancel();
                return true;
            }
            return false;
        }

        return false;
    }


    return (
        <PopupContext.Provider value={{
            isPopupOpen: isPopupOpen,
            closePopup: closePopup,
            openPopupWith: openPopupWith,

            popupMessage: popupMessage,
            confirmMessage: confirmMessage,
            cancelMessage: cancelMessage,
            confirmFn: onConfirm,
            cancelFn: onCancel,
            handleKeyBinding: handleKeyDown
        }}>
            {children}
        </PopupContext.Provider>
    )
}

/**
 * A hook to access the popup context, which contains the following properties:
 * - `isPopupOpen`: A boolean indicating whether the popup is currently open.
 * - `closePopup`: A function to close the popup.
 * - `openPopupWith`: A function to open the popup with custom parameters.
 *   - `popupMessage`: The message displayed in the popup. Default: `"Popup opened!"`.
 *   - `confirmMessage`: The information on the confirm action button. Default: `"Confirm"`.
 *   - `cancelMessage`: The information on the cancel action button. Default: `"Cancel"`. Set to "null" if you only want a confirm action.
 *   - `confirmFn`: The function executed if the user confirms. You do not need to manually close the popup. Default: `() => {}`.
 *   - `cancelFn`: The function executed if the user cancels. You do not need to manually close the popup. Default: `() => {}`.
 * - `popupMessage`: The message displayed in the popup.
 * - `confirmMessage`: The information on the confirm action button.
 * - `cancelMessage`: The information on the cancel action button.
 * - `confirmFn`: The function executed if the user confirms. You do not need to manually close the popup.
 * - `cancelFn`: The function executed if the user cancels. You do not need to manually close the popup.
 * - `handleKeyBinding`: A function to handle key bindings for confirming or canceling the popup.
 * @returns The popup context values.
 */
export function usePopup() {
    const ctx = useContext(PopupContext);
    if (!ctx) {
        throw new Error('usePopup must be used inside a PopupProvider');
    }
    return ctx;
}