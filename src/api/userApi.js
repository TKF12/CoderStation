import requse from './requse.js';

// 获取验证码图片
export function getCaptchaApi() {
    return requse({
        url: '/res/captcha',
        method: 'GET',
    })
}


// 账号是否存在
export function loginIdIsExistApi(loginId) {
    return requse({
        url: `/api/user/userIsExist/${loginId}`,
        method: 'GET',
        data: loginId,
    })
}


// 账号注册
export function registerApi(data) {
    return requse({
        url: '/api/user',
        method: 'POST',
        data,
    })
}