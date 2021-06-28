import { Table, Layout, Typography, Tag } from "antd";
import { Link } from "react-router-dom";
import { fetchStaff, fetchStaffCount } from "../../lib/Store";
import { useState, useEffect } from "react";

const { Title } = Typography;
const { Content } = Layout;

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
    render: (tag) => {
      let color = "green";
      if (tag.toLowerCase() === "inactive") {
        color = "volcano";
      }

      return (
        <Tag color={color} key={tag}>
          {tag.toUpperCase()}
        </Tag>
      );
    },
  },
  {
    title: "Action",
    key: "operation",
    dataIndex: "operation",
    fixed: "right",
    width: 100,
    render: (id) => <Link to={{ pathname: `/staff/${id}` }}>View Detail</Link>,
  },
];

// for (let i = 0; i < 5; i++) {
//   data.push({
//     key: i,
//     email: `nguyentutai${i}@gmail.com`,
//     fullname: "Nguyen Tu Tai",
//     status: i ===2 ? 'inactive' : 'active',
//     date_create: "today",
//     operation: i,
//   });
// }

export default function Staff(props) {
    const [data, setData] = useState(null);
    const [totalPage, setTotalPage] = useState(0);

    useEffect(() => {
      fetchStaffCount().then((count) => {
        setTotalPage(count);
      })
    }, []);

    useEffect(() => {
        fetchStaff().then((staffs) =>{
            let dataTable = [];
            if(staffs != null){
                staffs.map((staff, index) => {
                    dataTable.push({
                        key: staff.id,
                        email: staff.email,
                        fullname: staff.full_name,
                        status: staff.status === 0 ? 'active' : 'inactive',
                        date_create: staff.date_create,
                        operation: staff.id,
                      });
        
                      return dataTable;
                });
            }
        
            setData(dataTable);
        });
    }, []);
    
    function changePage(page) {
      fetchStaff(page - 1).then((staffs) =>{
        let dataTable = [];
        if(staffs != null){
            staffs.map((staff, index) => {
                dataTable.push({
                    key: staff.id,
                    email: staff.email,
                    fullname: staff.full_name,
                    status: staff.status === 0 ? 'active' : 'inactive',
                    date_create: staff.date_create,
                    operation: staff.id,
                  });
    
                  return dataTable;
            });
        }
    
        setData(dataTable);
    });
    }
    
  return (
    <Layout>
      <Content style={{ textAlign: "center" }}>
        <Title level={3}>Staffs</Title>
      </Content>

      <Table
        columns={columns}
        dataSource={data}
        scroll={{}}
        pagination={{ pageSize: 8, total: totalPage, onChange: changePage }}
      />
    </Layout>
  );
}
