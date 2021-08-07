import { Form, Input, Button, Row, Col, Typography, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "../../lib/use-auth";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import img from "../../lib/img/background_login_min.jpeg";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LoadingOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const login = "Login";
const forget_password = "Reset Password";

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(login);
  const [linkButtonText, setLinkButtonText] = useState(forget_password);

  const [actionButton, setActionButton] = useState(login);
  const [textTitle, setTextTitle] = useState(login);

  const [sendRequestResetPasswordSuccess, setSendRequestResetPasswordSuccess] =
    useState(false);

  function onclickBtnLink() {
    if (linkButtonText === forget_password) {
      setLinkButtonText(login);
      setType(forget_password);
      setActionButton(forget_password);
      setTextTitle(forget_password);
    } else if (linkButtonText === login) {
      setLinkButtonText(forget_password);
      setType(login);
      setActionButton(login);
      setTextTitle(login);
    }
    setErrorMessage("");
  }
  const auth = useAuth();

  let history = useHistory();

  //login
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    setLoading(true);

    // let { from } = location.state || { from: { pathname: "/" } };

    if (type === login) {
      auth
        .signin(values.email, values.password, () => {
          history.replace("/");
        })
        .then(({ user, error }) => {
          if (error) {
            setErrorMessage(error.message);
            setLoading(false);
          }
        });
    } else if (type === forget_password) {
      auth.recoveryPassword(values.email).then(({ data, error }) => {
        if (error) {
          setErrorMessage(error.message);
        } else {
          setSendRequestResetPasswordSuccess(true);
        }
        setLoading(false);
      });
    }
  };

  const iconLoading = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <div
      className="body-login"
      style={{ backgroundImage: `url(${img})`, height: "100vh" }}
    >
      <Spin indicator={iconLoading} spinning={loading}>
        <Row justify="center">
          <Col
            className="form-outside-login"
            style={{ boxShadow: "rgb(171 171 171 / 62%) 0px 0px 10px 6px" }}
          >
            <Row justify="center">
              <Title
                className="text-login"
                style={{
                  color: "whitesmoke",
                  lineHeight: "2.5em",
                }}
                level={1}
              >
                {textTitle}
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

              {!sendRequestResetPasswordSuccess ? (
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

                  {type === login ? (
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
                      <Input.Password
                        className="item-input"
                        prefix={
                          <LockOutlined className="site-form-item-icon" />
                        }
                        type="password"
                        placeholder="Password"
                        iconRender={(visible) =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                      />
                    </Form.Item>
                  ) : null}

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                    >
                      {actionButton}
                    </Button>
                  </Form.Item>

                  <Button
                    type="link"
                    className="link-button"
                    onClick={onclickBtnLink}
                  >
                    {linkButtonText}
                  </Button>

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
              ) : (
                <>
                  <Title
                    style={{
                      textAlign: "center",
                      // marginBottom: "1em",
                      color: "green",
                    }}
                    level={3}
                  >
                    Please check your email
                  </Title>
                  <Title
                    style={{
                      textAlign: "center",
                      // marginBottom: "1em",
                      color: "#5f6d65",
                    }}
                    level={5}
                  >
                    We had send a email to you. In order to complete the email
                    verification process, you must click on the link inside.
                  </Title>
                </>
              )}
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
      </Spin>
    </div>
  );
}
