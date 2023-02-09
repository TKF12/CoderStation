import requset from './requset';


// 获取所有书籍
export function getBookListApi(params) {
    return requset({
        url: '/api/book',
        method: 'GET',
        params,
    })
}


// 根据id查找书籍
export function getByIdBookDetailApi(id) {
    return requset({
        url: `/api/book/${id}`,
        method: 'GET',
    })
}


// 修改书籍相关数据
export function editBookApi(id, data) {
    return requset({
        url: `/api/book/${id}`,
        method: 'PATCH',
        data,
    })
}


// 根据数据id获取书籍评论
export function getBookCommentApi(id, params) {
    return requset({
        url: `/api/comment/bookcomment/${id}`,
        method: 'GET',
        params,
    })
}