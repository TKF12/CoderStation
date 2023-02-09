import React from 'react';

// router
import { useNavigate } from 'react-router-dom';

// css
import styles from '../css/Error.module.css';

function Error(props) {

    const navigate = useNavigate();

    // 跳转到首页
    function jumpHander() {
        navigate('/');
    }

    return (
        <div className={styles.Nopage} onClick={jumpHander}>
            <h1 className={styles.nopageTitle}>404</h1>
            <p className={styles.nopageContent}>页面不存在，点击回到首页</p>
        </div>
    );
}

export default Error;