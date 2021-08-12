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
  Avatar,
  Upload,
  notification
} from "antd";
import { MainTitle } from "../../utils/Text";
import {
  CloseCircleOutlined,
  SaveOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { checkServer, fetchDevice, loadImgVehicle, onUpdateVehicle } from "../../store/Store";
import TaskRecentByVehicle from "../task/TaskRecentByVehicle";
import moment from "moment";
import ConfirmDeleteVehicle from "../../component/ConfirmDeleteVehicle";
import { getBase64 } from "../../lib/common_function";
import VehicleIcon from "../../lib/custome-icon/VehicleIcon";

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

  const [showConfirm, setShowConfirm] = useState(false);

  const [devicesInSystem, setDevicesInSystem] = useState();

  const [urlAvatar, setUrlAvatar] = useState();
  const [oldUrlAvatar, setOldUrlAvatar] = useState();
  const [avatarFile, setAvatarFile] = useState();

  useEffect(() => {
    if (props.devices) {
      props.devices.forEach((element) => {
        if (element.id === Number(id)) {
          setDevice(element);

          //img
          loadImgVehicle(element.image).then((res) => {
            setUrlAvatar(res);
            setOldUrlAvatar(res);
          });

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
          if (element.status === 0) {
            defaultStatusX = "DISCONNECTED";
          } else if (element.status === 1) {
            defaultStatusX = "AVAILABLE";
          } else if (element.status === 2) {
            defaultStatusX = "RUNNING";
          } else if (element.status === 3) {
            defaultStatusX = "STOP";
          } else if (element.status === 4) {
            defaultStatusX = "ERROR_STOP";
          } else {
            defaultStatusX = "UN_SET_STATUS";
          }
          setDefaultStatus(defaultStatusX);
        }
      });
    }
    // eslint-disable-next-line
  }, [props.devices]);

  useEffect(() => {
    fetchDevice().then((devices) => {
      setDevicesInSystem(devices);
    });
  }, []);

  const onFinish = (values) => {
    console.log(values);
    if (isSaved) {
      message.loading({ content: "Updating...", key });

      checkServer().then((res) => {
        if (!res) {
          console.log("res res: ", res);
          notification["error"]({
            message: "Server is error, please try again later",
            icon: <CloseCircleOutlined style={{ color: "#cd201f" }} />,
          });
          // setLoading(false);
        } else {
          values.avatar_file = avatarFile;
          values.id = device.id;

          onUpdateVehicle(values).then((res) => {
            if (res.status === 200) {
              //success
              setIsSaved(!isSaved);
              message.success({
                content: "Update vehicle successfully!",
                key,
                duration: 2,
              });
            } else {
              message.error({
                content: `Update error! message: ${res.message}`,
                key,
                duration: 2,
              });
            }
          });
        }
      })
    } else {
      setIsSaved(!isSaved);
    }
  };

  const onReset = () => {
    form.resetFields();
    setIsSaved(false);
    setUrlAvatar(oldUrlAvatar);
  };

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
    setAvatarFile(file);
  };

  function beforeUpload(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  }

  function handleChange(info) {
    if (info.file.status === "uploading") {
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, (imageUrl) => {
        // setImageUrl(imageUrl);
        setUrlAvatar(imageUrl);
      });
    }
  }

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

              <Row className="row-center-ele" align="middle">
                <Col span={12}>
                  {urlAvatar ? (
                    <img src={urlAvatar} className="photo" alt="Image of vehicle"/>
                  ) : (
                    <Avatar size={128} icon={<VehicleIcon />} shape="square" />
                  )}
                </Col>
                <Col span={11} offset={1}  style={{ marginTop: "2em" }} >
                  <Form.Item
                    name="image"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    // initialValue={urlAvatar}
                  >
                    <Upload
                      name="avatar"
                      showUploadList={false}
                      customRequest={dummyRequest}
                      beforeUpload={beforeUpload}
                      onChange={handleChange}
                    >
                      <Button icon={<UploadOutlined />} disabled={!isSaved}>
                        Update image
                      </Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>

              <RowInline title="Code:">
                <Form.Item
                  name="code"
                  initialValue={device?.code}
                  rules={[
                    {
                      required: true,
                      message: "Please input code!",
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
                        let arr = devicesInSystem.filter(
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
                        let arr = devicesInSystem.filter(
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
                        "^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$|^([0-9a-fA-F]{4}\\.[0-9a-fA-F]{4}\\.[0-9a-fA-F]{4})$",
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

              {/* <RowInline title="Date Create:" marginBottom="2em">
                <span style={{ fontSize: "1.1em" }}>
                  {moment(device?.date_create).format("YYYY-MM-DD, HH:mm:ss")}
                </span>
              </RowInline> */}

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
                {isSaved ? (
                  <Button
                    htmlType="button"
                    style={{ width: "7em" }}
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={onReset}
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    htmlType="button"
                    style={{ width: "7em" }}
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => setShowConfirm(true)}
                  >
                    Delete
                  </Button>
                )}

                <Button
                  form="myForm"
                  type="primary"
                  htmlType="submit"
                  style={{ width: "7em", marginLeft: "2em" }}
                  icon={<SaveOutlined />}
                  // onClick={() => setIsSaved(!isSaved)}
                >
                  {isSaved ? "Save" : "Edit"}
                </Button>
              </Row>
            </Form>
          </Col>
        ) : null}

        <Col span={14} offset={1}>
          <TaskRecentByVehicle idVehicle={id} />
        </Col>
      </Row>

      <ConfirmDeleteVehicle
        showConfirm={showConfirm}
        cancleDelete={() => setShowConfirm(false)}
        code={device?.code}
        id={device?.id}
      />
    </div>
  );
}

function LastConnectionTime(props) {
  const [timeaa, setTimeaa] = useState();

  useEffect(() => {
    let last_connection_init = moment(props.time).startOf("minutes").fromNow();
    let prevNowPlaying = null;

    if (last_connection_init !== "Invalid date") {
      setTimeaa(moment(props.time).startOf("minutes").fromNow());

      prevNowPlaying = setInterval(() => {
        let last_connection = moment(props.time).startOf("minutes").fromNow();
        setTimeaa(last_connection);
      }, 10000);
    }

    return () => clearInterval(prevNowPlaying ?? null);
  }, [props.time]);

  return (
    <RowInline title="Last Connection:" marginBottom="2em">
      <span style={{ fontSize: "1.1em" }}>{timeaa ?? "Never"}</span>
    </RowInline>
  );
}
