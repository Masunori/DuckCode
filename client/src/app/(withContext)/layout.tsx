import { SettingsProvider } from "../components/contexts/SettingsContext";
import Settings from "../components/settings/Settings";
import { PopupProvider } from "../components/contexts/PopupContext";
import Popup from "../components/popup/Popup";
import { getProfile } from "@/lib/apiServer/user";
import KeyBindingsProvider from "./KeyBindingsProvider";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const response = await getProfile();

    if (response.status !== 200) {
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
