import { useState } from "react";
import Popup from "./Popup";
import Profile from "./Profile";

const Layout = () => {
    const [tab, setTab] = useState('Home');

    const tabStyle = {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50px',
        backgroundColor: '#f0f0f0',
        borderTop: '1px solid #ccc'
    };

    const tabButtonStyle = (isActive) => ({
        padding: '10px',
        cursor: 'pointer',
        fontWeight: isActive ? 'bold' : 'normal',
        color: isActive ? '#007bff' : '#333'
    });

    return (
        <div style={{height: "100%", width: "100%", paddingBottom: "50px"}}>
            {tab === 'Home' && <Popup />}
            {tab === 'Profile' && <Profile />}

            <div style={tabStyle}>
                <div 
                    style={tabButtonStyle(tab === 'Home')}
                    onClick={() => setTab('Home')}
                >
                    Home
                </div>
                <div 
                    style={tabButtonStyle(tab === 'Profile')}
                    onClick={() => setTab('Profile')}
                >
                    Profile
                </div>
            </div>
        </div>
    );
}
 
export default Layout;