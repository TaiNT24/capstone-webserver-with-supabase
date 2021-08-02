import { Modal, message, Form, Input } from "antd";
import { useEffect, useState } from "react";
import { onCreateNewDevice } from "../../lib/Store";

const key = "insert_new_vehicle";

export default function NewVehicle(props) {
  const [onOpen, setOnOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    if (props.openModal) {
      setOnOpen(props.openModal);
    }
  }, [props.openModal]);

  function handleSubmit() {
    form
      .validateFields()
      .then((values) => {
        setLoading(true);

        console.log("Values on submit: " + values);
        message.loading({ content: "Creating new vehicle...", key });

        onCreateNewDevice(values).then((dataRes) => {
          if (dataRes.length > 0) {
            handleCloseModal();

            message.success({
              content: "Create new vehicle successful!",
              key,
              duration: 2,
            });
          } else {
            console.log("Error_onCreateNewDevice: " + onCreateNewDevice);
            message.error({
              content: `Create new vehicle error! message: ${dataRes}`,
              key,
              duration: 2,
            });
          }
        });
      })
      .catch((info) => {
        setLoading(false);
        console.log("Validate Failed:", info);
      });
  }

  function handleCloseModal() {
    setOnOpen(false);
    setLoading(false);

    form.resetFields();
    props.closeModal();
  }

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Modal
        title="Create new vehicle"
        // style={{ top: 150 }}
        // centered
        visible={onOpen}
        okText="Create"
        cancelText="Cancel"
        onOk={handleSubmit}
        onCancel={handleCloseModal}
        confirmLoading={loading}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Code"
            name="code"
            rules={[
              {
                required: true,
                message: "Please input code!",
              },
              {
                pattern: /^(?:\d*)$/,
                message: "Code is only contains digits",
                validateTrigger: "onSubmit",
              },
              {
                len: 4,
                message: "Code has to be 4 digits",
                validateTrigger: "onSubmit",
              },
              {
                validateTrigger: "onSubmit",
                validator: (_, value) => {
                  let arr = props.devices.filter(
                    (device) => device.code === value
                  );

                  if (arr.length > 0 && arr[0].code === value) {
                    setLoading(false);
                    return Promise.reject("Dupplicate code");
                  } else {
                    return Promise.resolve();
                  }
                },
              },
            ]}
          >
            <Input type="text" />
          </Form.Item>

          <Form.Item
            label="Mac Address"
            name="mac_address"
            rules={[
              {
                required: true,
                message: "Please input mac address!",
              },
              {
                validateTrigger: "onSubmit",
                validator: (_, value) => {
                  let arr = props.devices.filter(
                    (device) => device.mac_address === value
                  );

                  if (arr.length > 0 && arr[0].mac_address === value) {
                    setLoading(false);
                    return Promise.reject("Dupplicate mac address");
                  } else {
                    return Promise.resolve();
                  }
                },
              },
              {
                pattern:
                  '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$|^([0-9a-fA-F]{4}\\.[0-9a-fA-F]{4}\\.[0-9a-fA-F]{4})$',
                message: "Please input valid mac address's vehicle",
                validateTrigger: "onSubmit",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
