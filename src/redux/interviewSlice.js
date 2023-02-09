import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getInterViewTitleListApi } from '../api/interviewApi';


export const getInterViewTitleListAsync = createAsyncThunk(
    'interview/getInterViewTitleListAsync',
    async (_, chunkApi) => {
        // 获取所有分类对应的面试题标题
        const result = await getInterViewTitleListApi();
        chunkApi.dispatch(initInterViewTitleList(result.data));
    }
)


export const interviewSlice = createSlice({
    name: 'interview',
    initialState: {
        // 标题
        interViewTitleList: [],
    },
    reducers: {
        initInterViewTitleList(state, { payload }) {
            state.interViewTitleList = payload;
        }
    }
})


export const { initInterViewTitleList } = interviewSlice.actions;
export default interviewSlice.reducer; 