import { useState, useEffect } from 'react';

// router
import { useParams } from 'react-router-dom';

// antd
import { Avatar } from 'antd';

// utils
import { formatDate } from '../utils/tools';

// api
import { getIdIssueApi, updateIssueApi } from '../api/issueApi';
import { getIdUseApi } from '../api/userApi';

// jsx
import PageHeader from '../component/PageHeader';
import Recommend from '../component/Recommend';
import PointsRanking from '../component/PointsRanking';
import Discuss from '../component/Discuss';

// css
import styles from '../css/IssueDetail.module.css';

function IssueDtail(props) {

    const { id } = useParams();

    // 文章内容
    const [issueInfo, setIssueInfo] = useState({});
    // 发布用户信息
    const [issueUser, setIssueUser] = useState({});


    useEffect(() => {
        async function fetchData() {
            // 获取文章内容
            const { data } = await getIdIssueApi(id);
            setIssueInfo(data);

            // 根据id获取用户信息
            const result = await getIdUseApi(data.userId);
            setIssueUser(result.data);

            // 增加阅读数量
            await updateIssueApi(id, {
                scanNumber: data.scanNumber + 1,
            });
        }
        fetchData();
    }, [id]);

    return (
        <div className={styles.container}>
            <PageHeader title='问答详情' />
            <div className={styles.detailContainer}>
                {/* 左边 */}
                <div className={styles.leftSide}>
                    <div className={styles.question}>
                        {/* 标题 */}
                        <h1>{issueInfo.issueTitle}</h1>
                        {/* 提问人信息：头像、昵称、提问时间 */}
                        <div className={styles.questioner}>
                            <Avatar size="small" src={issueUser.avatar}/>
                            <span className={styles.user}>{issueUser.nickname}</span>
                            <span>发布于：{formatDate(issueInfo.issueDate)}</span>
                        </div>
                        {/* 问题详情 */}
                        <div className={styles.content}>
                            <div dangerouslySetInnerHTML={{ __html: issueInfo.issueContent }}></div>
                        </div>
                    </div>
                    {/* 评论 */}
                    <Discuss type={1} typeId={id} issueInfo={issueInfo} />
                </div>
                <div className={styles.rightSide}>
                    {/* 推荐 */}
                    <Recommend />
                    {/* 积分排行 */}
                    <PointsRanking />
                </div>
            </div>
        </div>
    );
}

export default IssueDtail;