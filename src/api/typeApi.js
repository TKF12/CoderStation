import requset from './requset';

// 获取所有类型
export function getTypeListApi () {
    return requset({
        url: '/api/type',
        method: 'GET',
    })
}