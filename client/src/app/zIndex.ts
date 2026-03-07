/**
 * Central source of truth for all z-index layers in the app.
 *
 * Values are injected as CSS custom properties (--<key>-z-index) via an
 * inline <style> tag in the root layout, guaranteeing they are present in
 * the server-rendered HTML before any external CSS file is parsed — avoiding
 * the production bundling issue where CSS modules may be evaluated before
 * globals.css in the Webpack output.
 */
const zIndexValues: Record<string, number> = {
    // Public pages
    "landing": 1,
    "login-signup-overlay": 2,
    "login-signup": 3,

    // Home — game menu
    "stylized-game-menu-button": 2,
    "stylized-game-menu-button-description": 1,
    "game-menu-tab-overlay": 3,
    "game-menu-tab": 4,

    // Gameplay
    // (Monaco Editor minimap uses z-index 4, so the overlay must be higher)
    "gameplay-tab-overlay": 5,
    "gameplay-tab": 6,

    // Multiplayer — strategy board
    "strategy-board-overlay": 7,
    "strategy-board": 8,

    // Multiplayer — chatbox
    "chatbox-overlay": 9,
    "chatbox": 10,

    // Global UI
    "navbar": 15,
    "settings": 20,
    "popup-overlay": 30,
    "popup": 31,
};

/** Generates the `:root { ... }` block containing all z-index custom properties. */
export function getZIndexCss(): string {
    const declarations = Object.entries(zIndexValues)
        .map(([key, value]) => `--${key}-z-index:${value}`)
        .join(";");
    return `:root{${declarations}}`;
}
