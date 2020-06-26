import React from 'react';

function Rank({ name, entries, isGuest }) {
    return ( //displaying messages according to isGuest state/user profile
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