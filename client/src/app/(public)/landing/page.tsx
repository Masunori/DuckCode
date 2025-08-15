import Home from './components/Home';
import styles from './page.module.css';

export default function Page() {    
    // // React hooks to store the index of the current landing section and the landing sections
    // const [currentSection, setCurrentSection] = useState(0);
    // const sectionRef = useRef<(HTMLDivElement | null)[]>([]);

    // // scroll event handler
    // const handleScroll = useCallback((event: globalThis.WheelEvent) => {
    // const delta = event.deltaY;

    // setCurrentSection((prev) => {
    //     if (delta > 0 && prev < Object.keys(SECTIONS).length - 1) {
    //         return prev + 1; // Scroll down → next section
    //     } else if (delta < 0 && prev > 0) {
    //         return prev - 1; // Scroll up → previous section
    //     }
    //     return prev;
    //     });

    // }, []);

    // // enables jump scrolling whenever the section changes
    // useEffect(() => {
    // sectionRef.current[currentSection]?.scrollIntoView({ behavior: 'smooth' });
    // }, [currentSection]);

    // // attaches the jump scrolling handler to the window
    // useEffect(() => {
    // window.addEventListener('wheel', handleScroll, { passive: false });

    // return () => {
    //     window.removeEventListener("wheel", handleScroll);
    // };
    // }, [handleScroll]);

    return (
        <div className={`${styles.landing} ${styles.fullscreen}`}>
            <main>
                <Home />
            </main>
        </div>
    )
}