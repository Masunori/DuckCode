"use client";

import { PRISTINE_USER, User } from "@/app/userPrefs/userPrefsUtils";
import { Paths } from "@/app/utils/types";
import { create } from "zustand";
import { combine } from "zustand/middleware";

type UserStore = {
    user: User;
    setUserField: (path: Paths<User>, value: unknown) => void;
    setUser: (user: User) => void;
}

export const useUserStore = create<UserStore>(
    combine({ user: structuredClone(PRISTINE_USER) }, (set) => {
        return {
            setUserField: (path: Paths<User>, value: unknown) => {
                set((state) => {
                    if (!path) {
                        return { user: state.user };
                    }
                    const keys = path.split(".");
                    const newUser = { ...state.user };

                    // To traverse the User object recursively, `cursor` must be of type User or any object within User
                    // However, cursor = User does not work because it cannot confirm if keys[i] is a valid user attribute.
                    // cursor = object also does not work because it (somehow) cannot "cast type string to {}"
                    // cursor = Record<string, unknown> also does not work because Record cannot be spread
                    // Hence, cast cursor to any and suppress eslint.

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    let cursor: any = newUser;

                    for (let i = 0; i < keys.length - 1; i++) {
                        cursor[keys[i]] = { ...cursor[keys[i]] };
                        cursor = cursor[keys[i]];
                    }
                    cursor[keys.at(-1)!] = value;
                    return { user: newUser };
                })
            },
            setUser: (user: User) => set(() => ({ user })),
        }
    })
)