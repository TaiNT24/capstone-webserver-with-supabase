import { Select, message, List, Button, Card, Row, Col, Tag } from "antd";
import { fetchDevice, updateMappingDevice } from "../lib/Store";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Option } = Select;
const key = "updatable";

const NoDevice = () => {
  return (
    <Tag
      icon={<ExclamationCircleOutlined />}
      color="warning"
      className="no-device-is-map-to-staff"
    >
      Staff can control no device
    </Tag>
  );
};
export default function MappingDeviceToUser(props) {
  const [children, setChildren] = useState(null);
  const [devicesList, setDevicesList] = useState(null);
  const [selectedList, setSelectedList] = useState([]);
  const [isDisable, setIsDisable] = useState();
  const [idStaff, setIdStaff] = useState();
  const [gridDeviceButton, setGridDeviceButton] = useState();
  const [deviceAllowed, setDeviceAllowed] = useState();

  function handleChange(value) {
    setSelectedList(value);
  }

  useEffect(() => {
    setIdStaff(props.id);
  }, [props.id]);

  useEffect(() => {
    setIsDisable(props.isDisable);

    if (!props.isDisable) {
      //Edit device that map to staff
      fetchDevice().then((devices) => {
        const childrenX = [];

        devices.map((device) => {
          childrenX.push(
            <Option key={device.id} value={device.code}>
              {device.code}
            </Option>
          );

        });

        setChildren(childrenX);
        setDevicesList(devices);
      });
    } else if (devicesList !== null && props.isSaved) {
      //Save
      message.loading({ content: "Updating...", key });

      let devices = devicesList.filter((device) =>
        selectedList.includes(device.code)
      );

      updateMappingDevice(idStaff, devices).then((isDone) => {
        if (isDone) {
          message.success({ content: "Update success!", key, duration: 2 });
          props.savedSuccess();
          props.onUpdateDevices(selectedList);

          setDeviceAllowed(selectedList);
        }
      });
    }
  }, [props.isDisable]);

  useEffect(() => {
    setDeviceAllowed(props.defaultChildrenDevice);
  }, [props.defaultChildrenDevice]);

  useEffect(() => {
    const grid = [];

    if (deviceAllowed != null) {
      deviceAllowed.forEach((ele, index) => {
        grid.push(
          <Col span={8} style={{ marginBottom: "0.5em" }} key={index}>
            <Button type="primary" size="middle" >
              {/* <Link to={location => ({ ...location, pathname: `/vehicles/${ele}` })}>{ele}</Link> */}
              <Link to={{pathname: `/vehicles/${ele}`}}>{ele}</Link>
            </Button>
          </Col>
        );
      });
    }

    setGridDeviceButton(grid);
  }, [deviceAllowed]);

  return (
    <>
      {!isDisable ? (
        <Select
          size="large"
          mode="multiple"
          allowClear
          style={{ width: "100%" }}
          placeholder="There is no device"
          defaultValue={props.defaultChildrenDevice}
          onChange={handleChange}
          // disabled={isDisable}
        >
          {children}
        </Select>
      ) : (
        <Row>
          {gridDeviceButton.length > 0 ? gridDeviceButton : <NoDevice />}
        </Row>
      )}
    </>
  );
}
