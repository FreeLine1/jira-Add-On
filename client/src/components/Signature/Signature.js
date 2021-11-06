import React, {useEffect} from "react";
import './Signature.css';
import SignatureCanvas from 'react-signature-canvas';
import jwt_decode from "jwt-decode";

function Signature(canvasRef) {

    const saveCanvas = async () => {

        let data = await fetch('/sign', {
            method: 'POST',
            body: JSON.stringify({file: canvasRef.toDataURL('base64string')}),
            headers: {
                'Content-Type': 'application/json',
            }

        })

        let token;
        window.AP.context.getToken((tkn)=>{
            token = tkn;
            console.log(token);
            let decodedJWT = jwt_decode(token);
            console.log(decodedJWT);

            window.AP.request(`https://maxym-dev.atlassian.net/rest/api/2/user?accountId=${decodedJWT.sub}`, {
            method: 'GET',
                headers: {
                'Authorization': 'Basic bWF4aWsuNTV0QGdtYWlsLmNvbTpRMjRJU3FDM2lnaDhsa3FGc3BuTEEwQUQ=',
                    'Accept': 'application/json'
            }
        }).then((data)=>{
                console.log(JSON.parse(data.body))
            }).catch((err)=>{
                console.log('error:',err)
            })


            const commentData = JSON.stringify({
                "body": {
                    "type": "doc",
                    "version": 1,
                    "content": [
                        {
                            "type": "paragraph",
                            "content": [
                                {
                                    "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque eget venenatis elit. Duis eu justo eget augue iaculis fermentum. Sed semper quam laoreet nisi egestas at posuere augue semper.",
                                    "type": "text"
                                }
                            ]
                        }
                    ]
                }
            });

            // Returns statusCode 415 - Unsupported media type
            window.AP.request({
                url: `/rest/api/3/issue/SFL-1/comment`,
                type: 'POST',
                data: commentData,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                success: function(responseText){
                    console.log(responseText);
                },
                error: function(xhr, statusText, errorThrown){
                    console.log(arguments);
                }
            });


        })


        // window.AP.navigator.reload();
        // if(data && data.status==='OK') reload();

    }

    const clearCanvas = () => {
        canvasRef.clear()
    }


/*

When button 'send' clicked ///

const token = Ap.getToken()
const decodedJWT = decode(token)

fetch({
    'https://maxym-dev.atlassian.net/rest/api/2/user?accountId${<decodedJWT.sub}'
}).then((data)=>{
    data.displayName //Your name
    AP.request("url", {success:(data)=>{data.diplayName}})
})

 */

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
                    <button onClick={saveCanvas}>Send</button>
                </div>
            </div>
        </div>
    );
}

export default Signature;