/**
 * Created by zenghongtu on 03/09/2018.
 * Desc: config
 */

import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:9000/' : 'http://api.zenghongtu.com/v1';

const ajax = axios.create({
    timeout: 5000,
    baseURL
});

ajax.interceptors.request.use((config) => {
    const _id = window.localStorage.getItem('_id');
    _id && (config.headers._id = _id);
    return config
}, (err) => {
    alert('发起请求超时');
    throw new Error('发起请求超时')
});

ajax.interceptors.response.use((res) => {
    if (/^2/.test(res.status)) {
        const _id = res.headers._id;
        if (_id) {
            window.localStorage.setItem('_id', _id);
        }
        return res
    } else {
        throw new Error(res.data.message)
    }
}, (err) => {
    if (err.response.status === 504 || err.response.status === 404) {
        alert('服务器问题')
    } else if (err.response.status === 403) {
        alert('权限不足')
    } else {
        alert('未知错误')
    }
    throw new Error(err)
});

export default ajax
