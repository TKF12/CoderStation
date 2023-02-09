import requset from './requset';

// 获取问答列表
export function getIssueApi (data) {
    return requset({
        url: '/api/issue/',
        method: 'GET',
        params: {
            ...data
        }
    })
}


// 添加问答
export function addIssueApi(data) {
    return requset({
        url: '/api/issue/',
        method: 'POST',
        data,
    })
}


// 查询id
export function getIdIssueApi(id) {
    return requset({
        url: `/api/issue/${id}`,
        method: 'GET',
    })
}


// 更新问答
export function updateIssueApi(id, data) {
    return requset({
        url: `/api/issue/${id}`,
        method: 'PATCH',
        data,
    })
}