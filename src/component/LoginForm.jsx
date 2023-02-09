import {useState, useRef, useEffect} from 'react';

// redux
import { setIsLogin, initUseInfo, editUserAsync } from '../redux/loginSlice';
import { useDispatch } from 'react-redux';

// api
import {
    getCaptchaApi,
    loginIdIsExistApi,
    registerApi,
    loginUseApi,
    getIdUseApi
} from '../api/userApi';

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
    const [tabsValue, setTabsValue] = useState(0);
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
        // 重置表单
        resetForm();
    }, [tabsValue, props.isModalOpen]);


    // 登录ref
    const loginFormRef = useRef();
    // 注册ref
    const registerFormRef = useRef();

    // 渲染的表单
    let container = null;

    // 登录表单提交
    async function loginHandle() {
        const result = await loginUseApi(loginInfo);
        // 有登录信息
        if(result.data) {
            // 账号或密码不正确
            if(!result.data.data) {
                message.warning('账号或密码不正确');
                // 更新验证码
                captchaClickHandle();
            } else if(!result.data.data.enabled) {
                // 账号被冻结
                message.warning('账号被冻结，请联系管理员');
                // 更新验证码
                captchaClickHandle();
            } else {
                // 将token存储到本地
                localStorage.setItem('useToken', result.data.token);
                const use = await getIdUseApi(result.data.data._id);
                message.success('登录成功');
                // 将用户信息存储到redux
                dispatch(initUseInfo(use.data));
                // 设置已登录
                dispatch(setIsLogin(true));
                // 更新登录时间
                dispatch(editUserAsync({
                    userId: result.data.data._id,
                    newData: {
                        lastLoginDate: Date.now(),
                    }
                }));
                // 重置表单
                resetForm();
                // 关闭登录弹窗
                props.handleCancel();
            }

        } else {
            // 验证码错误
            message.warning(result.msg);
            captchaClickHandle();
        }
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
        // 获取验证码
        const res = await getCaptchaApi();
        setCaptcha(res);
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
            // 关闭注册弹窗
            props.handleCancel();
        } else {
            // 提示错误信息
            message.error(res.msg);
            captchaClickHandle();
        }
    }
    
    // 切换登录/注册
    function changeRadio(val) {
        setTabsValue(val);
        // 重置输入框
        resetForm();
    }

    // 重置表单
    function resetForm() {
        if(tabsValue === 0) {
            // 重置登录输入框
            loginFormRef.current?.resetFields();
            // 重置state
            setLoginInfo({
                loginId: '',
                loginPwd: '',
                captcha: '',
                remember: false
            });
        } else {
            // 重置注册输入框
            registerFormRef.current?.resetFields();
            // 重置state
            setRegisterInfo({
                loginId: '',
                nickname: '',
                captcha: '',
            });
        }
        
    }

    // 渲染登录
    if(tabsValue === 0) {
        container = (
            <div className={styles.container}>
                <Form
                    name="basic1"
                    onFinish={loginHandle}
                    ref={loginFormRef}
                    key={tabsValue}
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
                        <Button type="primary" onClick={resetForm}>
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
                    key={tabsValue}
                    name="basic2"
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
                        <Button type="primary" onClick={resetForm}>
                            重置
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        );
    }

    return (
        <>
            <Modal
                title="登录/注册"
                open={props.isModalOpen}
                onCancel={props.handleCancel}
                footer={false}
                destroyOnClose
            >
                {/* 选项卡 */}
                <Segmented
                    value={tabsValue}
                    className={styles.radioGroup}
                    options={[
                        {label: '登录', value: 0, icon: <UserOutlined />},
                        {label: '注册', value: 1, icon: <UserAddOutlined />},
                    ]}
                    size="large"
                    onChange={changeRadio}
                />
                {/* 表单 */}
                {container}
            </Modal>
        </>
    );
}

export default LoginForm;