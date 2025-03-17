import React, { useState, useEffect } from "react";
import { 
  UserOutlined, 
  QuestionCircleOutlined, 
  GiftOutlined, 
  FileTextOutlined,
  ShoppingOutlined,
  CommentOutlined,
  LogoutOutlined,
  HeartOutlined,  // Thay thế BabyOutlined bằng HeartOutlined
  // Hoặc có thể dùng SmileOutlined
} from "@ant-design/icons";
import { Layout, Menu, theme, Button, message, Avatar, Typography } from "antd";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { Content } from "antd/es/layout/layout";

const { Header, Footer, Sider } = Layout;
const { Title } = Typography;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={`/dashboard/${key}`}>{label}</Link>,  };
}

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState("user");
  
  const {
    token: { colorBgContainer, colorPrimary },
  } = theme.useToken();

  // Xác định menu item active dựa trên URL
  useEffect(() => {
    const path = location.pathname.split('/');
    const currentSection = path[path.length - 1];
    if (currentSection && currentSection !== 'dashboard') {
      setActiveKey(currentSection);
    }
  }, [location]);

  // Các mục menu liên quan đến quản lý thai kỳ
  const items = [
    getItem("Quản lý người dùng", "user", <UserOutlined />),
    getItem("Gói thành viên", "membership", <GiftOutlined />),
    getItem("Bài viết", "blog", <FileTextOutlined />),
    getItem("Câu hỏi thường gặp", "faq", <QuestionCircleOutlined />),
    getItem("Đơn hàng", "order", <ShoppingOutlined />),
    getItem("Quản lý bình luận", "comment", <CommentOutlined />),
  ];

  // Hàm xử lý logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    message.success('Đăng xuất thành công!');
    navigate('/login');
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ 
          background: '#fff'  // Nền trắng cho thanh bên
        }}
      >
        <div 
          style={{ 
            padding: '16px', 
            textAlign: 'center',
            borderBottom: '1px solid #f0f0f0',
            marginBottom: '16px',
            background: '#fafafa'
          }}
        >
          {collapsed ? (
            <Avatar 
              icon={<HeartOutlined />}  // Thay thế BabyOutlined
              style={{ backgroundColor: '#ff85a2', color: '#fff' }} 
              size="large"
            />
          ) : (
            <div>
              <Avatar 
                icon={<HeartOutlined />}  // Thay thế BabyOutlined
                style={{ backgroundColor: '#ff85a2', color: '#fff' }} 
                size="large"
              />
              <Title level={5} style={{ marginTop: 10, color: '#ff85a2' }}>
                Baby & Mom Admin
              </Title>
            </div>
          )}
        </div>
        
        <Menu
          theme="light"
          selectedKeys={[activeKey]}
          mode="inline"
          items={items}
          style={{ 
            borderRight: 0
          }}
        />
      </Sider>
      
      <Layout>
        <Header
          style={{
            padding: 0,
            background: '#fff',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: 24,
            paddingLeft: 24
          }}
        >
          <div>
            <Title level={4} style={{ margin: 0, color: '#ff85a2' }}>
              {items.find(item => item.key === activeKey)?.label || 'Dashboard'}
            </Title>
          </div>
          
          <Button 
            type="primary" 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
            style={{ 
              backgroundColor: '#ff85a2', 
              borderColor: '#ff85a2'
            }}
          >
            Đăng xuất
          </Button>
        </Header>
        
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: colorBgContainer,
            borderRadius: 8,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}
        >
          <Outlet />
        </Content>

        <Footer
          style={{
            textAlign: "center",
            background: '#fafafa',
            color: '#666'
          }}
        >
          Baby & Mom Admin - Hệ thống quản lý theo dõi thai kỳ © {new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
