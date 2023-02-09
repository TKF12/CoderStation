import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// react-redux
import { Provider } from 'react-redux';

// store
import store from './redux/store';

// router
import { BrowserRouter } from 'react-router-dom';

// antd组件
import { ConfigProvider,message } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';


// 全局css样式
import './index.css';

// 配置提示框
message.config({
  top: 80,
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // redux
  <Provider store={store}>
    {/* 路由 */}
    <BrowserRouter>
      {/* 配置antd中文 */}
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </BrowserRouter>
  </Provider>
  
);

