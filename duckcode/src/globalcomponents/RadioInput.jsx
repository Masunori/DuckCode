/**
 * Returns a stylised Radio Input
 * 
 * @param {*} attributes - All attributes associated with the radio input
 * - key (string, default: null) - If you use map() to generate a list of RadioInput, specify the key here.
 * - name (string) - The name for the input.
 * - value (string) - The value of the input
 * - onChange (function, default: null) - The behaviour when the input is selected
 * - defaultChecked (boolean, default: false) - Check the radio button if set to true.
 * - content (string) - The text the user sees alongside the input
 * - inputId (string, default: null) - If you want special styling or behaviour for the input, pass the input id.  
 * @returns a Radio Input JSX element
 */
export default function RadioInput({ 
    key=null, name, value, 
    onChange=null, defaultChecked=false, 
    content, inputId=null }) {
    return (
        <label className="radio-button-label" key={key === null ? "" : key}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <input
                    type="radio"
                    name={name}
                    value={value}
                    onChange={onChange}
                    defaultChecked={defaultChecked}
                    style={{ display: "none" }}
                    id={inputId === null ? "" : inputId}
                />{content}
                <span className="radio-input-indicator" />
            </div>
        </label>
    )
}