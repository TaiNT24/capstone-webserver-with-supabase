import { useParams } from "react-router-dom";
import { fetchStaffById } from "../../lib/Store";
import { Avatar, Layout, Row, Col, Input, Typography } from "antd";
import {
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  CarryOutOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import moment from "moment";

const { Title, Text } = Typography;
const colSpanSelect = 9;

export default function StaffDetail(props) {
  const { id } = useParams();

  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchStaffById(id).then((staff) => {
      setUser(staff);
    });
  });

  return (
    <Layout>
      {/* <Row> */}
        <Row>
          <Title level={3}>Staff's Profile</Title>
        </Row>

        <Row>
          <Col
            span={6}
            offset={0}
            style={{ backgroundColor: "rgb(181 175 167)", height: "42em" }}
          >
            <Row justify="center">
              <Avatar
                size={128}
                icon={<UserOutlined />}
                src="https://scontent.fsgn3-1.fna.fbcdn.net/v/t1.6435-9/181028952_1726041634270682_3678233076061175252_n.jpg?_nc_cat=109&ccb=1-3&_nc_sid=09cbfe&_nc_ohc=3bVFLE3sThMAX8SoJOA&_nc_ht=scontent.fsgn3-1.fna&oh=254d7a03e05405fdb920c50e6bb432af&oe=60DEB00E"
              />
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
                  disabled
                  style={{ fontWeight: "bold" }}
                  size="large"
                  prefix={<MailOutlined className="site-form-item-icon" />}
                  value={user?.email}
                  disabled
                />

                {/* <Text code style={{ fontSize: "1.4em" }}>
                <MailOutlined className="site-form-item-icon" />
                {user?.email}
              </Text> */}
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
                    <UserOutlined
                      style={{ fontSize: "16px", color: "#08c" }}
                      className="site-form-item-icon"
                    />
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
                  prefix={<CalendarOutlined className="site-form-item-icon" />}
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
                  prefix={<CarryOutOutlined className="site-form-item-icon" />}
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
                <Input
                  disabled
                  size="large"
                  prefix={
                    user?.status === 0 ? (
                      <CheckCircleOutlined
                        className="site-form-item-icon"
                        style={{ color: "green" }}
                      />
                    ) : (
                      <CloseCircleOutlined
                        className="site-form-item-icon"
                        style={{ color: "red" }}
                      />
                    )
                  }
                  value={user?.status === 0 ? "ACTIVE" : "INACTIVE"}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      {/* </Row> */}
    </Layout>
  );
}
