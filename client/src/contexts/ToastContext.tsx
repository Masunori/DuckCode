'use client';

import { createContext, useContext, useState } from "react";

type ToastInfoLevel = "info" | "success" | "error" | "warning";

type ToastContextType = {
    isPopupOpen: boolean;
    /** The level of the toast message, can be "info", "success", "error", or "warning" */
    level: ToastInfoLevel;
    message: string;
    /** Whether the toast notification is related to some UI component/API loading */
    isLoading: boolean;
    /** The duration of the toast message, in seconds. If set to -1, the toast will not auto-close */
    duration: number; // in seconds
    openPopup: (message: string, level?: ToastInfoLevel, duration?: number, isLoading?: boolean) => void;
    closePopup: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [level, setLevel] = useState<ToastInfoLevel>("info");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [duration, setDuration] = useState(3); // default duration of 3 seconds

    const openPopup = (message: string, level?: ToastInfoLevel, duration?: number, isLoading?: boolean) => {
        setMessage(message);
        setLevel(level ?? "info");
        setIsLoading(isLoading ?? false);
        setDuration(duration ?? -1);
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setMessage("");
        setIsLoading(false);
    };

    return (
        <ToastContext.Provider value={{ isPopupOpen, level, message, isLoading, duration, openPopup, closePopup }}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}