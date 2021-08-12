import { Modal, message } from "antd";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { deleteVehicle } from "../store/Store";

const key = "delete";

function ConfirmDeleteVehicle(props) {
  let history = useHistory();

  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const modalText = "This vehicle will be deleted and staffs who can control this vehicle cannot control anymore.";

  const showModal = () => {
    setVisible(true);
  };

  useEffect(() => {
    if (props.showConfirm) {
      showModal();
    }
  }, [props.showConfirm]);

  const handleOk = () => {
    // setModalText("Delete ...");
    // message.loading({ content: "Deleting...", key });
    setConfirmLoading(true);
    let time = Math.floor(Math.random() * 10 + 1) * 10;

    setTimeout(() => {
      setVisible(false);
      setConfirmLoading(false);

      deleteVehicle(props.id).then((res) => {
        if (res[0]?.id === props.id) {
          //success
          message.success({
            content: "Delete vehicle successfully!",
            key,
            duration: 2,
          });
          history.replace("/vehicles");
        } else {
          message.error({
            content: `Delete error! message: ${res}`,
            key,
            duration: 2,
          });
          handleCancel();
        }
      });
    }, time);
  };

  const handleCancel = () => {
    setVisible(false);
    props.cancleDelete();
  };

  return (
    <>
      <Modal
        title={`Delete Vehicle: ${props.code}`}
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="Yes"
      >
        <p>{modalText}</p>
      </Modal>
    </>
  );
}

export default ConfirmDeleteVehicle;
