import { Select, message, Button, Row, Col, Tag } from "antd";
import { updateMappingDevice } from "../lib/Store";
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
      Staff can control no vehicle
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
    if(props.getSelectedList) {
      props.getSelectedList(value);
    }
  }

  useEffect(() => {
    setIdStaff(props.id);
  }, [props.id]);

  useEffect(() => {
    setIsDisable(props.isDisable);

    if (!props.isDisable) {
      //Edit device that map to staff
        const childrenX = [];

        props.devices.map((device) => {
          childrenX.push(
            <Option key={device.id} value={device.code}>
              {device.code}
            </Option>
          );
          return device;
        });

        setChildren(childrenX);
        setDevicesList(props.devices);
    } else if (devicesList !== null && props.isSaved) {
      //Save
      message.loading({ content: "Updating...", key });

      let devices = devicesList.filter((device) =>
        selectedList.includes(device.code)
      );

      updateMappingDevice(idStaff, devices).then((isDone) => {
        if (isDone) {
          message.success({ content: "Update successfully!", key, duration: 2 });
          props.savedSuccess();
          props.onUpdateDevices(selectedList);

          setDeviceAllowed(selectedList);
        }
      });
    }
    // eslint-disable-next-line
  }, [props.isDisable]);

  useEffect(() => {
    setDeviceAllowed(props.defaultChildrenDevice);
  }, [props.defaultChildrenDevice]);

  useEffect(() => {
    const grid = [];

    if (deviceAllowed != null && props.devices) {
      deviceAllowed.forEach((ele, index) => {
        let idVehicle = props.devices.filter((device) => device.code === ele)[0].id;

        grid.push(
          <Col span={8} style={{ marginBottom: "0.5em" }} key={index}>
            <Button type="primary" size="middle">
              {/* <Link to={location => ({ ...location, pathname: `/vehicles/${ele}` })}>{ele}</Link> */}
              <Link to={{ pathname: `/vehicles/${idVehicle}` }}>{ele}</Link>
            </Button>
          </Col>
        );
      });
    }

    setGridDeviceButton(grid);

  }, [deviceAllowed, props.devices]);

  return (
    <>
      {!isDisable ? (
        <Select
          size="large"
          mode="multiple"
          allowClear
          style={{ width: "100%" }}
          placeholder="Select vehicles"
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
