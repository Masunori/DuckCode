import { UserPreference } from "../userPrefsTypes";

export type Fragment = {
    colorAccessibilityMode: string;
}

export function encode(p: UserPreference): Partial<Fragment> {
    return {
        colorAccessibilityMode: p.colorAccessibilityMode ?? "normal"
    };
}

export const PRISTINE: Fragment = {
    colorAccessibilityMode: "normal"
}

export function decode(raw: any): Fragment {
    const target = structuredClone(PRISTINE);

    target.colorAccessibilityMode = raw.colorAccessibilityMode ?? PRISTINE.colorAccessibilityMode;
    return target;
}