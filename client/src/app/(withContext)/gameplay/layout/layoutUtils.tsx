import { DefaultLayout } from './default/DefaultLayout';
import { FullscreenEditorLayout } from './fullscreenEditor/FullscreenEditorLayout';
import styles from './gameplay.layout.module.css';
import { InvertedLayout } from './inverted/InvertedLayout';
import { TwoTabsLayout } from './twoTabs/TwoTabsLayout';
import { TwoTabsInvertedLayout } from './twoTabsInverted/TwoTabsInvertedLayout';

export type LayoutInfo = {
    miniPreview: React.JSX.Element;
    implementation: React.JSX.Element,
}

export const LAYOUTS: Record<string, LayoutInfo> = {
    "Default": {
        miniPreview: 
            <div className={styles.defaultLayoutPreview}>
                <div className={styles.navbar}>Navigation Bar</div>
                <div className={styles.question}>Question</div>
                <div className={styles.editor}>Code Editor</div>
                <div className={styles.testCases}>Test Cases</div>
            </div>,
        implementation: <DefaultLayout />
    },
    "Inverted": {
        miniPreview: 
            <div className={styles.invertedLayoutPreview}>
                <div className={styles.navbar}>Navigation Bar</div>
                <div className={styles.question}>Question</div>
                <div className={styles.editor}>Code Editor</div>
                <div className={styles.testCases}>Test Cases</div>
            </div>,
        implementation: <InvertedLayout />
    },
    "Two Tabs": {
        miniPreview: 
            <div className={styles.twoTabsLayoutPreview}>
                <div className={styles.navbar}>Navigation Bar</div>
                <div className={styles.question}>Question + Test Cases (Toggle)</div>
                <div className={styles.editor}>Code Editor</div>
            </div>,
        implementation: <TwoTabsLayout />
    },
    "Two Tabs Inverted": {
        miniPreview: 
            <div className={styles.twoTabsInvertedLayoutPreview}>
                <div className={styles.navbar}>Navigation Bar</div>
                <div className={styles.question}>Question + Test Cases (Toggle)</div>
                <div className={styles.editor}>Code Editor</div>
            </div>,
        implementation: <TwoTabsInvertedLayout />
    },
    "Fullscreen Editor": {
        miniPreview: 
            <div className={styles.fullScreenEditorLayoutPreview}>
                <div className={styles.navbar}>
                    Navigation Bar + Toggle Question + Toggle Test Cases
                </div>
                <div className={styles.question}>Question (toggle)</div>
                <div className={styles.testCases}>Test Cases + Output (toggle)</div>
                <div className={styles.editor}>Code Editor</div>
            </div>,
        implementation: <FullscreenEditorLayout />
    },
}