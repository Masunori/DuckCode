import styles from './page.module.css';
import Link from "next/link";
import PortalClient from './PortalClient';

export default function Page() {
    return (
        <div className={styles.container}>  
            <Link href='/' className={styles.toLanding}>About Us</Link>
            <div className={styles.content}>
                <h1>It&apos;s more than just writing code... It&apos;s the Duck way of writing Code!</h1>
                <p>Dive into gamified tutorials, challenge peers in ranked matches, and participate in simulated contests with prizes!</p>
            </div>
            <PortalClient />
        </div> 
    )
}