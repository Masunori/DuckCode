import { ColorAccessibilityKeyword } from "@/components/themes/colorAccessibilityPalettes";
import { UserPreference } from "../userPrefsTypes";

export type Fragment = {
    colorAccessibilityMode: ColorAccessibilityKeyword;
    displayKeyBindingOnButtons?: boolean;
}

export function encode(p: UserPreference): Partial<Fragment> {
    return {
        colorAccessibilityMode: p.colorAccessibilityMode ?? "Normal",
        displayKeyBindingOnButtons: p.displayKeyBindingOnButtons ?? true
    };
}

export const PRISTINE: Fragment = {
    colorAccessibilityMode: "Normal",
    displayKeyBindingOnButtons: true
}

export function decode(raw: any): Fragment {
    const target = structuredClone(PRISTINE);

    target.colorAccessibilityMode = raw.colorAccessibilityMode ?? PRISTINE.colorAccessibilityMode;
    target.displayKeyBindingOnButtons = raw.displayKeyBindingOnButtons ?? PRISTINE.displayKeyBindingOnButtons;
    return target;
}