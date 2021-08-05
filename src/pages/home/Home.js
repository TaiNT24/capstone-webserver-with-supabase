import { Layout, notification } from "antd";
import Sidebar from "../../component/Siderbar";
import Content from "../../component/Content";
import { useAuth } from "../../lib/use-auth";
import { useStoreGetDevice } from "../../lib/Store";
import { useEffect, useState } from "react";
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  StopOutlined,
} from "@ant-design/icons";

const authPath = "/login";
let account = null;

export default function Home(props) {
  const [devicesList, setDevicesList] = useState(null);
  let auth = useAuth();
  let authed = auth.isLogin();

  if (auth.user) {
    // auth.fetchUser(auth.user.id).then((data) => {
    //   account = data[0];
    // });
  }

  const { devices } = useStoreGetDevice();

  const extraProps = {
    devices: devices,
    user: account,
  };

  const height = () => {
    var element = document.getElementsByTagName("BODY")[0];
    var positionInfo = element.getBoundingClientRect();
    var height = positionInfo.height;
    return height;
  };

  const openNotification = (type, msgTitle, icon) => {
    notification[type]({
      message: msgTitle,
      icon: icon,
      duration: 3,
    });
  };

  useEffect(() => {
    if (
      devicesList === null &&
      devices !== null &&
      devicesList !== undefined &&
      devices !== undefined
    ) {
      setDevicesList(devices);
    } else if (devicesList !== null && devicesList !== undefined) {
      devicesList.forEach((device) => {
        let device_change = devices.filter((d) => d.id === device.id)[0];

        if (device_change !== undefined) {
          if (device_change.status !== device.status) {
            let codeVehicle = device_change.code;
            let icon;
            switch (device_change.status) {
              case 0:
                icon = <CloseCircleOutlined style={{ color: "#cd201f" }} />;
                openNotification(
                  "error",
                  `Status of vehicle ${codeVehicle} is disconnected`,
                  icon
                );
                break;
              case 1:
                icon = <CheckCircleOutlined style={{ color: "#87d068" }} />;
                openNotification(
                  "success",
                  `Status of vehicle ${codeVehicle} is available`,
                  icon
                );

                break;
              case 2:
                icon = <SyncOutlined spin style={{ color: "#108ee9" }} />;

                openNotification(
                  "info",
                  `Status of vehicle ${codeVehicle} is running`,
                  icon
                );

                break;

              case 3:
                icon = <StopOutlined style={{ color: "#f50" }} />;

                openNotification(
                  "warning",
                  `Status of vehicle ${codeVehicle} is stop`,
                  icon
                );

                break;
              case 4:
                icon = <WarningOutlined style={{ color: "#f50" }} />;

                openNotification(
                  "warning",
                  `Status of vehicle ${codeVehicle} is error stop`,
                  icon
                );

                break;

              default:
                icon = <WarningOutlined style={{ color: "#f50" }} />;

                openNotification(
                  "error",
                  `Status of vehicle ${codeVehicle} is un_set_status`,
                  icon
                );
            }
          }
        }
      });

      setDevicesList(devices);
    } else {
      console.log("else effect");
    }
  }, [devices, devicesList]);

  return (
    <Layout>
      <Sidebar user={account} />

      <Layout className="site-layout" style={{ marginLeft: 250 }}>
        <Content
          minHeight={height()}
          authed={authed}
          authPath={authPath}
          extraProps={extraProps}
        />
      </Layout>
    </Layout>
  );
}
