import { Layout, Menu } from "antd";
import {
  UserOutlined,
  LaptopOutlined,
  LogoutOutlined,
  HistoryOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ModalConfirmLogout from "./ModalConfirmLogout";
import VehicleIcon from "../lib/custome-icon/VehicleIcon";
import { MainTitle } from "../utils/Text";

const { Sider } = Layout;

export default function Siderbar(props) {
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
    // eslint-disable-next-line
  }, [location.pathname]); //netlify suggess

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
        <MainTitle value={"Welcome"} level={4} style={{color: "white"}}/>
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

          <Menu.ItemGroup title="Manage Staff">
            <Menu.Item key="/staff" icon={<UserOutlined />}>
              <Link to="/staff">Staff</Link>
            </Menu.Item>
          </Menu.ItemGroup>

          <Menu.ItemGroup title="Manage Vehicle">
            <Menu.Item key="/vehicles" icon={<VehicleIcon />}>
              <Link to="/vehicles">Vehicles</Link>
            </Menu.Item>
          </Menu.ItemGroup>

          <Menu.ItemGroup title="Tasks">
            <Menu.Item key="/tasks" icon={<HistoryOutlined />}>
              <Link to="/tasks">History Tasks</Link>
            </Menu.Item>
          </Menu.ItemGroup>

          <Menu.ItemGroup title="My account" >
            <Menu.Item key="/about" icon={<UserOutlined />}>
              <Link to="/about">My Profile</Link>
            </Menu.Item>

            <Menu.Item
              key="/logout"
              onClick={clickLogout}
              icon={<LogoutOutlined />}
            >
              Logout
            </Menu.Item>
          </Menu.ItemGroup>
        </Menu>
      </Sider>
      <ModalConfirmLogout
        showConfirm={showConfirm}
        cancleLogout={cancleLogout}
      />
    </>
  );
}
