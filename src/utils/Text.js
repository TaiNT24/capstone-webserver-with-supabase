import { Typography } from "antd";

const { Title } = Typography;

export const MainTitle = (props, rest = {}) => {
  return <Title level={2} {...rest}>{props.value}</Title>;
};
