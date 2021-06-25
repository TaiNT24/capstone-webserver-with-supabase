import { Layout, Menu, Button } from "antd";
import { UserOutlined, LaptopOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/use-auth";
import { useHistory, useLocation } from "react-router-dom";
import routes from "../pages/routes";
import { useEffect, useState } from "react";
import ModalConfirmLogout from "./ModalConfirmLogout";

const { Sider } = Layout;

const { SubMenu } = Menu;

export default function Siderbar() {
  const [selectedItem, setSelectedItem] = useState("/log");
  const [showConfirm, setShowConfirm] = useState(false);

  let history = useHistory();
  let location = useLocation();

  useEffect(() => {
    let newPath = location.pathname;
    history;
    if (newPath === "/") {
      newPath = "/log";
    }
    setSelectedItem(newPath);
    console.log("selectedItem: " + selectedItem);
  });

  const clickLogout = () => {
    setShowConfirm(true);
  };

  const cancleLogout = () => {
    setShowConfirm(false);
  };

  return (
    <>
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
          // defaultSelectedKeys={selectedItem}
          // defaultOpenKeys={selectedGroup}
          selectedKeys={selectedItem}
        >
          <Menu.Item icon={<LaptopOutlined />} key="/log">
            <Link to="/log">Track vehicle's log</Link>
          </Menu.Item>

          <SubMenu
            key="manage_staff"
            icon={<UserOutlined />}
            title="Manage Staff"
          >
            <Menu.Item key="1">option1</Menu.Item>
          </SubMenu>

          <SubMenu
            key="manage_vehicle"
            icon={<UserOutlined />}
            title="Manage Vehicle"
          >
            <Menu.Item key="2">option2</Menu.Item>
          </SubMenu>

          <SubMenu key="my_account" icon={<UserOutlined />} title="My account">
            <Menu.Item key="/about">
              <Link to="/about">About Page</Link>
            </Menu.Item>
            <Menu.Item key="/logout" onClick={clickLogout}>
              Logout
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <ModalConfirmLogout showConfirm={showConfirm} cancleLogout={cancleLogout}/>
    </>
  );
}
