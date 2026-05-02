import { GettingStartedInstructionProvider } from "@/contexts/GettingStartedInstructionContext";
import { ReactNode } from "react";

export default function GettingStartedLayout({ children }: Readonly<{
    children: ReactNode;
}>) {
    return (
        <GettingStartedInstructionProvider>
            {children}
        </GettingStartedInstructionProvider>
    )
}