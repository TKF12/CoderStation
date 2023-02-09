import { useEffect, useState } from 'react';

// router
import { useLocation } from 'react-router-dom';

// jsx
import PageHeader from '../component/PageHeader';
import SearchResultItem from '../component/SearchResultItem';
import Recommend from '../component/Recommend';
import PointsRanking from '../component/PointsRanking';

// antd
import { Empty, Pagination } from 'antd';

// api
import { getIssueApi } from '../api/issueApi';
import { getBookListApi } from '../api/bookApi';

// css
import styles from '../css/SearchPage.module.css';


function SearchPage(props) {

    const location = useLocation();

    // 页码信息
    const [pageInfo, setPageInfo] = useState({
        current: 1,
        pageSize: 15,
        total: 0,
    });

    // 搜索到的数据
    const [issueSearchList, setIssueSearchList] = useState([]);


    useEffect(() => {
        async function fetchData() {
            // 获取输入框传递的内容
            const { inputText, selectContent } = location.state;
            
            // 请求参数
            const searchParams = {
                current: pageInfo.current,
                pageSize: pageInfo.pageSize,
            }

            switch(selectContent) {
                // 获取文档列表
                case 'issue': {
                    searchParams.issueStatus = true;
                    // 添加搜索的内容
                    searchParams.issueTitle = inputText;
                    const {data} = await getIssueApi(searchParams);
                    // 更新页码数据
                    setPageInfo({
                        current: data.currentPage,
                        pageSize: data.eachPage,
                        total: data.count,
                    });
                    setIssueSearchList(data.data);
                    break;
                }
                case 'books': {
                    searchParams.bookTitle = inputText;
                    const { data } = await getBookListApi(searchParams);
                    // 更新页码数据
                    setPageInfo({
                        current: data.currentPage,
                        pageSize: data.eachPage,
                        total: data.count,
                    });
                    setIssueSearchList(data.data);
                    break;
                }
            }
        }

        if(location.state) {
            fetchData();
        }

    }, [location.state, pageInfo.current, pageInfo.pageSize]);



    // 改变页码
    function changePage(current, pageSize) {
        setPageInfo({
            current,
            pageSize,
        })
    }

    

    return (
        <div className="container">
            <PageHeader title="搜索结果" />
            <div className={styles.searchPageContainer}>
                {/* 左边区域 */}
                <div className={[
                    styles.leftSide,
                    location.state.selectContent === 'books'
                    ? 
                    styles.bookList
                    :
                    ''
                ].join(' ')}>
                    {
                        // 渲染搜索到的内容
                        issueSearchList.map(item => {
                            return <SearchResultItem
                                        info={item}
                                        key={item._id}
                                        type={location.state.selectContent}
                                    />
                        })
                    }
                    {/* 暂无数据和分页按钮 */}
                    {
                        issueSearchList.length ? 
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
                            style={{margin: '0 auto'}}
                            description='暂无相关内容'
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />)
                    }
                    
                </div>
                {/* 右边区域 */}
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

export default SearchPage;