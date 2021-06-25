import { Form, Input, Button, Row, Col, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../../lib/use-auth";
import { useHistory, useLocation } from "react-router-dom";
import { useState } from "react";

const { Title } = Typography;

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState();

  const auth = useAuth();

  let history = useHistory();
  let location = useLocation();

  //login
  const onFinish = (values) => {
    console.log("Received values of form: ", values);

    // let { from } = location.state || { from: { pathname: "/" } };

    auth.signin(values.email, values.password, () => {
      history.replace("/");
    })
    .then(({user, error}) => {
        if(error) {
            setErrorMessage(error.message)
        }
    });
  };

  return (
    <Row justify="center" className="body-login">
      <Col className="form-outside-login">
        <Row justify="center" align="middle">
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{}}
            onFinish={onFinish}
          >
            <Title
              style={{ textAlign: "center", marginBottom: "1em" }}
              level={1}
            >
              Login
            </Title>

            <Form.Item
              name="email"
              rules={[
                {
                  type: "email",
                  message: "Please enter a valid E-mail!",
                  validateTrigger: ["onFinish"],
                },
                {
                  required: true,
                  message: "Please input your Email!",
                },
              ]}
            >
              <Input
                className="item-input"
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
                {
                  min: 6,
                  message: "Password at least 6 characters!",
                  validateTrigger: ["onFinish"],
                },
              ]}
            >
              <Input
                className="item-input"
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                Log in
              </Button>
            </Form.Item>

            <Title
              style={{ textAlign: "center", marginBottom: "1em", color: 'red' }}
              level={5}
            >
              {errorMessage}
            </Title>
          </Form>
        </Row>
      </Col>
    </Row>
  );
}
