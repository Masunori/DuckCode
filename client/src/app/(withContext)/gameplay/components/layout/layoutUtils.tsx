export type LayoutInfo = {
    miniPreview: React.JSX.Element;
    implementation: React.JSX.Element;
}

export const LAYOUTS: Record<string, LayoutInfo> = {
    "Default": {
        miniPreview: <div></div>,
        implementation: <div></div>
    },
    "Invert": {
        miniPreview: <div></div>,
        implementation: <div></div>
    },
}