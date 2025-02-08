/**
 * Open the confirmation pop-up with the specified message.
 * 
 * @param {string} message - The confirmation pop-up message. Default: "Do you want to proceed?"
 * @param {string} cancelMessage - The content on the cancel button. Default: "Cancel"
 * @param {string} proceedMessage - The content on the proceed button. Default: "Proceed"
 * @param {Function} onCancel - The action executed when the cancel button is clicked. Default: ()=>null
 * @param {Function} onProceed - The action executed when the proceed button is clicked. Default: ()=>null
 */
export function openConfirmWithMessage(
    message="Do you want to proceed?",
    cancelMessage="Cancel",
    proceedMessage="Proceed",
    onCancel=()=>null,
    onProceed=()=>null
) {
    const confirmPopup = document.getElementById('confirm');
    confirmPopup.style.transform = 'translateY(0)';

    const overlay = document.getElementById('confirmation-popup-overlay');
    overlay.style.visibility = 'visible';

    document.getElementById('confirmation-message').innerText = message;
    document.getElementById('confirm-tab-cancel-button').innerText = cancelMessage;
    document.getElementById('confirm-tab-proceed-button').innerText = proceedMessage;

    document.getElementById('confirm-tab-cancel-button').onclick = onCancel;
    document.getElementById('confirm-tab-proceed-button').onclick = onProceed;
}

/**
 * Returns a confirmation pop-up. 
 * @param {object} param0 - The list of values to pass in the confirmation pop-up
 * - message (str): The confirmation pop-up message.
 * - cancelMessage (str): The content on the cancel button.
 * - proceedMessage (str): The content on the proceed button.
 * - onCancel (function): The action executed when the cancel button is clicked.
 * - onProceed (function): The action executed when the proceed button is clicked.
 * @returns the confirmation component as a pop-up.
 */
export default function Confirm({ 
    message="Do you want to proceed?",
    cancelMessage="Cancel",
    proceedMessage="Proceed",
    onCancel=()=>null,
    onProceed=()=>null
}) {
    function handleCancelWrapper() {
        onCancel();

        const confirmPopup = document.getElementById('confirm');
        confirmPopup.style.transform = 'translateY(-20vh)';

        const overlay = document.getElementById('confirmation-popup-overlay');
        overlay.style.visibility = 'hidden';
    }

    function handleProceedWrapper() {
        onProceed();

        const confirmPopup = document.getElementById('confirm');
        confirmPopup.style.transform = 'translateY(-20vh)';

        const overlay = document.getElementById('confirmation-popup-overlay');
        overlay.style.visibility = 'hidden';
    }

    return (
        <div id="confirmation-popup-overlay">
            <div id="confirm">
                <h3 id="confirmation-message">{message}</h3>
                <button id="confirm-tab-cancel-button" onClick={handleCancelWrapper}>{cancelMessage}</button>
                <button id="confirm-tab-proceed-button" onClick={handleProceedWrapper}>{proceedMessage}</button>
            </div>
        </div>
    )
}