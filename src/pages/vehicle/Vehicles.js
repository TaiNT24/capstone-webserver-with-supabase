import { Card, Col, Row, Layout, Tag, Spin, Typography } from "antd";
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { fetchAllDevice } from "../../lib/Store";
import { MainTitle } from "../../utils/Text";
import { Link, Redirect } from "react-router-dom";

const { Title } = Typography;

const DescriptionItem = ({ title, content }) => (
  <Row>
    <Col >
      <Title style={{}} level={5}>
        {title}:
      </Title>
    </Col>

    <Col offset={1}>
      {content}
    </Col>
  </Row>
);

export default function Vehicles() {
  const [columnsRender, setColumnsRender] = useState();
  const [loading, setLoading] = useState();

  const { devices } = fetchAllDevice();

  useEffect(() => {
    const render = [];

    setLoading(true);

    if (devices != null) {
      devices.forEach((device) => {
        let code = device.code;
        let status;
        let battery = device.battery + " %";
        let mac_add = device.mac_address;
        let last_connection = device.last_connection;

        code = "Device code: " + code;
        switch (device.status) {
          case 0:
            status = (
              <Tag color="#87d068" icon={<CheckCircleOutlined />}>
                ACTIVE
              </Tag>
            );
            break;
          case 1:
            status = (
              <Tag icon={<CloseCircleOutlined />} color="#cd201f">
                INACTIVE
              </Tag>
            );
            break;
          case 2:
            status = (
              <Tag icon={<SyncOutlined spin />} color="#108ee9">
                RUNNING
              </Tag>
            );
            break;

          default:
            "UN_SET";
        }

        render.push(
          <Col span={8} key={device.id}>
            <Link to={{ pathname: `/vehicles/${device.code}` }}>
              <Card
                className="card-vehicel"
                style={{
                  borderRadius: "1em",
                  color: "#1f1f1f",
                  marginTop: "2em",
                  boxShadow: "0 0 10px 0 rgb(0 0 0 / 15%)",
                }}
                headStyle={{ color: "#061178" }}
                title={code}
                extra={status}
                hoverable
                bordered={false}
              >
                {/* <Title style={{}} level={5}>
                  Battery:
                </Title>
                <p></p> */}
                <DescriptionItem title="Battery" content={battery} />
                <DescriptionItem title="Mac Address" content={mac_add} />
                <DescriptionItem title="Last Connect" content={last_connection?? "None"} />


                {/* <Title style={{}} level={5}>
                  Mac Address:
                </Title>
                <p>{mac_add}</p>

                <Title style={{}} level={5}>
                  Last Connect:
                </Title>
                <p>{last_connection ?? "None"}</p> */}
              </Card>
            </Link>
          </Col>
        );
      });
    }

    setColumnsRender(render);
    if (columnsRender) {
      setLoading(false);
    }
  }, [devices]);

  return (
    <div>
      <Row className="row-center-ele">
        {/* <Title level={2}>Device List</Title> */}
        <MainTitle value="Device List" />
      </Row>

      <Row justify="center">
        <Spin size="large" spinning={loading} />
      </Row>

      {!loading ? (
        <Row gutter={24}>
          {columnsRender?.length > 0 ? columnsRender : "There is no device"}
        </Row>
      ) : null}
    </div>
  );
}
