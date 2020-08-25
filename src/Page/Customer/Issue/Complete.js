import { Button, Col, Dropdown, Menu, Row, Table, Typography, Tag, Divider, Select, DatePicker,Input } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ModalSendIssue from "../../../Component/Dialog/Customer/modalSendIssue";
import MasterPage from "../MasterPage";
import Column from "antd/lib/table/Column";
import { SearchOutlined } from "@ant-design/icons";

export default function Completed() {
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const [loading, setLoadding] = useState(false);
  const [loadticket, setLoadticket] = useState([]);
  const [ProgressStatus, setProgressStatus] = useState("");
  const { RangePicker } = DatePicker;

  let page = {
    data: {
      ProgressStatusData: [
        {
          text: "InProgress",
          value: "InProgress",
        },
        {
          text: "Cancel",
          value: "Complete",
        },
        {
          text: "Complete",
          value: "Complete",
        },
      ],
    },
    loaddata: {
      loadProgressStatus: [],
    },
  };

  const dataSource = [ 
    {
        key: '1',
        CompanyID: 'ICON',
        IssueID: 'IssueREM003',
        Subject: 'Subject : แจ้งปัญหา Link Error',
        tags: ['InProgress'],
        product: "REM",
        module: "SaleOrder",
        issuetype: "Bug",
        IssueBy: 'Admin System',
        IssueDate: '04/07/2020',
        Detail: 'รายละเอียดเพิ่มเติม',
        AssignTo: "ICON",
        ProgressStatus: "Complete",
        DueDate: "31/08/2020",
        OverDue: 0
    },
  ];

  const loadIssue = () => {
    // setLoadding(true);
    axios({
      url: "http://10.207.0.244/api/tickets",
      method: "GET",
      headers: {
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IuC4p-C4o-C4quC4pOC4qeC4juC4tOC5jCDguIjguLjguYnguKLguYDguIjguKPguLTguI0iLCJuYW1laWQiOiIxNiIsIlVzZXJJZCI6IjE2IiwibmJmIjoxNTk3Mjg4MDMxLCJleHAiOjE1OTc4OTI4MzEsImlhdCI6MTU5NzI4ODAzMX0.MORhQP-p0LsM-sPNGwG8IvCDjQWjwWNvZrPetejl6Dg",
      },
    })
      .then((res) => {
        setLoadding(false);
        setLoadticket(res.data);
      })
      .catch((err) => {
        setLoadding(false);
      });
  };

  useEffect(() => {
    // loadIssue();
  }, []);

  return (
    <MasterPage>
      <Row style={{ marginBottom: 16,textAlign:"left" }}>
        <Col span={24}>
          <label style={{ fontSize: 20, verticalAlign: "top" }}>รายการแจ้งปัญหา</label>
        </Col>
      </Row>
      <Row style={{ marginBottom: 16,textAlign:"right" }} gutter={[16, 16]}>
        <Col span={8}></Col>
        <Col span={8}>
         <Input placeholder="Subject" prefix="" suffix={<SearchOutlined/>}></Input>
        </Col>
        <Col span={6} className="gutter-row" >
          <RangePicker format="DD/MM/YYYY" />
        </Col>
        <Col span={2}>
          <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: "#00CC00" }} >
            Search
        </Button>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table dataSource={dataSource} loading={loading}>
            <Column
              title="Subject"
              render={(record) => {
                return (
                  <div>
                    <a href="/#"
                      onClick={(e) => {
                        e.preventDefault();
                        history.push({
                          pathname: "/Customer/Issue/Subject/" + record.IssueID,
                        });
                      }}
                    >
                      {record.IssueID + "-" + record.Subject}
                    </a>

                    <div style={{ marginTop: 4, fontSize: "smaller" }}>
                      {record.issuetype == 'Bug' ? <Tag color="#f50">{record.issuetype}</Tag> : <Tag color="#108ee9">{record.issuetype}</Tag>}
                      <span>{record.product}</span>
                      <Divider type="vertical" />
                      <span>{record.module}</span>
                    </div>
                  </div>
                );
              }}
            />
            <Column title="Issue Date" dataIndex="IssueDate" />
            <Column title="Due Date" dataIndex="DueDate" />
            <Column

              title="ProgressStatus"
              render={(record) => {
                return (
                  <Dropdown
                    overlayStyle={{
                      width: 300,
                      boxShadow:
                        "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.31) 0px 0px 1px",
                    }}
                    overlay={
                      <Menu
                        onSelect={(x) => console.log(x.selectedKeys)}
                        onClick={(x) => {
                          setVisible(true);
                          setProgressStatus(x.key);
                        }}
                      >
                        {page.data.ProgressStatusData.filter(
                          (x) => x.text !== record.ProgressStatus
                        ).map((x) => (
                          <Menu.Item key={x.text}>{x.text}</Menu.Item>
                        ))}
                      </Menu>
                    }
                    trigger="click"
                  >
                    {/* <Button type="link">{record.ProgressStatus}</Button> */}
                    <a href="/#">{record.ProgressStatus}</a>
                  </Dropdown>
                );
              }}
            />
          </Table>
        </Col>
      </Row>
      <ModalSendIssue
        title={ProgressStatus}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => {
          setVisible(false);
          loadIssue();
        }}
      />
      {/* </Spin> */}
    </MasterPage>
  );
}
