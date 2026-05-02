"use client";

import { User } from "@/app/userPrefs/userPrefsTypes";
import { useSettings } from "@/contexts/SettingsContext";
import Image from "next/image";
import styles from "../page.module.css";
import rankStyles from "@/components/styles/ranks.module.css";
import { useUserPreferenceStore } from "@/contexts/UserPreferenceContext";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type UserInfoProps = {
    user: User;
    imageDimension: number;
}

function UserInfo({ user, imageDimension }: UserInfoProps) {
    const cumulativeExpForCurrentLevel = 100 * (Math.pow(1.1, user.level) - 1);
    const expForNextLevel = 10 * (Math.pow(1.1, user.level));
    const currentLevelExp = user.exp - cumulativeExpForCurrentLevel;
    const expProgressPercent = (currentLevelExp / expForNextLevel) * 100;

    const [showCumulatedExp, setShowCumulatedExp] = useState(false);

    return <div className={styles.userInfo}>
        <div className={styles.profilePicContainer}>
            <Image 
                src={"/images/default_profile_pic.png"} 
                alt="user-profile-pic" 
                width={imageDimension} 
                height={imageDimension} 
            />
        </div>
        <div className={styles.usernameLevelExp}>
            <p>{user.name}</p>
            <div className={styles.expBarWithLevel}>
                <span>{user.level}</span>
                <div 
                    className={styles.expBarTotal}
                    onMouseEnter={() => setShowCumulatedExp(true)}
                    onMouseLeave={() => setShowCumulatedExp(false)}
                >
                    <div
                        className={styles.expBarAcquired}
                        style={{
                            width: `${expProgressPercent}%`
                        }}>
                            
                        <div className={styles.expBarRunner}></div>
                    </div>
                    <span style={{ cursor: "default" }}>{`${Math.round(currentLevelExp)} / ${Math.round(expForNextLevel)}`}</span>
                    <AnimatePresence>
                        {
                            showCumulatedExp && <motion.div 
                                className={styles.cumulatedExpTooltip}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <p>{`Cumulative EXP: ${user.exp}`}</p>
                            </motion.div>
                        }
                    </AnimatePresence>
                </div>
                <span>{user.level + 1}</span>
            </div>
        </div>
        <div className={`${styles.rank} ${rankStyles[user.rank.toLowerCase()]}`}>
            <p>{user.rank.toUpperCase()}</p>
        </div>
    </div>    
}

function MultiplayerInformation() {
    return <div>

    </div>
}

export default function HomeNavbar({ user }: { user: User }) {
    const { openSettings } = useSettings();
    const userPreference = useUserPreferenceStore(state => state.userPreference);

    return (
        <div
            className={styles.homeNavbar}
        >
            <UserInfo user={user} imageDimension={userPreference.fontSize * 3} />
            <MultiplayerInformation />
            <div className={styles.homeNavbarButtons}>
                <button className={styles.inventory} disabled>Inventory</button>
                <button className={styles.clan} disabled>Clan</button>
                <button className={styles.toSettings} onClick={openSettings}>
                    <Image
                        src={'/icons/settings.png'}
                        alt="settings"
                        width={userPreference.fontSize * 1.25}
                        height={userPreference.fontSize * 1.25}
                    />
                </button>
            </div>
        </div>
    )
}