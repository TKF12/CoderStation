import React from 'react';

// router
import { useNavigate } from 'react-router-dom';

// css
import styles from '../css/BookItem.module.css'

// antd
import {Card} from 'antd';

function BookItem(props) {

    const navigate = useNavigate();

    return (
        <Card
            onClick={() => navigate(`/bookdetail/${props.info._id}`)}
            className={styles['book-item-container']}
            hoverable
            cover={<img className={styles['book-img']} alt="example" src={props.info.bookPic} />}
        >
            <Card.Meta
                title={props.info.bookTitle}
                description={
                    <div className={styles['book-item-info']}>
                        <div>
                            浏览数：
                            {props.info.scanNumber}
                        </div>
                        <div>
                            评论数：
                            {props.info.commentNumber}
                        </div>
                    </div>
                } />
        </Card>
    );
}

export default BookItem;