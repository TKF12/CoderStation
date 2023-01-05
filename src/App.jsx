import {useState} from 'react';

// css
import './css/App.css';

// jsx
import HeaderNav from './component/HeaderNav';
import ContentRoutes from './router/Index';
import PageFooter from './component/PageFooter';
import LoginForm from './component/LoginForm';

// antd
import { Layout } from 'antd';
const { Header, Footer, Content } = Layout;





function App(props) {

  // 登录弹窗是否显示
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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
          <ContentRoutes />
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