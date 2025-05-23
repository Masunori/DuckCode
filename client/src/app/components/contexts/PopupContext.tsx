'use client';

import React, { createContext, useContext, useState } from "react";

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
        confirmFn: () => void = () => {},
        cancelFn: () => void = () => {}
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
        }}>
            {children}
        </PopupContext.Provider>
    )
}

export function usePopup() {
    const ctx = useContext(PopupContext);
    if (!ctx) {
        throw new Error('usePopup must be used inside a PopupProvider');
    }
    return ctx;
}