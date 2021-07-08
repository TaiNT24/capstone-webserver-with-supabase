import { useState, useEffect } from "react";
import {
  Row,
  Col,
  Avatar,
  Button,
  Typography,
  Form,
  Divider,
  Input,
  DatePicker,
} from "antd";
import { MainTitle } from "../utils/Text";
import moment from "moment";
import { fetchAllStaff } from "../lib/Store";
import { UserOutlined } from "@ant-design/icons";

const { Title } = Typography;

const RowInfo = ({ title, children }) => {
  return (
    <Row style={{ marginBottom: "1em" }}>
      <Col span={5}>
        <Title style={{}} level={5}>
          {title}:
        </Title>
      </Col>

      <Col span={18} offset={1}>
        {children}
      </Col>
    </Row>
  );
};

function disabledDate(current) {
  // Can not select days after 2001-01-01
  return moment("2001-01-01").isSameOrBefore(current);
}

const default_birthday = "2000-12-01";

export default function NewStaffInfo(props) {
  const [form] = Form.useForm();

  //useState
  const [allStaff, setAllStaff] = useState();

  //useEffect
  useEffect(() => {
    fetchAllStaff().then((data) => {
      if (data.length > 0) {
        setAllStaff(data);
      } else {
        console.log("error_fetchAllStaff: " + data);
      }
    });
    // eslint-disable-next-line
  }, []);

  const onFinish = (values) => {
    console.log(values);
    values.role = "staff";
    props.onNextStep(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  const onChangeBirthday = (_, dateString) => {
    console.log(dateString);
  };

  return (
    <Form onFinish={onFinish} form={form}>
      <Row justify="center">
        <MainTitle value="Staff Information" />
      </Row>

      <Row className="row-center-ele">
        <Avatar size={128} icon={<UserOutlined />} />

        {/* <Form.Item
            name="upload"
            // label="Upload"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            // extra="longgggggggggggggggggggggggggggggggggg"
          >
            <Upload name="logo" action="/upload.do" listType="picture">
              <Button icon={<UploadOutlined />}>Upload avatar</Button>
            </Upload>
          </Form.Item> */}
      </Row>

      <RowInfo title="Email">
        <Form.Item
          name="email"
          initialValue={props.initDataStaff?.email}
          rules={[
            {
              required: true,
              message: "Email is required",
            },
            {
              pattern: /(^[\w]+(\.|-)?([\w]{2,5})+$)/,
              message: "Please input valid email!",
              validateTrigger: "onSubmit",
            },
            {
              min: 3,
              message: "Please input at least 3 characters!",
              validateTrigger: "onSubmit",
            },
            {
              max: 30,
              message: "Please input maximum 30 characters!",
              validateTrigger: "onSubmit",
            },
            {
              validateTrigger: "onSubmit",
              validator: (_, value) => {
                if (allStaff) {
                  let arr = allStaff.filter(
                    (staff) => staff.email.split("@")[0] === value
                  );

                  if (arr.length > 0 && arr[0].email.split("@")[0] === value) {
                    return Promise.reject("Dupplicate email!");
                  } else {
                    return Promise.resolve();
                  }
                }
              },
            },
          ]}
        >
          <Input size="middle" type="text" addonAfter="@amr-system.me" />
        </Form.Item>
      </RowInfo>

      <RowInfo title="Full name">
        <Form.Item
          name="fullname"
          initialValue={props.initDataStaff?.fullname}
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
            style={{ width: "64%" }}
          />
        </Form.Item>
      </RowInfo>

      <RowInfo title="Birthday">
        <Form.Item
          name="birthday"
          initialValue={
            props.initDataStaff
              ? moment(props.initDataStaff.birthday)
              : moment(default_birthday)
          }
          rules={[
            {
              required: true,
              message: "Birthday is required",
            },
          ]}
        >
          <DatePicker
            style={{ width: "64%", textAlign: "center" }}
            onChange={onChangeBirthday}
            showToday={false}
            disabledDate={disabledDate}
          />
        </Form.Item>
      </RowInfo>

      <RowInfo title="Role">Staff</RowInfo>

      <Divider />
      {/* //row here */}

      <Row
        justify="center"
        style={{ position: "absolute", bottom: "3.3em", left: "9em" }}
      >
        <Form.Item>
          <Button htmlType="button" onClick={onReset} style={{ width: "8em" }}>
            Reset
          </Button>

          <Button
            type="primary"
            htmlType="submit"
            style={{ marginLeft: "2em", width: "8em" }}
          >
            Next
          </Button>
        </Form.Item>
      </Row>
    </Form>
  );
}
