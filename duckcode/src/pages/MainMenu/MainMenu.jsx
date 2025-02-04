import { useContext, useEffect, useRef } from 'react';
import './mainmenu.css';
import Settings from '../../globalcomponents/settings_components/Settings';
import { SettingsContext } from '../../App';
import StarryBackground from '../../globalcomponents/background_wrappers/StarryBackground';
import { useNavigate } from 'react-router-dom';

export default function MainMenu() {
    const currentExp = 1200;
    const expCap = 2000;

    const navigate = useNavigate();
    const handleToGameplay = (event) => {
        navigate('/gameplay');
    }

    const expBarRef = useRef(null);

    const {setFrozen} = useContext(SettingsContext);

    useEffect(() => {
        const expBar = Math.floor(360 * currentExp / expCap);

        expBarRef.current.style.backgroundImage = `conic-gradient(from 0deg at 50% 50%,
                                                                    var(--exp-bar-color),
                                                                    var(--exp-bar-color-tail) ${expBar}deg,
                                                                    transparent ${expBar}deg)`;
    }, [currentExp, expCap]);

    const child = (
        <div id="main-menu">
            <div id='main-menu-navbar'>
                <div ref={expBarRef} id='main-menu-user-image'>
                    <div id='image-wrapper'>
                        <img id='main-menu-profile-avatar' src='https://i.pinimg.com/736x/55/1e/9a/551e9ad6616917d8335fe46db64688b9.jpg' alt='user-profile-picture' />
                    </div>
                </div>
                <h2 id='main-menu-username'>duck_administrator_420</h2>
                <p id='main-menu-user-level'>Level <span>38</span></p>
                <p id='main-menu-user-exp'><span>{currentExp}</span> / <span>{expCap}</span></p>
                <div id='main-menu-settings'>
                    <button id='main-menu-to-settings-button' onClick={() => setFrozen(false)}>
                        <img id='settings-logo' src='/icons/settings.png' alt='settings' />
                    </button>
                    <Settings />
                </div>
            </div>
            <div id='main-menu-selections'>
                <button onClick={handleToGameplay} className='main-menu-sig-choice' id='play-ranked-match-button'>Play Ranked Match</button>
                <button className='main-menu-insig-choice'>Play Practice Match</button>
                <button className='main-menu-insig-choice'>Tutorial</button>
                <button className='main-menu-insig-choice'>Inventory</button>
            </div>
        </div>
    );

    return <StarryBackground child={child} />
}