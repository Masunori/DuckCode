import { useEffect, useRef, useState } from "react";

let colorInputCreationCounter = 0;
let radioInputCreationCounter = 0;
let checkboxInputCreationCounter = 0;
let dropdownInputCreationCounter = 0;

const incrementColor = () => (colorInputCreationCounter = (colorInputCreationCounter + 1) % 10000);
const incrementRadio = () => (radioInputCreationCounter = (radioInputCreationCounter + 1) % 10000);
const incrementCheckbox = () => (checkboxInputCreationCounter = (checkboxInputCreationCounter + 1) % 10000);
const incrementDropdown = () => (dropdownInputCreationCounter = (dropdownInputCreationCounter + 1) % 10000);

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
    onChange=(event) => {return;}, checked=false,
    content, inputId=`radio-input-${radioInputCreationCounter}`
}) {
    // const [isChecked, setIsChecked] = useState(checked);

    // function handleRadioChange(event) {
    //     onChange(event);
    // }

    incrementRadio();

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
 * - value (str, default = '#000000'): The default colour of the input.
 * @returns a radio input
 */
export function ColorInput({
    name,
    onChange=(event) => {return;}, 
    content, inputId=`color-input-${colorInputCreationCounter}`,
    value='#000000',
}) {
    const [color, setColor] = useState(value);

    function handleColorChange(event) {
        setColor(event.target.value);
        onChange(event);
    }

    useEffect(() => {
        setColor(value);
    }, [value]);

    incrementColor();

    return (
        <label htmlFor={inputId} className="color-input-label">
            <div className="color-input-wrapper">
                <p className="color-input-content">{content}</p>
                <input
                    className="color-input-input"
                    type="color"
                    id={inputId}
                    name={name}
                    value={color}
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
 * @param {Object} param0 the parameters, including
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
    content, inputId=`checkbox-input-${checkboxInputCreationCounter}`,
    inputClassname=null
}) {
    incrementCheckbox();

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

/**
 * Returns a dropdown input component.
 * 
 * @param {Object} param0 the parameters, including
 * - optionsMap (Object): The object literal to be converted into the options for dropdown.
 * - getKey (function, default = ([key, value]) => key): This is applied on the optionsMap to extract the key.
 * The key is the name that the user will see for each option. If not implemented, we assume that the key of the key-value pair is also the key.
 * - getValue (function, default = ([key, value]) => value): This is applied on the optionsMap to extract the value.
 * The value is the data that will be passed around when an option is selected. If not specified, we assume that the value of the key-value pair is also the value.
 * - getAuxiliaryInfo (function, default = ([key, value]) => null): This is applied on the optionsMap to extract any auxiliary information.
 * This extra information will be displayed alongside the key in each option. By default, there is no auxiliary information.
 * - title (string, default = 'Dropdown Input): the name for the dropdown. 
 * - id (string, default = `dropdown-input-${internal_counter}`): The ID of the input (the box that will display the user option).
 * - defaultValue (string, default = null): The default value displayed in the input.
 * - onSelectDropDownItem (function, default = val => null): The action that will be fired when the user selects an option.
 * This function accepts ONE parameter, which is the value as described in the optionsMap.
 * This is also the only place where the programmer can interact with this value.
 * @returns the dropdown input
 * 
 * Note: When you override getKey, getValue, or getAuxiliaryInfo, please leave the parameter as [key, value] for readability.
 */
export function DropdownInput({
    optionsMap,
    getKey=([key, value]) => key,
    getValue=([key, value]) => value,
    getAuxiliaryInfo=([key, value]) => "",
    title='Dropdown Input',
    id=`dropdown-input-${dropdownInputCreationCounter}`,
    defaultValue="",
    onSelectDropDownItem=(val) => null
}) {
    const [dropDownHeight, setDropDownHeight] = useState('0');
    const dropDownOptionsContainerId = `dropdown-options-container-${dropdownInputCreationCounter}`;
    const dropDownOptionClassname = `dropdown-option-${dropdownInputCreationCounter}`;

    const [value, setValue] = useState(defaultValue || '');
    const optionsContainerRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        // setValue(defaultValue);

        function openDropDown(event) {
            setDropDownHeight('200px');
            event.stopPropagation();
        }

        function closeDropDown(event) {
            setDropDownHeight('0');
        }

        function dispatchInputEvent(event) {
            setValue(event.currentTarget.dataset.key);
            onSelectDropDownItem(event.currentTarget.dataset.value);

            const inputEvent = new Event('input', { bubbles: true });
            inputRef.current.dispatchEvent(inputEvent);
        }

        // When a dropdown option is selected, trigger a change in the input field
        const dropDownOptions = optionsContainerRef.current.querySelectorAll(`.${dropDownOptionClassname}`);
        dropDownOptions.forEach(option => option.addEventListener('click', dispatchInputEvent));

        const dropDownOptionsContainer = document.getElementById(id);
        window.addEventListener('click', closeDropDown);
        dropDownOptionsContainer.addEventListener('click', openDropDown);

        return (() => {
            window.removeEventListener('click', closeDropDown);
            dropDownOptionsContainer.removeEventListener('click', openDropDown);
            dropDownOptions.forEach(option => option.removeEventListener('click', dispatchInputEvent));
        });
    }, [dropDownOptionClassname, id, onSelectDropDownItem, defaultValue, optionsMap]);

    incrementDropdown();

    return (
        <div className="dropdown-container">
            <p>{title}</p>
            <label htmlFor={id} style={{ position: 'relative' }}>
                <input ref={inputRef} id={id} className="dropdown-input" type="text" value={value} readOnly />
                <div ref={optionsContainerRef} id={dropDownOptionsContainerId} style={{ height: dropDownHeight }}>
                    {Object.entries(optionsMap).map(([key, value]) => (
                        <div key={key} className={dropDownOptionClassname} data-key={getKey([key, value])} data-value={getValue([key, value])}>
                            <span>{getKey([key, value])}</span>
                            <span style={{ opacity: 0.25 }}>{getAuxiliaryInfo([key, value])}</span>
                        </div>
                    ))}
                </div>
            </label>
        </div>
    )
}