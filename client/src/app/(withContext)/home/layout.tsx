import React from "react";
import StarryBackground from "@/components/backgrounds/StarryBackground";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <StarryBackground>
            {children}
        </StarryBackground>
    )
}