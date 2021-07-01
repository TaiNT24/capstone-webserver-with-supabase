import { Layout, Menu } from "antd";
import {
  UserOutlined,
  LaptopOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useHistory, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ModalConfirmLogout from "./ModalConfirmLogout";

const { Sider } = Layout;

// const { SubMenu } = Menu;

export default function Siderbar() {
  const [selectedItem, setSelectedItem] = useState("/log");
  const [showConfirm, setShowConfirm] = useState(false);

  let location = useLocation();

  useEffect(() => {
    let newPath = location.pathname;

    if (newPath === "/") {
      newPath = "/log";
    }

    // ex: /staff/{id}
    if (newPath.lastIndexOf("/") > 1) {
      newPath = newPath.substring(0, newPath.lastIndexOf("/"));
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

          {/* <SubMenu
            key="manage_staff"
            icon={<UserOutlined />}
            title="Manage Staff"
          > */}
          <Menu.ItemGroup title="Manage Staff">
            <Menu.Item key="/staff" icon={<UserOutlined />}>
              <Link to="/staff">Staff</Link>
            </Menu.Item>
          </Menu.ItemGroup>
          {/* </SubMenu> */}

          {/* <SubMenu
            key="manage_vehicle"
            icon={<UserOutlined />}
            title="Manage Vehicle"
          > */}
          <Menu.ItemGroup title="Manage Vehicle">
          <Menu.Item key="/vehicles">
              <Link to="/vehicles">Vehicles</Link>
            </Menu.Item>
            <Menu.Item key="/canvas">
              <Link to="/canvas">Canvas</Link>
            </Menu.Item>
          </Menu.ItemGroup>
          {/* </SubMenu> */}

          {/* <SubMenu key="my_account" icon={<UserOutlined />} title="My account"> */}
          <Menu.ItemGroup title="My account">
            <Menu.Item key="/about">
              <Link to="/about">About Page</Link>
            </Menu.Item>

            <Menu.Item
              key="/logout"
              onClick={clickLogout}
              icon={<LogoutOutlined />}
            >
              Logout
            </Menu.Item>
          </Menu.ItemGroup>
          {/* </SubMenu> */}
        </Menu>
      </Sider>
      <ModalConfirmLogout
        showConfirm={showConfirm}
        cancleLogout={cancleLogout}
      />
    </>
  );
}
