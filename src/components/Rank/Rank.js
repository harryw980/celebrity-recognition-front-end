import React from 'react';
//import './Rank.css';


function Rank({ name, entries, isGuest }) {
    return (
        <div>
            <div className='white f3 mb2'>
                {isGuest?'':`${name}, your number of entry is...`}
            </div>
            <div className='white f1'>
                {`${isGuest?'Register to have a entry count':entries}`}
            </div>
        </div>
    );
}

export default Rank;