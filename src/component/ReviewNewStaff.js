import { Row, Col, Typography, Avatar, Tag } from "antd";
import { MainTitle } from "../utils/Text";
import { ExclamationCircleOutlined, UserOutlined } from "@ant-design/icons";
import moment from "moment";
import { getBase64 } from "../lib/common_function";
import { useEffect, useState } from "react";
import { loadAvatar } from "../lib/Store";

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
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    console.log("props.newStaff?.avatar: ", props.newStaff?.avatar);
    if(props.newStaff?.avatar){
      loadAvatar(props.newStaff.avatar).then(res => {
        setImageUrl(res);
      })
    }
  }, [])

  return (
    <>
      <Row justify="center">
        <MainTitle value="Review New Staff" />
      </Row>

      <Row className="row-center-ele">
        <Avatar
          size={128}
          icon={<UserOutlined />}
          src={imageUrl}
        />
      </Row>

      <Row className="row-center-ele">
        <span
          style={{
            fontSize: "1.1em",
            color: props.isCreateFail ? "red" : "green",
          }}
        >
          {props.isCreateFail
            ? "Create staff fail!"
            : "Create staff successful!"}
        </span>
      </Row>
      <Row className="row-center-ele">
        <span style={{ color: props.isCreateFail ? "red" : "green" }}>
          {props.isCreateFail
            ? "Please try it later!"
            : "The account information have been send to staff's email."}
        </span>
      </Row>

      {props.isCreateFail ? null : (
        <div>
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
        </div>
      )}

      {/* <Row className="row-center-ele">
        <span style={{ fontSize: "1em", color: "red" }}>
          The login information is only displayed once when the account is
          created. Please save the information before close!
        </span>
      </Row> */}
    </>
  );
}
