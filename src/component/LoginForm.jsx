import {useState, useRef, useEffect} from 'react';

// redux
import { setIsLogin, initUseInfo } from '../redux/loginSlice';
import { useDispatch } from 'react-redux';

// api
import { getCaptchaApi, loginIdIsExistApi, registerApi } from '../api/userApi';

// css
import styles from '../css/LoginForm.module.css';

// antd
import {
    Modal,
    Segmented,
    Form,
    Input,
    Row,
    Col,
    Checkbox,
    Button,
    message
} from 'antd';
import { UserOutlined, UserAddOutlined } from '@ant-design/icons'




function LoginForm(props) {

    const dispatch = useDispatch();

    // 选项卡状态
    const [value, changeValue] = useState(0);
    // 登录信息
    const [loginInfo, setLoginInfo] = useState({
        loginId: '',
        loginPwd: '',
        captcha: '',
        remember: false,
    });
    // 注册信息
    const [registerInfo, setRegisterInfo] = useState({
        loginId: '',
        nickname: '',
        captcha: '',
    });

    // svg验证码
    const [captcha, setCaptcha] = useState(null);

    useEffect(() => {
        // 获取验证码
        captchaClickHandle();
    }, [value, props.isModalOpen]);

    // 登录ref
    const loginFormRef = useRef();
    // 注册ref
    const registerFormRef = useRef();

    // 渲染的表单
    let container = null;

    // 登录表单提交
    function loginHandle() {
        
    }

    // 验证账号是否存在
    async function checkLoginIdIsExist() {
        if(!registerInfo.loginId) {
            return;
        }
        const res = await loginIdIsExistApi(registerInfo.loginId);
        if(res.data) {
            return Promise.reject('账号已存在');
        }
    }

    /**
     * @description: 更新登录信息
     * @param {*} info 旧信息
     * @param {*} val 修改的值
     * @param {*} key 修改的key
     * @param {*} setInfo 修改loginInfo方法 
     */
    function updateInfo(info, val, key, setInfo) {
        // 拿到当前用户信息
        const infoStart = {...info};
        // 修改
        infoStart[key] = val;
        setInfo(infoStart);
    }

    // 切换验证码
    async function captchaClickHandle() {
        const res = await getCaptchaApi();
        setCaptcha(res);
    }

    // 清空注册内容和登录内容，关闭登录弹窗
    function handleCancel() {
        setRegisterInfo({
            loginId: '',
            nickname: '',
            captcha: '',
        });
        setLoginInfo({
            loginId: '',
            loginPwd: '',
            captcha: '',
            remember: false,
        });
        props.handleCancel();
    }

    // 注册提交
    async function registerHandle() {
        const res = await registerApi(registerInfo);
        // 有注册信息
        if(res.data) {
            // 设置用户信息
            dispatch(initUseInfo(res.data));
            // 设置已登录
            dispatch(setIsLogin(true));
            message.success('注册成功，默认密码为123456', 5);
            // 关闭弹窗
            handleCancel();
        } else {
            // 提示错误信息
            message.error(res.msg);
            captchaClickHandle();
        }
    }

    // 渲染登录
    if(value === 0) {
        container = (
            <div className={styles.container}>
                <Form
                    name="basic1"
                    autoComplete="off"
                    onFinish={loginHandle}
                    ref={loginFormRef}
                >
                    <Form.Item
                        label="登录账号"
                        name="loginId"
                        rules={[
                            {
                                required: true,
                                message: "请输入账号",
                            },
                        ]}
                    >
                        <Input
                            placeholder="请输入你的登录账号"
                            value={loginInfo.loginId}
                            onChange={(e) => updateInfo(loginInfo, e.target.value, 'loginId', setLoginInfo)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="登录密码"
                        name="loginPwd"
                        rules={[
                            {
                                required: true,
                                message: "请输入密码",
                            },
                        ]}
                    >
                        <Input.Password
                            placeholder="请输入你的登录密码，新用户默认为123456"
                            value={loginInfo.loginPwd}
                            onChange={(e) => updateInfo(loginInfo, e.target.value, 'loginPwd', setLoginInfo)}
                        />
                    </Form.Item>

                    {/* 验证码 */}
                    <Form.Item
                        name="logincaptcha"
                        label="验证码"
                        rules={[
                            {
                                required: true,
                                message: '请输入验证码',
                            },
                        ]}
                    >
                        <Row align="middle">
                            <Col span={16}>
                                <Input
                                    placeholder="请输入验证码"
                                    value={loginInfo.captcha}
                                    onChange={(e) => updateInfo(loginInfo, e.target.value, 'captcha', setLoginInfo)}
                                />
                            </Col>
                            <Col span={6}>
                                <div
                                    className={styles.captchaImg}
                                    onClick={captchaClickHandle}
                                    dangerouslySetInnerHTML={{ __html: captcha }}
                                ></div>
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item
                        name="remember"
                        wrapperCol={{
                            offset: 5,
                            span: 16,
                        }}
                    >
                        <Checkbox
                            onChange={(e) => updateInfo(loginInfo, e.target.checked, 'remember', setLoginInfo)}
                            checked={loginInfo.remember}
                        >记住我</Checkbox>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 5,
                            span: 16,
                        }}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ marginRight: 20 }}
                        >
                            登录
                        </Button>
                        <Button type="primary" htmlType="submit">
                            重置
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    } else {
        container = (
            <div className={styles.container}>
                <Form
                    name="basic2"
                    autoComplete="off"
                    ref={registerFormRef}
                    onFinish={registerHandle}
                >
                    <Form.Item
                        label="登录账号"
                        name="loginId"
                        rules={[
                            {
                                required: true,
                                message: "请输入账号，仅此项为必填项",
                            },
                            // 验证用户是否已经存在
                            { validator: checkLoginIdIsExist },
                        ]}
                        validateTrigger='onBlur'
                    >
                        <Input
                            placeholder="请输入账号"
                            value={registerInfo.loginId}
                            onChange={(e) => updateInfo(registerInfo, e.target.value, 'loginId', setRegisterInfo)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="用户昵称"
                        name="nickname"
                    >
                        <Input
                            placeholder="请输入昵称，不填写默认为新用户xxx"
                            value={registerInfo.nickname}
                            onChange={(e) => updateInfo(registerInfo, e.target.value, 'nickname', setRegisterInfo)}
                        />
                    </Form.Item>

                    <Form.Item
                        name="registercaptcha"
                        label="验证码"
                        rules={[
                            {
                                required: true,
                                message: '请输入验证码',
                            },
                        ]}
                    >
                        <Row align="middle">
                            <Col span={16}>
                                <Input
                                    placeholder="请输入验证码"
                                    value={registerInfo.captcha}
                                    onChange={(e) => updateInfo(registerInfo, e.target.value, 'captcha', setRegisterInfo)}
                                />
                            </Col>
                            <Col span={6}>
                                <div
                                    className={styles.captchaImg}
                                    onClick={captchaClickHandle}
                                    dangerouslySetInnerHTML={{ __html: captcha }}
                                ></div>
                            </Col>
                        </Row>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 5,
                            span: 16,
                        }}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ marginRight: 20 }}
                        >
                            注册
                        </Button>
                        <Button type="primary" htmlType="submit">
                            重置
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }


    // 确认
    function handleOk() {
        console.log('querding');
    }

    // 切换登录/注册
    function changeRadio(val) {
        changeValue(val);
    }

    return (
        <div>
            <Modal
                title="登录/注册"
                open={props.isModalOpen}
                onCancel={props.handleCancel}
                onOk={handleOk}
            >
                {/* 选项卡 */}
                <Segmented
                    value={value}
                    className={styles.radioGroup}
                    options={[
                        {label: '登录', value: 0, icon: <UserOutlined />},
                        {label: '注册', value: 1, icon: <UserAddOutlined />}
                    ]}
                    size="large"
                    onChange={changeRadio}
                />
                {/* 表单 */}
                {container}
            </Modal>
        </div>
    );
}

export default LoginForm;