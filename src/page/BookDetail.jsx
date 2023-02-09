import { useEffect, useState } from 'react';

// redux
import { updatedUserInfo } from '../redux/loginSlice';
import { useSelector, useDispatch } from 'react-redux';

// router
import { useParams } from 'react-router-dom';

// antd
import { Image, message, Modal } from 'antd';

// css
import styles from '../css/BookDetail.module.css';

// api
import { getByIdBookDetailApi, editBookApi } from '../api/bookApi';
import { editUserApi } from '../api/userApi';

// jsx
import PageHeader from '../component/PageHeader';
import Discuss from '../component/Discuss';

function BookDetail(props) {

    const { id } = useParams();

    const dispatch = useDispatch();

    // 登录状态
    const { isLogin, loginInfo } = useSelector((state) => state.user);

    // 是否下载弹窗
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 书籍信息
    const [bookInfo, setBookInfo] = useState({});


    useEffect(() => {
        async function fetchData() {
            // 根据id获取书籍
            const { data } = await getByIdBookDetailApi(id);
            
            // 修改浏览数
            await editBookApi(id, {
                scanNumber: data.scanNumber + 1,
            });
            setBookInfo(data);
        }
        fetchData();
    }, [id]);

    // 显示下载是否下载弹窗
    function showModal() {
        setIsModalOpen(true);
    }

    // 关闭是否下载弹窗
    function handleCancel() {
        setIsModalOpen(false);
    }


    // 点击确定
    async function handleOk() {
        if(loginInfo.points - bookInfo.requirePoints < 0) {
            message.warning('积分不足');
        } else {
            // 更新积分
            await editUserApi(loginInfo._id, {
                points: loginInfo.points - bookInfo.requirePoints,
            });
            // 更新本地积分
            dispatch(updatedUserInfo({
                points: loginInfo.points - bookInfo.requirePoints
            }));
            message.success("积分已扣除");
            // 打开新页面
            window.open(`${bookInfo.downloadLink}`)
            // 关闭，是否下载弹窗
            setIsModalOpen(false);
        }
    }

    return (
        <div>
            <PageHeader title='书籍详情' />
            <div className={styles.bookInfoContainer}>
                {/* 左侧 */}
                <div className={styles.leftSide}>
                    <div className={styles.img}>
                        <Image height={350} src={bookInfo.bookPic}></Image>
                    </div>
                    <div className={styles.link}>
                        <span>
                            下载需要积分：
                            <span className={styles.requirePoints}>
                                {bookInfo.requirePoints}
                            </span>
                        </span>
                        {
                            isLogin ? 
                            (<div className={styles.downloadLink} onClick={showModal}>
                                百度云下载地址
                            </div>)
                            :
                            null
                        }
                    </div>
                </div>
                {/* 右侧 */}
                <div className={styles.rightSide}>
                    <h1 className={styles.title}>{bookInfo?.bookTitle}</h1>
                    <div dangerouslySetInnerHTML={{ __html: bookInfo?.bookIntro }}></div>
                </div>
            </div>
            <div className={styles.comment}>
                <Discuss type={2} typeId={id} bookInfo={bookInfo} />
            </div>
            <Modal
                title="重要提示"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>是否使用 
                    <span
                        className={styles.requirePoints}
                    >
                        {bookInfo?.requirePoints}
                    </span>
                    积分下载此书籍？
                </p>
            </Modal>
        </div>
    );
}

export default BookDetail;