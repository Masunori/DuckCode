type KeyHandler = (event: KeyboardEvent) => boolean;

export const GENERAL_KEY_PRIORITY = 1;
export const GAMEPLAY_KEY_PRIORITY = 2;
export const GAMEPLAY_TAB_KEY_PRIORITY = 3;
export const SETTINGS_KEY_PRIORITY = 4;
export const POPUP_KEY_PRIORITY = 1000;
export const INPUT_KEY_PRIORITY = 10;

interface Layer {
    id: string;
    priority: number;
    handler: KeyHandler;
}

/**
 * Manages keyboard events across different layers of the application.
 */
class KeyboardManager {
    private layers: Layer[];

    constructor() {
        this.layers = [];
    }

    register(id: string, priority: number, handler: KeyHandler): void {
        // Ensure no duplicate layer IDs
        if (this.layers.some(layer => layer.id === id)) {
            throw new Error(`Layer with ID ${id} is already registered.`);
        }
        
        this.layers.push({ id, priority, handler });
        this.layers.sort((a, b) => b.priority - a.priority);
    }

    unregister(id: string): void {
        this.layers = this.layers.filter(layer => layer.id !== id);
    }

    handleEvent(event: KeyboardEvent): void {
        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];
            if (layer.handler(event)) {
                return;
            }
        }
    }
}

export const keyboardManager = new KeyboardManager();