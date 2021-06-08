import { Layout, Menu } from "antd";
import { UserOutlined, LaptopOutlined } from "@ant-design/icons";

const { Sider } = Layout;

const { SubMenu } = Menu;

export default function Siderbar() {
  return (
    <Sider
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
      }}
      trigger={null}
      width={250}
    >
      <div className="logo" />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["5"]}
        defaultOpenKeys={["sub2"]}
      >
        <SubMenu key="sub1" icon={<UserOutlined />} title="User">
          <Menu.Item key="1">option1</Menu.Item>
          <Menu.Item key="2">option2</Menu.Item>
          <Menu.Item key="3">option3</Menu.Item>
          <Menu.Item key="4">option4</Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" icon={<LaptopOutlined />} title="Track robot's log">
          <Menu.Item key="5">Track Log</Menu.Item>
          <Menu.Item key="6">option6</Menu.Item>
          <Menu.Item key="7">option7</Menu.Item>
          <Menu.Item key="8">option8</Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  );
}
