import {useState} from 'react';

import classNames from 'classnames';

// antd
import { Avatar } from 'antd';

// css
import styles from '../css/PointsRankingItem.module.css'

function PointsRankingItem(props) {

    // 字体图标css名称
    const [classNameList] = useState({
        iconfont: true,
        'icon-jiangbei': true,
    });

    
    // 根据不同的数字渲染不同的样式
    function matching(number) {
        let contentItem;
        switch(number) {
            // 第一名
            case 1: {
                contentItem = (
                    <div 
                        style={{
                            color: '#ffda23',
                            fontSize: '20px'
                        }}
                        className={`${classNames(classNameList)} ${styles.num}`}>
                    </div>
                );
                break;
            }
            // 第二名
            case 2: {
                contentItem = (
                    <div 
                        style={{
                            color: '#c5c5c5',
                            fontSize: '20px'
                        }}
                        className={classNames(classNameList)}>
                    </div>
                );
                break;
            }
            // 第三名
            case 3: {
                contentItem = (
                    <div 
                        style={{
                            color: '#cd9a62',
                            fontSize: '20px'
                        }}
                        className={classNames(classNameList)}>
                    </div>
                );
                break;
            }
            // 默认显示数字
            default: {
                contentItem = (
                    <div style={{
                            fontSize: '20px'
                        }}
                        className={styles.num}
                    >
                        {number}
                    </div>
                );
            }
        }
        return contentItem;
    }

    const Trophy = matching(props.rNum);


    return (
        <div className={styles.container}>
            <div className={styles.left}>
                {Trophy}
                <div className={styles.avatar}>
                    <Avatar
                        size="small"
                        src={props.itemInfo.avatar}
                        title={props.itemInfo.nickname}
                    />
                </div>
                {/* 用户名 */}
                <div className={styles.nickname}>
                    <a href="#"
                        onClick={(e) => e.preventDefault()}
                        title={props.itemInfo.nickname}
                    >
                        {props.itemInfo.nickname}
                    </a>
                </div>
            </div>
            
            <div className={styles.right}>
                {props.itemInfo.points}
            </div>
        </div>
    );
}

export default PointsRankingItem;