import { useParams } from "react-router-dom";
import {
  fetchStaffById,
  fetchDevice,
  fetchMappingDevice,
} from "../../store/Store";
import {
  Avatar,
  Layout,
  Row,
  Col,
  Input,
  Typography,
  Button,
  Select,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  CarryOutOutlined,
  EditOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import moment from "moment";
import UpdateStatusButton from "../../component/UpdateStatusButton";
import MappingDeviceToUser from "../../component/MappingDeviceToUser";

const { Title } = Typography;
const { Option } = Select;

const colSpanSelect = 9;

export default function StaffDetail(props) {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [tag, setTag] = useState(null);
  const [isDisableUpdateMappingDevice, setIsDisableUpdateMappingDevice] =
    useState(true);
  const [defaultChildrenDevice, setDefaultChildrenDevice] = useState();
  const [oldDefaultChildrenDevice, setOldDefaultChildrenDevice] = useState();

  const [isCancel, setIsCancel] = useState(false);

  const [isSaveChanged, setIsSaveChanged] = useState(false);

  useEffect(() => {
    fetchStaffById(id).then((staff) => {
      setUser(staff);
      setTag({
        id: staff.id,
        status: staff.status === 0 ? "ACTIVE" : "INACTIVE",
      });
    });
    loadMappingDevice(id);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isCancel && user) {
      setDefaultChildrenDevice(oldDefaultChildrenDevice);
      setIsCancel(false);
    }
    // eslint-disable-next-line
  }, [isCancel]);

  function loadMappingDevice(userId) {
    fetchDevice().then((devices) => {
      const children = [];

      devices.map((device) => {
        children.push(<Option key={device.code}>{device.code}</Option>);
        return null;
      });

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

  return (
    <Layout>
      <Row justify="center" style={{ marginBottom: "1em" }}>
        <Title level={2}>Staff's Profile</Title>
      </Row>

      <Row>
        <Col
          span={6}
          offset={0}
          style={{ backgroundColor: "rgb(181 175 167)", height: "42em" }}
        >
          <Row justify="center">
            <Avatar size={128} icon={<UserOutlined />} src={user?.avatar} />
          </Row>

          <Row justify="center">{user?.full_name}</Row>
        </Col>

        <Col span={16} offset={2} style={{}}>
          <Row align="middle">
            <Col span={5}>
              <Title level={5}>Email:</Title>
            </Col>

            <Col span={colSpanSelect}>
              <Input
                style={{ fontWeight: "bold" }}
                size="large"
                prefix={
                  <MailOutlined className="site-form-item-icon icon-custome" />
                }
                value={user?.email}
                disabled
              />
            </Col>
          </Row>

          <br />

          <Row align="middle">
            <Col span={5}>
              <Title style={{}} level={5}>
                Full Name:
              </Title>
            </Col>

            <Col span={colSpanSelect}>
              <Input
                disabled
                size="large"
                prefix={
                  <UserOutlined className="site-form-item-icon icon-custome" />
                }
                value={user?.full_name}
              />
            </Col>
          </Row>

          <br />

          <Row align="middle">
            <Col span={5}>
              <Title style={{}} level={5}>
                Birthday:
              </Title>
            </Col>

            <Col span={colSpanSelect}>
              <Input
                disabled
                size="large"
                prefix={
                  <CalendarOutlined className="site-form-item-icon icon-custome" />
                }
                value={moment(user?.birthday).format("MM/DD/YYYY")}
              />
            </Col>
          </Row>

          <br />

          <Row align="middle">
            <Col span={5}>
              <Title style={{}} level={5}>
                Role:
              </Title>
            </Col>

            <Col span={colSpanSelect}>
              <Input
                disabled
                size="large"
                prefix={
                  <CarryOutOutlined className="site-form-item-icon icon-custome" />
                }
                value={user?.role.toUpperCase()}
              />
            </Col>
          </Row>

          <br />

          <Row align="middle">
            <Col span={5} style={{}}>
              <Title level={5}>Status:</Title>
            </Col>

            <Col span={colSpanSelect}>
              {tag ? <UpdateStatusButton tag={tag} /> : null}
            </Col>
          </Row>

          <br />

          <Row align="middle">
            <Col span={5}>
              <Title style={{}} level={5}>
                Control vehicle:
              </Title>
            </Col>

            <Col span={colSpanSelect}>
              {defaultChildrenDevice ? (
                <MappingDeviceToUser
                  isDisable={isDisableUpdateMappingDevice}
                  id={user?.id}
                  defaultChildrenDevice={defaultChildrenDevice}
                  isSaved={isSaveChanged}
                  savedSuccess={() => setIsSaveChanged(false)}
                  onUpdateDevices={(value) =>
                    setOldDefaultChildrenDevice(value)
                  }
                />
              ) : null}
            </Col>
            <Col span={4} offset={1}>
              <Button
                size="large"
                type="primary"
                icon={<EditOutlined />}
                onClick={() => {
                  if (!isDisableUpdateMappingDevice) {
                    setIsSaveChanged(true);
                  }
                  setIsDisableUpdateMappingDevice(
                    !isDisableUpdateMappingDevice
                  );
                }}
              >
                {isDisableUpdateMappingDevice ? "Edit" : "Save"}
              </Button>
            </Col>
            {isDisableUpdateMappingDevice ? null : (
              <Col span={4}>
                <Button
                  size="large"
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
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </Layout>
  );
}
