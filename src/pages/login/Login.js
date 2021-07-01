import { Form, Input, Button, Row, Col, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../../lib/use-auth";
import { useHistory, useLocation } from "react-router-dom";
import { useState } from "react";

const { Title } = Typography;

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState("");

  const auth = useAuth();

  let history = useHistory();
  let location = useLocation();

  //login
  const onFinish = (values) => {
    console.log("Received values of form: ", values);

    // let { from } = location.state || { from: { pathname: "/" } };

    auth
      .signin(values.email, values.password, () => {
        history.replace("/");
      })
      .then(({ user, error }) => {
        if (error) {
          setErrorMessage(error.message);
        }
      });
  };

  return (
    <div
      className="body-login"
      style={{ backgroundImage: `url(/img/AdobeStock_1.jpeg)` }}
    >
      <Row justify="center">
        <Col className="form-outside-login">
          <Row justify="center">
            <Title
              className="text-login"
              style={{
                color: "whitesmoke",
                lineHeight: "2.5em",
              }}
              level={1}
            >
              Login
            </Title>

            <Title
              style={{
                textAlign: "center",
                marginBottom: "1.5em",
                marginTop: "0em",
                color: "#1da57a",
              }}
              level={3}
            >
              Welcome to AVS system!
            </Title>

            <Form
              name="normal_login"
              className="login-form"
              initialValues={{}}
              onFinish={onFinish}
            >
              {/* <Title
                style={{ textAlign: "center", marginBottom: "1em", backgroundColor: '#1da57a', color: 'whitesmoke' }}
                level={1}
              >
                Login
              </Title> */}

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
                style={{
                  textAlign: "center",
                  // marginBottom: "1em",
                  color: "red",
                }}
                level={5}
              >
                {errorMessage}
              </Title>
            </Form>
          </Row>
        </Col>
      </Row>
      <Row justify="center">
        <Title
          style={{
            color: "whitesmoke ", //"#1da57a",
            marginBottom: "0em",
            fontSize: "14px",
            position: "fixed",
            bottom: "1em",
          }}
          level={5}
        >
          FPT University
        </Title>
      </Row>
    </div>
  );
}
