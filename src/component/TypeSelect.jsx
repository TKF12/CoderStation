import React from 'react';

import { useEffect, useState } from 'react';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { getTypeList } from '../redux/typeSlice';
import { updatedIssueType, updatedBookType } from '../redux/typeSlice';

// router
import { useLocation } from 'react-router-dom';

// antd
import { Tag } from 'antd';

function TypeSelect(props) {

    const dispatch = useDispatch();

    const location = useLocation();

    // 全部类型
    const { typeList } = useSelector(state => state.type);
    
    const colorArr = ["#108ee9", "#2db7f5", "#f50", "green", "#87d068", "blue", "red", "purple"];

    const [tagetList, setTagetList] = useState([]);

    // 改变当前选中的类型
    function changeTag(val) {
        // 问答类型
        if(location.pathname === '/'){
            dispatch(updatedIssueType(val));
        }
        // 书籍类型
        if(location.pathname === '/books') {
            dispatch(updatedBookType(val));
        }
    }

    useEffect(() => {
        // 没有类型数据，获取
        if(!typeList.length) {
            dispatch(getTypeList());
        }
        // 有类型数据
        if(typeList.length) {
            const arr = typeList.map((item, i) => {
                return (<Tag
                    style={{cursor: 'pointer'}}
                    key={item._id}
                    color={colorArr[i % colorArr.length]}
                    value={item._id}
                    onClick={() => changeTag(item._id)}
                >
                    {item.typeName}
                </Tag>);
            });
            setTagetList([
                (<Tag
                    style={{cursor: 'pointer'}}
                    key='all'
                    color='magenta'
                    value='all'
                    onClick={() => changeTag('all')}
                >
                    全部
                </Tag>),
                ...arr,
            ]);
        }
    }, [typeList]);



    return (
        <div>
            {tagetList}
        </div>
    );
}

export default TypeSelect;