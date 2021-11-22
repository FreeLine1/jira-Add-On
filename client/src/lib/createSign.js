import authAxios from './authAxios';

export default function createSign(data){
    return authAxios({
        url: '/api/sign',
        method: 'POST',
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
