import { useRef, useState, useEffect } from 'react';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { getTypeList } from '../redux/typeSlice';

// router
import { useNavigate } from 'react-router-dom';

// api
import { addIssueApi } from '../api/issueApi';

// 富文本
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';


// utils
import {typeOptionCreator} from '../utils/tools';

// antd
import {Form, Input, Select, Button, message} from 'antd';

// css
import styles from '../css/AddIssue.module.css';

function addIssue(props) {

    const formRef = useRef();
    const editorRef = useRef();

    const navigate = useNavigate();

    const dispatch = useDispatch();

    // 获取类型
    const { typeList } = useSelector(store => store.type);
    // 用户信息
    const { loginInfo } = useSelector(store => store.user);

    // 添加相关信息
    const [issueInfo, setIssueInfo] = useState({
        issueTitle: '',
        typeId: '',
        issueContent: '',
        userId: '',
    });

    // 获取类型
    useEffect(() => {
        async function getUserInfo() {
            // 仓库中没有类型时，再获取
            if(!typeList.length) {
                dispatch(getTypeList());
            }
        }
        getUserInfo();

    },[]);


    // 添加问题
    async function addHandle() {
        // 富文本中的内容
        const content = editorRef.current.getInstance().getHTML();
        const result = await addIssueApi({
            issueTitle: issueInfo.issueTitle,
            typeId: issueInfo.typeId,
            issueContent: content,
            userId: loginInfo._id
        });
        if(result.data) {
            message.success('添加成功，审核通过将会进行展示');
            // 跳转到首页
            navigate('/');
        }
    }

    // 改变要提交的选中的类型
    function handleChange(val) {
        updateInfo(val, 'typeId');
    }

    // 改变state中的数据
    function updateInfo(val, key) {
        const newInfo = {...issueInfo};
        newInfo[key] = val;
        setIssueInfo(newInfo);
    }


    // 重置
    function resetForm() {
        // 重置问答信息
        setIssueInfo({
            issueTitle: '',
            typeId: '',
            issueContent: '',
            userId: '',
        });
        // 清空表单
        formRef.current.resetFields();
        // 重置编辑内容
        editorRef.current.getInstance().setHTML('');
    }


    return (
        <div className={styles.container}>
            <Form
                name="basic"
                // initialValues={issueInfo}
                ref={formRef}
                onFinish={addHandle}
            >
                {/* 问答标题 */}
                <Form.Item
                    label="标题"
                    name="issueTitle"
                    rules={[{ required: true, message: '请输入标题' }]}
                >
                    <Input
                        placeholder="请输入标题"
                        size="large"
                        value={issueInfo.issueTitle}
                        onChange={(e) => updateInfo(e.target.value, 'issueTitle')}
                    />
                </Form.Item>

                {/* 问题类型 */}
                <Form.Item
                    label="问题分类"
                    name="typeId"
                    rules={[{ required: true, message: '请选择问题所属分类' }]}
                >
                    <Select
                        style={{ width: 200 }}
                        onChange={handleChange}
                    >
                        {typeOptionCreator(Select, typeList)}
                    </Select>
                </Form.Item>


                {/* 问答内容 */}
                <Form.Item
                    label="问题描述"
                    name="issueContent"
                    rules={[{ required: true, message: '请输入问题描述' }]}
                >
                    <Editor
                        initialValue=""
                        previewStyle="vertical"
                        height="600px"
                        initialEditType="wysiwyg"
                        useCommandShortcut={true}
                        language='zh-CN'
                        ref={editorRef}
                    />
                </Form.Item>


                {/* 确认按钮 */}
                <Form.Item wrapperCol={{ offset: 3, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        确认新增
                    </Button>

                    <Button type="link" onClick={resetForm} className="resetBtn">
                        重置
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default addIssue;