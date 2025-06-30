"use client";

import { User } from "@/app/userPrefs/userPrefsUtils";
import styles from '../settings.module.css';
import { useState } from "react";
import Image from "next/image";
import editIcon from '../../../../../public/icons/edit.png';
import { useUserStore } from "../../contexts/UserContext";

type AccountSettingsProps = {
    nextUserInfo: TempAccountInfo;
    handleAccountChange: (key: keyof TempAccountInfo, value: string) => void;
}

type TempAccountInfo = Pick<User, 'name' | 'email' | 'bio' | 'isTwoFactorEnabled'>;

export default function AccountSettings({ nextUserInfo, handleAccountChange }: AccountSettingsProps) {
    const user = useUserStore(state => state.user);

    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [tempUsername, setTempUsername] = useState(nextUserInfo.name);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [tempBio, setTempBio] = useState(nextUserInfo.bio || "");
    const [isHoveringProfilePic, setIsHoveringProfilePic] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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

    const handlePasswordChange = () => {
        // No temporary password stored, immediately change for user object upon typing - to update
    }

    return (
        <div className={`${styles.settingsOptionDisplay} ${styles.accountSettingsDisplay}`}>
            {/* User Profile Section */}
            <div className={styles.settingsContentChunk}>
                <h2>User Profile</h2>
                <div className={styles.profileSection}>
                    <div
                        className={styles.profilePictureContainer}
                        onMouseEnter={() => setIsHoveringProfilePic(true)}
                        onMouseLeave={() => setIsHoveringProfilePic(false)}
                    >
                        <Image
                            src={user.profilePicture || "/default-profile.png"}
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
            </div>

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
                {isChangingPassword ? (
                    <div className={styles.passwordChangeForm}>
                        <div className={styles.formGroup}>
                            <label>Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div className={styles.formActions}>
                            <button
                                className={styles.saveButton}
                                onClick={handlePasswordChange}
                            >
                                Change Password
                            </button>
                            <button
                                className={styles.cancelButton}
                                onClick={() => setIsChangingPassword(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        className={styles.editButton}
                        onClick={() => setIsChangingPassword(true)}
                    >
                        Change Password
                    </button>
                )}

{/*}
                <div className={styles.securityOptions}>
                    <CheckboxInput
                        inputId="two-factor-auth"
                        inputName="Enable Two-Factor Authentication"
                        defaultChecked={user.isTwoFactorEnabled || false}
                        handleOptionChange={(checked) => {
                            setNextUserFA();
                        }}
                    />
                </div>
                                    */}
            </div>
        </div>
    );
}