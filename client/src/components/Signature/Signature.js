import React, {useRef} from "react";
import './Signature.css';
import SignatureCanvas from 'react-signature-canvas';
import jwt_decode from "jwt-decode";

function Signature(canvasRef) {

    const buttonRef = useRef();
    const saveCanvas = async () => {
        if (buttonRef.current) buttonRef.current.disabled = true;
        setTimeout(() => {
            if (buttonRef.current) buttonRef.current.disabled = false
        }, 2000)

        let token;
        window.AP.context.getToken((tkn) => {
            token = tkn;
            let decodedJWT = jwt_decode(token);

            window.AP.request(`https://maxym-dev.atlassian.net/rest/api/2/user?accountId=${decodedJWT.sub}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic bWF4aWsuNTV0QGdtYWlsLmNvbTpRMjRJU3FDM2lnaDhsa3FGc3BuTEEwQUQ=',
                    'Accept': 'application/json'
                }
            }).then((data) => {
                const resultBody = JSON.parse(data.body)
                fetch('/sign', {
                    method: 'POST',
                    body: JSON.stringify({file: canvasRef.toDataURL('base64string'), name: resultBody.displayName}),
                    headers: {
                        'Content-Type': 'application/json',
                    }

                }).then(() => {
                    window.AP.navigator.reload();
                })
            }).catch((err) => {
                console.log('error:', err)
            })

        })
    }

    const clearCanvas = () => {
        canvasRef.clear()
    }


    return (
        <div className='draw-container'>

            <div className='signature'>
                <SignatureCanvas
                    penColor='black'
                    canvasProps={{width: 340, height: 130, className: 'sigCanvas'}}
                    ref={(ref) => {
                        canvasRef = ref
                    }}
                />
                <div className="signButtons">
                    <button onClick={clearCanvas}>Clear</button>
                    <br/>
                    <button ref={buttonRef} onClick={saveCanvas}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default Signature;