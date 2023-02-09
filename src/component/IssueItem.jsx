import {useState, useEffect} from 'react';

// router
import { useNavigate } from 'react-router-dom';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { getTypeList } from '../redux/typeSlice';

// utils
import { formatDate } from '../utils/tools';

// antd
import { Tag } from 'antd'

// api
import { getIdUseApi } from '../api/userApi';

// css
import styles from '../css/IssueItem.module.css';

function IssuseItem(props) {

    const dispatch = useDispatch();

    const navigate = useNavigate();

    // 用户信息
    const [userInfo, setUserInfo] = useState({});

    // 所有类型
    const {typeList} = useSelector((store => store.type));

    // tag颜色
    const colorArr = ["#108ee9", "#2db7f5", "#f50", "green", "#87d068", "blue", "red", "purple"];

    useEffect(() => {

        async function getUserInfo() {
            // 仓库中没有类型时，再获取
            if(!typeList.length) {
                dispatch(getTypeList());
            }

            // 获取用户当前问答用户的信息
            const { data } = await getIdUseApi(props.itemInfo.userId);
            setUserInfo(data);
        }
        getUserInfo();

    },[]);

    // 获取当前类型
    const type = typeList.find(item => {
        return item._id === props.itemInfo.typeId;
    });


    return (
        <div className={styles.container}>
            {/* 回答数 */}
            <div className={styles.issueNum}>
                <div>{props.itemInfo.commentNumber}</div>
                <div>回答</div>
            </div>
            {/* 浏览数 */}
            <div className={styles.issueNum}>
                <div>{props.itemInfo.scanNumber}</div>
                <div>浏览</div>
            </div>
            {/* 问题内容 */}
            <div className={styles.issueContainer}>
                <div className={styles.top} onClick={() => navigate(`/issuesdetail/${props.itemInfo._id}`)}>
                    {props.itemInfo.issueTitle}
                </div>
                <div className={styles.bottom}>
                    <div className={styles.left}>
                        {/* 类型 */}
                        <Tag color={colorArr[typeList.indexOf(type) % colorArr.length]}>{type?.typeName}</Tag>
                    </div>
                    <div className={styles.right}>
                        {/* 用户名称 */}
                        <Tag color="volcano">{userInfo.nickname}</Tag>
                        {/* 发布日期 */}
                        <span>{formatDate(props.itemInfo.issueDate, "year")}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IssuseItem;