import requset from './requset';

// 获取面试题所有标题
export function getInterViewTitleListApi() {
    return requset({
        url: '/api/interview/interviewTitle',
        method: 'GET',
    })
}


// 根据标题id获取文章
export function getByIdViewContentApi(id) {
    return requset({
        url: `/api/interview/${id}`,
        method: 'GET',
    })
}