import { Select } from "antd";

const { Option } = Select;

const FilterDevice = (props) => {
  const handleChange = (value) => {
    props.onChangeDeviceFilter(value);
  };

  const renderListIdDevice = () => {
    const children = [];

    props.idDeviceList.map((e) => {
      return children.push(<Option key={e.id} value={e.id}>{e.code}</Option>);
    });

    return children;
  };

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
        {renderListIdDevice()}
      </Select>
      <br />
    </>
  );
};

export default FilterDevice;
