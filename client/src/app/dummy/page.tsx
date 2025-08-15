"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export default function Page() {
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);

    return (
        <>
            <button onClick={() => setOpen(prev => !prev)}>Toggle Popup</button>
            <AnimatePresence>
                {open && (
                    <motion.div 
                        style={{ 
                            background: "rgba(0, 0, 0, 0.5)", 
                            padding: "20px", borderRadius: "8px", 
                            overflow: "hidden",
                        }}
                        initial={{ height: 0 }}
                        animate={{ height: "500px" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.h2 layout>Popup Content</motion.h2>
                        <motion.p layout>This is a simple popup example.</motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            <button onClick={() => setOpen2(prev => !prev)}>Toggle Popup 2</button>
            <div
                style={{
                    height: open2 ? "500px" : "0",
                    overflow: "hidden",
                    transitionDuration: "0.5s",
                    background: "rgba(0, 0, 0, 0.5)",
                    padding: "20px",
                    borderRadius: "8px",
                    boxSizing: "border-box"
                }}
            >
                <h2>Popup 2 Content</h2>
                <p>This is another popup example with a different style.</p>
            </div>
        </>
    )
}