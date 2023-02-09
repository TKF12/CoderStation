// 需要鉴权的页面
export default [
    { path: "/issuesdetail/:id", needLogin: false },
    { path: "/books", needLogin: false },
    { path: "/bookdetail/:id", needLogin: false },
    { path: "/interviews", needLogin: false },
    { path: "/personal", needLogin: true },
    { path: "/addissue", needLogin: true },
    { path: "/searchpage", needLogin: false },
    { path: "/", needLogin: false },
]