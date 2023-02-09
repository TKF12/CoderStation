
import { useRef, useEffect, useState } from 'react';

// 富文本
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { editUserAsync } from '../redux/loginSlice';

// api
import { getCommentApi, addCommentApi } from '../api/commentApi';
import { getIdUseApi } from '../api/userApi';
import { updateIssueApi } from '../api/issueApi';
import { getBookCommentApi, editBookApi } from '../api/bookApi';

// utils
import { formatDate } from '../utils/tools';

// antd
import { List, Avatar, Button, message, Pagination, Input } from 'antd';

// icon
import { UserOutlined } from '@ant-design/icons';

// css
import styles from '../css/Discuss.module.css';


function Discuss(props) {

    const dispatch = useDispatch();

    const editorRef = useRef();
    // 用户信息
    const { isLogin, loginInfo } = useSelector((state) => state.user);
    // 评论数据
    const [commentList, setCommentList] = useState([]);

    // 是否显示暂无评论
    const [isCommentLen, setIsCommentLen] = useState(false); 

    // 是否获取最新评论
    const [commentListKey, setCommentListKey] = useState(false);

    // 书籍评论框内容
    const [textInput, changeTextInput] = useState('');


    // 页码信息
    const [pageInfo, setPageInfo] = useState({
        current: 1,
        pageSize: 15,
        total: 0,
    });

    useEffect(() => {

        let user = null;
        async function fetchData() {
            // 获取评论数据，type===1表示获取问答数据，type===2表示获取书籍评论
            if(props.type === 1) {
                const {data} = await getCommentApi(props.typeId, {
                    current: pageInfo.current,
                    pageSize: pageInfo.pageSize,
                });
                user = data;
                // 没有评论显示暂无评论
                data.count === 0 && setIsCommentLen(true);

            } else if(props.type === 2) {
                // 获取书籍评论
                const {data} = await getBookCommentApi(props.typeId, {
                    current: pageInfo.current,
                    pageSize: pageInfo.pageSize,
                });
                user = data;
                // 没有评论显示暂无评论
                data.count === 0 && setIsCommentLen(true);
            }
            // 获取评论用户信息，并且将用户信息添加到评论数据中
            for (let i = 0; i < user.data.length; i++) {
                // 获取用户信息
                const result = await getIdUseApi(user.data[i].userId);
                user.data[i].userInfo = result.data;
            }

            // 更新评论数据
            setCommentList(user.data);

            // 更新分页数据
            setPageInfo({
                current: user.currentPage,
                pageSize: user.eachPage,
                total: user.count,
            });

        }
        fetchData();

    }, [props.typeId, commentListKey, pageInfo.current, pageInfo.pageSize]);


    // 提交
    async function submitComment(e) {
        e.preventDefault();
        // 获取输入框中内容
        let contentHtml;

        // 问答评论积分加4 书籍评论加2
        const pointNumber = props.type === 1 ? 4 : 2;


        // type === 1表示添加问答评论，type === 2表示书籍评论
        if(props.type === 1) {
            contentHtml = editorRef.current.getInstance().getHTML();
            if(contentHtml === '<p><br></p>') {
                contentHtml = '';
            }
        } else if(props.type === 2) {
            contentHtml = textInput;
        }

        // 没有输入评论内容
        if(!contentHtml) {
            message.warning('请输入评论内容！');
            return;
        }

        // 提交评论
        const {data} = await addCommentApi({
            userId: loginInfo._id,
            typeId: props.issueInfo ? props.issueInfo.typeId : props.bookInfo.typeId,
            commentContent: contentHtml,
            commentType: props.type,
            bookId: props.bookInfo?._id,
            issueId: props.issueInfo?._id,
        });
        
        // 获取最新评论数据
        setCommentListKey(!commentListKey);

        if(props.type === 1) {
            // 更新问答评论数量
            await updateIssueApi(props.typeId, {
                commentNumber: ++props.issueInfo.commentNumber,
            });
            // 清空评论输入框
            editorRef.current.getInstance().setHTML('');
            // 更新问答积分数据
            dispatch(editUserAsync({
                userId: loginInfo._id,
                newData: {
                    points: loginInfo.points + pointNumber,
                }
            }));
        } else {
            // 更新书籍评论数量
            await editBookApi(props.typeId, {
                commentNumber: ++props.bookInfo.commentNumber
            })
            // 更新书籍积分
            dispatch(editUserAsync({
                userId: loginInfo._id,
                newData: {
                    points: loginInfo.points + pointNumber,
                }
            }));
            // 清空评论输入框
            changeTextInput('');
        }
        message.success(`评论成功，积分+${pointNumber}`);
        
    }
    // 改变页码
    function changePage(current, pageSize) {
        setPageInfo({
            current,
            pageSize,
        })
    }


    return (

        <div>
            <div className={styles.commentInput}>
                {/* 头像 */}
                <Avatar icon={<UserOutlined />} src={loginInfo?.avatar} />
                {
                    props.type === 1 ?
                    // 问答区域
                    (<div style={{width: '709px', marginLeft: '15px'}}>
                        <Editor
                            initialValue=""
                            previewStyle="vertical"
                            height="270px"
                            initialEditType="wysiwyg"
                            useCommandShortcut={true}
                            initialFrameWidth='200px'
                            language='zh-CN'
                            ref={editorRef}
                            className="editor"/>
                        <Button
                            size="middle"
                            type='primary'
                            style={{marginTop: '15px'}}
                            disabled={isLogin ? false : true}
                            onClick={submitComment}
                        >
                            提交评论
                        </Button>
                    </div>)
                    :
                    // 书籍区域
                    (   
                        <div style={{flexGrow: 1, marginLeft: '15px'}}>
                            <Input.TextArea
                                value={textInput}
                                onChange={(e) => changeTextInput(e.target.value)}
                                rows={4}
                                placeholder={isLogin ? "" : "请登录后评论..."}
                            >
                            </Input.TextArea>
                            <Button
                                size="middle"
                                type='primary'
                                style={{marginTop: '15px'}}
                                disabled={isLogin ? false : true}
                                onClick={submitComment}
                            >
                                提交评论
                            </Button>
                        </div>
                    )
                }
                
            </div>
            {/* 评论列表 */}
            <div className={styles.commentSection}>
                <div className={styles.commentTitle}>
                    评论
                </div>
                <List
                    itemLayout="vertical"
                    size="large"
                    dataSource={commentList}
                    locale={{emptyText: isCommentLen ? '暂无评论' : false}}
                    loading={!isCommentLen && !commentList.length}
                    renderItem={(item) => (
                        <List.Item
                            key={item._id}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        icon={<UserOutlined />}
                                        src={item.userInfo?.avatar}
                                    />
                                }
                                title={
                                    <div>
                                        <div>{item.userInfo?.nickname}</div>
                                        <div className={styles['comment-list-title']}>
                                            {formatDate(item.commentDate, 'year-time')}
                                        </div>
                                    </div>
                                }
                            />
                            {/* 用户评论 */}
                            <div
                                dangerouslySetInnerHTML={{ __html: item.commentContent }}
                            ></div>
                        </List.Item>
                    )}
                ></List>
                {/* 页码 */}
                {
                    !!commentList.length && (
                        <div
                            style={{padding: '20px 0px'}}
                            className={styles['comment-page']}>
                            <Pagination
                                defaultCurrent={1}
                                {...pageInfo}
                                onChange={changePage}
                                showSizeChanger
                            />
                            <div className="pageTotal">
                                {
                                    pageInfo.total
                                    ? 
                                    `共${Math.ceil(pageInfo.total / pageInfo.pageSize)}页`
                                    :
                                    null
                                }
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default Discuss;