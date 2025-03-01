import React, { useState } from "react";
import { DesktopOutlined, PieChartOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import { Link, Outlet } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
const { Header, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label: <Link to={`/dashboard/${key}`}>{label}</Link>,
  };
}
const items = [
  getItem("user", "user", <DesktopOutlined />),
  getItem("faq", "faq", <DesktopOutlined />),
  getItem("membership", "membership", <DesktopOutlined />),
  getItem("blog", "blog", <DesktopOutlined />),
  //   getItem("User", "sub1", <UserOutlined />, [
  //     getItem("Tom", "3"),
  //     getItem("Bill", "4"),
  //     getItem("Alex", "5"),
  //   ]),
  //   getItem("Team", "sub2", <TeamOutlined />, [
  //     getItem("Team 1", "6"),
  //     getItem("Team 2", "8"),
  //   ]),
  //   getItem("Files", "9", <FileOutlined />),
];
const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
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
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        />
        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <div
            style={{
              padding: 24,
              height: "100%",
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </div>
        </Content>

        <Footer
          style={{
            textAlign: "center",
          }}
        >
        </Footer>
      </Layout>
    </Layout>
  );
};
export default AdminLayout;
