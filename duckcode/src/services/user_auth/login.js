import { delay } from "../fakeApiUtils";
import { jwtDecode } from "jwt-decode";

// dummy username: newuser 
// dummy password: securepassword

/**
 * Sends a POST request to the server to fetch the user data when the user logs in.
 * 
 * @param {string} username The username
 * @param {string} password The password
 * @returns The JSON representing the user's information.
 */
export async function login(username, password) {
    const GAMEPLAY_API_HTTP = process.env.REACT_APP_GAMEPLAY_API_HTTP;

    const response = await fetch(`${GAMEPLAY_API_HTTP}/auth/logIn`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password,
        })
    })
        .then(async res => {
            const data = await res.json();
            console.log("Response: ", res.status, data);
            return data;
        })
        .then(data => jwtDecode(data.token))
        .catch(err => console.error("Fetch error: ", err));

    return response;
}

export async function loginFake(username, password) {
    const user = {
        userId: '12345678',
        username: 'duck_administrator_420',
        email: 'iloveduckcode@duckcode.org',
        rankPoints: 1000,
        profile: {
            // avatar: 'https://i.pinimg.com/736x/55/1e/9a/551e9ad6616917d8335fe46db64688b9.jpg',
            level: 38,
            exp: 1200,
        },
        settings: {
            theme: {
                base: "vs-dark",
                inherit: "false",
                rules: [
                    { token: 'comment', foreground: '', background: '', fontStyle: '' },
                    { token: 'string', foreground: '', background: '', fontStyle: '' },
                    { token: 'keyword', foreground: '', background: '', fontStyle: '' },
                    { token: 'invalid', foreground: '', background: '', fontStyle: '' },
                    { token: 'number', foreground: '', background: '', fontStyle: '' },
                    { token: 'number.hex', foreground: '', background: '', fontStyle: '' },
                    { token: 'regexp', foreground: '', background: '', fontStyle: '' },
                    { token: 'annotation', foreground: '', background: '', fontStyle: '' },
                    { token: 'type', foreground: '', background: '', fontStyle: '' },
                    { token: 'typeParameter', foreground: '', background: '', fontStyle: '' },
                    { token: 'function', foreground: '', background: '', fontStyle: '' },
                    { token: 'method', foreground: '', background: '', fontStyle: '' },
                    { token: 'macro', foreground: '', background: '', fontStyle: '' },
                    { token: 'interface', foreground: '', background: '', fontStyle: '' },
                    { token: 'property', foreground: '', background: '', fontStyle: '' },
                    { token: 'decorator', foreground: '', background: '', fontStyle: '' },
                ],
                color: {
                    'editor.background': '',
                    'editor.foreground': '',
                    'editorLineNumber.foreground': '',
    
                    'editor.selectionBackground': '',
                    'editor.selectionHighlightBackground': '',
                    'editor.foldBackground': '',
    
                    'editor.wordHighlightBackground': '',
                    'editor.wordHighlightStrongBackground': '',
    
                    'editor.findMatchBackground': '',
                    'editor.findMatchHighlightBackground': '',
                    'editor.findRangeHighlightBackground': '',
    
                    'editor.hoverHighlightBackground': '',
    
                    'editor.lineHighlightBorder': '',
                    'editorLink.activeForeground': '',
                    'editor.rangeHighlightBackground': '',
                    'editor.snippetTabstopHighlightBackground': '',
                    'editor.snippetTabstopHighlightBorder': '',
                    'editor.snippetFinalTabstopHighlightBackground': '',
                    'editor.snippetFinalTabstopHighlightBorder': '',
                    'editorWhitespace.foreground': '',
                    'editorIndentGuide.background': '',
                    'editorIndentGuide.activeBackground': '',
                    'editorRuler.foreground': '',
    
                    'editorCodeLens.foreground': '',
    
                    'editorBracketHighlight.foreground1': '',
                    'editorBracketHighlight.foreground2': '',
                    'editorBracketHighlight.foreground3': '',
                    'editorBracketHighlight.foreground4': '',
                    'editorBracketHighlight.foreground5': '',
                    'editorBracketHighlight.foreground6': '',
                    'editorBracketHighlight.unexpectedBracket.foreground': '',
    
                    'editorOverviewRuler.border': '',
                    'editorOverviewRuler.selectionHighlightForeground': '',
                    'editorOverviewRuler.wordHighlightForeground': '',
                    'editorOverviewRuler.wordHighlightStrongForeground': '',
                    'editorOverviewRuler.modifiedForeground': '',
                    'editorOverviewRuler.addedForeground':    '',
                    'editorOverviewRuler.deletedForeground':  '',
                    'editorOverviewRuler.errorForeground':    '',
                    'editorOverviewRuler.warningForeground':  '',
                    'editorOverviewRuler.infoForeground':     '',
    
                    'editorError.foreground': '',
                    'editorWarning.foreground': '',
    
                    'editorGutter.modifiedBackground': '',
                    'editorGutter.addedBackground':    '',
                    'editorGutter.deletedBackground':  '',
    
                    'sideBar.background': '',
                    'sideBarTitle.foreground': '',
                    'sideBarSectionHeader.background': '',
                    'sideBarSectionHeader.border': '',
    
                    'minimap.background': '',
                    'minimap.foregroundOpacity': '',
                    'scrollbarSlider.background': ''
                }
            },
            progLang: 'javascript',
            codeEditorFont: 'monospace',
            overallTheme: {
                background: {
                    type: 'color',
                    value: '#121212',
                },
                firstLayerBackground: {
                    type: 'color',
                    value: '#242424',
                },
                secondLayerBackground: {
                    type: 'color',
                    value: '#484848',
                },
                thirdLayerBackground: {
                    type: 'color',
                    value: '#525252',
                },
                fourthLayerBackground: {
                    type: 'color',
                    value: '#606060',
                },
                significantChoiceButton: {
                    type: 'color',
                    value: '#0077ff',
                },
                significantChoiceButtonSelected: {
                    type: 'color',
                    value: '#0560bc',
                },
                insignificantChoiceButton: {
                    type: 'color',
                    value: '#363636',
                },
                insignificantChoiceButtonSelected: {
                    type: 'color',
                    value: '#484848',
                },
                settingsBackground: {
                    type: 'color',
                    value: '#484848',
                },
                settingsOptionBackground: {
                    type: 'color',
                    value: '#363636',
                },
                settingsOptionBorder: {
                    type: 'color',
                    value: '#848484',
                },
                overallFont: {
                    type: 'dropdown',
                    value: "'PF Din Text Pro', 'sans-serif'",
                }, 
            }  
        }
    };
        
    return delay(1000, user);
}