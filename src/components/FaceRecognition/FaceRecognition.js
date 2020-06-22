import React from 'react';
import './FaceRecognition.css';


function FaceRecognition({ imgURL, box }) {
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id='inputImage' alt='' src={imgURL} width='500px' height='auto' />
                <div className='bounding-box' style={{ left:box.left, top:box.top, right:box.right, bottom:box.bottom, }}></div>
            </div>
        </div>
    );
}

export default FaceRecognition;