import React, {useRef} from "react";
import './Signature.css';
import SignatureCanvas from 'react-signature-canvas';
import createSign from "../../lib/createSign";

function Signature(canvasRef) {

    const buttonRef = useRef();
    const clearButtonRef = useRef();

    const saveCanvas = async () => {
        buttonRef.current.disabled = true;
        clearButtonRef.current.disabled = true;

        new Promise((res) => {
            return window.AP.user.getCurrentUser((user) => res(user))
        }).then((user) => {
            return window.AP.request(`/rest/api/3/user?accountId=${user.atlassianAccountId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            })
        }).then((data) => {
            return new Promise((resolve, reject) => {
                window.AP.context.getContext(function (response) {
                    resolve({key: response.jira.issue.key, data})
                })
            })
        }).then(({key, data}) => {
            const axiosData = JSON.stringify({
                file: canvasRef.toDataURL('base64string'),
                name: JSON.parse(data.body).displayName,
                issueKey: key
            });

            return createSign(axiosData);

        }).catch((err) => {
            console.log('error:', err)
        }).finally(() => window.AP.navigator.reload())

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
                    <button ref={clearButtonRef} onClick={clearCanvas}>Clear</button>
                    <br/>
                    <button ref={buttonRef} onClick={saveCanvas}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default Signature;