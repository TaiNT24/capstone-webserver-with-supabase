import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Layout,
  Row,
  Col,
  Input,
  Typography,
  Tag,
  Select,
  Button,
  Form,
  message,
} from "antd";
import { MainTitle } from "../../utils/Text";
import {
  CloseCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { updateVehicle } from "../../lib/Store";

const { Title } = Typography;
const { Option } = Select;

const RowInline = ({ title, children, marginBottom }) => {
  return (
    <Row align="middle" style={{ marginBottom: marginBottom ?? "0.7em" }}>
      <Col span={9} offset={1}>
        <Title style={{}} level={5}>
          {title}
        </Title>
      </Col>
      <Col span={12} offset={2}>
        {children}
      </Col>
    </Row>
  );
};

const key = "updatable";

export default function VehicleDetails(props) {
  const [form] = Form.useForm();
  const { id } = useParams();

  const [device, setDevice] = useState();
  const [batteryColor, setBatteryColor] = useState();
  const [defaultStatus, setDefaultStatus] = useState();
  const [isSaved, setIsSaved] = useState(false);
  const [isDisableChangeStatus, setIsDisableChangeStatus] = useState(false);

  useEffect(() => {
    if (props.devices) {
      props.devices.forEach((element) => {
        if (element.id === Number(id)) {
          setDevice(element);

          // diff active or inactive => disable change
          if (element.status !== 0 && element.status !== 1) {
            setIsDisableChangeStatus(true);
          }

          //battery
          let colorBattery = "green";
          if (element.battery < 20) {
            colorBattery = "warning";
          } else if (element.battery < 50) {
            colorBattery = "blue";
          }
          setBatteryColor(colorBattery);

          //default status
          let defaultStatusX = "0";
          if (element.status === 1) {
            defaultStatusX = "1";
          } else if (element.status === 2) {
            defaultStatusX = "2";
          }
          setDefaultStatus(defaultStatusX);
        }
      });
    }
    // eslint-disable-next-line
  }, [props.devices]);

  const onFinish = (values) => {
    console.log(values);
    if (isSaved) {
      message.loading({ content: "Updating...", key });

      updateVehicle(device.id, values).then((res) => {
        // if (res.code === "23505") {
        //   // trùng code
        // }
        if (res[0]?.id === device.id) {
          //success
          setIsSaved(!isSaved);
          message.success({ content: "Update success!", key, duration: 2 });
        } else {
          message.error({
            content: `Update error! message: ${res}`,
            key,
            duration: 2,
          });
        }
      });
    } else {
      setIsSaved(!isSaved);
    }
  };

  const onReset = () => {
    form.resetFields();
    setIsSaved(false);
  };

  return (
    <Layout className="ant-layout-inside">
      <MainTitle value="Vehicle Detail" />

      <Row>
        {device ? (
          <Col span={9}>
            <Form
              id="myForm"
              form={form}
              onFinish={onFinish}
              style={{
                padding: "1em",
                borderRadius: "1em",
                marginLeft: "1em",
                // boxShadow: "0 0 10px 0 rgb(0 0 0 / 15%)",
                boxShadow: "rgb(29 165 122 / 45%) 0px 0px 10px 0px"
              }}
            >
              <RowInline title="Code:">
                <Form.Item
                  name="code"
                  initialValue={device?.code}
                  rules={[
                    {
                      required: true,
                      message: "Code is required",
                    },
                    {
                      validateTrigger: "onSubmit",
                      validator: (_, value) => {
                        let arr = props.devices.filter(
                          (device) => device.code === value
                        );

                        if (arr.length > 0 && arr[0].code !== device?.code) {
                          return Promise.reject("Dupplicate code");
                        } else {
                          return Promise.resolve();
                        }
                      },
                    },
                  ]}
                >
                  <Input
                    style={{}}
                    size="large"
                    type="text"
                    disabled={!isSaved}
                  />
                </Form.Item>
              </RowInline>

              <RowInline title="Mac Address:">
                <Form.Item
                  name="mac_address"
                  initialValue={device?.mac_address}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input style={{}} size="large" disabled={!isSaved} />
                </Form.Item>
              </RowInline>

              <RowInline title="Date Create:" marginBottom="2em">
                <Input
                  style={{}}
                  size="large"
                  value={device?.date_create}
                  disabled
                />
              </RowInline>

              <RowInline title="Battery:" marginBottom="2em">
                <Tag
                  style={{
                    width: "4em",
                    height: "2.5em",
                    lineHeight: "2.5em",
                    textAlign: "center",
                  }}
                  color={batteryColor}
                >
                  {device?.battery} %
                </Tag>
              </RowInline>

              {defaultStatus ? (
                <RowInline title="Status:">
                  <Form.Item
                    name="status"
                    initialValue={defaultStatus}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select
                      style={{ width: 120 }}
                      disabled={isDisableChangeStatus || !isSaved}
                      //   onChange={handleChange}
                    >
                      <Option value="0">Active</Option>
                      <Option value="1">Inactive</Option>
                      <Option value="2" disabled>
                        Running
                      </Option>
                    </Select>
                  </Form.Item>
                </RowInline>
              ) : null}

              <RowInline title="Last Connection:" marginBottom="2em">
                <Input
                  style={{}}
                  size="large"
                  value={device?.last_connection}
                  disabled
                />
              </RowInline>
              <Row justify="center">
                <Button
                  form="myForm"
                  type="primary"
                  htmlType="submit"
                  style={{ width: "6em" }}
                  icon={<SaveOutlined />}
                  // onClick={() => setIsSaved(!isSaved)}
                >
                  {isSaved ? "Save" : "Edit"}
                </Button>

                {isSaved ? (
                  <Button
                    htmlType="button"
                    style={{ width: "6em", marginLeft: "2em" }}
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={onReset}
                  >
                    Cancle
                  </Button>
                ) : null}
              </Row>
            </Form>
          </Col>
        ) : null}

        <Col span={15}></Col>
      </Row>
    </Layout>
  );
}
