import { Card, Col, Row, Layout, Tag, Spin, Typography, Button } from "antd";
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { MainTitle } from "../../utils/Text";
import { Link } from "react-router-dom";
import NewVehicle from "./NewVehicle";
import moment from "moment";
import sgMail from "@sendgrid/mail";
// const sgMail = require("@sendgrid/mail");

const { Title } = Typography;

function DescriptionItem(props) {
  return (
    <Row>
      <Col>
        <Title style={{}} level={5}>
          {props.title}:
        </Title>
      </Col>

      <Col offset={1}>{props.content}</Col>
    </Row>
  );
}

export default function Vehicles(props) {
  const [columnsRender, setColumnsRender] = useState();
  const [loading, setLoading] = useState();

  const [devices, setDevices] = useState();

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const render = [];

    setLoading(true);

    if (devices != null) {
      devices.forEach((device) => {
        let code = device.code;
        let status;

        let colorBattery = "green";
        if (device.battery < 20) {
          colorBattery = "warning";
        } else if (device.battery < 50) {
          colorBattery = "blue";
        }
        let battery = (
          <Tag
            style={{
              width: "4em",
              height: "2.5em",
              lineHeight: "2.5em",
              textAlign: "center",
            }}
            color={colorBattery}
          >
            {device.battery} %
          </Tag>
        );
        let mac_add = device.mac_address;

        code = "Code: " + code;
        switch (device.status) {
          case 0:
            status = (
              <Tag icon={<CloseCircleOutlined />} color="#cd201f">
                DISCONNECTED
              </Tag>
            );
            break;
          case 1:
            status = (
              <Tag color="#87d068" icon={<CheckCircleOutlined />}>
                AVAILABLE
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
          case 3:
            status = (
              <Tag icon={<StopOutlined />} color="#f50">
                STOP
              </Tag>
            );
            break;

          default:
            status = (
              <Tag icon={<WarningOutlined />} color="#f50">
                UN_SET_STATUS
              </Tag>
            );
        }

        render.push(
          <Col span={8} key={device.id}>
            <Link to={{ pathname: `/vehicles/${device.id}` }}>
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
                <DescriptionItem title="Battery" content={battery} />
                <DescriptionItem title="Mac Address" content={mac_add} />
                {/* <DescriptionItem
                  title="Last Connect"
                  content={lastConnection ?? "None"}
                /> */}
                <LastConnectionTime time={device.last_connection} />
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
    // eslint-disable-next-line
  }, [devices]);

  useEffect(() => {
    setDevices(props.devices);
    console.log("props.devices: " + props.devices);
  }, [props.devices]);

  return (
    <Layout className="ant-layout-inside">
      <MainTitle value="Vehicle List" />

      <Row justify="end">
        <Button
          type="primary"
          style={{ marginRight: "2em" }}
          onClick={() => {
            sgMail.setApiKey('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');
            const msg = {
              to: "test1@amr-system.me", // Change to your recipient
              from: "admin@amr-system.me", // Change to your verified sender
              subject: "Sending with SendGrid is Fun",
              text: "and easy to do anywhere, even with Node.js",
              html: "<strong>and easy to do anywhere, even with Node.js</strong>",
            };

            sgMail
              .send(msg)
              .then(() => {
                console.log("Email sent");
              })
              .catch((error) => {
                console.error(error);
              });
          }}
        >
          Sendmail
        </Button>
      </Row>

      <Row justify="end">
        <Button
          type="primary"
          onClick={() => setOpenModal(true)}
          style={{ marginRight: "2em" }}
        >
          Create vehicle
        </Button>
        <NewVehicle
          openModal={openModal}
          closeModal={() => setOpenModal(false)}
          {...props}
        />
      </Row>

      <Row justify="center">
        <Spin size="large" spinning={loading} />
      </Row>

      {!loading ? (
        <Row gutter={24} style={{ margin: "0 1em" }}>
          {columnsRender?.length > 0 ? columnsRender : `There is no vehicle`}
        </Row>
      ) : null}
    </Layout>
  );
}

function LastConnectionTime(props) {
  const [timeaa, setTimeaa] = useState();

  useEffect(() => {
    setTimeaa(moment(props.time).startOf("minutes").fromNow());

    let prevNowPlaying = setInterval(() => {
      let last_connection = moment(props.time).startOf("minutes").fromNow();
      setTimeaa(last_connection);
    }, 10000);

    return () => clearInterval(prevNowPlaying);
  }, [props.time]);

  return <DescriptionItem title="Last Connect" content={timeaa ?? "None"} />;
}
