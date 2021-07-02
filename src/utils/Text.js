import { Typography, Row } from "antd";

const { Title } = Typography;

export const MainTitle = (props, rest = {}) => {
      
      return (
        <Row className="row-center-ele">
          <Title level={2} {...rest}>{props.value}</Title>
        </Row>
      );
};
