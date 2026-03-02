"use client";

import { UserPreference } from "@/app/userPrefs/userPrefsTypes";
import { PRISTINE_USER_PREFERENCE } from "@/app/userPrefs/userPrefsUtils";
import { Paths } from "@/lib/utils/types";
import path from "path";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

type UserPreferenceStore = {
    userPreference: UserPreference;
    setUserPreference: (preference: UserPreference) => void;
    setUserPreferenceField: (path: Paths<UserPreference>, value: unknown) => void;
}

export const useUserPreferenceStore = create<UserPreferenceStore>()(
    subscribeWithSelector((set) => ({
        userPreference: structuredClone(PRISTINE_USER_PREFERENCE),
        setUserPreference: (preference: UserPreference) => set(() => ({ userPreference: preference })),
        setUserPreferenceField: (path: Paths<UserPreference>, value: unknown) => {
            set((state) => {
                if (!path) {
                    return { userPreference: state.userPreference };
                }

                const keys = path.split(".");
                const newPreference = { ...state.userPreference };

                // To traverse the UserPreference object recursively, `cursor` must be of type UserPreference or any object within UserPreference
                // However, cursor = UserPreference does not work because it cannot confirm if keys[i] is a valid userPreference attribute.
                // cursor = object also does not work because it (somehow) cannot "cast type string to {}"
                // cursor = Record<string, unknown> also does not work because Record cannot be spread
                // Hence, cast cursor to any and suppress eslint.

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let cursor: any = newPreference;

                for (let i = 0; i < keys.length - 1; i++) {
                    cursor[keys[i]] = { ...cursor[keys[i]] };
                    cursor = cursor[keys[i]];
                }
                cursor[keys.at(-1)!] = value;
                return { userPreference: newPreference };
            })
        },
    }))
);