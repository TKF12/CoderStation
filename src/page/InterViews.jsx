import { useEffect, useState } from 'react';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { getTypeList } from '../redux/typeSlice';
import { getInterViewTitleListAsync } from '../redux/interviewSlice';

// api
import { getByIdViewContentApi } from '../api/interviewApi';

// antd
import { Tree, FloatButton } from 'antd';

// jsx
import PageHeader from '../component/PageHeader';

// css
import styles from '../css/Interview.module.css';

function InterViews(props) {

    const dispatch = useDispatch();

    // 左侧区域
    const [treeData, setTreeData] = useState([]);

    // 获取类别
    const { typeList } = useSelector(state => state.type);
    // 标题
    const { interViewTitleList } = useSelector(state => state.interview);

    // 文章
    const [viewContent, setViewContent] = useState(null);

    useEffect(() => {

        // 获取类别
        if(!typeList.length) {
            dispatch(getTypeList());
        }

        // 获取标题
        if(!interViewTitleList.length) {
            dispatch(getInterViewTitleListAsync());
        }


        // 有类型 并且 有标题
        if(typeList.length && interViewTitleList.length) {
            // 类型
            const arr = typeList.map((item, i) => {
                return {
                    title: <h3>{item.typeName}</h3>,
                    key: i,
                }
            });
            // 标题
            for (let i = 0; i < interViewTitleList.length; i++) {
                const child = [];
                for (let j = 0; j < interViewTitleList[i].length; j++) {
                    child.push({
                        title: <h4 onClick={() => clickTitle(interViewTitleList[i][j]._id)}>
                            {interViewTitleList[i][j].interviewTitle}
                        </h4>,
                        key: `${i}-${j}`,
                    })
                }
                arr[i].children = child;
            }
            setTreeData(arr);
        }
        

    }, [typeList, interViewTitleList]);


    // 点击左侧标题 获取文章
    async function clickTitle(val) {
        const result = await getByIdViewContentApi(val);
        setViewContent(result.data);
    }

    // 右侧渲染内容
    let interviewRightSide = null;

    if(viewContent) {
        // 文章内容
        interviewRightSide = (
            <div className={styles.content}>
                {/* 标题 */}
                <h1 className={styles.interviewRightTitle}>{viewContent?.interviewTitle}</h1>
                {/* 内容 */}
                <div className={styles.contentContainer}>
                    <div dangerouslySetInnerHTML={{ __html: viewContent?.interviewContent }}></div>
                </div>
            </div>
        )

    } else {
        interviewRightSide = (
            <div style={{
                textAlign: "center",
                fontSize: "40px",
                fontWeight: "100",
                marginTop: "150px"
            }}>
                请在左侧选择面试题
            </div>
        )
    }

    return (
        <div className={styles.container}> 
            <PageHeader title="面试题大全" />
            <div className={styles.interviewContainer}>
                {/* 左侧 */}
                <div className={styles.leftSide}>
                    <Tree treeData={treeData} />
                </div>
                {/* 右侧 */}
                <div className={styles.rightSide}>
                    {interviewRightSide}
                </div>
            </div>
            <FloatButton.BackTop />
        </div>
    );
}

export default InterViews;