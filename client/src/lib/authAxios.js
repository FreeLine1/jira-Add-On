import axios from "axios";

export default function authAxios(options) {
    const getToken = new Promise((resolve) => window.AP.context.getToken(resolve));

    axios.interceptors.request.use(
        async function (config) {
            const token = await getToken;
            return {...config, headers: {...config.headers, Authorization: `JWT ${token}`}}
        });
    return axios(options)
}

