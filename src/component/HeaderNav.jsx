// router
import { NavLink } from "react-router-dom";

// antd
import { Input, Select } from 'antd';

// jsx
import LoginAvatar from "./LoginAvatar";

function HeaderNav(props) {


    return (
        <div className="headerContainer">
            {/* logo区域 */}
            <div className="logoContainer">
                <div className="logo"></div>
            </div>
            {/* 导航按钮 */}
            <div className="navContainer">
                <NavLink to="/" className="navgation">问答</NavLink>
                <NavLink to="/books" className="navgation">书籍</NavLink>
                <NavLink to="/interviews" className="navgation">面试题</NavLink>
                <NavLink to="/blogs" className="navgation">专栏</NavLink>
            </div>
            {/* 选项卡，搜索 */}
            <div className="searchContainer">
                <Input.Group compact>
                <Select 
                    defaultValue="issue"
                    size="large"
                    style={{width: '20%'}}
                    >
                    <Select.Option className="select-item" value="issue">问答</Select.Option>
                    <Select.Option className="select-item" value="books">书籍</Select.Option>
                </Select>
                <Input.Search
                    enterButton="搜索"
                    size="large"
                    style={{
                        width: '80%',
                    }}
                    placeholder="请输入要搜索的内容"
                />
                </Input.Group>
            </div>
            {/* 登录或注册 */}
            <div className="loginBtnContainer">
                <LoginAvatar
                    loginHeader={props.loginHeader}
                />
            </div>
        </div>
    );
}

export default HeaderNav;