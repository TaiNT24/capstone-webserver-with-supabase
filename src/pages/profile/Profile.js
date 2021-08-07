import { useState, useEffect, useRef } from "react";
import {
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
import moment from "moment";
import {
  fetchStaffById,
  loadAvatar,
  onUpdateStaff,
  checkServer,
  supabase,
} from "../../lib/Store";
import {
  CloseCircleOutlined,
  UserOutlined,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { getBase64 } from "../../lib/common_function";
import Layout from "antd/lib/layout/layout";

const key_message = "updata_staff";

const { Title } = Typography;

const DescriptionItem = ({ title, children }) => (
  <Row>
    <Col span={6}>
      <Title style={{}} level={5}>
        {title}:
      </Title>
    </Col>

    <Col span={9} offset={1}>
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

export default function Profile(props) {
  const [form] = Form.useForm();

  //useState
  const [user, setUser] = useState(null);

  const [urlAvatar, setUrlAvatar] = useState("");
  const [oldUrlAvatar, setOldUrlAvatar] = useState("");

  const [avatarFile, setAvatarFile] = useState();
  const [loading, setLoading] = useState(false);

  const [infoStaffIsChange, setInfoStaffIsChange] = useState(false);
  const [onChangeData, setOnChangeData] = useState(0);

  const fullnameRef = useRef();
  const birthdayRef = useRef();

  let current_user = supabase.auth.session().user;

  //useEffect
  useEffect(() => {

    fetchStaffById(current_user.id).then((staff) => {
      setUser(staff);

      loadAvatar(staff.avatar).then((res) => {
        if (res === null) {
          res = "";
        }
        console.log("res loadAvatar: ", res);
        setUrlAvatar(res);
        setOldUrlAvatar(res);
      });
    });
    // eslint-disable-next-line
  }, []);

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
    if (urlAvatar !== oldUrlAvatar) {
      setInfoStaffIsChange(true);
    } else {
      setInfoStaffIsChange(false);
    }
  }, [urlAvatar, oldUrlAvatar]);

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
        values.role = user.role;
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
            fetchStaffById(current_user.id).then((staff) => {
              setUser(staff);
              loadAvatar(staff.avatar).then((res) => {
                if (res === null) {
                  res = "";
                }
                setUrlAvatar(res);
                setOldUrlAvatar(res);
              });
            });
            message.success({
              content: "Update staff successfully!",
              key_message,
              duration: 2,
            });
            setOnChangeData(0);
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
    <Layout>
      <Spin indicator={iconLoading} spinning={loading}>
        <Form onFinish={onFinish} form={form}>
          <Row justify="center">
            <MainTitle value="Staff Profile" />
          </Row>

          <Row className="row-center-ele" style={{ marginBottom: "0" }}>
            <Form.Item
              name="avatar"
              valuePropName="fileList"
              getValueFromEvent={normFile}
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

          <Row style={{ marginTop: "1em" }}>
            <Col span={16} offset={8}>
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
                  style={{ marginLeft: "3em", width: "8em" }}
                >
                  Update
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Spin>

      <Divider  />
    </Layout>
  );
}
