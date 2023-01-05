import axios from 'axios';

const instance = axios.create({
    baseUrl: 'http: //localhost:7001',
    timeout: 5000,
})

// 请求拦截器
instance.interceptors.request.use((config) => {
    return config;
}, (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
});


instance.interceptors.response.use((res) => {
    if(res.status === 200) {
        return res.data;
    }
}, (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
});


export default instance;