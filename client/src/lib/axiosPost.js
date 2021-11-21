const {default: axios} = require("axios");

export default function axiosPost(canvasRef, resultBody) {

    const getToken = () => {
        return new Promise(resolve =>
            window.AP.context.getToken(token => {
                return resolve(token);
            })
        );
    };

    axios.interceptors.request.use(
        async function (config) {
            let token = await getToken();
            if (token) {
                config.headers.Authorization = `JWT ${token}`;
            }
            return config;
        },
        function (err) {
            return Promise.reject(err);
        }
    );

    return axios('/sign', {
        method: 'POST',
        data: JSON.stringify({file: canvasRef.toDataURL('base64string'), name: resultBody.displayName}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
