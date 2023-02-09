// router
import { useLocation, useNavigate } from 'react-router-dom';

// jsx
import ContentRoutes from './Index';

// antd
import {Alert} from "antd";


import RouteBeforeConfig from './RouteBeforeConfig';


// 导航守卫

function RouteBefore(props) {

    const location = useLocation();

    const navigate = useNavigate();

    // 匹配到的路径
    const currentPath = RouteBeforeConfig.filter((item) => item.path === location.pathname);

    if(currentPath[0]) {
        // 当前页面需要鉴权 并且 没有token
        if(!localStorage.getItem('useToken') && currentPath[0].needLogin) {
            return (
                <Alert 
                    message="请先登录"
                    type="warning"
                    closable
                    onClose={closeHandle}
                    style={{
                        marginTop : "30px",
                        marginBottom : "30px"
                    }}
                />
            );
        }
    }

    // 关闭提示弹框，跳转到首页
    function closeHandle() {
        navigate('/');
    }

    return (
        <ContentRoutes />
    );
}

export default RouteBefore;