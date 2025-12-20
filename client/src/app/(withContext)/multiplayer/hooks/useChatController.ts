import { useChatStore } from "../stores/chatStore";
import { useUserStore } from "@/app/components/contexts/UserContext";
import { create } from "zustand";

type ChatControllerProps = {
    /** Whether the chatbox is open */
    isChatboxOpen: boolean;

    /** Toggles the chatbox */
    setIsChatboxOpen: (bool: boolean | ((prev: boolean) => boolean)) => void;

    /** The message in the chatbox's text input field */
    message: string;

    /** Sets the message in the chatbox's text input field */
    setMessage: (message: string) => void;

    /** Sends the message to the server and updates the message history */
    sendMessage: () => void;
}

/**
 * A Zustand store for managing chatbox UI state.
 * 
 * - `isChatboxOpen` and `setIsChatboxOpen` manages the visibility of the chatbox.
 * - `message` manages the current user messsage.
 * - `setMessage` and `sendMessage` manages updating and sending messages.
 */
export const useChatController = create<ChatControllerProps>((set, get) => ({
    isChatboxOpen: false,
    setIsChatboxOpen: (bool) => 
        set((state) => ({
            isChatboxOpen: typeof bool === "function"
                ? bool(state.isChatboxOpen)
                : bool,
        })),
    message: "",
    setMessage: (message) => set({ message: message }),
    sendMessage: () => {
        const message = get().message;
        if (message.trim() === "") {
            return;
        }

        const user = useUserStore.getState().user;
        const addMessage = useChatStore.getState().addMessage;

        addMessage({
            sender: user.name,
            content: message,
            timestamp: new Date().toISOString(),
        });

        set({ message: "" });
    }
}))