import { useContext } from "react"
import { UserContext } from "../../App"

export default function AccountSettings() {
    const user = useContext(UserContext);

    return (
        <div id="account-settings">
            <form id="account-settings-form">
                <div className="one-settings-option-block" id="account-settings-profile">
                    <img src={user.profile.avatar} alt="avatar" />
                    <label id="account-settings-username-label" htmlFor="account-settings-username">
                        <p>Username:</p>
                        <input id="account-settings-username" value={user.username} type="text" readOnly autoComplete="false" />
                    </label>
                    <label id="account-settings-userid-label" htmlFor="account-settings-username">
                        <p>User ID:</p>
                        <input id="account-settings-userid" value={user.userId} type="text" readOnly autoComplete="false" />
                    </label>
                </div>
                <div className="one-settings-option-block" id="account-settings-binding-method">
                <label id="account-settings-email-label" htmlFor="account-settings-username">
                        <p>Email:</p>
                        <input id="account-settings-email" value={user.email} type="text" readOnly autoComplete="false" />
                    </label>
                </div>
            </form>
        </div>
    )
}