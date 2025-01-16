import { useContext } from "react";
import { OVERALL_THEME_DESCRIPTOR } from "../color_schemes/themes";
import { ColorInput, DropdownInput } from "../Input";
import { SettingsContext } from "../../App";

export default function GeneralSettings() {
    const {settings, temp} = useContext(SettingsContext);

    function handleOverallStyleUpdate(event) {
        const token = event.target.name;
        const style = event.target.value;

        temp.current.overallTheme.updateTheme(token, style);
    }

    return (
        <div id="general-settings">
            <form id="general-settings-form">
                <h1 className="one-settings-option-block" style={{ pointerEvents: "none" }}>
                    Customise the general gameplay settings.
                </h1>
                <div id="overall-theme" className="one-settings-option-block">
                    <h2>Colours</h2>
                    {Object.entries(settings.overallTheme.theme).map(([key, value], idx) => {
                        if (value.type === 'color') {
                            return (
                                <ColorInput
                                    name={key}
                                    key={idx}
                                    value={value.value}
                                    onChange={handleOverallStyleUpdate}
                                    content={OVERALL_THEME_DESCRIPTOR[key]}
                                />
                            )
                        } else if (value.type === 'dropdown') {
                            return (
                                <DropdownInput
                                    optionsMap={value.available}
                                    key={idx}
                                    title='General Font'
                                    defaultValue='Honkai: Star Rail'
                                    onSelectDropDownItem = {val => temp.current.overallTheme.updateTheme('overallFont', val)}
                                />
                            )
                        } else {
                            return null;
                        }
                    })}
                </div>
            </form>
        </div>
    )
}
