import { Select } from "antd";
import { useEffect, useState } from "react";

const { Option } = Select;

const FilterDevice = (props) => {
  const [listDevice, setListDevice] = useState();

  const handleChange = (value) => {
    props.onChangeDeviceFilter(value);
  };

  useEffect(() => {
    const children = [];

    if (props.idDeviceList != null) {

      props.idDeviceList.map((e) => {
        return children.push(
          <Option key={e.id} value={e.id}>
            {e.code}
          </Option>
        );
      });
    }

    setListDevice(children);
  }, [props.idDeviceList]);

  return (
    <>
      <Select
        mode="multiple"
        allowClear
        style={{ width: "40%", alignSelf: "center", marginLeft: "1em" }}
        placeholder="Choose Filter ID Device"
        defaultValue={[]}
        onChange={handleChange}
      >
        {listDevice}
      </Select>
      <br />
    </>
  );
};

export default FilterDevice;
