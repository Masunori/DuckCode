import { PopupProvider } from "../../contexts/PopupContext";
import { SettingsProvider } from "../../contexts/SettingsContext";
import Popup from "../../components/popup/Popup";
import Settings from "../../components/settings/Settings";
import { PRISTINE_USER } from "../userPrefs/userPrefsUtils";
import KeyBindingsProvider from "./KeyBindingsProvider";
import UserSetter from "../userPrefs/UserSetter";
import RefreshClient from "./RefreshClient";
import { getProfile } from "@/lib/apiServer/user";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { printd } from "@/lib/utils/debugUtils";
import UserPrefRootSetter from "../userPrefs/UserPrefRootSetter";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const accessToken = (await cookies()).get("accessToken")?.value;
    const refreshToken = (await cookies()).get("refreshToken")?.value;

    if (!accessToken && !refreshToken) {
        redirect("/portal");
    }

    if (accessToken) {
        // printd("@app/(withContext)/layout.tsx", "Fetching user profile...");
        const response = await getProfile();

        if (response.status === 200 && response.data) {
            const user = response.data;

            return (
                <>
                    <UserSetter user={user} />
                    <UserPrefRootSetter />
                    <KeyBindingsProvider>
                        <PopupProvider>
                            <Popup />
                            <SettingsProvider>
                                <Settings />
                                {children}
                            </SettingsProvider>
                        </PopupProvider>
                    </KeyBindingsProvider>
                </>
            );
        }
    }

    // The RefreshClient will handle token-refreshing so that cookies can be set on the client side
    if (refreshToken) {
        return <RefreshClient />
    }

    redirect("/portal");

    // return (
    //     <>
    //         <UserSetter user={PRISTINE_USER} />
    //         <UserPrefInitializer />
    //         <KeyBindingsProvider>
    //             <PopupProvider>
    //                 <Popup />
    //                 <SettingsProvider>
    //                     <Settings />
    //                     {children}
    //                 </SettingsProvider>
    //             </PopupProvider>
    //         </KeyBindingsProvider>
    //     </>
    // );
}
