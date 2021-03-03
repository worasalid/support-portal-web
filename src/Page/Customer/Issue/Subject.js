import { Col, Row, Select, Typography, Affix, Button, Avatar, Tabs, Tag, Modal } from "antd";
import React, { useContext, useState, useEffect } from "react";
import "../../../styles/index.scss";
import { useHistory, useRouteMatch } from "react-router-dom";
import CommentBox from "../../../Component/Comment/Customer/Comment";
import ModalSendIssue from "../../../Component/Dialog/Customer/modalSendIssue";
import Historylog from "../../../Component/History/Customer/Historylog";
import IssueContext, { customerReducer, customerState } from "../../../utility/issueContext";
import MasterPage from "../MasterPage";
import { ArrowDownOutlined, ArrowUpOutlined, ClockCircleOutlined, UndoOutlined, UserOutlined } from "@ant-design/icons";
import Axios from "axios";
import moment from 'moment';
import DuedateLog from "../../../Component/Dialog/Customer/duedateLog";
import TabsDocument from "../../../Component/Subject/Customer/tabsDocument";
import ModalCompleteIssue from "../../../Component/Dialog/Customer/modalCompleteIssue";
import ModalCancelIssue from "../../../Component/Dialog/Customer/modalCancelIssue";
import ModalReOpen from "../../../Component/Dialog/Customer/modalReOpen";
import ModalConfirmManday from "../../../Component/Dialog/Customer/modalConfirmManday";
import ModalPO from "../../../Component/Dialog/Customer/modalPO";
import ModalDueDate from "../../../Component/Dialog/Customer/modalDueDate";

const { Option } = Select;
const { TabPane } = Tabs;


export default function Subject() {
  const match = useRouteMatch();
  const history = useHistory();
  const { state: customerstate, dispatch: customerdispatch } = useContext(IssueContext);

  // div
  const [container, setContainer] = useState(null);
  const [divcollapse, setDivcollapse] = useState("block");
  const [collapsetext, setCollapsetext] = useState("Hide details");

  // modal
  const [visible, setVisible] = useState(false);
  const [modalsendissue_visible, modalSendissue_visible] = useState(false);
  const [historyduedate_visible, setHistoryduedate_visible] = useState(false);
  const [modalcomplete_visible, setModalcomplete_visible] = useState(false);
  const [modalreopen_visible, setModalreopen_visible] = useState(false);
  const [modalcancel_visible, setModalcancel_visible] = useState(false);
  const [modalconfirmManday_visible, setModalconfirmManday_visible] = useState(false);
  const [modalPO_visible, setModalPO_visible] = useState(false);
  const [modalDueDate_visible, setModalDueDate_visible] = useState(false);

  // data
  const [ticketdata, setTicketdata] = useState([]);
  const [history_duedate_data, setHistory_duedate_data] = useState([]);
  const [ProgressStatus, setProgressStatus] = useState("");


  const getflow_output = async (value) => {
    const flow_output = await Axios({
      url: process.env.REACT_APP_API_URL + "/workflow/action_flow",
      method: "GET",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
      },
      params: {
        trans_id: value.TransId
      }
    });
    if (flow_output.status === 200) {
      customerdispatch({
        type: "LOAD_ACTION_FLOW",
        payload: flow_output.data.filter((x) => x.Type === null || x.Type === "Issue" 
          || x.Type === (value.IsCloudSite === true ? "OnCloud" : "OnPremise")
        )
      })

    }

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
        // getflow_output(ticket_detail.data[0].TransId)
        getflow_output(ticket_detail.data[0])
      }
    } catch (error) {

    }
  }

  const UndoIssue = async (value) => {
    try {
      const result = await Axios({
        url: process.env.REACT_APP_API_URL + "/workflow/issue-undo",
        method: "POST",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
        data: {
          mailboxid: value
        }
      });

      if (result.status === 200) {
        await Modal.info({
          title: 'บันทึกข้อมูลสำเร็จ',
          content: (
            <div>
              <p>ยกเลิกการส่ง Issue เลขที่ : {customerstate.issuedata.details[0] && customerstate.issuedata.details[0].Number}</p>
            </div>
          ),
          onOk() {
            history.push({ pathname: "/customer/issue/mytask" })
          },
        });

      }
    } catch (error) {

    }
  }

  const getDueDateHistory = async () => {
    try {
      const history = await Axios({
        url: process.env.REACT_APP_API_URL + "/tickets/log_duedate",
        method: "GET",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
        params: {
          ticketId: match.params.id
        }
      });

      if (history.status === 200) {
        setHistory_duedate_data(history.data)
      }
    } catch (error) {

    }
  }

  function HandleChange(value, item) {
    setProgressStatus(item.label);
    customerdispatch({ type: "SELECT_NODE_OUTPUT", payload: item.data })

    // BUG FLOW
    if (customerstate.issuedata.details[0].IssueType === "Bug") {
      if (item.data.NodeName === "customer" &&
        item.data.value === "AssignIcon" || item.data.value === "Continue" || item.data.value === "Pass" ||
        item.data.value === "SendInfo" || item.data.value === "SendToDeploy") {

        return (modalSendissue_visible(true))
      }
      if (item.data.NodeName === "customer" && item.data.value === "ReOpen") { return (setModalreopen_visible(true)) }
      if (item.data.NodeName === "customer" && item.data.value === "Complete") { return (setModalcomplete_visible(true)) }
      if (item.data.NodeName === "customer" && item.data.value === "Cancel") { return (setModalcancel_visible(true)) }
    }

    // CR FLOW
    if (customerstate.issuedata.details[0].IssueType === "ChangeRequest") {

      if (item.data.NodeName === "customer" && item.data.value === "AssignIcon" || item.data.value === "Pass" || item.data.value === "SendInfo" || item.data.value === "Continue") {
        modalSendissue_visible(true)
      }
      if (item.data.NodeName === "customer" && item.data.value === "Hold") {
        modalSendissue_visible(true)
      }
      if (item.data.NodeName === "customer" && item.data.value === "ConfirmManday") {
        setModalconfirmManday_visible(true)
      }
      if (item.data.NodeName === "customer" && item.data.value === "Reject") {
        modalSendissue_visible(true)
      }
      if (item.data.NodeName === "customer" && item.data.value === "SendPO") { return (setModalPO_visible(true)) }
      if (item.data.NodeName === "customer" && item.data.value === "RejectDueDate") {
        setModalDueDate_visible(true)
      }
      if (item.data.NodeName === "customer" && item.data.value === "ApproveDueDate") {
        setModalDueDate_visible(true)
      }
      if (item.data.value === "ReOpen") {
        setModalreopen_visible(true)
      }
      if (item.data.value === "Cancel") {
        setModalcancel_visible(true)
      }
      if (item.data.value === "Complete") {
        setModalcomplete_visible(true)
      }
    }

    if (customerstate.issuedata.details[0].IssueType === "Use") {
      if (item.data.NodeName === "customer" && item.data.value === "AssignIcon" || item.data.value === "Pass" || item.data.value === "SendInfo") {
        return (modalSendissue_visible(true))
      }
      if (item.data.NodeName === "customer" && item.data.value === "ReOpen") { return (setModalreopen_visible(true)) }
      if (item.data.NodeName === "customer" && item.data.value === "Complete") { return (setModalcomplete_visible(true)) }
      if (item.data.NodeName === "customer" && item.data.value === "Cancel") { return (setModalcancel_visible(true)) }
    }

  }

  function renderColorPriority(param) {
    switch (param) {
      case 'Critical':
        return <ArrowUpOutlined style={{ fontSize: "16px", color: "#C0392B" }} />
      case 'High':
        return <ArrowUpOutlined style={{ fontSize: "16px", color: "#E74C3C" }} />
      case 'Medium':
        return <ArrowDownOutlined style={{ fontSize: "16px", color: "#DC7633" }} />
      case 'Low':
        return <ArrowDownOutlined style={{ fontSize: "16px", color: "#27AE60" }} />

    }
  }

  useEffect(() => {
    getdetail();
  }, [])


  useEffect(() => {
    getdetail();
    getDueDateHistory();
  }, [historyduedate_visible])

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
                          <div className="issue-description" dangerouslySetInnerHTML={{ __html: customerstate?.issuedata?.details[0]?.Description }} ></div>
                        </div>
                      </Row>
                    </div>
                  </Col>
                </Row>

                {/* TAB Document */}
                <Row style={{ marginTop: 36, marginRight: 24 }}>
                  <Col span={24}>

                    <TabsDocument
                      details={{
                        refId: customerstate.issuedata.details[0] && customerstate.issuedata.details[0].Id,
                        // reftype: "Master_Ticket",
                      }}
                    />
                  </Col>
                </Row>

                {/* TAB Activity */}
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
              span={8}
              style={{ backgroundColor: "#fafafa", padding: 24, border: "1px" }}
            >
              <Row style={{ marginBottom: 20 }}>
                <Col span={16}>
                  <label className="header-text">Progress Status</label>
                  <br />
                  <Select
                    style={{ width: "100%", marginTop: 8 }}
                    placeholder="None"
                    onChange={(value, item) => HandleChange(value, item)}
                    value={customerstate.issuedata.details[0] && customerstate.issuedata.details[0].ProgressStatus}
                    options={customerstate && customerstate.actionflow.map((x) => ({ value: x.FlowOutputId, label: x.TextEng, data: x }))}
                    disabled={
                      customerstate.issuedata.details[0] &&
                        customerstate.issuedata.details[0].MailType === "out" ? true : false
                    }
                  >
                  </Select>
                </Col>
                <Col span={8}>

                  <Button type="primary" icon={<UndoOutlined />} color="green"
                    style={{
                      marginLeft: 20,
                      width: 100,
                      marginTop: 35,
                      display: customerstate.issuedata.details[0]?.IsUndo === true &&
                        customerstate.issuedata.details[0].MailType === "out" &&
                        customerstate.issuedata.details[0].NodeActionText === "Create" ? "block" : "none"
                    }}
                    onClick={() => UndoIssue(customerstate.issuedata.details[0].MailBoxId)}
                  >
                    Undo
                    </Button>
                </Col>

              </Row>
              <Row style={{ marginBottom: 20 }}>
                <Col span={18}>
                  <label className="header-text">IssueType</label>
                  <br />
                  <label className="value-text">{customerstate.issuedata.details[0] && customerstate.issuedata.details[0].IssueType}</label>
                </Col>
              </Row>
              <Row style={{ marginBottom: 20 }}>
                <Col span={18}>
                  <label className="header-text">Priority</label>
                  <br />
                  <label className="value-text">
                    {renderColorPriority(customerstate.issuedata.details[0] && customerstate.issuedata.details[0].Priority)}&nbsp;&nbsp;

                    {customerstate.issuedata.details[0] && customerstate.issuedata.details[0].Priority}
                  </label>
                </Col>
              </Row>
              <Row style={{ marginBottom: 20 }}>
                <Col span={18}>
                  <label className="header-text">Product</label>
                  <br />
                  <label className="value-text">{customerstate.issuedata.details[0] && `${customerstate.issuedata.details[0].ProductName} (${customerstate.issuedata.details[0].ProductFullName})`}</label>
                </Col>
              </Row>

              <Row style={{ marginBottom: 20 }}>
                <Col span={18}>
                  <label className="header-text">Module</label>
                  <br />
                  <label className="value-text">{customerstate.issuedata.details[0] && customerstate.issuedata.details[0].ModuleName}</label>
                </Col>
              </Row>

              <Row style={{
                marginBottom: 20,
                display: customerstate.issuedata.details[0]?.IssueType === "ChangeRequest" &&
                  customerstate.issuedata.details[0]?.Manday !== null ? "block" : "none"
              }}>
                <Col span={18}>
                  <label className="header-text">Manday</label>
                  <label style={{ marginLeft: 10 }} className="value-text">{customerstate.issuedata.details[0]?.Manday}</label>
                </Col>
              </Row>

              <Row style={{ marginBottom: 20 }}>
                <Col span={18}>
                  <label className="header-text">DueDate</label>
                  <br />

                  <label className="value-text">
                    {(customerstate?.issuedata?.details[0]?.DueDate === null ? "None" : moment(customerstate?.issuedata?.details[0]?.DueDate).format("DD/MM/YYYY HH:mm"))}
                  </label>

                  {customerstate?.issuedata?.details[0]?.cntDueDate >= 1 ?
                    <Tag style={{ marginLeft: 16, cursor: "pointer" }} color="warning" onClick={() => setHistoryduedate_visible(true)}>
                      <label style={{ cursor: "pointer" }}> DueDate ถูกเลื่อน</label>

                    </Tag> : ""
                  }


                  {/* <Button type="text"
                    style={{ padding: 0 }}
                    icon={<ClockCircleOutlined style={{ fontSize: 18 }} />}
                    className="value-text"
                  >
                    {(customerstate?.issuedata?.details[0]?.DueDate === null ? "None" : moment(customerstate.issuedata.details[0].DueDate).format("DD/MM/YYYY HH:mm"))}
                  </Button>

                  {history_duedate_data.length >= 1 ?
                    <Tag style={{ marginLeft: 16 }} color="warning" onClick={() => setHistoryduedate_visible(true)}>
                      DueDate ถูกเลื่อน
                   </Tag> : ""
                  } */}
                </Col>
              </Row>

            </Col>
          </Row>
        </div>
      </div>

      <DuedateLog
        title="ประวัติ DueDate"
        visible={historyduedate_visible}
        onCancel={() => setHistoryduedate_visible(false)}
        details={{
          ticketId: customerstate.issuedata.details[0] && customerstate.issuedata.details[0].Id
        }}
      >
      </DuedateLog>

      <ModalSendIssue
        title={ProgressStatus}
        visible={modalsendissue_visible}
        width={700}
        onCancel={() => modalSendissue_visible(false)}
        onOk={() => {
          modalSendissue_visible(false);
        }}
        details={{
          ticketid: customerstate.issuedata.details[0] && customerstate.issuedata.details[0].Id,
          mailboxid: customerstate.issuedata.details[0] && customerstate.issuedata.details[0].MailBoxId,
          flowoutputid: customerstate.node.output_data && customerstate.node.output_data.FlowOutputId,
          flowoutput: customerstate?.node.output_data
        }}
      />

      <ModalConfirmManday
        title={ProgressStatus}
        visible={modalconfirmManday_visible}
        width={700}
        onCancel={() => setModalconfirmManday_visible(false)}
        onOk={() => {
          setModalconfirmManday_visible(false);
        }}
        details={{
          ticketid: customerstate.issuedata.details[0]?.Id,
          mailboxid: customerstate.issuedata.details[0]?.MailBoxId,
          flowoutputid: customerstate.node.output_data?.FlowOutputId,
          manday: customerstate.issuedata.details[0]?.Manday,
          cost: customerstate.issuedata.details[0]?.Cost
        }}
      />

      <ModalDueDate
        title={ProgressStatus}
        visible={modalDueDate_visible}
        width={700}
        onCancel={() => setModalDueDate_visible(false)}
        onOk={() => {
          setModalDueDate_visible(false);
        }}
        details={{
          ticketid: customerstate.issuedata.details[0] && customerstate.issuedata.details[0].Id,
          mailboxid: customerstate.issuedata.details[0] && customerstate.issuedata.details[0].MailBoxId,
          flowoutputid: customerstate.node.output_data && customerstate.node.output_data.FlowOutputId,
          duedate: moment(customerstate.issuedata.details[0]?.DueDate).format("DD/MM/YYYY")
        }}
      />

      <ModalPO
        title={ProgressStatus}
        visible={modalPO_visible}
        width={700}
        onCancel={() => setModalPO_visible(false)}
        onOk={() => {
          setModalPO_visible(false);
        }}
        details={{
          ticketid: customerstate.issuedata.details[0]?.Id,
          mailboxid: customerstate.issuedata.details[0]?.MailBoxId,
          flowoutputid: customerstate.node.output_data?.FlowOutputId
        }}
      />

      <ModalCompleteIssue
        title={ProgressStatus}
        visible={modalcomplete_visible}
        onCancel={() => setModalcomplete_visible(false)}
        width={700}
        onOk={() => setModalcomplete_visible(false)}
        details={{
          ticketid: customerstate.issuedata.details[0] && customerstate.issuedata.details[0].Id,
          mailboxid: customerstate.issuedata.details[0] && customerstate.issuedata.details[0].MailBoxId,
          flowoutputid: customerstate.node.output_data && customerstate.node.output_data.FlowOutputId,
        }}
      />

      <ModalCancelIssue
        title={ProgressStatus}
        visible={modalcancel_visible}
        onCancel={() => setModalcancel_visible(false)}
        width={700}
        onOk={() => setModalcancel_visible(false)}
        details={{
          ticketid: customerstate.issuedata.details[0] && customerstate.issuedata.details[0].Id,
          mailboxid: customerstate.issuedata.details[0] && customerstate.issuedata.details[0].MailBoxId,
          flowoutputid: customerstate.node.output_data && customerstate.node.output_data.FlowOutputId
        }}
      />

      <ModalReOpen
        title={ProgressStatus}
        visible={modalreopen_visible}
        onCancel={() => setModalreopen_visible(false)}
        width={700}
        onOk={() => setModalreopen_visible(false)}
        details={{
          ticketid: customerstate.issuedata.details[0] && customerstate.issuedata.details[0].Id,
          mailboxid: customerstate.issuedata.details[0] && customerstate.issuedata.details[0].MailBoxId,
          flowoutputid: customerstate.node.output_data && customerstate.node.output_data.FlowOutputId
        }}
      />

    </MasterPage>
  );
}
