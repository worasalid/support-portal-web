import { Col, DatePicker, Row, Select, Divider, Typography, Affix, Button, Avatar, Tabs } from "antd";
import React, { useState } from "react";
import "../../../styles/index.scss";
import { useHistory, useRouteMatch } from "react-router-dom";
import CommentBox from "../../../Component/Comment/Internal/Comment";
import ModalSupport from '../../../Component/Dialog/Internal/modalSupport'
import Historylog from "../../../Component/History/Customer/Historylog";
import Uploadfile from "../../../Component/UploadFile"
import SubjectDetails from "../../../Component/Subject/SubjectDetail";
import MasterPage from "../MasterPage";
import { UsbOutlined, UserOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TabPane } = Tabs;

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
        text: "Send To Dev",
        value: "sendtodev",
      },
      {
        text: "Resolved",
        value: "resolved",
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
  const [container, setContainer] = useState(null);
  const [divcollapse, setDivcollapse] = useState("block")
  const [collapsetext, setCollapsetext] = useState("Hide details")

  // Binding dropdownselect
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

  page.loaddata.IssueType = page.data.IssueTypeData.map((x) => ({ name: x.name, value: x.id, }));
  page.loaddata.Module = page.data.ModuleData.map((x) => ({ name: x.text, value: x.value, }));

  function HandleChange(value) {
    console.log(`selected ${value}`);
    setVisible(true);
    setProgressStatus(value);

  }

  return (
    <MasterPage>
      <div style={{ height: "100%" }} >
        <div className="scrollable-container" ref={setContainer} >
          <Affix target={() => container}>
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
          </Affix>

          <Row>
            {/* Content */}
            <Col span={16} style={{ paddingTop: 24 }}>
              <div style={{ height: "70vh", overflowY: "scroll" }}>
                {/* Issue Description */}
                <Row style={{marginRight:24}}>
                  <Col span={24}>
                    <label className="topic-text">ISSUE-00001-Subject : แจ้งปัญหา Link Error</label>
                    <div className="issue-detail-box">
                      <Row>
                        <Col span={16} style={{ display: "inline" }}>
                          <Typography.Title level={4}>
                            <Avatar size={32} icon={<UserOutlined />} />&nbsp;&nbsp; Help! This is a high priority request
                        </Typography.Title>
                        </Col>
                        <Col span={8} style={{ display: "inline", textAlign: "right" }}>
                          <Button type="link"
                            onClick={
                              () => {
                                return (
                                  setDivcollapse(divcollapse === 'none' ? 'block' : 'none'),
                                  setCollapsetext(divcollapse === 'block' ? 'Show details' : 'Hide details')
                                )
                              }
                            }
                          >{collapsetext}
                          </Button>
                        </Col>
                      </Row>
                      <Row>
                        <div style={{ display: divcollapse }}>
                          <p>
                            Track the priority of requests to spot problems quickly and
                           set tighter <strong>Service Level Agreement (SLA)</strong> goals.<br /> Customers can set their own priority when raising a
                            request, or you can hide it from customers and let your team
                           decide.
                          </p>

                        </div>
                      </Row>
                    </div>
                  </Col>
                </Row>

                {/* TAB */}
                <Row style={{ marginTop: 36 ,marginRight:24}}>
                  <Col span={24}>
                    <label className="header-text">Activity</label>
                    <Tabs defaultActiveKey="1">
                      <TabPane tab="Comments" key="1">
                        <CommentBox />
                      </TabPane>
                      <TabPane tab="History Log" key="2">
                        <Historylog />
                      </TabPane>
                    </Tabs>
                  </Col>
                </Row>
              </div>
            </Col>
            {/* Content */}

            {/* SideBar */}
            <Col span={6} style={{ backgroundColor: "", height: 500,marginLeft:20 }}>
                        <Row style={{ marginBottom: 30 }}>
                            <Col span={18}>
                                ProgressStatus<br />
                                <Select style={{ width: '100%' }} placeholder="None" onChange={HandleChange}>
                                    {page.loaddata.ProgressStatus}
                                </Select>
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: 30 }}>
                            <Col span={18}>
                                Priority<br />
                                <Select style={{ width: '100%' }} placeholder="None">
                                    {page.loaddata.Priority}
                                </Select>
                            </Col>
                        </Row>
       
                        <Row style={{ marginBottom: 30 }}>
                            <Col span={18}>
                                DueDate<br />
                                <DatePicker />
                            </Col>
                        </Row>

                    </Col>
            {/* SideBar */}
          </Row>
        </div>
      </div>

      <ModalSupport title={ProgressStatus} visible={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}></ModalSupport>
    </MasterPage>
  );
}
