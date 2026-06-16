"use client";

import { useToast } from "@/contexts/ToastContext";

export default function DumpPage() {
    // return null;
    const { openPopup } = useToast();

    return (
        <>
            <button onClick={() => openPopup("Toast opened", "success", 5, false)}>Open Toast (Success)</button>
            <button onClick={() => openPopup("Toast opened", "warning", 5, false)}>Open Toast (Warning)</button>
            <button onClick={() => openPopup("Toast opened", "error", 5, true)}>Open Toast (Error)</button>
            <button onClick={() => openPopup("Toast opened", "info", 5, true)}>Open Toast (Info)</button>
        </>
    );
}