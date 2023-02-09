import {configureStore} from '@reduxjs/toolkit';
import loginSlice from './loginSlice';
import typeSlice from './typeSlice';
import interviewSlice from './interviewSlice';

export default configureStore({
    reducer: {
        user: loginSlice,
        type: typeSlice,
        interview: interviewSlice,
    }
})