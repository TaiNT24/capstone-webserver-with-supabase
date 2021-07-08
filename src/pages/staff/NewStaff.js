import { useState, useEffect } from "react";
import { Drawer, Row, Col, Divider, Steps, Button, Spin } from "antd";
import NewStaffInfo from "../../component/NewStaffInfo";
import MappingDeviceToUser from "../../component/MappingDeviceToUser";
import { MainTitle } from "../../utils/Text";
import ConfirmCreateStaff from "../../component/ConfirmCreateStaff";
import { onCreateNewStaff, onInsertMappingDevice } from "../../lib/Store";
import ReviewNewStaff from "../../component/ReviewNewStaff";

const { Step } = Steps;

export default function NewStaff(props) {
  const [visible, setVisible] = useState(false);

  const [current, setCurrent] = useState(0);

  const [dataStaff, setDataStaff] = useState(null);
  const [selectedListDevice, setSelectedListDevice] = useState([]);
  const [defaultChildrenDevice, setDefaultChildrenDevice] = useState([]);
  const [dataStaffResponse, setDataStaffResponse] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setVisible(props.showNewStaff);
  }, [props.showNewStaff]);

  function onNextStep(dataStaffInput) {
    setDataStaff(dataStaffInput);
    setCurrent(1);
  }

  return (
    <Drawer
      width={800}
      placement="right"
      closable={false}
      onClose={() => props.onCloseNewStaff()}
      visible={visible}
    >
      <Row>
        <Col span={6}>
          <Steps current={current} direction="vertical">
            <Step title="Information" description="Staff information." />
            <Step title="Assign Vehicle" />
            <Step title="Confirmation" />
            <Step title="Review" />
          </Steps>
        </Col>

        <Divider type="vertical" style={{ height: "100vh" }} />

        <Col span={16} offset={1}>
          {current === 0 ? (
            <NewStaffInfo onNextStep={onNextStep} initDataStaff={dataStaff} />
          ) : current === 1 ? (
            <>
              <MainTitle value="Vehicle Control Assignment" />

              <MappingDeviceToUser
                isDisable={false}
                id={null}
                defaultChildrenDevice={defaultChildrenDevice}
                getSelectedList={(value) => setSelectedListDevice(value)}
                {...props}
              />

              <Row
                justify="center"
                style={{ position: "absolute", bottom: "5em", left: "9em" }}
              >
                <Button
                  // type="primary"
                  // danger
                  // icon={<CloseCircleOutlined />}
                  style={{ width: "8em" }}
                  onClick={() => {
                    setCurrent(0);
                  }}
                >
                  Previous
                </Button>

                <Button
                  style={{ marginLeft: "2em", width: "8em" }}
                  type="primary"
                  // icon={<EditOutlined />}
                  onClick={() => {
                    setDefaultChildrenDevice(selectedListDevice);
                    setCurrent(2);
                  }}
                >
                  {selectedListDevice.length > 0 ? "Next" : "Skip"}
                </Button>
              </Row>
            </>
          ) : current === 2 ? (
            <>
              <Spin size="large" spinning={loading}>
                <ConfirmCreateStaff
                  user={dataStaff}
                  selectedListDevice={selectedListDevice}
                />

                <Row
                  justify="center"
                  style={{ position: "absolute", bottom: "5em", left: "9em" }}
                >
                  <Button
                    style={{ width: "8em" }}
                    onClick={() => {
                      setCurrent(1);
                    }}
                  >
                    Previous
                  </Button>

                  <Button
                    style={{ marginLeft: "2em", width: "8em" }}
                    type="primary"
                    onClick={() => {
                      setLoading(true);

                      onCreateNewStaff(dataStaff).then((res) => {
                        if (res.error) {
                          let message = res.error.message;
                          console.log("error_onCreateNewStaff_response: ", message);
                          setLoading(false);
                        } else {
                          let staff = {
                            id: res.data.data[0].id,
                            email: res.data.data[0].email,
                            password: res.data.data[0].origin_password,
                            birthday: res.data.data[0].birthday,
                            fullname: res.data.data[0].full_name,
                            role: res.data.data[0].role,
                          };
                          setDataStaffResponse(staff);

                          let devices = [];
                          if (props.devices && selectedListDevice.length > 0) {
                            selectedListDevice.map((deviceSelected) => {
                              let id = props.devices.filter(
                                (device) => device.code === deviceSelected
                              )[0].id;

                              devices.push({
                                id: id,
                              });
                              return null;
                            });

                            onInsertMappingDevice(staff.id, devices).then(
                              (res) => {
                                setLoading(false);

                                if (res) {
                                  // debugger
                                  setCurrent(3);
                                }
                              }
                            );
                          }else if(selectedListDevice.length === 0){
                            setLoading(false);
                            setCurrent(3);

                          }
                        }
                      });
                    }}
                  >
                    Create staff
                  </Button>
                </Row>
              </Spin>
            </>
          ) : (
            <>
              <ReviewNewStaff
                newStaff={dataStaffResponse}
                selectedListDevice={selectedListDevice}
              />

              <Row
                justify="center"
                style={{ position: "absolute", bottom: "5em", left: "5em" }}
              >
                <Button
                  type="primary"
                  style={{ width: "8em" }}
                  onClick={() => {
                    props.onCloseNewStaff();
                  }}
                >
                  Done
                </Button>

                <Button
                  type="primary"
                  style={{ width: "12em", marginLeft: "2em" }}
                  onClick={() => {
                    props.onCloseNewStaff();
                    //send mail
                  }}
                >
                  Send email to staff
                </Button>
              </Row>
            </>
          )}
        </Col>
      </Row>
    </Drawer>
  );
}
