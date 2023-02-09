import requset from './requset';


// 获取评论
export function getCommentApi(id, params) {
    return requset({
        url: `/api/comment/issuecomment/${id}`,
        method: 'GET',
        params,
    })
}



// 添加评论
export function addCommentApi(data) {
    return requset({
        url: '/api/comment',
        method: 'POST',
        data,
    })
}