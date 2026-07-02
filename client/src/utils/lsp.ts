import { MonacoPyrightProvider } from "monaco-pyright-lsp";

/**
 * This class patches the MonacoPyrightProvider by terminating the worker when the provider is disposed. 
 * 
 * This prevents the worker from continuing to run in the background after the provider is no longer needed, 
 * which can lead to resource leaks and unexpected behavior.
 */
export class PatchedPyrightProvider extends MonacoPyrightProvider {
    dispose() {
        this.lspClient.worker.terminate();
    }
}