import styles from "./layout.module.css";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <div className={styles.halfScreenCover}></div>
            {children}
        </div>
    )
}