import { useState, useEffect, useRef } from "react";
import {
  Drawer,
  Row,
  Col,
  Avatar,
  Button,
  Typography,
  Divider,
  Form,
  Upload,
  Input,
  message,
  Space,
  Spin,
  DatePicker,
  notification,
} from "antd";
import { MainTitle } from "../../utils/Text";
import UpdateStatusButton from "../../component/UpdateStatusButton";
import moment from "moment";
import {
  fetchStaffById,
  fetchDevice,
  fetchMappingDevice,
  loadAvatar,
  onUpdateStaff,
  checkServer,
} from "../../lib/Store";
import MappingDeviceToUser from "../../component/MappingDeviceToUser";
import {
  EditOutlined,
  CloseCircleOutlined,
  UserOutlined,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { getBase64 } from "../../lib/common_function";

const key_message = "updata_staff";

const { Title } = Typography;

const DescriptionItem = ({ title, children }) => (
  <Row>
    <Col span={6}>
      <Title style={{}} level={5}>
        {title}:
      </Title>
    </Col>

    <Col span={11} offset={1}>
      {children}
    </Col>
  </Row>
);

const RowInfo = ({ title, children }) => {
  return (
    <Row style={{ marginBottom: "1em" }}>
      <Col span={18} offset={5}>
        <DescriptionItem title={title}>{children}</DescriptionItem>
      </Col>
    </Row>
  );
};
function disabledDate(current) {
  // Can not select days after 2001-01-01
  return moment("2001-01-01").isSameOrBefore(current);
}

const iconLoading = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export default function StaffProfile(props) {
  const [form] = Form.useForm();

  //useState
  const [visible, setVisible] = useState(false);

  const [user, setUser] = useState(null);
  const [tag, setTag] = useState(null);
  const [isDisableUpdateMappingDevice, setIsDisableUpdateMappingDevice] =
    useState(true);
  const [defaultChildrenDevice, setDefaultChildrenDevice] = useState();
  const [oldDefaultChildrenDevice, setOldDefaultChildrenDevice] = useState();

  const [isCancel, setIsCancel] = useState(false);

  const [isSaveChanged, setIsSaveChanged] = useState(false);

  const [urlAvatar, setUrlAvatar] = useState();
  const [oldUrlAvatar, setOldUrlAvatar] = useState();

  const [avatarFile, setAvatarFile] = useState();
  const [loading, setLoading] = useState(false);

  const [infoStaffIsChange, setInfoStaffIsChange] = useState(false);
  const [onChangeData, setOnChangeData] = useState(0);

  const fullnameRef = useRef();
  const birthdayRef = useRef();

  //useEffect
  useEffect(() => {
    fetchStaffById(props.id).then((staff) => {
      setUser(staff);
      setTag({
        id: staff.id,
        status: staff.status === 0 ? "ACTIVE" : "INACTIVE",
      });
      loadAvatar(staff.avatar).then((res) => {
        if(res === null) {
          res = '';
        }
        console.log("res loadAvatar: ", res);
        setUrlAvatar(res);
        setOldUrlAvatar(res);
      });
    });
    loadMappingDevice(props.id);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isCancel && user) {
      setDefaultChildrenDevice(oldDefaultChildrenDevice);
      setIsCancel(false);
    }
    // eslint-disable-next-line
  }, [isCancel]);

  useEffect(() => {
    setVisible(props.showProfile);
  }, [props.showProfile]);

  useEffect(() => {
    if (onChangeData > 0) {
      let birthday_data = moment(birthdayRef.current.props.value)
        .format("YYYY-MM-DD")
        .toString();

      let fullname_data = fullnameRef.current.props.value;

      if (birthday_data !== user.birthday || fullname_data !== user.full_name) {
        setInfoStaffIsChange(true);
      } else {
        setInfoStaffIsChange(false);
      }
    }
    // eslint-disable-next-line
  }, [onChangeData]);

  useEffect(() => {
    if (urlAvatar && oldUrlAvatar) {
      if (urlAvatar !== oldUrlAvatar) {
        setInfoStaffIsChange(true);
      } else {
        setInfoStaffIsChange(false);
      }
    }
  }, [urlAvatar, oldUrlAvatar]);

  function loadMappingDevice(userId) {
    fetchDevice().then((devices) => {
      //
      fetchMappingDevice(userId).then((mapping_devices) => {
        const default_children = [];

        mapping_devices.map((device) => {
          devices.map((child) => {
            if (device.device_id === child.id) {
              default_children.push(child.code);
            }
            return null;
          });
          return null;
        });

        setDefaultChildrenDevice(default_children);
        setOldDefaultChildrenDevice(default_children);
      });
    });
  }

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

  const onFinish = async (values) => {
    setLoading(true);
    checkServer().then((res) => {
      if (!res) {
        console.log("res res: ", res);
        notification["error"]({
          message: "Server is error, please try again later",
          icon: <CloseCircleOutlined style={{ color: "#cd201f" }} />,
        });
        setLoading(false);
      } else {
        values.id = user.id;
        values.file_path = user.avatar;
        console.log("user_avatar: ", user.avatar);
        values.avatar_file = avatarFile;

        console.log(values);
        onUpdateStaff(values).then((res) => {
          if (res.error) {
            let message = res.error.message;
            console.log("error_onUpdateStaff_response: ", message);

            message.error({
              content: `Update error! message: ${res}`,
              key_message,
              duration: 2,
            });
          } else if (res.data !== null) {
            fetchStaffById(props.id).then((staff) => {
              setUser(staff);
              setTag({
                id: staff.id,
                status: staff.status === 0 ? "ACTIVE" : "INACTIVE",
              });
              loadAvatar(staff.avatar).then((res) => {
                console.log("res loadAvatar: ", res);
                if(res === null) {
                  res = '';
                }
                setUrlAvatar(res);
                setOldUrlAvatar(res);
              });
            });
            message.success({
              content: "Update staff success!",
              key_message,
              duration: 2,
            });
            setOnChangeData(0);
            props.updateSuccess();
          }
          setLoading(false);
        });
      }
    });
  };

  const onReset = () => {
    form.resetFields();
    setUrlAvatar(oldUrlAvatar);
    setInfoStaffIsChange(false);
  };

  // const onChangeBirthday = (_, dateString) => {
  //   if(dateString !== user.birthday) {
  //     setInfoStaffIsChange(true);
  //   }
  // };

  return (
    <Drawer
      width={640}
      placement="right"
      closable={false}
      onClose={() => props.onCloseProfile()}
      visible={visible}
    >
      <Spin indicator={iconLoading} spinning={loading}>
        <Form onFinish={onFinish} form={form}>
          <Row justify="center">
            <MainTitle value="Staff Profile" />
          </Row>

          {/* <Row className="row-center-ele">
          <Avatar size={128} icon={<UserOutlined />} src={urlAvatar} />
        </Row> */}

          <Row className="row-center-ele" style={{ marginBottom: "0" }}>
            <Form.Item
              name="avatar"
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
                  <Avatar size={128} icon={<UserOutlined />} src={urlAvatar} />
                  <Button icon={<UploadOutlined />}>Update avatar</Button>
                </Space>
              </Upload>
            </Form.Item>
          </Row>

          <RowInfo title="Email">{user?.email}</RowInfo>
          {user ? (
            <>
              <RowInfo title="Full name">
                <Form.Item
                  name="fullname"
                  initialValue={user?.full_name}
                  rules={[
                    {
                      required: true,
                      message: "Full name is required",
                    },
                    {
                      min: 3,
                      message: "Full name must be at least 3 characters!",
                      validateTrigger: "onSubmit",
                    },
                    {
                      max: 30,
                      message: "Please input maximum 30 characters!",
                      validateTrigger: "onSubmit",
                    },
                    {
                      pattern: /^([a-zA-Z\s]*)$/,
                      message: "Please input valid full name!",
                      validateTrigger: "onSubmit",
                    },
                  ]}
                >
                  <Input
                    size="middle"
                    type="text"
                    allowClear
                    style={{ width: "100%" }}
                    onChange={() => setOnChangeData(onChangeData + 1)}
                    ref={fullnameRef}
                  />
                </Form.Item>
              </RowInfo>

              <RowInfo title="Birthday">
                <Form.Item
                  name="birthday"
                  initialValue={moment(user?.birthday)}
                  rules={[
                    {
                      required: true,
                      message: "Birthday is required",
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: "100%", textAlign: "center" }}
                    onChange={() => setOnChangeData(onChangeData + 1)}
                    showToday={false}
                    disabledDate={disabledDate}
                    ref={birthdayRef}
                  />
                </Form.Item>
              </RowInfo>
            </>
          ) : null}

          <RowInfo title="Role">{user?.role.toUpperCase()}</RowInfo>

          <Row>
            <Col span={18} offset={5}>
              <Row>
                <Col span={6}>
                  <Title style={{}} level={5}>
                    Status:
                  </Title>
                </Col>

                <Col span={11} offset={1}>
                  {tag ? (
                    <UpdateStatusButton
                      tag={tag}
                      updateSuccess={props.updateSuccess}
                    />
                  ) : null}
                </Col>
              </Row>
            </Col>
          </Row>

          <Row style={{ marginTop: "1em" }}>
            <Col span={18} offset={7}>
              <Form.Item>
                <Button
                  disabled={!infoStaffIsChange}
                  htmlType="button"
                  onClick={onReset}
                  style={{ width: "8em" }}
                >
                  Reset
                </Button>

                <Button
                  disabled={!infoStaffIsChange}
                  type="primary"
                  htmlType="submit"
                  style={{ marginLeft: "2em", width: "8em" }}
                >
                  Update
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>

      <Divider style={{ marginTop: "0" }} />

      <Row>
        <Col span={5} offset={1}>
          <Title style={{}} level={5}>
            Control Device:
          </Title>
        </Col>

        <Col span={10} offset={1}>
          {defaultChildrenDevice ? (
            <MappingDeviceToUser
              isDisable={isDisableUpdateMappingDevice}
              id={user?.id}
              defaultChildrenDevice={defaultChildrenDevice}
              isSaved={isSaveChanged}
              savedSuccess={() => setIsSaveChanged(false)}
              onUpdateDevices={(value) => {
                setDefaultChildrenDevice(value);
                setOldDefaultChildrenDevice(value);
              }}
              {...props}
            />
          ) : null}
        </Col>

        <Col span={6} offset={1}>
          {/* Edit */}
          <Row>
            <Button
              size="large"
              type="primary"
              className="btn-update-device"
              icon={<EditOutlined />}
              onClick={() => {
                if (!isDisableUpdateMappingDevice) {
                  setIsSaveChanged(true);
                }
                setIsDisableUpdateMappingDevice(!isDisableUpdateMappingDevice);
              }}
            >
              {isDisableUpdateMappingDevice ? "Edit" : "Save"}
            </Button>
          </Row>

          {/* Cancle */}
          <Row style={{ marginTop: "1em" }}>
            {isDisableUpdateMappingDevice ? null : (
              <Button
                size="large"
                className="btn-update-device"
                type="primary"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => {
                  setIsCancel(true);
                  setDefaultChildrenDevice(null);

                  setIsDisableUpdateMappingDevice(
                    !isDisableUpdateMappingDevice
                  );
                }}
              >
                Cancel
              </Button>
            )}
          </Row>
        </Col>
      </Row>
    </Drawer>
  );
}
