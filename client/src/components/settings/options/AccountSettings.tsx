"use client";

import editIcon from '@/../public/icons/edit.png';
import { User } from "@/app/userPrefs/userPrefsTypes";
import CurrentPasswordInput from '@/components/authInputs/CurrentPasswordInput';
import NewPasswordInput from '@/components/authInputs/NewPasswordInput';
import styles from '@/components/settings/settings.module.css';
import { usePopup } from "@/contexts/PopupContext";
import { useUserStore } from "@/contexts/UserContext";
import { FieldState, PASSWORD_CONDITIONS } from "@/lib/utils/fieldConditions";
import { AnimatePresence, motion } from 'motion/react';
import Image from "next/image";
import { useState } from "react";

type AccountSettingsProps = {
    nextUserInfo: TempAccountInfo;
    handleAccountChange: (key: keyof TempAccountInfo, value: string) => void;
}

type PasswordChangeFormProps = {
    onSave: (currentPassword: string, newPassword: string, confirmPassword: string) => void;
    onCancel: () => void;
}

const PasswordChangeForm = ({
    onSave,
    onCancel
}: PasswordChangeFormProps) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [newPasswordFieldState, setNewPasswordFieldState] = useState(FieldState.EMPTY);
    const [confirmPasswordFieldState, setConfirmPasswordFieldState] = useState(FieldState.EMPTY);

    return <div className={styles.passwordChangeForm}>
        <CurrentPasswordInput 
            onChangeCurrentPassword={setCurrentPassword}
            name="Current Password"
        />
        <NewPasswordInput 
            onChangeNewPassword={setNewPassword}
            onChangeConfirmPassword={setConfirmPassword}
            onValidateNewPassword={setNewPasswordFieldState}
            onValidateConfirmPassword={setConfirmPasswordFieldState}
        />
        <div className={styles.formActions}>
            <button
                disabled={
                    currentPassword === "" 
                    || newPasswordFieldState !== FieldState.VALID 
                    || confirmPasswordFieldState !== FieldState.VALID
                }
                className={styles.saveButton}
                onClick={() => onSave(currentPassword, newPassword, confirmPassword)}
            >
                Change Password
            </button>
            <button
                className={styles.cancelButton}
                onClick={onCancel}
            >
                Cancel
            </button>
        </div>
    </div>;
}

type TempAccountInfo = Pick<User, 'name' | 'email' | 'bio' | 'isTwoFactored'>;

export default function AccountSettings({ nextUserInfo, handleAccountChange }: AccountSettingsProps) {
    const user = useUserStore(state => state.user);

    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [tempUsername, setTempUsername] = useState(nextUserInfo.name);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [tempBio, setTempBio] = useState(nextUserInfo.bio || "");
    const [isHoveringProfilePic, setIsHoveringProfilePic] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const handleSaveUsername = () => {
        handleAccountChange("name", tempUsername);
        setIsEditingUsername(false);
    };

    const handleCancelUsername = () => {
        setTempUsername(tempUsername);
        setIsEditingUsername(false);
    };

    const handleSaveBio = () => {
        handleAccountChange("bio", tempBio);
        setIsEditingBio(false);
    };

    const handleCancelBio = () => {
        setTempBio(tempBio || "");
        setIsEditingBio(false);
    };

    const { openPopupWith } = usePopup();

    const handleLogout = async () => {
        openPopupWith(
            "Are you sure you want to logout?",
            "Logout",
            "Cancel",
            async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = "/portal";
            },
            () => { }
        );
    }

    return (
        <div className={`${styles.settingsOptionDisplay} ${styles.accountSettingsDisplay}`}>
            {/* User Profile Section */}
            <section className={styles.settingsContentChunk}>
                <h2>User Profile</h2>
                <div className={styles.profileSection}>
                    <div
                        className={styles.profilePictureContainer}
                        onMouseEnter={() => setIsHoveringProfilePic(true)}
                        onMouseLeave={() => setIsHoveringProfilePic(false)}
                    >
                        <Image
                            src={"/images/default_profile_pic.png"}
                            alt="Profile"
                            width={80}
                            height={80}
                            className={`${styles.profilePicture} ${isHoveringProfilePic ? styles.profilePictureHover : ''}`}
                        />
                        {isHoveringProfilePic && (
                            <div className={styles.profilePictureOverlay}>
                                <Image
                                    src={editIcon}
                                    alt="Edit"
                                    width={16}
                                    height={16}
                                    className={styles.editIcon}
                                />
                            </div>
                        )}
                    </div>

                    <div className={styles.profileInfo}>
                        <div className={styles.usernameContainer}>
                            {isEditingUsername ? (
                                <>
                                    <input
                                        type="text"
                                        value={tempUsername}
                                        onChange={(e) => setTempUsername(e.target.value)}
                                        className={styles.profileInput}
                                        autoFocus
                                    />
                                    <div className={styles.editActions}>
                                        <button
                                            className={styles.saveSmallButton}
                                            onClick={handleSaveUsername}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className={styles.cancelSmallButton}
                                            onClick={handleCancelUsername}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span className={styles.usernameText}>{nextUserInfo.name}</span>
                                    <button
                                        className={styles.editSmallButton}
                                        onClick={() => setIsEditingUsername(true)}
                                    >
                                        <Image
                                            src={editIcon}
                                            alt="Edit"
                                            width={16}
                                            height={16}
                                            className={styles.editIcon}
                                        />
                                    </button>
                                </>
                            )}
                        </div>

                        <div className={styles.bioContainer}>
                            {isEditingBio ? (
                                <>
                                    <textarea
                                        value={tempBio}
                                        onChange={(e) => setTempBio(e.target.value)}
                                        placeholder="Add a bio..."
                                        className={styles.bioInput}
                                        rows={3}
                                        autoFocus
                                    />
                                    <div className={styles.editActions}>
                                        <button
                                            className={styles.saveSmallButton}
                                            onClick={handleSaveBio}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className={styles.cancelSmallButton}
                                            onClick={handleCancelBio}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className={styles.bioText}>{nextUserInfo.bio || "No bio yet"}</p>
                                    <button
                                        className={styles.editSmallButton}
                                        onClick={() => setIsEditingBio(true)}
                                    >
                                        <Image
                                            src={editIcon}
                                            alt="Edit"
                                            width={16}
                                            height={16}
                                            className={styles.editIcon}
                                        />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Rest of the component remains the same */}
            {/* Account Information Section */}
            <div className={styles.settingsContentChunk}>
                <h2>Account Information</h2>
                <div className={styles.accountInfoContainer}>
                    {/* First row - Email and Account Created side by side */}
                    <div className={styles.topRow}>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Email:</span>
                            <span className={styles.infoValue}>{nextUserInfo.email}</span>
                        </div>
                        {user.createdAt && (
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Account Created:</span>
                                <span className={styles.infoValue}>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Second row - Level, Rank, and Experience */}
                    <div className={styles.bottomRow}>
                        <div className={styles.levelRankContainer}>
                            <div className={styles.levelContainer}>
                                <span className={styles.levelLabel}>Level</span>
                                <span className={styles.levelValue}>{user.level}</span>
                            </div>
                            <div className={`${styles.rank} ${styles[user.rank.toLowerCase()]}`}>
                                {user.rank}
                            </div>
                        </div>
                        <div className={styles.expContainer}>
                            <div className={styles.expBarWithLevel}>
                                <span className={styles.levelMin}>{user.level}</span>
                                <div className={styles.expBarTotal}>
                                    <div
                                        className={styles.expBarAcquired}
                                        style={{ width: `${user.exp}%` }}
                                    >
                                        <div className={styles.expBarRunner}></div>
                                    </div>
                                </div>
                                <span className={styles.levelMax}>{user.level + 1}</span>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Password & Security Section */}
            <div className={styles.settingsContentChunk}>
                <h2>Password & Security</h2>
                <AnimatePresence initial={false}>
                    {isChangingPassword ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                            animate={{ opacity: 1, height: "auto", overflow: "hidden" }}
                            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                            <PasswordChangeForm
                                onSave={(currentPassword, newPassword, confirmPassword) => {
                                    // Validation can be added here before calling handleAccountChange
                                    if (newPassword !== confirmPassword) {
                                        alert("New password and confirm password do not match.");
                                        return;
                                    }
                                }}
                                onCancel={() => setIsChangingPassword(false)}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="button"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            <button
                                className={styles.editButton}
                                onClick={() => setIsChangingPassword(true)}
                            >
                                Change Password
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
                {/*}
                <div className={styles.securityOptions}>
                    <CheckboxInput
                        inputId="two-factor-auth"
                        inputName="Enable Two-Factor Authentication"
                        defaultChecked={user.isTwoFactored || false}
                        handleOptionChange={(checked) => {
                            setNextUserFA();
                        }}
                    />
                </div>
                                    */}
            </div>
            <div className={styles.settingsContentChunk}>
                <button
                    onClick={handleLogout}
                    className={styles.logoutButton}
                >Logout</button>
            </div>
        </div>
    );
}