import { Col, DatePicker, Row, Select, Divider, Typography, Affix, Button, Avatar, Tabs } from "antd";
import React, { useContext, useState, useEffect, useReducer } from "react";
import "../../../styles/index.scss";
import { useHistory, useRouteMatch } from "react-router-dom";
import CommentBox from "../../../Component/Comment/Customer/Comment";
import ModalSendIssue from "../../../Component/Dialog/Customer/modalSendIssue";
import Historylog from "../../../Component/History/Customer/Historylog";
import IssueContext, { customerReducer, customerState } from "../../../utility/issueContext";
import MasterPage from "../MasterPage";
import { UserOutlined } from "@ant-design/icons";
import Axios from "axios";

const { Option } = Select;
const { TabPane } = Tabs;


export default function Subject() {
  const match = useRouteMatch();
  const history = useHistory();
  const { state: customerstate, dispatch: customerdispatch } = useContext(IssueContext);

  const [visible, setVisible] = useState(false);
  const [ProgressStatus, setProgressStatus] = useState("");
  const [container, setContainer] = useState(null);
  const [divcollapse, setDivcollapse] = useState("block")
  const [collapsetext, setCollapsetext] = useState("Hide details")

  const [ticketdata, setTicketdata] = useState([]);

  const getflow_output = async (trans_id) => {
    const flow_output = await Axios({
      url: process.env.REACT_APP_API_URL + "/workflow/action_flow",
      method: "GET",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
      },
      params: {
        trans_id
      }
    });
    customerdispatch({ type: "LOAD_ACTION_FLOW", payload: flow_output.data })
  }

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
         customerdispatch({ type: "LOAD_ISSUEDETAIL", payload: ticket_detail.data })
         getflow_output(ticket_detail.data[0].TransId)
      }
    } catch (error) {

    }
  }
  function HandleChange(value) {
    setVisible(true);
    setProgressStatus(value);

  }

  useEffect(() => {
    getdetail();
  }, [])

// console.log(customerstate)
//   // useEffect(() => {
//   //   // getflow_output();
//   // }, [customerstate])

  console.log("ticket_detail", customerstate.issuedata.details[0] && customerstate.issuedata.details[0].GroupStatus);
  console.log("ticket_datarow", customerstate.issuedata.details[0] && customerstate.issuedata.details[0].TransId);
  console.log("ACTION_FLOW", customerstate.actionflow && customerstate.actionflow)
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
                    {/* <label className="topic-text">{ticketdata[0] && ticketdata[0].ticket_number}</label> */}
                    <label className="topic-text">{customerstate.issuedata.details[0] && customerstate.issuedata.details[0].Number}</label>
                    <div className="issue-detail-box">
                      <Row>
                        <Col span={16} style={{ display: "inline" }}>
                          <Typography.Title level={4}>
                            <Avatar size={32} icon={<UserOutlined />} />&nbsp;&nbsp;  {customerstate.issuedata.details[0] && customerstate.issuedata.details[0].Title}
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
                            {customerstate.issuedata.details[0] && customerstate.issuedata.details[0].Description}
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
                    onChange={(value,index) => HandleChange(index.label)}
                    defaultValue= ""
                    options={customerstate && customerstate.actionflow.map((x) => ({ value: x.ToNodeId, label: x.TextEng }))}
                  >
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
              <Row style={{ marginBottom: 30 }}>
                <Col span={18}>
                  <label className="header-text">Priority</label>
                  <br />
                  <label className="value-text">{ticketdata[0] && ticketdata[0].priority}</label>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>

      <ModalSendIssue
        title={ProgressStatus}
        visible={visible}
        width={700}
        onCancel={() => setVisible(false)}
        onOk={() => {
          setVisible(false);
        }}
      />
    </MasterPage>
  );
}
