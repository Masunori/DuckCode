import PublicNavbar from "./PublicNavbar";
import styles from "./layout.module.css";

export default function Layout({ children }: { children: React.ReactNode }) {
    const dummyLink = "https://youtu.be/dQw4w9WgXcQ?si=pbHjWVWDclnIJgTS";

    return (
        <div className={styles.publicLayout}>
            <PublicNavbar />
            {children}
            <footer>
                <ul>
                    <li>
                        <a href={dummyLink}>Privacy Policy</a>
                    </li>
                    <li>
                        <a href={dummyLink}>Terms of Service</a>
                    </li>
                    <li>
                        <a href={dummyLink}>Contact Us</a>
                    </li>
                    <li>
                        <a href={dummyLink}>Help Centre</a>
                    </li>
                </ul>
                {/* <p>&copy; {new Date().getFullYear()} DuckCode Project. All rights reserved.</p> */}
            </footer>
        </div>
    )
}