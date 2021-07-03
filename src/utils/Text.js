import { Typography, Row } from "antd";

const { Title } = Typography;

export const MainTitle = (props) => {
      
      return (
        <Row className="row-center-ele">
          <Title level={props.level??2} {...props}>{props.value}</Title>
        </Row>
      );
};
