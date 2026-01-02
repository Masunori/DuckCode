import { SettingsProvider } from "../components/contexts/SettingsContext";
import Settings from "../components/settings/Settings";
import { PopupProvider } from "../components/contexts/PopupContext";
import Popup from "../components/popup/Popup";
import { getProfile } from "@/lib/apiServer/user";
import KeyBindingsProvider from "./KeyBindingsProvider";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { printd } from "../utils/debugUtils";
import RefreshClient from "./RefreshClient";
import { PRISTINE_USER } from "../userPrefs/userPrefsUtils";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const accessToken = (await cookies()).get("accessToken")?.value;
    const refreshToken = (await cookies()).get("refreshToken")?.value;

    if (!accessToken && !refreshToken) {
        redirect("/portal");
    }

    if (accessToken) {
        printd("@app/(withContext)/layout.tsx", "Fetching user profile...");
        const response = await getProfile();

        if (response.status === 200 && response.data) {
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
    }

    // The RefreshClient will handle token-refreshing so that cookies can be set on the client side
    if (refreshToken) {
        return <RefreshClient />
    }

    redirect("/portal");

    // return (
    //     <KeyBindingsProvider user={PRISTINE_USER}>
    //         <PopupProvider>
    //             <Popup />
    //             <SettingsProvider>
    //                 <Settings />
    //                 {children}
    //             </SettingsProvider>
    //         </PopupProvider>
    //     </KeyBindingsProvider>
    // );
}
