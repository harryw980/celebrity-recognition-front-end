import React from 'react';
import './LinkForm.css';

const LinkForm = ({ onInputChange, onDetect }) => {
    return (
        <div className='ma4 mt0'>
            <p className='f2'>
                {'Face Detection'}
            </p>
            <div className='center'>
                <div className='pa4 br3 shadow-5 center form'>
                    <input onChange={onInputChange} className='f4 pa2 w-70 center' type='tex' />
                    <button onClick={onDetect} className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple'>Dectect</button>
                </div>
            </div>
        </div>
    );
}

export default LinkForm;