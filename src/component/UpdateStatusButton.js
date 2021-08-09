import { Switch, Popconfirm } from "antd";
import { useState, useEffect } from "react";
import { updateStatusStaff } from "../lib/Store";

export default function UpdateStatusButton(props) {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [idUpdate, setIdUpdate] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState(true);
  const [tag, setTag] = useState({});
  const [loadingUpdateStatus, setLoadingUpdateStatus] = useState(false);
  const [isCheckItem, setIsCheckItem] = useState();

  useEffect(() => {
    setTag(props.tag);
    setIsCheckItem(props.tag.status === "ACTIVE");
    setIdUpdate(props.tag.id);
  }, [props.tag]);  //netlify suggess

  const showPopconfirm = () => {
    setVisible(true);
    setLoadingUpdateStatus(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);

    updateStatusStaff(idUpdate, statusUpdate).then((dataReturn) => {
      setTag({
        id: dataReturn.id,
        status: dataReturn.status === 0 ? "ACTIVE" : "INACTIVE",
      });
      setVisible(false);
      setConfirmLoading(false);
      setLoadingUpdateStatus(false);
      setIsCheckItem(!isCheckItem);
      if(props.updateSuccess) {
        props.updateSuccess();
      }
    });
  };

  const handleCancel = () => {
    setVisible(false);
    // setIdUpdate(null);
    setStatusUpdate(true);
    setLoadingUpdateStatus(false);
    setIsCheckItem(isCheckItem);
  };

  function changeStatus(isChecked, event) {
    showPopconfirm();
    // setIdUpdate(id);
    setStatusUpdate(isChecked);
  }

  return (
    <>
      <Popconfirm
        title="Are you sure to deactivate this account"
        visible={visible}
        onConfirm={handleOk}
        okButtonProps={{ loading: confirmLoading }}
        onCancel={handleCancel}
        okText="Yes"
      >
        <Switch
          loading={loadingUpdateStatus}
          checkedChildren={tag?.status}
          unCheckedChildren={tag?.status}
          checked={isCheckItem}
          onChange={(checked, event) => changeStatus(checked, event)}
        />
      </Popconfirm>
    </>
  );
}
