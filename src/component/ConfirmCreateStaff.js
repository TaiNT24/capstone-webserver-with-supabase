import { Row, Col, Typography, Divider, Avatar, Tag } from "antd";
import { MainTitle } from "../utils/Text";
import { ExclamationCircleOutlined, UserOutlined } from "@ant-design/icons";
import moment from "moment";
import { getBase64 } from "../lib/common_function";
import { useEffect, useState } from "react";

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

export default function ConfirmCreateStaff(props) {
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    if(props.user?.avatar){
      getBase64(props.user?.avatar[0].originFileObj, (imageUrl) => {
        setImageUrl(imageUrl);
      });
    }
  })

  return (
    <>
      <Row justify="center">
        <MainTitle value="Confirm Staff Information" />
      </Row>

      <Row className="row-center-ele">
        <Avatar size={128} icon={<UserOutlined />} src={imageUrl} />
      </Row>

      <RowInfo title="Email" content={props.user?.email + "@amr-system.me"} />
      <RowInfo title="Full name" content={props.user?.fullname} />
      <RowInfo
        title="Birthday"
        content={moment(props.user?.birthday).format("MM/DD/YYYY")}
      />
      <RowInfo title="Role" content={props.user?.role.toUpperCase()} />

      <Divider />

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
