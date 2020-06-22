import React from 'react';
//import './Navigation.css';

function Navigation({ signedIn, routeChange, routeChangeGuest, isGuest }) {
    if(signedIn){
        return (
            <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <p onClick={() => routeChangeGuest('signin')} className='f3 link dim black underline pa3 pointer'>{isGuest?'Guest Sign Out':`Sign Out`}</p>
            </nav>
        );
    }else{
        return (
            <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <p onClick={() => routeChange('signin')} className='f3 link dim black underline pa3 pointer'>Sign In</p>
                <p onClick={() => routeChange('register')} className='f3 link dim black underline pa3 pointer'>Register</p>
            </nav>
        );
    }
}

export default Navigation;
