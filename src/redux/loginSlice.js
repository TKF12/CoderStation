import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        // 是否登录
        isLogin: false,
        // 用户信息
        loginInfo: null,
    },
    reducers: {
        // 修改是否登录
        setIsLogin(state, { payload }) {
            state.isLogin = payload;
        },
        // 添加用户信息
        initUseInfo(state, { payload }) {
            state.loginInfo = payload;
        }
    }
});


export const { setIsLogin, initUseInfo } = userSlice.actions;
export default userSlice.reducer;