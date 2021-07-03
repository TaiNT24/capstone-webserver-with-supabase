import { useState, useEffect } from "react";
import { Drawer, Row, Col, Avatar, Button, Typography } from "antd";
import { MainTitle } from "../../utils/Text";
import UpdateStatusButton from "../../component/UpdateStatusButton";
import moment from "moment";
import {
  fetchStaffById,
  fetchDevice,
  fetchMappingDevice,
} from "../../lib/Store";
import MappingDeviceToUser from "../../component/MappingDeviceToUser";
import {
  EditOutlined,
  CloseCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const DescriptionItem = ({ title, content }) => (
  <Row>
    <Col span={6}>
      <Title style={{}} level={5}>
        {title}:
      </Title>
    </Col>

    <Col span={11} offset={1}>
      {content}
    </Col>
  </Row>
);

const RowInfo = ({ title, content }) => {
  return (
    <Row style={{ marginBottom: "1em" }}>
      <Col span={18} offset={7}>
        <DescriptionItem title={title} content={content} />
      </Col>
    </Row>
  );
};

export default function StaffProfile(props) {
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

  //useEffect
  useEffect(() => {
    fetchStaffById(props.id).then((staff) => {
      setUser(staff);
      setTag({
        id: staff.id,
        status: staff.status === 0 ? "ACTIVE" : "INACTIVE",
      });
    });
    loadMappingDevice(props.id);
  }, []);

  useEffect(() => {
    if (isCancel && user) {
      setDefaultChildrenDevice(oldDefaultChildrenDevice);
      setIsCancel(false);
    }
  }, [isCancel]);

  useEffect(() => {
    setVisible(props.showProfile);
  }, [props.showProfile]);

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

  return (
    <Drawer
      width={640}
      placement="right"
      closable={false}
      onClose={() => props.onCloseProfile()}
      visible={visible}
    >
      <Row justify="center">
        <MainTitle value="Staff Profile" />
      </Row>

      <Row className="row-center-ele">
        <Avatar size={128} icon={<UserOutlined />} src={user?.avatar} />
      </Row>

      <RowInfo title="Email" content={user?.email} />
      <RowInfo title="Full name" content={user?.full_name} />
      <RowInfo
        title="Birthday"
        content={moment(user?.birthday).format("MM/DD/YYYY")}
      />
      <RowInfo title="Role" content={user?.role.toUpperCase()} />

      <Row>
        <Col span={18} offset={7}>
          <Row>
            <Col span={6}>
              <Title style={{}} level={5}>
                Status:
              </Title>
            </Col>

            <Col span={11} offset={1}>
              {tag ? <UpdateStatusButton tag={tag} /> : null}
            </Col>
          </Row>
        </Col>
      </Row>

      {/* <Divider /> */}

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
