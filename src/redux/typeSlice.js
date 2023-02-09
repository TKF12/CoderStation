import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// api
import { getTypeListApi } from '../api/typeApi';

// 异步方法
export const getTypeList = createAsyncThunk(
    'type/getTypeList',
    async (val, chunkApi) => {
        // 获取类型列表
        const result = await getTypeListApi();
        return result.data
    }
)

export const typeSlice = createSlice({
    name: 'type',
    initialState: {
        typeList: [],
        issueType: 'all',
        bookType: 'all',
    },
    reducers: {
        // 更新当前选中的类型
        updatedIssueType(state, {payload}) {
            state.issueType = payload;
        },
        // 跟新书籍类型
        updatedBookType(state, { payload }) {
            state.bookType = payload;
        }
    },
    extraReducers: (builder) => {
        // 改变仓库里面的数据
        builder.addCase(getTypeList.fulfilled, (state, { payload }) => {
            state.typeList = payload;
        })
    }
});

export const { updatedIssueType, updatedBookType } = typeSlice.actions; 
export default typeSlice.reducer;