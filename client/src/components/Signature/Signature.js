import React , {useRef} from "react";
import './Signature.css';
import SignatureCanvas from 'react-signature-canvas';

function Signature(canvasRef) {
//const canvasRef = useRef()


    const saveCanvas = () => {
        console.log(canvasRef.toDataURL('base64string'))

        fetch('/sign', {
            method: 'POST',
            body: JSON.stringify({file: canvasRef.toDataURL('base64string')}),
            headers: {
                'Content-Type': 'application/json',
            }
        })
    }
    const clearCanvas = () => {
        canvasRef.clear()
    }

    return(
        <div className='draw-container'>

            {/*<CanvasDraw  />*/}
            <div className='signature'>
            <SignatureCanvas
                penColor='black'
                canvasProps={{width: 340, height: 130, className: 'sigCanvas'}}
                ref={(ref) => {canvasRef = ref }}
            />
                <div className="signButtons">
                <button onClick={clearCanvas}>Clear</button><br/>
                <button onClick={saveCanvas}>Send</button>
                </div>
            </div>
        </div>
    );
}
export default Signature;