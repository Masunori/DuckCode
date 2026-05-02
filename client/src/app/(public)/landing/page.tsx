import Home from './components/Home';
import styles from './page.module.css';

export default function Page() {    
    return (
        <div className={`${styles.landing} ${styles.fullscreen}`}>
            <main>
                <Home />
            </main>
        </div>
    )
}