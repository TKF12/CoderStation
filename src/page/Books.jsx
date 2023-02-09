import { useEffect, useState } from 'react';

// css
import styles from '../css/Books.module.css';

// redux
import { useSelector } from 'react-redux';

// antd
import {Empty, Pagination} from 'antd';

// jsx
import PageHeader from '../component/PageHeader';
import TypeSelect from '../component/TypeSelect';
import BookItem from '../component/BookItem';

// api
import {getBookListApi} from '../api/bookApi'; 

function Books(props) {


    // 获取书籍类型
    const {bookType} = useSelector(state => state.type);
    

    // 页码信息
    const [pageInfo, setPageInfo] = useState({
        current: 1,
        pageSize: 15,
        total: 0,
    });

    // 书籍数据
    const [bookList, setBookList] = useState([]);

    useEffect(() => {
        async function fetchData() {

            // 请求配置
            const fetchParams = {
                current: pageInfo.current,
                pageSize: pageInfo.pageSize,
            }
            
            // redux中的类型不是全部，请求时添加类型id
            if(bookType !== 'all') {
                fetchParams.typeId = bookType;
                fetchParams.current = 1;
            }

            // 获取书籍数据
            const {data} = await getBookListApi(fetchParams);
            setBookList(data.data);
            // 更新页码数据
            setPageInfo({
                current: data.currentPage,
                pageSize: data.eachPage,
                total: data.count,
            })
        }
        fetchData();
    }, [pageInfo.current, pageInfo.pageSize, bookType]);

    // 改变页码
    function changePage(current, pageSize) {
        setPageInfo({
            current,
            pageSize,
        })
    }

    // 组装列表
    const bookListCard = bookList.map((item) => {
        return (
            <BookItem
                info={item}
                key={item._id}
            />
        )
    });

    const occupyList = []; 

    // 当一行数量不够时，补div
    if(bookList.length) {
        if(bookList.length % 5 !== 0) {
            const len = 5 - (bookList.length % 5);
            for (let i = 0; i < len; i++) {
                occupyList.push(
                    <div key={i}
                        style={{
                            width: '200px',
                            marginBottom: '30px'
                        }}
                    ></div>);
            }
        }
    }
    

    return (
        <div>
            <PageHeader title='最新资源'>
                <TypeSelect />
            </PageHeader>
            <div className={styles.bookContainer}>
                {bookListCard}
                {occupyList}
                {
                    bookList.length ?
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
                    (
                    <div style={{margin: '0 auto'}}>
                        <Empty
                            description='暂无相关内容'
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        />
                    </div>
                    )
                }
            </div>
        </div>
    );
}

export default Books;