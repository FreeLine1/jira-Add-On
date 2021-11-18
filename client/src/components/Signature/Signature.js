import React, {useRef} from "react";
import './Signature.css';
import SignatureCanvas from 'react-signature-canvas';


function Signature(canvasRef) {

    const buttonRef = useRef();
    const saveCanvas = async () => {


        window.AP.context.getToken()
            .then((res) => {
                console.log(res)
                return new Promise((res)=>{
                    window.AP.user.getCurrentUser((user)=> res(user))
                })
            }).then((user)=>{
                console.log(user.atlassianAccountId)
                return window.AP.request(`/rest/api/3/user?accountId=${user.atlassianAccountId}`, { // 3 //5
                    method: 'GET',
                    headers: {
                        // 4
                        'Accept': 'application/json'
                    }
                })
            }).then((data) => {
                console.log(data)
                const resultBody = JSON.parse(data.body)
                fetch('/sign', {
                    method: 'POST',
                    body: JSON.stringify({file: canvasRef.toDataURL('base64string'), name: resultBody.displayName}),
                    headers: {
                        'Authorization': 'Basic bWF4aWsuNTV0QGdtYWlsLmNvbTpRMjRJU3FDM2lnaDhsa3FGc3BuTEEwQUQ=', // 7
                        'Content-Type': 'application/json',
                    }
                })
            })
            .catch((err) => {
                console.log('error:', err)
            })
            // .finally(() => window.AP.navigator.reload()) // 1

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