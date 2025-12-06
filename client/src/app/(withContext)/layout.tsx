// "use client";

import { SettingsProvider } from "../components/contexts/SettingsContext";
import Settings from "../components/settings/Settings";
import { PopupProvider } from "../components/contexts/PopupContext";
import Popup from "../components/popup/Popup";
import { getProfile } from "@/lib/apiServer/user";
import KeyBindingsProvider from "./KeyBindingsProvider";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { printd } from "../utils/debugUtils";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const accessToken = (await cookies()).get("accessToken")?.value;
    const refreshToken = (await cookies()).get("refreshToken")?.value;

    printd("@app/(withContext)/layout.tsx", "Fetching user profile...");
    const response = await getProfile(accessToken, refreshToken);

    if (response.status !== 200) {
        printd("@app/(withContext)/layout.tsx", "Failed to fetch user profile");
        redirect("/portal");
        return;
    }

    if (response.data === null) {
        redirect("/portal");
        return;
    }

    const user = response.data;

    return (
        <KeyBindingsProvider user={user}>
            <PopupProvider>
                <Popup />
                <SettingsProvider>
                    <Settings />
                    {children}
                </SettingsProvider>
            </PopupProvider>
        </KeyBindingsProvider>
    );
}
