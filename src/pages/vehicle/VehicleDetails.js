import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Row,
  Col,
  Input,
  Typography,
  Tag,
  Button,
  Form,
  message,
  Divider,
} from "antd";
import { MainTitle } from "../../utils/Text";
import { CloseCircleOutlined, SaveOutlined } from "@ant-design/icons";
import { updateVehicle } from "../../lib/Store";
import TaskRecentByVehicle from "../task/TaskRecentByVehicle";
import moment from "moment";

const { Title } = Typography;

const RowInline = ({ title, children, marginBottom }) => {
  return (
    <Row
      align="middle"
      type="flex"
      style={{ marginBottom: marginBottom ?? "0.7em" }}
    >
      <Col span={9} offset={1}>
        <Title style={{ marginBottom: "0" }} level={5}>
          <div
            style={{
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {title}
          </div>
        </Title>
      </Col>

      <Col span={12} offset={2}>
        {children}
      </Col>
    </Row>
  );
};

const key = "updatable";

export default function VehicleDetails(props) {
  const [form] = Form.useForm();
  const { id } = useParams();

  const [device, setDevice] = useState();
  const [batteryColor, setBatteryColor] = useState();
  const [defaultStatus, setDefaultStatus] = useState();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (props.devices) {
      props.devices.forEach((element) => {
        if (element.id === Number(id)) {
          setDevice(element);

          //battery
          let colorBattery = "green";
          if (element.battery < 20) {
            colorBattery = "warning";
          } else if (element.battery < 50) {
            colorBattery = "blue";
          }
          setBatteryColor(colorBattery);

          //default status
          let defaultStatusX = "DISCONNECTED";
          if (element.status === 1) {
            defaultStatusX = "AVAILABLE";
          } else if (element.status === 2) {
            defaultStatusX = "RUNNING";
          } else if (element.status === 3) {
            defaultStatusX = "STOP";
          }
          setDefaultStatus(defaultStatusX);
        }
      });
    }
    // eslint-disable-next-line
  }, [props.devices]);

  const onFinish = (values) => {
    console.log(values);
    if (isSaved) {
      message.loading({ content: "Updating...", key });

      updateVehicle(device.id, values).then((res) => {
        if (res[0]?.id === device.id) {
          //success
          setIsSaved(!isSaved);
          message.success({ content: "Update success!", key, duration: 2 });
        } else {
          message.error({
            content: `Update error! message: ${res}`,
            key,
            duration: 2,
          });
        }
      });
    } else {
      setIsSaved(!isSaved);
    }
  };

  const onReset = () => {
    form.resetFields();
    setIsSaved(false);
  };

  return (
    <div className="ant-layout-inside" height="100vh">
      <MainTitle value="Vehicle Detail" />

      <Row>
        {device ? (
          <Col span={9}>
            <Form
              id="myForm"
              form={form}
              onFinish={onFinish}
              style={{
                padding: "1em",
                borderRadius: "1em",
                marginLeft: "1em",
                // boxShadow: "0 0 10px 0 rgb(0 0 0 / 15%)",
                boxShadow: "rgb(29 165 122 / 45%) 0px 0px 10px 0px",
              }}
            >
              <Title level={5} style={{ textAlign: "center" }}>
                Vehicle Information
              </Title>

              <Divider style={{ margin: "1em" }} />

              <RowInline title="Code:">
                <Form.Item
                  name="code"
                  initialValue={device?.code}
                  rules={[
                    {
                      required: true,
                      message: "Code is required",
                    },
                    {
                      pattern: /^(?:\d*)$/,
                      message: "Code is only contains digits",
                      validateTrigger: "onSubmit",
                    },
                    {
                      len: 4,
                      message: "Code has to be 4 digits",
                      validateTrigger: "onSubmit",
                    },
                    {
                      validateTrigger: "onSubmit",
                      validator: (_, value) => {
                        let arr = props.devices.filter(
                          (device) => device.code === value
                        );

                        if (arr.length > 0 && arr[0].code !== device?.code) {
                          return Promise.reject("Dupplicate code");
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <Input
                    style={{ marginBottom: "0" }}
                    size="large"
                    type="text"
                    disabled={!isSaved}
                  />
                </Form.Item>
              </RowInline>

              <RowInline title="Mac Address:">
                <Form.Item
                  name="mac_address"
                  initialValue={device?.mac_address}
                  rules={[
                    {
                      required: true,
                      message: "Please input mac address!",
                    },
                    {
                      validateTrigger: "onSubmit",
                      validator: (_, value) => {
                        value = value.toUpperCase();
                        let arr = props.devices.filter(
                          (device) => device.mac_address === value
                        );

                        if (
                          arr.length > 0 &&
                          arr[0].mac_address === value &&
                          isSaved &&
                          device?.mac_address !== value
                        ) {
                          return Promise.reject("Dupplicate mac address");
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                    {
                      pattern:
                      '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$|^([0-9a-fA-F]{4}\\.[0-9a-fA-F]{4}\\.[0-9a-fA-F]{4})$',
                      message: "Please input valid mac address's vehicle",
                      validateTrigger: "onSubmit",
                    },
                  ]}
                >
                  <Input
                    style={{ marginBottom: "0" }}
                    size="large"
                    disabled={!isSaved}
                  />
                </Form.Item>
              </RowInline>

              <RowInline title="Date Create:" marginBottom="2em">
                {/* <Input
                  style={{}}
                  size="large"
                  value=
                  readOnly
                /> */}
                <span style={{ fontSize: "1.1em" }}>{device?.date_create}</span>
              </RowInline>

              <RowInline title="Battery:" marginBottom="2em">
                <Tag
                  style={{
                    width: "4em",
                    height: "2.5em",
                    lineHeight: "2.5em",
                    textAlign: "center",
                  }}
                  color={batteryColor}
                >
                  {device?.battery} %
                </Tag>
              </RowInline>

              {defaultStatus ? (
                // <RowInline title="Status:">
                //   <Form.Item
                //     name="status"
                //     initialValue={defaultStatus}
                //     rules={[
                //       {
                //         required: true,
                //       },
                //     ]}
                //   >
                //     <Select
                //       style={{ width: 120 }}
                //       disabled={isDisableChangeStatus || !isSaved}
                //       //   onChange={handleChange}
                //     >
                //       <Option value="0">Active</Option>
                //       <Option value="1">Inactive</Option>
                //       <Option value="2" disabled>
                //         Running
                //       </Option>
                //     </Select>
                //   </Form.Item>
                // </RowInline>
                <RowInline title="Status:" marginBottom="2em">
                  <span style={{ fontSize: "1.1em" }}>{defaultStatus}</span>
                </RowInline>
              ) : null}

              {/* <RowInline title="Last Connection:" marginBottom="2em">
                <span style={{ fontSize: "1.1em" }}>
                  {device?.last_connection}
                </span>
              </RowInline> */}

              <LastConnectionTime time={device?.last_connection} />

              <Row justify="center">
                <Button
                  form="myForm"
                  type="primary"
                  htmlType="submit"
                  style={{ width: "6em" }}
                  icon={<SaveOutlined />}
                  // onClick={() => setIsSaved(!isSaved)}
                >
                  {isSaved ? "Save" : "Edit"}
                </Button>

                {isSaved ? (
                  <Button
                    htmlType="button"
                    style={{ width: "7em", marginLeft: "2em" }}
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={onReset}
                  >
                    Cancel
                  </Button>
                ) : null}
              </Row>
            </Form>
          </Col>
        ) : null}

        <Col span={14} offset={1}>
          <TaskRecentByVehicle idVehicle={id} />
        </Col>
      </Row>
    </div>
  );
}

function LastConnectionTime(props) {
  const [timeaa, setTimeaa] = useState();

  useEffect(() => {
    setTimeaa(moment(props.time).startOf("minutes").fromNow());

    let prevNowPlaying = setInterval(() => {
      let last_connection = moment(props.time).startOf("minutes").fromNow();
      setTimeaa(last_connection);
    }, 10000);

    return () => clearInterval(prevNowPlaying);
  }, [props.time]);

  return (
    <RowInline title="Last Connection:" marginBottom="2em">
      <span style={{ fontSize: "1.1em" }}>{timeaa ?? "None"}</span>
    </RowInline>
  );
}
