import { Tabs } from "antd";
import { UnorderedListOutlined, EnvironmentOutlined } from "@ant-design/icons";

import Vehicles from "./VehicleList";
import Canvas from "./VehiclePosition";
import { useEffect, useState } from "react";

const { TabPane } = Tabs;

export default function (props) {
  const [devices, setDevices] = useState();

  useEffect(() => {
    console.log("Vehicle tab: " + props.devices);
    setDevices(props.devices);

  }, [props.devices]);

  return (
    <Tabs defaultActiveKey="Vehicle_List">
      <TabPane
        tab={
          <span>
            <UnorderedListOutlined />
            Vehicle List
          </span>
        }
        key="Vehicle_List"
      >
        <Vehicles devices={devices} />
      </TabPane>
      <TabPane
        tab={
          <span>
            <EnvironmentOutlined />
            Vehicle Position
          </span>
        }
        key="Vehicle_Position"
      >
        <Canvas devices={devices} />
      </TabPane>
    </Tabs>
  );
}
