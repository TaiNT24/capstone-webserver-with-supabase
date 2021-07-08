import { Row, Col, Typography, Divider, Avatar, Tag } from "antd";
import { MainTitle } from "../utils/Text";
import { ExclamationCircleOutlined, UserOutlined } from "@ant-design/icons";
import moment from "moment";

const { Title } = Typography;

const DescriptionItem = ({ title, content }) => (
  <Row>
    <Col span={8}>
      <Title style={{}} level={5}>
        {title}:
      </Title>
    </Col>

    <Col span={14} offset={2}>
      {content}
    </Col>
  </Row>
);

const RowInfo = ({ title, content }) => {
  return (
    <Row style={{ marginBottom: "1em" }}>
      <Col span={22} offset={2}>
        <DescriptionItem title={title} content={content} />
      </Col>
    </Row>
  );
};

export default function ReviewNewStaff(props) {
  return (
    <>
      <Row justify="center">
        <MainTitle value="Review New Staff" />
      </Row>

      <Row className="row-center-ele">
        <Avatar size={128} icon={<UserOutlined />} src={props.newStaff?.avatar} />
      </Row>

      <Row className="row-center-ele">
          <span  style={{fontSize: "1.1em", color: "green"}}>Create staff successful!</span>
      </Row>

      <RowInfo title="Email" content={props.newStaff?.email} />
      <RowInfo title="Password" content={props.newStaff?.password} />
      <RowInfo title="Full name" content={props.newStaff?.fullname} />
      <RowInfo
        title="Birthday"
        content={moment(props.newStaff?.birthday).format("MM/DD/YYYY")}
      />
      <RowInfo title="Role" content={props.newStaff?.role.toUpperCase()} />

      <Row style={{ marginBottom: "1em" }}>
        <Col span={22} offset={2}>
          <Row>
            <Col span={8}>
              <Title style={{}} level={5}>
                Control Vehicle:
              </Title>
            </Col>

            <Col span={13} offset={2}>
              {props.selectedListDevice.length > 0 ? (
                props.selectedListDevice.map((e) => e + " ")
              ) : (
                <Tag 
                  icon={<ExclamationCircleOutlined />}
                  color="warning"
                  className="no-device-is-map-to-staff"
                >
                  Staff can control no vehicle
                </Tag>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
      <Row></Row>
    </>
  );
}
