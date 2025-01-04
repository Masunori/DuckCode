import { useState } from "react";

let colorInputCreationCounter = 0;
let radioInputCreationCounter = 0;
let checkboxInputCreationCounter = 0;

/**
 * Returns a radio input component. This input is already encapsulated inside a label.
 * 
 * @param {object} param0 the parameters, including
 * - name (string): the name to add to the input
 * - value (any): the value of the input
 * - key (any, defalut=null): if Array.map() is used to produce this input, pass the key here
 * - onChange (function, default=()=>{return;}: specify the onChange behaviour for the input
 * - checked (boolean, default=false): specify if the input is checked when rendered
 * - content (string): the text accompanying the input the user will see.
 * - inputId (string, default = "radio-input-{counter}"): specify the identity of the input. We use an internal counter for default identity.
 * @returns a radio input
 */
export function RadioInput({
    name, value,
    onChange=() => {return;}, checked=false,
    content, inputId=`radio-input-${radioInputCreationCounter++}`
}) {
    return (
        <label htmlFor={inputId} className="radio-button-label">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                {content}
                <input
                    type='radio'
                    name={name}
                    value={value}
                    onChange={onChange}
                    checked={checked}
                    style={{ display: "none", maxWidth: "3em" }}
                    id={inputId}
                />
                <span className='radio-input-indicator' />
            </div>
        </label>
    )
}

/**
 * Returns a color input component. This input is already encapsulated inside a label.
 * 
 * @param {object} param0 the parameters, including
 * - name (string): the name to add to the input
 * - key (any, defalut=null): if Array.map() is used to produce this input, pass the key here
 * - onChange (function, default=()=>{return;}: specify the onChange behaviour for the input
 * - content (string): The text accompanying the colour input that the user will see.
 * - inputId (string, default = "radio-input-{counter}"): specify the identity of the input. We use an internal counter for default identity.
 * @returns a radio input
 */
export function ColorInput({
    name,
    onChange=(color) => {return;}, 
    content, inputId=`color-input-${colorInputCreationCounter++}`,
}) {
    const [color, setColor] = useState("#000000");

    function handleColorChange(event) {
        setColor(event.target.value);
        onChange(event);
    }

    return (
        <label htmlFor={inputId} className="color-input-label">
            <div className="color-input-wrapper">
                <p className="color-input-content">{content}</p>
                <input
                    className="color-input-input"
                    type="color"
                    id={inputId}
                    name={name}
                    onChange={handleColorChange}
                />
                <p className="color-input-color">{color}</p>
            </div>
        </label>
    )
}

/**
 * Returns a checkbox input component. This input is already encapsulated inside a label.
 * 
 * @param {object} param0 the parameters, including
 * - name (string): the name to add to the input
 * - value (any): the value of the input
 * - key (any, defalut=null): if Array.map() is used to produce this input, pass the key here
 * - onChange (function, default=()=>{return;}: specify the onChange behaviour for the input
 * - inputId (string, default = "radio-input-{counter}"): specify the identity of the input. We use an internal counter for default identity.
 * @returns a radio input
 */
export function CheckboxInput({
    name, value,
    onChange=(...args) => {return;}, 
    content, inputId=`checkbox-input-${checkboxInputCreationCounter++}`,
    inputClassname=null
}) {
    return (
        <label htmlFor={inputId} className="checkbox-input-label">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                {content}
                <input
                    type='checkbox'
                    name={name}
                    value={value}
                    onChange={onChange}
                    style={{ display: "none", maxWidth: "3em" }}
                    id={inputId}
                    className={inputClassname ?? ""}
                />
                <span className='checkbox-input-indicator' />
            </div>
        </label>
    )
}