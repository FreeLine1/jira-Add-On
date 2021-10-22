import React , {useRef} from "react";
import './Signature.css'

import CanvasDraw from "react-canvas-draw";
import SignatureCanvas from 'react-signature-canvas'
function Signature() {
//const canvasRef = useRef()
    let canvasRef;

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
             <p>HELLO WORLDdd</p>
            <button onClick={clearCanvas}>Clear</button>
            <button onClick={saveCanvas}>Send</button>
            {/*<CanvasDraw  />*/}
            <div className='signature'>
            <SignatureCanvas
                penColor='black'
                canvasProps={{width: 500, height: 200, className: 'sigCanvas'}}
                ref={(ref) => {canvasRef = ref }}
            />
            </div>
        </div>
    );
}
export default Signature;