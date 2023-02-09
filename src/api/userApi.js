import requset from './requset.js';

// 获取验证码图片
export function getCaptchaApi() {
    return requset({
        url: '/res/captcha',
        method: 'GET',
    })
}


// 账号是否存在
export function loginIdIsExistApi(loginId) {
    return requset({
        url: `/api/user/userIsExist/${loginId}`,
        method: 'GET',
        data: loginId,
    })
}


// 账号注册
export function registerApi(data) {
    return requset({
        url: '/api/user',
        method: 'POST',
        data,
    })
}


// 账号登录
export function loginUseApi(data) {
    return requset({
        url: '/api/user/login',
        method: 'POST',
        data,
    })
}


// 根据id获取用户信息
export function getIdUseApi(id) {
    return requset({
        url: `/api/user/${id}`,
        method: 'GET'
    })
}


// 恢复登录
export function restoreLoginApi() {
    return requset({
        url: '/api/user/whoami',
        method: 'GET'
    })
}


// 获取积分前十用户
export function getPointsListApi() {
    return requset({
        url: '/api/user/pointsrank',
        method: 'GET'
    })
}


// 修改用户相关信息
export function editUserApi(id, data) {
    return requset({
        url: `/api/user/${id}`,
        method: 'PATCH',
        data,
    })
}


// 根据用户id验证密码是否正确
export function checkPasswordApi(userId, loginPwd) {
    return requset({
        url: '/api/user/passwordcheck',
        method: 'POST',
        data: {
            userId,
            loginPwd
        }
    });
}