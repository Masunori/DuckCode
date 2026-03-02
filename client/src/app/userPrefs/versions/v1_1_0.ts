import { ColorAccessibilityKeyword } from "@/components/themes/colorAccessibilityPalettes";
import { UserPreference } from "../userPrefsTypes";

export type Fragment = {
    colorAccessibilityMode: ColorAccessibilityKeyword;
}

export function encode(p: UserPreference): Partial<Fragment> {
    return {
        colorAccessibilityMode: p.colorAccessibilityMode ?? "Normal"
    };
}

export const PRISTINE: Fragment = {
    colorAccessibilityMode: "Normal"
}

export function decode(raw: any): Fragment {
    const target = structuredClone(PRISTINE);

    target.colorAccessibilityMode = raw.colorAccessibilityMode ?? PRISTINE.colorAccessibilityMode;
    return target;
}