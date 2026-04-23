import { printd } from "./debugUtils";

type KeyHandler = (event: KeyboardEvent) => boolean;

export type PriorityName = 
    "GENERAL_KEY_PRIORITY"
    | "GAMEPLAY_KEY_PRIORITY"
    | "GAMEPLAY_TAB_KEY_PRIORITY"
    | "CANVAS_KEY_PRIORITY"
    | "CHAT_KEY_PRIORITY"
    | "SETTINGS_KEY_PRIORITY"
    | "POPUP_KEY_PRIORITY"
    | "SETTINGS_INPUT_KEY_PRIORITY"

type PriorityInfo = {
    /** The priority level for this layer. */
    priority: number;
    /** If this is set to true, even if the keyboard shortcut does not match, the event will still be blocked and not reach lower layers. */
    blocksFlow: boolean;
}

export const PRIORITY_INFO: Record<PriorityName, PriorityInfo> = {
    GENERAL_KEY_PRIORITY: { priority: 1, blocksFlow: false, },
    GAMEPLAY_KEY_PRIORITY: { priority: 2, blocksFlow: false, },
    GAMEPLAY_TAB_KEY_PRIORITY: { priority: 3, blocksFlow: false, },
    CANVAS_KEY_PRIORITY: { priority: 4, blocksFlow: true, },
    CHAT_KEY_PRIORITY: { priority: 5, blocksFlow: true, },
    SETTINGS_KEY_PRIORITY: { priority: 6, blocksFlow: true, },
    SETTINGS_INPUT_KEY_PRIORITY: { priority: 10, blocksFlow: false },
    POPUP_KEY_PRIORITY: { priority: 1000, blocksFlow: true, },
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

    /**
     * Registers a new keyboard event handler layer.
     * @param id The unique ID for this layer, used for unregistering later.
     * @param priority The priority name for this layer, which determines the order of event handling and whether it blocks lower layers.
     * @param handler The function that will handle keyboard events for this layer. It should return true if the event was handled and should not propagate further, or false if the event was not handled and should continue to the next layer.
     */
    register(id: string, priority: PriorityName, handler: KeyHandler): void {
        // Ensure no duplicate layer IDs
        if (this.layers.some(layer => layer.id === id)) {
            throw new Error(`Layer with ID ${id} is already registered.`);
        }
        
        printd('@/src/lib/utils/keyboardManager.ts', `Registering layer ${id} with priority ${priority}`);
        printd('@/src/lib/utils/keyboardManager.ts', `Priority information: `, PRIORITY_INFO[priority]);
        printd('@/src/lib/utils/keyboardManager.ts', `Handler function: `, handler.toString());

        this.layers.push({ id, priority, handler });
        this.layers.sort((a, b) => PRIORITY_INFO[b.priority].priority - PRIORITY_INFO[a.priority].priority);

        const layerInfoStrings = this.layers.map(layer => `- ${layer.id} (${PRIORITY_INFO[layer.priority].priority})`).join("\n");
        printd('@/src/lib/utils/keyboardManager.ts', `Current layer order:\n${layerInfoStrings}`);
    }

    /**
     * Unregisters a keyboard event handler layer.
     * @param id The unique ID for the layer to unregister.
     */
    unregister(id: string): void {
        printd('@/src/lib/utils/keyboardManager.ts', `Unregistering layer ${id}`);
        this.layers = this.layers.filter(layer => layer.id !== id);
    }

    handleEvent(event: KeyboardEvent): void {
        for (let i = 0; i < this.layers.length; i++) {
            const layer = this.layers[i];

            if (layer.handler(event)) {
                return;
            } else if (PRIORITY_INFO[layer.priority].blocksFlow) {
                return;
            }
        }
    }
}

export const keyboardManager = new KeyboardManager();