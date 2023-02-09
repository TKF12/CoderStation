import { useEffect, useState } from "react";

// redux
import { useSelector, useDispatch } from "react-redux"
import { editUserAsync, clearUseInfo, setIsLogin } from '../redux/loginSlice';

// router
import { useNavigate } from 'react-router-dom';


// jsx
import PageHeader from "../component/PageHeader"
import PersonalInfoItem from "../component/PersonalInfoItem"

// antd
import {
    Card,
    Button,
    Upload,
    Image,
    Modal,
    Form,
    Input,
    message,
    Alert
} from "antd";
import { PlusOutlined } from '@ant-design/icons';

// utils
import { formatDate } from "../utils/tools"

// api
import { checkPasswordApi } from "../api/userApi"

// css
import styles from "../css/Personal.module.css"

function Personal(props) {

    const navigate = useNavigate();
    
    const dispatch = useDispatch();

    // 用户信息
    const { loginInfo } = useSelector(state => state.user);


    // 模态框是否显示
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [panelName, setPanelName] = useState("");
    // 要修改的数据项
    const [editInfo, setEditInfo] = useState({});
    // 密码相关
    const [passwordInfo, setPasswordInfo] = useState({
        oldpassword: "", // 旧密码
        newpassword: "", // 新密码
        passwordConfirm: "", // 确认密码
    });

    // 模态框显示
    const showModal = (name) => {
        // 设置模态框显示的标题
        setPanelName(name);
        // 每次打开模态框的时候，清空上一次提交的新内容信息
        setEditInfo({});
        setIsModalOpen(true);
        // 重置密码框
        setPasswordInfo({
            oldpassword: "", // 旧密码
            newpassword: "", // 新密码
            passwordConfirm: "", // 确认密码
        });
    };


    /**
     * 模态框点击确定时的回调
     */
    const handleOk = () => {

        // 编辑框里面有输入旧密码表示 修改密码
        if(passwordInfo.oldpassword && !editInfo.loginPwd) {
            message.error('请输入新密码');
            return;
        }

        if(passwordInfo.oldpassword && !passwordInfo.passwordConfirm) {
            message.error('请输确认密码');
            return;
        }

        // 派发异步 action
        dispatch(editUserAsync({
            userId: loginInfo._id,
            newData: editInfo
        }));
        // 模态框显示
        setIsModalOpen(false);


        // 修改密码需要重新登录
        if(passwordInfo.newpassword) {
            message.success("密码修改成功，请重新登录");
            // 清除本地保存的token
            localStorage.removeItem('useToken');
            // 清空用户信息
            dispatch(clearUseInfo);
            // 设置未登录
            dispatch(setIsLogin(false));
            // 跳转到首页
            navigate('/');
        } else {
            message.success("信息修改成功！");
        }
    };

    /**
     * 模态框点击取消时的回调
     */
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // 上传头像
    function handleAvatar(newInfo, key) {

        const newAvatar = { [key]: newInfo };
        // 修改头像
        dispatch(editUserAsync({
            userId: loginInfo._id,
            newData: newAvatar
        }));
        message.success("头像修改成功");
    }

    // 更新要编辑的数据
    function updateInfo(newInfo, key) {
        if (key === 'nickname' && !newInfo) {
            message.error("昵称不能为空");
            return;
        }
        const newUserInfo = { ...editInfo };
        newUserInfo[key] = newInfo.trim();
        setEditInfo(newUserInfo)
    }

    // 更新密码相关数据
    function updatePasswordInfo(newInfo, key) {
        const newPasswordInfo = { ...passwordInfo };
        newPasswordInfo[key] = newInfo.trim();
        setPasswordInfo(newPasswordInfo);
        // 如果是新密码框，更新 editInfo 的内容
        if (key === "newpassword") {
            updateInfo(newInfo, 'loginPwd');
        }
    }

    let modalContent = null;

    /**
     * 验证密码是否正确
     */
    async function checkPassword() {
        if (passwordInfo.oldpassword) {
            const { data } = await checkPasswordApi(loginInfo._id, passwordInfo.oldpassword);
            if (!data) {
                return Promise.reject("密码不正确");
            }
        }
    }

    switch (panelName) {
        case "基本信息": {
            modalContent = (
                <>
                    <Form
                        style={{paddingTop: '20px'}}
                        name="basic1"
                        initialValues={loginInfo}
                        onFinish={handleOk}
                    >
                        <Form.Item>
                            <Alert
                                showIcon
                                message="注意：输入登录密码表示修改密码，如果只修改用户名称密码选项可不填写"
                                type="warning"
                            />
                        </Form.Item>
                        {/* 登录密码 */}
                        <Form.Item
                            label="登录密码"
                            name="oldpassword"
                            rules={[
                                {
                                    validator: checkPassword
                                }
                            ]}
                            validateTrigger='onBlur'
                        >
                            <Input.Password
                                rows={6}
                                value={passwordInfo.oldpassword}
                                placeholder="如果要修改密码，请先输入旧密码"
                                onChange={(e) => updatePasswordInfo(e.target.value, 'oldpassword')}
                            />
                        </Form.Item>

                        {/* 新的登录密码 */}
                        <Form.Item
                            label="新密码"
                            name="newpassword"
                        >
                            <Input.Password
                                rows={6}
                                value={passwordInfo.newpassword}
                                placeholder="请输入新密码"
                                onChange={(e) => updatePasswordInfo(e.target.value, 'newpassword')}
                            />
                        </Form.Item>

                        {/* 确认密码 */}
                        <Form.Item
                            label="确认密码"
                            name="passwordConfirm"
                            rules={[
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newpassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('两次密码不一致'));
                                    },
                                }),
                            ]}
                            validateTrigger='onBlur'
                        >
                            <Input.Password
                                rows={6}
                                placeholder="请确认密码"
                                value={passwordInfo.passwordConfirm}
                                onChange={(e) => updatePasswordInfo(e.target.value, 'passwordConfirm')}
                            />
                        </Form.Item>

                        {/* 用户昵称 */}
                        <Form.Item
                            label="用户昵称"
                            name="nickname"
                        >
                            <Input
                                placeholder="昵称可选，默认为新用户"
                                value={editInfo.nickname}
                                onBlur={(e) => updateInfo(e.target.value, 'nickname')}
                            />
                        </Form.Item>

                        {/* 确认修改按钮 */}
                        <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                确认
                            </Button>

                            <Button type="link" className="resetBtn">
                                重置
                            </Button>
                        </Form.Item>
                    </Form>
                </>

            );
            break;
        }
        case "社交账号": {
            modalContent = (
                <>
                    <Form
                        style={{paddingTop: '20px'}}
                        name="basic2"
                        initialValues={loginInfo}
                        onFinish={handleOk}
                    >
                        <Form.Item
                            label="邮箱"
                            name="mail"
                        >
                            <Input
                                value={loginInfo.mail}
                                placeholder="请填写邮箱"
                                onChange={(e) => updateInfo(e.target.value, 'mail')}
                            />
                        </Form.Item>
                        <Form.Item
                            label="QQ号"
                            name="qq"
                        >
                            <Input
                                value={loginInfo.qq}
                                placeholder="请填写 QQ 号"
                                onChange={(e) => updateInfo(e.target.value, 'qq')}
                            />
                        </Form.Item>
                        <Form.Item
                            label="微信"
                            name="wechat"
                        >
                            <Input
                                value={loginInfo.wechat}
                                placeholder="请填写微信号"
                                onChange={(e) => updateInfo(e.target.value, 'wechat')}
                            />
                        </Form.Item>
                        <Form.Item
                            label="github"
                            name="github"
                        >
                            <Input
                                value={loginInfo.github}
                                placeholder="请填写 github "
                                onChange={(e) => updateInfo(e.target.value, 'github')}
                            />
                        </Form.Item>

                        {/* 确认修改按钮 */}
                        <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                确认
                            </Button>

                            <Button type="link" className="resetBtn">
                                重置
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            );
            break;

        }
        case "个人简介": {
            modalContent = (
                <>
                    <Form
                        style={{paddingTop: '20px'}}
                        name="basic3"
                        initialValues={loginInfo}
                        onFinish={handleOk}
                    >
                        {/* 自我介绍 */}
                        <Form.Item
                            label="自我介绍"
                            name="intro"
                        >
                            <Input.TextArea
                                rows={6}
                                value={loginInfo.intro}
                                placeholder="选填"
                                onChange={(e) => updateInfo(e.target.value, 'intro')}
                            />
                        </Form.Item>

                        {/* 确认修改按钮 */}
                        <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
                            <Button type="primary" htmlType="submit">
                                确认
                            </Button>

                            <Button type="link" className="resetBtn">
                                重置
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            );
            break;
        }
    }


    return (
        <>
            <PageHeader title="个人中心" />
            {/* 信息展示 */}
            <div className={styles.container}>
                <div className={styles.row}>
                    <Card title="基本信息"
                        extra={<div className={styles.edit} onClick={() => showModal("基本信息")}>编辑</div>}
                    >
                        <PersonalInfoItem info={{
                            itemName: "登录账号",
                            itemValue: loginInfo.loginId,
                        }} />
                        <PersonalInfoItem info={{
                            itemName: "账号密码",
                            itemValue: "************",
                        }} />
                        <PersonalInfoItem info={{
                            itemName: "用户昵称",
                            itemValue: loginInfo.nickname,
                        }} />
                        <PersonalInfoItem info={{
                            itemName: "用户积分",
                            itemValue: loginInfo.points,
                        }} />
                        <PersonalInfoItem info={{
                            itemName: "注册时间",
                            itemValue: formatDate(loginInfo.registerDate),
                        }} />
                        <PersonalInfoItem info={{
                            itemName: "上次登录时间",
                            itemValue: formatDate(loginInfo.lastLoginDate),
                        }} />
                        <div style={{ fontWeight: 100, height: 50 }}>当前头像：</div>
                        <Image src={loginInfo.avatar} width={100} />
                        <div style={{ fontWeight: 100, height: 50 }}>上传新头像：</div>
                        <Upload
                            action="/api/upload"
                            listType="picture-card"
                            maxCount={1}
                            onChange={(e) => {
                                if (e.file.status === 'done') {
                                    // 说明上传已经完成
                                    const url = e.file.response.data;
                                    handleAvatar(url, 'avatar');
                                }
                            }}
                        >
                            <PlusOutlined />
                        </Upload>
                    </Card>
                </div>
                <div className={styles.row}>
                    <Card title="社交账号"
                        extra={<div className={styles.edit} onClick={() => showModal("社交账号")}>编辑</div>}
                    >
                        <PersonalInfoItem info={{
                            itemName: "邮箱",
                            itemValue: loginInfo.mail ? loginInfo.mail : "未填写",
                        }} />
                        <PersonalInfoItem info={{
                            itemName: "QQ号",
                            itemValue: loginInfo.qq ? loginInfo.qq : "未填写",
                        }} />
                        <PersonalInfoItem info={{
                            itemName: "微信号",
                            itemValue: loginInfo.wechat ? loginInfo.wechat : "未填写",
                        }} />
                        <PersonalInfoItem info={{
                            itemName: "github",
                            itemValue: loginInfo.github ? loginInfo.github : "未填写",
                        }} />

                    </Card>
                </div>
                <div className={styles.row}>
                    <Card title="个人简介"
                        extra={<div className={styles.edit} onClick={() => showModal("个人简介")}>编辑</div>}
                    >
                        <p className={styles.intro}>
                            {loginInfo.intro ? loginInfo.intro : "未填写"}
                        </p>
                    </Card>
                </div>
            </div>
            {/* 修改信息对话框 */}
            <Modal
                destroyOnClose
                title={panelName}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={false}
            >
                {modalContent}
            </Modal>
        </>
    );
}

export default Personal;