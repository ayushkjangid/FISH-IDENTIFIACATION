import React from 'react';

import loginBg from '../assets/login_bg.jpg';
import './FishBackground.css';

const FishBackground = React.memo(() => {
    return (
        <div className="fish-background" style={{ backgroundImage: `url(${loginBg})` }}>
        </div>
    );
});

export default FishBackground;
