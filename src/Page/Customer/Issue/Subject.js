import { Col, DatePicker, Row, Select, Divider, Typography, Affix, Button, Avatar, Tabs } from "antd";
import React, { useState, useEffect } from "react";
import "../../../styles/index.scss";
import { useHistory, useRouteMatch } from "react-router-dom";
import CommentBox from "../../../Component/Comment/Customer/Comment";
import ModalSendIssue from "../../../Component/Dialog/Customer/modalSendIssue";
import Historylog from "../../../Component/History/Customer/Historylog";
import Uploadfile from "../../../Component/UploadFile"
import SubjectDetails from "../../../Component/Subject/SubjectDetail";
import MasterPage from "../MasterPage";
import { UserOutlined } from "@ant-design/icons";
import Axios from "axios";

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
  const [container, setContainer] = useState(null);
  const [divcollapse, setDivcollapse] = useState("block")
  const [collapsetext, setCollapsetext] = useState("Hide details")

  const [ticketdata, setTicketdata] = useState([]);

  const getdetail = async () => {
    try {
      const ticket_detail = await Axios({
        url: process.env.REACT_APP_API_URL + "/tickets/loaddetail",
        method: "GET",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
        params: {
          ticketId: match.params.id
        }
      });
      if (ticket_detail.status === 200) {
        setTicketdata(ticket_detail.data.map((values) => {
          return {
            ticket_number: values.Number,
            type: values.Type,
            title: values.Title,
            description: values.Description,
            ticket_date: new Date(values.CreateDate).toLocaleDateString() + " : " + new Date(values.CreateDate).toLocaleTimeString(),
            customer_name: values.CustomerName
          }
        }));

      }
    } catch (error) {

    }
  }

  function HandleChange(value) {
    setVisible(true);
    setProgressStatus(value);

  }

  useEffect(() => {
    getdetail()
  }, [])

  // console.log("ticket_detail", ticket_details[0].ticket_number);
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
            <Col span={16} style={{ paddingTop: 0 }}>
              <div style={{ height: "80vh", overflowY: "scroll" }}>
                {/* Issue Description */}
                <Row style={{ marginRight: 24 }}>
                  <Col span={24}>
                <label className="topic-text">{ticketdata[0] && ticketdata[0].ticket_number}</label>
                    <div className="issue-detail-box">
                      <Row>
                        <Col span={16} style={{ display: "inline" }}>
                          <Typography.Title level={4}>
                            <Avatar size={32} icon={<UserOutlined />} />&nbsp;&nbsp;  {ticketdata[0] && ticketdata[0].title}
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
                           {ticketdata[0] && ticketdata[0].description}
                          </p>

                        </div>
                      </Row>
                    </div>
                  </Col>
                </Row>

                {/* TAB */}
                <Row style={{ marginTop: 36, marginRight: 24 }}>
                  <Col span={24}>
                    <label className="header-text">Activity</label>
                    <Tabs defaultActiveKey="1">
                      <TabPane tab="Comment" key="1">
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
            <Col
              span={6}
              style={{ backgroundColor: "#fafafa", padding: 24 }}
            >
              <Row style={{ marginBottom: 30 }}>
                <Col span={18}>
                  <label className="header-text">Progress Status</label>
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
                  <label className="header-text">ICON Due Date</label>
                  <br />
                  <label className="value-text">30/08/2020</label>
                </Col>
              </Row>
            </Col>
            {/* SideBar */}
          </Row>
        </div>
      </div>

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
