import { create } from "zustand";
import { ChatboxMessage } from "../multiplayerUtils"

type ChatState = {
    /** The list of message from all users */
    messages: ChatboxMessage[];
    /** Adds a new message to the list of messages */
    addMessage: (message: ChatboxMessage) => void;
}

export const useChatStore = create<ChatState>((set) => ({
    messages: [],
    addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
    })),
}));