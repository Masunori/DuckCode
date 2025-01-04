import { useEffect, useRef, useState } from "react"
import { LIST_OF_KEY_BINDINGS } from "../constants"

// function KeyBindingRegister({ display, setDisplay, target, bindingRef }) {
//     useEffect(() => {
//         function cancelRegister(event) {
//             setDisplay('none');
//         }

//         function registerNewKey(event) {
//             if (event.key === 'Escape') {
//                 cancelRegister(event);
//             }

//             if (display === 'block') {
//                 if (event.ctrlKey) {
//                     event.preventDefault();
//                     bindingRef.current[target] = `'CTRL' + '${event.key.toUpperCase()}'`;
//                 } else {
//                     bindingRef.current[target] = `'${event.key.toUpperCase()}'`
//                 }
//             }
//             setDisplay("none");
//         }

//         window.addEventListener('click', cancelRegister);
//         window.addEventListener('keypress', registerNewKey, );

//         return () => {
//             window.removeEventListener('click', cancelRegister);
//             window.removeEventListener('keypress', registerNewKey, true);
//         }    
//     }, [display, setDisplay, target, bindingRef]);

//     function handleInnerClick(event) {
//         event.stopPropagation();
//     }

//     return (
//         <div id="key-binding-overlay" style={{ display: display }}>
//             <div id="key-binding-register" onClick={handleInnerClick}>
//                 <h1>Please key in your preferred key binding.</h1>
//                 <h1>Left click to cancel.</h1>
//             </div>
//         </div>
//     )
// }

export default function KeyboardShortcutSettings() {
    const bindingRef = useRef(LIST_OF_KEY_BINDINGS);
    // const [display, setDisplay] = useState("none");
    // const [target, setTarget] = useState(null);

    return (
        <div id="keyboard-config-settings">
            {/* <KeyBindingRegister 
                display={display} 
                setDisplay={setDisplay}
                target={target}
                bindingRef={bindingRef}
            /> */}
            <form id="keyboard-config-settings-form">
                <h2>Gameplay</h2>
                {Object.entries(LIST_OF_KEY_BINDINGS).map(([key, value], idx) => (
                    <div key={idx} 
                        className="keyboard-config-options" 
                        // onClick={(event) => {
                        //     event.stopPropagation();
                        //     setTarget(key);
                        //     setDisplay("block");
                        // }}
                    >
                        <p>{key}</p>
                        <input
                            className="key-binding-input" 
                            name="key-binding" 
                            value={bindingRef.current[key]} 
                            readOnly 
                        />
                    </div>
                ))}
            </form>
        </div>
    )
}