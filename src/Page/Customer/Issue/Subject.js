import { Col, DatePicker, Row, Select, Divider, Typography } from "antd";
import React, { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import CommentBox from "../../../Component/Comment/Customer/Comment";
import ModalSendIssue from "../../../Component/Dialog/Customer/modalSendIssue";
import SubjectDetails from "../../../Component/Subject/SubjectDetail";
import MasterPage from "../MasterPage";

const { Option } = Select;

let page = {
  data: {
    PriorityData: [
      {
        text: "Low",
        id: "Low",
      },
      {
        text: "Medium",
        id: "Medium",
      },
      {
        text: "High",
        id: "High",
      },
    ],
    IssueTypeData: [
      {
        name: "Bug",
        id: "Bug",
      },
      {
        name: "Data",
        id: "Data",
      },
      {
        name: "Use",
        id: "Use",
      },
      {
        name: "New Requirement",
        id: "New Requirement",
      },
    ],
    AssignTodata: [
      {
        text: "Worasalid",
        value: "Worasalid",
      },
      {
        text: "Admin",
        value: "Admin",
      },
      {
        text: "Support",
        value: "Support",
      },
      {
        text: "Developer",
        value: "Developer",
      },
    ],
    ProgressStatusData: [
      {
        text: "Cancel",
        value: "Cancel",
      },
      {
        text: "Complete",
        value: "Complete",
      },
    ],
    ModuleData: [
      {
        text: "CRM",
        value: "CRM",
      },
      {
        text: "Finance",
        value: "Finance",
      },
      {
        text: "SaleOrder",
        value: "SaleOrder",
      },
      {
        text: "Report",
        value: "Report",
      },
      {
        text: "PrintForm",
        value: "PrintForm",
      },
    ],
  },
  loaddata: {
    Priority: [],
    IssueType: [],
    AssignTo: [],
    ProgressStatus: [],
    Module: [],
  },
};

export default function Subject() {
  const match = useRouteMatch();

  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const [Priority, setPriority] = useState("");
  const [DueDate, setDueDate] = useState("");
  const [ProgressStatus, setProgressStatus] = useState("");

  // Binding แบบวนลูปสร้าง html tag ของ dropdownselect
  // page.data.PriorityData.forEach(x => page.loaddata.Priority.push(<Option value={x.id} >{x.text}</Option>))
  page.loaddata.Priority = page.data.PriorityData.map((x) => (
    <Option value={x.id}>{x.text}</Option>
  ));
  page.loaddata.AssignTo = page.data.AssignTodata.map((x) => (
    <Option value={x.value}>{x.text}</Option>
  ));
  page.loaddata.ProgressStatus = page.data.ProgressStatusData.map((x) => (
    <Option value={x.value}>{x.text}</Option>
  ));

  // Binding แบบ map กำหนดค่าใส่ attribute ของ dropdownselect ได้เลย (ใช้ attribute option={obj})
  // ใส่ obj ที่มีชื่อ name กับ value
  page.loaddata.IssueType = page.data.IssueTypeData.map((x) => ({
    name: x.name,
    value: x.id,
  }));
  page.loaddata.Module = page.data.ModuleData.map((x) => ({
    name: x.text,
    value: x.value,
  }));

  function HandleChange(value) {
    console.log(`selected ${value}`);
    setVisible(true);
    setProgressStatus(value);
  }

  return (
    <MasterPage>
      <Row>
        <Col>
          <a
            href="/#"
            onClick={(e) => {
              e.preventDefault();
              history.goBack();
            }}
          >
            Back
          </a>
        </Col>
      </Row>
      <Row>
        {/* Content */}
        <Col span={16} style={{paddingTop: 24}}>
          <Row>
            <Col>
              <Typography.Title level={4}>
                Help! This is a high priority request
              </Typography.Title>
              <div>
                <p>
                  Track the priority of requests to spot problems quickly and
                  set tighter <strong>Service Level Agreement (SLA)</strong> goals.<br /> Customers can set their own priority when raising a
                  request, or you can hide it from customers and let your team
                  decide.
                </p>
                <p>Try it out</p>
                <p>
                  Assign yourself and add a comment to stop the{" "}
                  <strong>Time to First Response</strong>
                  <br />
                  SLA from counting down. Resolve the request to stop all SLAs
                  completely.
                </p>
              </div>
            </Col>
          </Row>
          <Row style={{ marginTop: 36 }}>
            <Col>
              <b>Comments</b>
              <Divider style={{ marginTop: 4 }} />
              <CommentBox />
            </Col>
          </Row>
        </Col>

        {/* SideBar */}
        <Col
          span={6}
          style={{ backgroundColor: "#fafafa", padding: 24 }}
        >
          <Row style={{ marginBottom: 30 }}>
            <Col span={18}>
              Progress Status:
              <br />
              <Select
                style={{ width: "100%", marginTop: 8 }}
                placeholder="None"
                onChange={HandleChange}
              >
                {page.loaddata.ProgressStatus}
              </Select>
            </Col>
          </Row>
          <Row style={{ marginBottom: 30 }}>
            <Col span={18}>
              ICON Due Date:
              <br />
              <span>30/08/2020</span>
            </Col>
          </Row>
        </Col>
        {/* SideBar */}
      </Row>

      <ModalSendIssue
        title={ProgressStatus}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => {
          setVisible(false);
        }}
      />
    </MasterPage>
  );
}
