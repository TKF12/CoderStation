import React from 'react';

// router
import { useNavigate } from 'react-router-dom';

// redux
import { useSelector } from 'react-redux';

// antd
import { Button, message } from 'antd';

function AddIssueBtn(props) {

    const navigate = useNavigate();
    // 登录状态
    const { isLogin } = useSelector((state) => state.user);

    function clickAddissue() {
        // 已登录
        if(isLogin) {
            // 跳转到添加页面
            navigate('/addissue');
        } else {
            message.warning('请先登录');
        }
    }

    return (
        <Button
            type="primary"
            size="large"
            style={{
                width : "100%",
                marginBottom : "30px"
            }}
            onClick={clickAddissue}
            >
            我要提问
        </Button>
    );
}

export default AddIssueBtn;