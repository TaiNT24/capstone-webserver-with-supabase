import { Form, Input, Button, Row, Col, Typography, Spin } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useAuth } from "../../lib/use-auth";
import { Link, useHistory } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import img from "../../lib/img/background_login_min.jpeg";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LoadingOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

export default function RecoveryPassword() {
  localStorage.clear();

  const [errorMessage, setErrorMessage] = useState("");
  const [isResetSuccess, setIsResetSuccess] = useState(false);

  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState();

  const actionButton = "Reset Password";
  const textTitle = "Reset Password";

  const passwordRef = useRef();

  const auth = useAuth();

  // console.log("token: ", new URLSearchParams(window.location.href)
  // .get("http://localhost:3000/recovery-password#access_token"));

  let history = useHistory();

  useEffect(() => {
    let token = new URLSearchParams(window.location.href).get(
      process.env.REACT_APP_PATH_LINK_RECOVERY_PASSWORD
    );

    console.log("history: ", history.location.pathname);
    if (history.location.pathname === "/") {
      history.push("/login");
    }
    if (token !== null) {
      setAccessToken(token);
    }
    localStorage.clear();

    // eslint-disable-next-line
  }, []);

  // useEffect(() => {

  // })

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    console.log("accessToken: ", accessToken);
    setLoading(true);
    if (!accessToken) {
      setErrorMessage(
        "Your session is expired, please send reset password request again"
      );
      setLoading(false);
    } else {
      auth
        .updatePassword(accessToken, values.password, () => {
          // history.replace("/");
        })
        .then(({ data, error }) => {
          if (error) {
            setErrorMessage(error.message);
          }else {
            // setErrorMessage("Update password success!");
            setIsResetSuccess(true);
          }
          console.log("data update: ", data);
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
              {!isResetSuccess ? (
                <Form
                  name="normal_login"
                  className="login-form"
                  initialValues={{}}
                  onFinish={onFinish}
                >
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
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="password"
                      placeholder="Confirm Password"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                      ref={passwordRef}
                    />
                  </Form.Item>

                  <Form.Item
                    name="confirm_password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Confirm Password!",
                      },
                      {
                        min: 6,
                        message: "Confirm Password at least 6 characters!",
                        validateTrigger: ["onFinish"],
                      },
                      {
                        validateTrigger: "onSubmit",
                        validator: (_, value) => {
                          let password = passwordRef.current.state.value;
                          if (value !== password) {
                            return Promise.reject(
                              "Confirm password does not match password!"
                            );
                          } else {
                            return Promise.resolve();
                          }
                        },
                      },
                    ]}
                  >
                    <Input.Password
                      className="item-input"
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="password"
                      placeholder="Password"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                    >
                      {actionButton}
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
              ) : (
                <>
                  <Title
                    style={{
                      textAlign: "center",
                      marginLeft: "1em",
                      color: "green",
                    }}
                    level={3}
                  >
                    Update password successfully
                  </Title>
                  <Title
                    style={{
                      textAlign: "center",
                      marginTop: "2em",
                      color: "#5f6d65",
                    }}
                    level={5}
                  >
                    Go to <Link to="/login">Login</Link>
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
