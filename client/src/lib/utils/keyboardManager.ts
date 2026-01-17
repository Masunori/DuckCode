type KeyHandler = (event: KeyboardEvent) => boolean;

export type PriorityName = 
    "GENERAL_KEY_PRIORITY"
    | "GAMEPLAY_KEY_PRIORITY"
    | "GAMEPLAY_TAB_KEY_PRIORITY"
    | "CANVAS_KEY_PRIORITY"
    | "CHAT_KEY_PRIORITY"
    | "SETTINGS_KEY_PRIORITY"
    | "POPUP_KEY_PRIORITY"
    | "INPUT_KEY_PRIORITY"

export const PRIORITY_INFO: Record<PriorityName, { priority: number, stopPropagation: boolean }> = {
    GENERAL_KEY_PRIORITY: { priority: 1, stopPropagation: false, },
    GAMEPLAY_KEY_PRIORITY: { priority: 2, stopPropagation: false, },
    GAMEPLAY_TAB_KEY_PRIORITY: { priority: 3, stopPropagation: false, },
    CANVAS_KEY_PRIORITY: { priority: 4, stopPropagation: true, },
    CHAT_KEY_PRIORITY: { priority: 5, stopPropagation: true, },
    SETTINGS_KEY_PRIORITY: { priority: 6, stopPropagation: false, },
    POPUP_KEY_PRIORITY: { priority: 1000, stopPropagation: true, },
    INPUT_KEY_PRIORITY: { priority: 10, stopPropagation: false }, // Input layers
};

interface Layer {
    id: string;
    priority: PriorityName;
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

    register(id: string, priority: PriorityName, handler: KeyHandler): void {
        // Ensure no duplicate layer IDs
        if (this.layers.some(layer => layer.id === id)) {
            throw new Error(`Layer with ID ${id} is already registered.`);
        }
        
        this.layers.push({ id, priority, handler });
        this.layers.sort((a, b) => PRIORITY_INFO[b.priority].priority - PRIORITY_INFO[a.priority].priority);
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