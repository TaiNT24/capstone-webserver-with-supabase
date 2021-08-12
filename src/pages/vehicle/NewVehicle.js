import {
  Drawer,
  message,
  Form,
  Input,
  Row,
  Col,
  Upload,
  Space,
  Avatar,
  Button,
  notification,
  Spin
} from "antd";
import { useEffect, useState } from "react";
import {
  checkServer,
  fetchDevice,
  onCreateNewVehicle,
} from "../../store/Store";
import {
  UserOutlined,
  UploadOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  LoadingOutlined
} from "@ant-design/icons";
import { getBase64 } from "../../lib/common_function";
import { MainTitle } from "../../utils/Text";
const key = "insert_new_vehicle";

const iconLoading = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export default function NewVehicle(props) {
  // const [visible, setVisible] = useState(false);
  const [urlAvatar, setUrlAvatar] = useState();
  const [avatarFile, setAvatarFile] = useState();

  //
  const [onOpen, setOnOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [devicesInSystem, setDevicesInSystem] = useState();

  const [form] = Form.useForm();

  useEffect(() => {
    if (props.openModal) {
      setOnOpen(props.openModal);
    }
  }, [props.openModal]);

  useEffect(() => {
    fetchDevice().then((devices) => {
      setDevicesInSystem(devices);
    });
  }, []);

  function handleSubmit() {
    form
      .validateFields()
      .then((values) => {
        setLoading(true);

        console.log("Values on submit: ", values);
        // message.loading({ content: "Creating new vehicle...", key });

        checkServer().then((res) => {
          if (!res) {
            console.log("res res: ", res);
            notification["error"]({
              message: "Server is error, please try again later",
              icon: <CloseCircleOutlined style={{ color: "#cd201f" }} />,
            });
            setLoading(false);
          } else {
            values.avatar_file = avatarFile;

            onCreateNewVehicle(values).then((dataRes) => {
              if (dataRes.status === 200) {
                handleCloseModal();

                message.success({
                  content: "Create new vehicle successfully!",
                  key,
                  duration: 2,
                });
              } else {
                console.log("Error_createVehicle: " + dataRes);
                message.error({
                  content: `Create new vehicle error! message: ${dataRes.error.message}`,
                  key,
                  duration: 2,
                });
              }
              setLoading(false);
            });
          }
        });
      })
      .catch((info) => {
        setLoading(false);
        console.log("Validate Failed:", info);
      });
  }

  function handleCloseModal() {
    setOnOpen(false);
    setLoading(false);

    form.resetFields();
    setUrlAvatar();
    props.closeModal();
  }

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  function getRandomInt() {
    let code;
    let isDup = true;

    let array = [];
    devicesInSystem.forEach((device) => {
      array.push(device.code);
    });

    while (isDup) {
      code = Math.floor(Math.random() * 10000);
      if (code < 1000 || array.includes(code.toString())) {
        isDup = true;
      } else {
        isDup = false;
      }
    }

    // setCodeValue(code);
    form.setFieldsValue({
      code: code.toString(),
    });
  }

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
    <>
      <Drawer
        width={640}
        placement="right"
        closable={false}
        onClose={handleCloseModal}
        visible={onOpen}
        // loading={loading}
      >
        <Spin indicator={iconLoading} spinning={loading}>
          <Form
            form={form}
            onFinish={handleSubmit}
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
            initialValues={{
              remember: true,
            }}
            onFinishFailed={onFinishFailed}
          >
            <Row justify="center">
              <MainTitle value="Create New Vehicle" />
            </Row>

            <Row className="row-center-ele">
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
                  <Space direction="vertical">
                    <Avatar
                      size={128}
                      icon={<UserOutlined />}
                      src={urlAvatar}
                      shape="square"
                    />
                    <Button icon={<UploadOutlined />}>Update image</Button>
                  </Space>
                </Upload>
              </Form.Item>
            </Row>

            <Row>
              <Col span={14} offset={2}>
                <Form.Item
                  label="Code"
                  name="code"
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

                        if (arr.length > 0 && arr[0].code === value) {
                          setLoading(false);
                          return Promise.reject("Dupplicate code");
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <Input type="text" />
                </Form.Item>
              </Col>
              <Col offset={1}>
                <Button onClick={getRandomInt} icon={<SyncOutlined />}>
                  Generate
                </Button>
              </Col>
            </Row>

            <Row style={{ marginTop: "1em" }}>
              <Col span={14} offset={2}>
                <Form.Item
                  label="Mac Address"
                  name="mac_address"
                  rules={[
                    {
                      required: true,
                      message: "Please input mac address!",
                    },
                    {
                      validateTrigger: "onSubmit",
                      validator: (_, value) => {
                        let arr = devicesInSystem.filter(
                          (device) => device.mac_address === value
                        );

                        if (arr.length > 0 && arr[0].mac_address === value) {
                          setLoading(false);
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
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row style={{ marginTop: "3em" }}>
              <Col span={18} offset={7}>
                <Form.Item>
                  <Button
                    // disabled={!infoStaffIsChange}
                    htmlType="button"
                    onClick={handleCloseModal}
                    style={{ width: "8em" }}
                  >
                    Cancel
                  </Button>

                  <Button
                    // disabled={!infoStaffIsChange}
                    type="primary"
                    htmlType="submit"
                    style={{ marginLeft: "2em", width: "8em" }}
                  >
                    Create
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Drawer>
      {/* <Modal
        title="Create new vehicle"
        // style={{ top: 150 }}
        // centered
        visible={onOpen}
        okText="Create"
        cancelText="Cancel"
        onOk={handleSubmit}
        onCancel={handleCloseModal}
        confirmLoading={loading}
      >
        </Modal> */}
    </>
  );
}
