"use client";

import { User } from "@/app/userPrefs/userPrefsTypes";
import { useSettings } from "@/contexts/SettingsContext";
import Image from "next/image";
import styles from "../page.module.css";

export default function HomeNavbar({ user }: { user: User }) {
    const { openSettings } = useSettings();

    return (
        <div
            className={styles.homeNavbar}
        >
            <div className={styles.userInfo}>
                {/* <Image 
                    src={null} 
                    alt="user-profile-pic" 
                    width={user.userPreference.fontSize * 3} 
                    height={user.userPreference.fontSize * 3} 
                /> */}
                <div className={styles.img}>

                </div>
                <div className={styles.usernameLevelExp}>
                    <p>{user.name}</p>
                    <div className={styles.expBarWithLevel}>
                        <span>{user.level}</span>
                        <div className={styles.expBarTotal}>
                            <div
                                className={styles.expBarAcquired}
                                style={{
                                    width: `${user.exp / (10 * Math.pow(1.1, user.level - 1))}%`
                                }}>
                                <div className={styles.expBarRunner}></div>
                            </div>
                        </div>
                        <span>{user.level + 1}</span>
                    </div>
                </div>
                <div className={styles.rank}>
                    <p>{user.rank}</p>
                </div>
            </div>
            <button className={styles.inventory}>Inventory</button>
            <button className={styles.clan}>Clan</button>
            <button className={styles.toSettings} onClick={openSettings}>
                <Image
                    src={'/icons/settings.png'}
                    alt="settings"
                    width={20}
                    height={20}
                />
            </button>
        </div>
    )
}