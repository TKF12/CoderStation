import { useRoutes, Navigate } from "react-router-dom";

// jsx
import Issues from '../page/Issues';
import Books from '../page/Books';
import InterViews from '../page/InterViews';
import Blogs from '../page/Blogs';

function Index(props) {
    return useRoutes([
        {
            path: '/',
            element: <Issues />
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
        }
    ])
}

export default Index;