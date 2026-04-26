"use client";

import editIcon from '@/../public/icons/edit.png';
import { User } from "@/app/userPrefs/userPrefsTypes";
import CurrentPasswordInput from '@/components/authInputs/CurrentPasswordInput';
import NewPasswordInput from '@/components/authInputs/NewPasswordInput';
import styles from '@/components/settings/settings.module.css';
import rankStyles from '@/components/styles/ranks.module.css';
import { usePopup } from "@/contexts/PopupContext";
import { useUserStore } from "@/contexts/UserContext";
import { updateProfile } from '@/lib/apiClient/user';
import { FieldState, PASSWORD_CONDITIONS } from "@/lib/utils/fieldConditions";
import { AnimatePresence, motion } from 'motion/react';
import { s } from 'motion/react-client';
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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

type UserProfileSectionProps = {
    user: TempAccountInfo;
    onSave: (bio: string) => void;
}

const UserProfileSection = ({ user, onSave }: UserProfileSectionProps) => {
    const [isEditingBio, setIsEditingBio] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    return (
        <div className={styles.profileSection}>
            <Image
                src={"/images/default_profile_pic.png"}
                alt="Profile"
                width={80}
                height={80}
                className={`${styles.profilePicture}`}
            />
            <ul className={styles.profileInfo}>
                <li>
                    <h4>Username</h4>
                    <p>{user.name}</p>
                </li>
                <li style={{ 
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: "1rem",
                    alignItems: "start"
                }}>
                    <div>
                        <h4>Bio</h4>
                        <p
                            className={`${styles.bioDisplay} ${isEditingBio ? styles.closed : styles.open}`}
                        >
                            {user.bio || "No bio yet"}
                        </p>
                        <textarea
                            ref={textareaRef}
                            className={`${styles.bioTextarea} ${isEditingBio ? styles.open : styles.closed}`}
                            defaultValue={user.bio || ""}
                            name='bio'
                        />
                    </div>
                    {
                        !isEditingBio && (
                            <button className={styles.editButton} onClick={() => setIsEditingBio(true)}>
                                Edit
                            </button>
                        )
                    }
                    {
                        isEditingBio && (
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <button 
                                    className={styles.saveButton} 
                                    onClick={() => {
                                        onSave(textareaRef.current?.value || "");
                                        setIsEditingBio(false);
                                    }}
                                >
                                    Save
                                </button>
                                <button 
                                    className={styles.cancelButton} 
                                    onClick={() => setIsEditingBio(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        )
                    }
                </li>
            </ul>
        </div>
    )
}

type TempAccountInfo = Pick<User, 'name' | 'email' | 'bio' | 'isTwoFactored'>;

export default function AccountSettings({ nextUserInfo, handleAccountChange }: AccountSettingsProps) {
    const user = useUserStore(state => state.user);

    const cumulativeExpForCurrentLevel = 100 * (Math.pow(1.1, user.level) - 1);
    const expForNextLevel = 10 * (Math.pow(1.1, user.level));
    const currentLevelExp = user.exp - cumulativeExpForCurrentLevel;
    const expProgressPercent = (currentLevelExp / expForNextLevel) * 100;

    const [isHoveringProfilePic, setIsHoveringProfilePic] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const { openPopupWith } = usePopup();

    const handleSaveBio = (newBio: string) => {
        const bioSavedSuccessfullyPopup = () => {
            openPopupWith(
                "Bio updated successfully!",
                "Great!",
                null,
                () => { },
                () => { }
            )
        };

        const bioUpdateFailedPopup = (message: string) => {
            openPopupWith(
                `Failed to update bio: ${message}`,
                "Okay",
                null,
                () => { },
                () => { }
            )
        };

        openPopupWith(
            "Save changes to bio?",
            "Save",
            "Cancel",
            async () => {
                const response = await updateProfile(
                    user.name,
                    newBio
                );

                if (response.status === 200) {
                    handleAccountChange("bio", newBio);
                    bioSavedSuccessfullyPopup();
                } else {
                    bioUpdateFailedPopup(response.data.message || "Unknown error");
                }
            },
            () => { }
        );
    };

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
                <UserProfileSection user={nextUserInfo} onSave={handleSaveBio} />
                {/* <div className={styles.profileSection}>
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

                    
                </div> */}
            </section>

            {/* Rest of the component remains the same */}
            {/* Account Information Section */}
            <div className={styles.settingsContentChunk}>
                <h2>Account Information</h2>
                <div className={styles.accountInfoContainer}>
                    {/* First row - Email and Account Created side by side */}
                    <div className={styles.topRow}>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Email</span>
                            <span className={styles.infoValue}>{nextUserInfo.email}</span>
                        </div>
                        {user.createdAt && (
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Account Created</span>
                                <span className={styles.infoValue}>
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Level</span>
                            <div className={styles.expBarWithLevel}>
                                <span>{user.level}</span>
                                <div 
                                    className={styles.expBarTotal}
                                >
                                    <div
                                        className={styles.expBarAcquired}
                                        style={{
                                            width: `${expProgressPercent}%`
                                        }}>
                                            
                                        <div className={styles.expBarRunner}></div>
                                    </div>
                                    <span style={{ cursor: "default" }}>{`${Math.round(currentLevelExp)} / ${Math.round(expForNextLevel)}`}</span>
                                </div>
                                <span>{user.level + 1}</span>
                            </div>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Cumulated EXP</span>
                            <span className={styles.infoValue}>{user.exp}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Rank</span>
                            <div className={`${styles.rank} ${rankStyles[user.rank.toLowerCase()]}`}>
                                {user.rank}
                            </div>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Rank Points</span>
                            <span className={styles.infoValue}>{user.rankPoint}</span>
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
                <h2>Logout</h2>
                <button
                    onClick={handleLogout}
                    className={styles.logoutButton}
                >Logout</button>
            </div>
        </div>
    );
}