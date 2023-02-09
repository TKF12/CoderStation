import {useState, useEffect} from 'react';

// redux
import { useSelector } from 'react-redux';

// api
import { getIssueApi } from '../api/issueApi';

// antd
import { Pagination, Empty } from 'antd';

// jsx
import PageHeader from '../component/PageHeader';
import IssueItem from '../component/IssueItem';
import AddIssueBtn from '../component/AddIssueBtn';
import Recommend from '../component/Recommend';
import PointsRanking from '../component/PointsRanking';
import TypeSelect from '../component/TypeSelect';


//css
import styles from "../css/Issue.module.css";

function Issues(props) {

    // 问答列表
    const [issueInfo, setIssueInfo] = useState([]);

    const { issueType } = useSelector(state => state.type);

    // 页码信息
    const [pageInfo, setPageInfo] = useState({
        current: 1,
        pageSize: 15,
        total: 0,
    })


    useEffect(() => {

        // 获取问答列表
        async function fetchIssue() {
            // 请求参数
            const fetchParams = {
                current: pageInfo.current,
                pageSize: pageInfo.pageSize,
                issueStatus: true,
            }
            
            // redux中的类型不是全部，请求时添加类型id
            if(issueType !== 'all') {
                fetchParams.typeId = issueType;
                fetchParams.current = 1;
            }
            const {data} = await getIssueApi(fetchParams);
            // 保存问答列表
            setIssueInfo(data.data);
            // 设置页码信息
            setPageInfo({
                current: data.currentPage,
                pageSize: data.eachPage,
                total: data.count,
            })
        }
        fetchIssue();
    }, [pageInfo.current, pageInfo.pageSize, issueType]);

    // 问答列表渲染
    const issueList = issueInfo.map((item, i) => {
        return (
            <IssueItem key={i} itemInfo={item} />
        );
    });

    // 改变页码
    function changePage(current, pageSize) {
        setPageInfo({
            current,
            pageSize,
        })
    }

    return (
        <div className={styles.container}>
            <PageHeader title="问答列表">
                {/* 类型选择 */}
                <TypeSelect />
            </PageHeader>
            {/* 下面的列表内容区域 */}
            <div className={styles.issueContainer}>
                {/* 左边区域 */}
                <div className={styles.leftSide}>
                    {issueList}
                    {/* 暂无数据和分页按钮 */}
                    {
                        issueList.length ? 
                        (<div className="paginationContainer">
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
                        </div>) 
                        :
                        (<Empty
                            description='暂无相关内容'
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />)
                    }
                    
                </div>
                {/* 右边区域 */}
                <div className={styles.rightSide}>
                    {/* 添加问答 */}
                    <AddIssueBtn />
                    {/* 推荐 */}
                    <Recommend />
                    {/* 积分排行 */}
                    <PointsRanking />
                </div>
            </div>
        </div>
    );
}

export default Issues;