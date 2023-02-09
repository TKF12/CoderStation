import { useRoutes, Navigate } from "react-router-dom";

// jsx
import Issue from '../page/Issue';
import Books from '../page/Books';
import InterViews from '../page/InterViews';
import Blogs from '../page/Blogs';
import AddIssue from "../page/AddIssue";
import IssueDetail from "../page/IssueDetail";
import SearchPage from "../page/SearchPage";
import BookDetail from '../page/BookDetail';
import Personal from '../page/Personal';
import Error from '../page/Error';

function Index(props) {
    return useRoutes([
        {
            path: '/',
            element: <Issue />
        },
        {
            path: '/books',
            element: <Books />
        },
        {
            path: '/interviews',
            element: <InterViews />
        },
        {
            path: '/blogs',
            element: <Blogs />
        },
        {
            path: '/addissue',
            element: <AddIssue />
        },
        {
            path: '/issuesdetail/:id',
            element: <IssueDetail />
        },
        {
            path: '/searchpage',
            element: <SearchPage />
        },
        {
            path: '/bookdetail/:id',
            element: <BookDetail />
        },
        {
            path: '/personal',
            element: <Personal />
        },
        {
            path: '*',
            element: <Error />
        }
    ])
}

export default Index;