import styles from '../page.module.css';
import animationStyles from '@/components/styles/animations.module.css';
import Link from 'next/link';

export default function Home() {
    return (
        <section className={`${styles.landingWelcomeSection} ${styles.fullscreen}`}>
            <div className={styles.landingWelcomeContainer}>
                <h1>Welcome to DuckCode!</h1>
                <p>It&apos;s not just another website about programming, it&apos;s DuckCode.</p>
                <div className={`${styles.landingWelcomePlayDuckcodeButtonWrapper} ${animationStyles.illuminatingBorder}`}>
                    <Link href='/portal' className={`${styles.landingWelcomePlayDuckcodeButton}`}>Play Now</Link>
                </div>
            </div>
        </section>
    )
}