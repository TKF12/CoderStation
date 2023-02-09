import React from 'react';

// jsx
import IssuseItem from './IssueItem';
import BookItem from './BookItem';

function SearchResultItem(props) {

    return (
        <div style={!props.info.issueTitle ? {flexGrow: 1} : {}}>
            {
                props.info.issueTitle
                ?
                <IssuseItem itemInfo={props.info} />
                :
                <BookItem info={props.info} />
            }
        </div>
    );
}

export default SearchResultItem;