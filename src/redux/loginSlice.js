import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// api
import { editUserApi } from '../api/userApi';

export const editUserAsync = createAsyncThunk(
    'user/editUser',
    async (val, chunkApi) => {
        await editUserApi(val.userId, val.newData);
        // 更新仓库中数据
        chunkApi.dispatch(updatedUserInfo(val.newData))
    }
)


export const userSlice = createSlice({
    name: 'user',
    initialState: {
        // 是否登录
        isLogin: false,
        // 用户信息
        loginInfo: {},
    },
    reducers: {
        // 修改是否登录
        setIsLogin(state, { payload }) {
            state.isLogin = payload;
        },
        // 添加用户信息
        initUseInfo(state, { payload }) {
            state.loginInfo = payload;
        },
        // 清空用户信息
        clearUseInfo(state, { payload }) {
            state.loginInfo = {};
        },
        // 修改用户数据
        updatedUserInfo(state, { payload }) {
            for (const key in payload) {
                state.loginInfo[key] = payload[key];
            }
        }
    }
});


export const { setIsLogin, initUseInfo, clearUseInfo, updatedUserInfo } = userSlice.actions;
export default userSlice.reducer;