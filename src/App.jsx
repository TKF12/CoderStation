import {useState, useEffect} from 'react';

// redux
import { useDispatch } from 'react-redux';
import { setIsLogin, initUseInfo } from './redux/loginSlice';

// api
import { restoreLoginApi, getIdUseApi } from './api/userApi';

// css
import './css/App.css';

// jsx
import HeaderNav from './component/HeaderNav';
import RouteBefore from './router/RouteBefore';
import PageFooter from './component/PageFooter';
import LoginForm from './component/LoginForm';

// antd
import { Layout, message } from 'antd';
const { Header, Footer, Content, } = Layout;



function App(props) {

  const dispatch = useDispatch();

  // 登录弹窗是否显示
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 验证是否已登录
  useEffect(() => {
    async function isLogin() {
      const result = await restoreLoginApi();
      if(result.data) {
        // 根据id获取用户信息
        const res = await getIdUseApi(result.data._id);
        // 设置已登录
        dispatch(setIsLogin(true));
        // 设置用户信息
        dispatch(initUseInfo(res.data));
      } else {
        // 登录错误
        message.warning(result.msg);
        // 删除token
        localStorage.removeItem('useToken');
      }
    }
    // 有token验证是否已登录
    localStorage.getItem('useToken') && isLogin();
  }, []);

  // 打开登录弹窗
  function loginHeader() {
    setIsModalOpen(true);
  }

  // 关闭登录弹窗
  function handleCancel() {
    setIsModalOpen(false);
  }


  return (
    <div className="App">
      <Layout>
        {/* 头部 */}
        <Header className="header">
          <HeaderNav loginHeader={loginHeader} />
        </Header>
        {/* 中间内容区域 */}
        <Content className="content">
          <RouteBefore />
        </Content>
        {/* 底部 */}
        <Footer className="footer">
          <PageFooter />
        </Footer>
        {/* 登录弹窗 */}
        <LoginForm
          isModalOpen={isModalOpen}
          handleCancel={handleCancel}/>
      </Layout>
    </div>
  );
}

export default App;