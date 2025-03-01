import React from 'react';
import { Layout, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import Header from '../Header/HeaderU';
import Footer from '../Footer/Footer';

const { Content } = Layout;

const MainLayout = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Header 
        style={{
          padding: 0,
          background: colorBgContainer,
        }}
      />

      <Content style={{
        margin: '0 16px',
      }}>
        <div style={{
          padding: 24,
          height: '100%',
          minHeight: 360,
          background: colorBgContainer,
        }}>
          <Outlet />
        </div>
      </Content>

      <Footer 
        style={{
          textAlign: 'center',
          marginTop: 'auto'
        }}
      />
    </Layout>
  );
};

export default MainLayout; 