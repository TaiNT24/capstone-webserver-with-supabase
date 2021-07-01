import { Table, Layout, Typography } from "antd";
import { Link } from "react-router-dom";
import {
  fetchStaff,
  fetchStaffCount,
  updateStatusStaff,
} from "../../lib/Store";
import { useState, useEffect } from "react";
import UpdateStatusButton from "../../component/UpdateStatusButton";
import StaffProfile from "./StaffProfile";

const { Title } = Typography;
const { Content } = Layout;

export default function Staff(props) {
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState();

  const [showProfile, setShowProfile] = useState(false);
  const [idProfile, setIdProfile] = useState();

  const onOpenProfile = (id) => {
    setIdProfile(id);
    setShowProfile(true);
  };

  const onCloseProfile = (id) => {
    setIdProfile(null);
    setShowProfile(false);
  };

  const columns = [
    {
      title: "Email",
      width: 200,
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Full name",
      width: 150,
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Date created",
      dataIndex: "date_create",
      key: "8",
      width: 150,
    },
    {
      title: "Status",
      width: 100,
      dataIndex: "status",
      key: "status",
      render: (tag) => <UpdateStatusButton tag={tag} />,
    },
    {
      title: "Action",
      key: "operation",
      dataIndex: "operation",
      fixed: "right",
      width: 100,
      render: (id) => {
        {
          /* <Link to={{ pathname: `/staff/${id}` }}>View Detail</Link> */
        }
        return (
          <a onClick={() => onOpenProfile(id)} key={id}>
            View Profile
          </a>
        );
      },
    },
  ];

  useEffect(() => {
    fetchStaffCount().then((count) => {
      setTotalPage(count);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchStaff(currentPage - 1).then((staffs) => {
      mapStaffToData(staffs);
    });
  }, [currentPage]);

  function mapStaffToData(staffs) {
    let dataTable = [];
    if (staffs != null) {
      staffs.map((staff, index) => {
        dataTable.push({
          key: staff.id,
          email: staff.email,
          fullname: staff.full_name,
          status: {
            id: staff.id,
            status: staff.status === 0 ? "ACTIVE" : "INACTIVE",
          },
          date_create: staff.date_create,
          operation: staff.id,
        });

        return dataTable;
      });
    }

    setData(dataTable);
    setLoading(false);
  }

  return (
    <Layout>
      <Content style={{ textAlign: "center" }}>
        <Title level={2}>Staffs</Title>
      </Content>

      <Table
        columns={columns}
        dataSource={data}
        scroll={{ y: 460 }}
        loading={loading}
        pagination={{
          pageSize: 8,
          total: totalPage,
          onChange: (page) => setCurrentPage(page),
          // position: ['topRight']
        }}
      />

      {showProfile ? (
        <StaffProfile
          showProfile={showProfile}
          id={idProfile}
          onCloseProfile={onCloseProfile}
        />
      ) : null}
    </Layout>
  );
}
