import React from 'react';

// css
import styles from '../css/PageHeader.module.css'

function PageHeader(props) {
    return (
        <div className={styles.row}>
            {/* 问答列表 */}
            <div className={styles.pageHeader}>
                {props.title}
            </div>
            {/* 类型区域 */}
            {props.children}
        </div>
    );
}

export default PageHeader;