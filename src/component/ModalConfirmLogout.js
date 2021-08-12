import { Modal } from "antd";
import { useState, useEffect } from "react";
import { useAuth } from "../store/use-auth";
import { useHistory } from "react-router-dom";


function ModalConfirmLogout(props) {
  const auth = useAuth();
  let history = useHistory();

  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Are you sure to logout!");

  const showModal = () => {
    setVisible(true);
  };

  useEffect(() => {
    if(props.showConfirm){
      showModal();
    }
  },[props.showConfirm]);

  const handleOk = () => {
    setModalText("Logout ...");
    setConfirmLoading(true);
    let time =  Math.floor((Math.random() * 10) + 1)*10;

    setTimeout(() => {
      setVisible(false);
      setConfirmLoading(false);

      auth.signout(() => {
        history.replace("/login");
      });
    }, time);

  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setVisible(false);
    props.cancleLogout();
  };

  return (
    <>
      <Modal
        title="Logout"
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

export default ModalConfirmLogout;
