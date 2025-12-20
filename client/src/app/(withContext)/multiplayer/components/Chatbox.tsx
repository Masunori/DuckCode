"use client";

import { AnimatePresence, motion } from "motion/react";
import styles from "../page.module.css";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useChatStore } from "../stores/chatStore";
import { isKeyCombo, MULTIPLAYER_KEY_BINDINGS } from "@/app/components/settings/settingsUtils";
import { keyboardManager } from "@/app/utils/keyboardManager";
import { useChatController } from "../hooks/useChatController";
import { useShallow } from "zustand/shallow";

export default function Chatbox() {
    const [isChatboxOpen, setIsChatboxOpen, message, setMessage, sendMessage] = useChatController(
        useShallow(state => [state.isChatboxOpen, state.setIsChatboxOpen, state.message, state.setMessage, state.sendMessage])
    );

    const chatboxRef = useRef<HTMLDivElement>(null);
    const chatboxDialogueRef = useRef<HTMLDivElement>(null);
    const chatboxInputRef = useRef<HTMLInputElement>(null);

    const [autoScroll, setAutoScroll] = useState(true);
    const scrollPositionRef = useRef<number | null>(null);

    // on open the chatbox, focus the input
    useEffect(() => {
        if (isChatboxOpen && chatboxInputRef.current) {
            chatboxInputRef.current.focus();
        }
    }, [chatboxInputRef, isChatboxOpen]);

    // close the chatbox when clicking outside of it
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (chatboxRef.current && !chatboxRef.current.contains(event.target as Node)) {
                setIsChatboxOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setIsChatboxOpen]);

    const messages =  useChatStore(state => state.messages);
    const addMessage = useChatStore(state => state.addMessage);

    // delete this later
    // this randomly generates messages for testing purposes
    useEffect(() => {
        const interval = setInterval(() => {
            const randomNum = Math.random();
            const randomSender = randomNum > 0.66 ? "Player 1" : randomNum > 0.33 ? "Player 2" : "System";

            const randomMessage = randomSender === "System"
                ? `${Math.random() > 0.5 ? "Player 1" : "Player 2"} is running the code.`
                : `Random message from ${randomSender} at ${new Date().toLocaleTimeString()}`;

            addMessage({
                sender: randomSender,
                content: randomMessage,
                timestamp: new Date().toISOString()
            });
        }, 1000); // random interval between 1s and 7s

        return () => clearInterval(interval);
    }, [addMessage]);

    const handleSendMessage = useCallback(() => {
        sendMessage();
        if (chatboxInputRef.current) {
            chatboxInputRef.current.focus(); // refocus the input
        }

        const el = chatboxDialogueRef.current;

        if (!el) {
            return;
        }

        el.scrollTo({
            top: el.scrollHeight,
            behavior: "auto",
        });
        setAutoScroll(true);
    }, [chatboxInputRef, sendMessage]);

    // scroll to the bottom of the chatbox when new messages are added
    // only when the user is near the end of the chatbox
    const userScrollingRef = useRef(false);

    useEffect(() => {
        const el = chatboxDialogueRef.current;
        if (!el || !isChatboxOpen) return;

        const handleScroll = () => {
            const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 20;
            if (!userScrollingRef.current) return;
            
            setAutoScroll(atBottom);
            scrollPositionRef.current = atBottom ? null : el.scrollTop;
        };

        const markUserScroll = () => {
            userScrollingRef.current = true;
        };

        el.addEventListener("scroll", handleScroll);
        el.addEventListener("wheel", markUserScroll);
        el.addEventListener("touchmove", markUserScroll);

        return () => {
            el.removeEventListener("scroll", handleScroll);
            el.removeEventListener("wheel", markUserScroll);
            el.removeEventListener("touchmove", markUserScroll);
        };
    }, [isChatboxOpen]);


    useEffect(() => {
        const el = chatboxDialogueRef.current;
        if (!el) {
            return;
        }

        console.log(el.scrollHeight - el.scrollTop - el.clientHeight);
    }, [messages]);

    useEffect(() => {
        const el = chatboxDialogueRef.current;
        if (!el) {
            return;
        }

        if (!autoScroll && scrollPositionRef.current !== null) {
            el.scrollTo({
                top: scrollPositionRef.current,
                behavior: "auto",
            })
        } else {
            el.scrollTo({
                top: el.scrollHeight,
                behavior: "auto",
            })
        }
    }, [autoScroll, messages]);

    // add key bindings
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isChatboxOpen) {
                if (isKeyCombo(e, MULTIPLAYER_KEY_BINDINGS["OPEN_CHATBOX"].combo)) {
                    e.preventDefault();
                    setIsChatboxOpen(true);
                    return true;
                }
                
                return false;
            }

            if (isKeyCombo(e, MULTIPLAYER_KEY_BINDINGS["SEND_CHAT_MESSAGE"].combo)) {
                e.preventDefault();
                handleSendMessage();

                return true;
            } else if (isKeyCombo(e, MULTIPLAYER_KEY_BINDINGS["CLOSE_CHATBOX"].combo)) {
                e.preventDefault();
                setIsChatboxOpen(false);
                return true;
            }

            return false;
        }

        keyboardManager.register("chatbox-send-message", "CHAT_KEY_PRIORITY", handleKeyDown);

        return () => {
            keyboardManager.unregister("chatbox-send-message");
        }
    }, [handleSendMessage, isChatboxOpen, setIsChatboxOpen]);

    // This component can be expanded to include
    return (
        <AnimatePresence>
            {isChatboxOpen && (
                <>  
                    <motion.div 
                        className={styles.chatboxOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    ></motion.div>
                    <motion.div
                        className={styles.chatbox}
                        initial={{ opacity: 0, x: "-100%", y: "0" }}
                        animate={{ opacity: 1, x: "0%", y: "0%" }}
                        exit={{ opacity: 0, x: "-100%", y: "0" }}
                        transition={{ duration: 0.25 }}
                        ref={chatboxRef}
                    >
                        <button 
                            className={styles.chatboxCloseButton} 
                            onClick={() => setIsChatboxOpen(false)}
                        >×</button>
                        {!autoScroll && (
                            <button 
                                className={styles.scrollToBottomButton}
                                onClick={() => { 
                                    if (chatboxDialogueRef.current) {
                                        chatboxDialogueRef.current.scrollTo({
                                            top: chatboxDialogueRef.current.scrollHeight,
                                            behavior: "smooth",
                                        })
                                    }
                                }}
                            >▼</button>
                        )}
                        <div></div>
                        <div className={styles.chatboxDialogueContainer}>
                            <motion.div className={styles.chatboxDialogue} ref={chatboxDialogueRef}>
                                {messages.map(message => (
                                    <motion.div
                                        key={message.timestamp}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={styles.chatboxMessage}
                                    >
                                        <span className={styles.chatboxMessageSender}>[{message.sender}]: </span>
                                        <span className={styles.chatboxMessageContent}>{message.content}</span>
                                        {/* <span className={styles.chatboxMessageTimestamp}>
                                            {new Date(message.timestamp).toLocaleTimeString()}
                                        </span> */}
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                        <div className={styles.chatboxInput}>
                            <label htmlFor="chatbox-input">
                                <input
                                    id="chatbox-input"
                                    type="text" 
                                    placeholder="Type something..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    autoComplete="off"
                                    ref={chatboxInputRef}
                                ></input>
                            </label>
                            <button onClick={handleSendMessage}>Send</button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}