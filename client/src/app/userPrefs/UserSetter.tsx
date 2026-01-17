"use client";

import { useUserStore } from "@/contexts/UserContext";
import { User } from "./userPrefsTypes";
import { useEffect } from "react";

export default function UserSetter({ user }: { user: User }) {
    const setUser = useUserStore(state => state.setUser);

    useEffect(() => {
        setUser(user);
    }, [user]);

    return null;
}