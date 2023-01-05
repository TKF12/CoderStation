// redux
import {useSelector} from 'react-redux';

// antd
import { Button, Avatar, List, Popover, Image } from 'antd';

// icon
import { UserOutlined } from '@ant-design/icons';

// css
import styles from '../css/LoginAvatar.module.css';

function LoginAvatar(props) {

    // 从redux中获取是否登录
    const { isLogin, loginInfo } = useSelector(state => state.user);

    // 渲染的内容
    let loginStatus = null;

    // 列表显示的内容
    const items = [
        {
            title: '个人中心',
        },
        {
            title: '退出登录',
        },
    ]


    // 已登录
    if(isLogin) {
        // hover后显示的列表
        const content = (
            <List 
                dataSource={items}
                renderItem={(item) => (
                    <List.Item>
                        {item.title}
                    </List.Item>
                )}
            />
        );
        // 头像
        loginStatus = (
            <div className={styles.avatarContainer}>
                <Popover
                    content={content}
                    placement="bottom"
                    trigger="hover"
                >
                    <Avatar
                        size="large"
                        style={{cursor: 'pointer'}}
                        icon={<UserOutlined />} 
                        src={<Image src={loginInfo?.avatar}/>}
                    />
                </Popover>
            </div>    
        );
    } else {
        loginStatus = (
            <Button
                size="large"
                type="primary"
                onClick={() => props.loginHeader()}
            >
                登陆/注册
            </Button>
        );
    }
    return (
        <div>
            {loginStatus}
        </div>
    );
}

export default LoginAvatar;