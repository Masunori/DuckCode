export type ColorAccessibilityKeyword = "Normal" 
    | "Protanopia" 
    | "Deuteranopia" 
    | "Tritanopia" 
    | "Achromatopsia";

export type ColorAccessibilityPalette = {
    description: string;
    correct: string;
    correctOnHover: string;
    wrong: string;
    wrongOnHover: string;
}

export const COLOR_ACCESSIBILITY_PALETTES: Record<ColorAccessibilityKeyword, ColorAccessibilityPalette> = {
    Normal: {
        description: "Default color palette.",
        correct: "#42BE65",
        correctOnHover: "#086222",
        wrong: "#f82d37",
        wrongOnHover: "#92080f",
    },
    Protanopia: {
        description: "Color palette optimized for protanopia (red-green color blindness).",
        correct: "#0072B2",
        correctOnHover: "#074267",
        wrong: "#E69F00",
        wrongOnHover: "#BB7700",
    },
    Deuteranopia: {
        description: "Color palette optimized for deuteranopia (red-green color blindness).",
        correct: "#0072B2",
        correctOnHover: "#074267",
        wrong: "#E69F00",
        wrongOnHover: "#BB7700",
    },
    Tritanopia: {
        description: "Color palette optimized for tritanopia (blue-yellow color blindness).",
        correct: "#42BE65",
        correctOnHover: "#086222",
        wrong: "#f82d37",
        wrongOnHover: "#92080f",
    },
    Achromatopsia: {
        description: "Grayscale color palette for achromatopsia (complete color blindness).",
        correct: "#9C9C9C",
        correctOnHover: "#797979",
        wrong: "#606060",
        wrongOnHover: "#454545",
    },
}