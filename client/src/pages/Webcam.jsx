import React, { useState } from 'react';
import Webcam from "react-webcam";
import CountDowns from './Countdown';


const videoConstraints = {
    width: 220,
    height: 200,
    facingMode: "user"
};
  
export const WebcamCapture = (props) => {
    
    const{getData}=props;

    const [image,setImage]=useState('');
    const webcamRef = React.useRef(null);
    
    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();   
        setImage(imageSrc);
        getData(imageSrc);
        };

    return (
        <> 
        <div className="webcam-container">
            <div className="webcam-img"> 

                {image === '' ? <Webcam
                    audio={false}
                    height={200}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width={220}
                    videoConstraints={videoConstraints}
                /> : <img src={image} alt=""/>}
            </div>
            <div>
                {image !== '' ?
                    <button onClick={(e) => {
                        e.preventDefault();
                        setImage('')
                    }}
                        className="btn btn-danger">
                        Retake Image</button> :
                        <CountDowns onTimesup={capture}/>
                }
                
            </div>
        </div>
        </>
    );
};