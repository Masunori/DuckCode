import { UserPreference } from "../userPrefsTypes";

export type Fragment = {
    enableEnhancedLanguageSupport: boolean
}

export function encode(p: UserPreference): Partial<Fragment> {
    return {
        enableEnhancedLanguageSupport: p.enableEnhancedLanguageSupport ?? false
    };
}

export const PRISTINE: Fragment = {
    enableEnhancedLanguageSupport: false,
}

export function decode(raw: any): Fragment {
    const target = structuredClone(PRISTINE);

    target.enableEnhancedLanguageSupport = raw.enableEnhancedLanguageSupport ?? PRISTINE.enableEnhancedLanguageSupport;
    return target;
}