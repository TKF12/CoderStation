import { useEffect, useState, useRef } from "react";

// router
import { NavLink, useNavigate, useLocation } from "react-router-dom";

// antd
import { Input, Select } from 'antd';

// jsx
import LoginAvatar from "./LoginAvatar";

function HeaderNav(props) {

    const navigate = useNavigate();
    const location = useLocation();

    // ref
    const inputSearchRef = useRef();

    // 搜索内容
    const [inputText, setInputText] = useState('');

    // 搜索选项卡内容
    const [selectContent, setSelectContent] = useState('issue');


    // 页面刷新 搜索框中没有内容 但是 searchpage组件state上面有数据
    // 将数据回填
    useEffect(() => {
        if(!inputSearchRef.current.input.value && location.state) {
            // 回填输入框内容
            setInputText(location.state.inputText);
            // 回填选项卡内容
            setSelectContent(location.state.selectContent);
        }
    },[]);


    useEffect(() => {
        // 从searchpage跳转到其它页面清空输入框内容
        if(location.pathname !== '/searchpage') {
            setInputText('');
            // setSelectContent('issue');
        }
    }, [location.pathname]);

    

    // 改变搜索内容
    function changeInputText(e) {
        const val = e.target.value;
        setInputText(val);
        // 输入框没有内容 并且 当前页不是首页 跳转到首页
        if(!val && location.pathname !== '/') {
            navigate('/');
        }
    }

    // 搜索选项卡
    function changeSelect(val) {
        setSelectContent(val)
    }

    // 搜索提交
    function inputSubmit() {
        // 输入框中没有内容
        if(!inputText) {
            return;
        }
        // 跳转到搜索页
        navigate('/searchpage', {
            state: {
                inputText,
                selectContent
            }
        })
    }

    return (
        <div className="headerContainer">
            {/* logo区域 */}
            <div className="logoContainer" onClick={() => navigate('/')}>
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
                        getPopupContainer={() => document.querySelector('.searchContainer')}
                        value={selectContent}
                        size="large"
                        style={{width: '20%'}}
                        className='select-group'
                        onChange={changeSelect}
                    >
                        <Select.Option className="select-item" value="issue">问答</Select.Option>
                        <Select.Option className="select-item" value="books">书籍</Select.Option>
                    </Select>
                    <Input.Search
                        ref={inputSearchRef}
                        value={inputText}
                        enterButton="搜索"
                        size="large"
                        style={{
                            width: '80%',
                        }}
                        placeholder="请输入要搜索的内容"
                        onChange={changeInputText}
                        onSearch={inputSubmit}
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