import { Col, Tag, Row, Select, Divider, Typography, Affix, Button, Avatar, Tabs, Modal, Timeline, Popconfirm } from "antd";
import React, { useState, useEffect, useContext, useRef } from "react";
import "../../../styles/index.scss";
import { useHistory, useRouteMatch } from "react-router-dom";
import CommentBox from "../../../Component/Comment/Internal/Comment";
import InternalComment from "../../../Component/Comment/Internal/Internal_comment";
import ModalSupport from "../../../Component/Dialog/Internal/modalSupport";
import Historylog from "../../../Component/History/Internal/Historylog";
import MasterPage from "../MasterPage";
import { ArrowDownOutlined, ArrowUpOutlined, ClockCircleOutlined, UpCircleOutlined, UserOutlined } from "@ant-design/icons";
import Axios from "axios";
import IssueContext, { userReducer, userState } from "../../../utility/issueContext";
import ModalDueDate from "../../../Component/Dialog/Internal/modalDueDate";
import Issuesearch from "../../../Component/Search/Internal/IssueSearch";
import ModalDeveloper from "../../../Component/Dialog/Internal/modalDeveloper";
// import ModalDocument from "../../../Component/Dialog/Internal/modalDocument";
import ModalQA from "../../../Component/Dialog/Internal/modalQA";
import ModalLeaderQC from "../../../Component/Dialog/Internal/modalLeaderQC";
import ModalLeaderAssign from "../../../Component/Dialog/Internal/modalLeaderAssign";
import ModalResolved from "../../../Component/Dialog/Internal/modalResolved";
import Clock from "../../../utility/countdownTimer";
import moment from "moment";
import ModalqaAssign from "../../../Component/Dialog/Internal/modalqaAssign";
import TabsDocument from "../../../Component/Subject/Internal/tabsDocument";
import ModalTimetracking from "../../../Component/Dialog/Internal/modalTimetracking";
import ModalComplete from "../../../Component/Dialog/Internal/modalComplete";
import ModalLeaderReject from "../../../Component/Dialog/Internal/modalLeaderReject";

const { Option } = Select;
const { TabPane } = Tabs;


export default function SubTask() {
  const match = useRouteMatch();
  const history = useHistory();
  const selectRef = useRef(null)
  const { state: userstate, dispatch: userdispatch } = useContext(IssueContext);

  const [defaultFlow, setDefaultFlow] = useState(undefined)

  //modal
  const [visible, setVisible] = useState(false);
  const [modalduedate_visible, setModalduedate_visible] = useState(false);
  const [historyduedate_visible, setHistoryduedate_visible] = useState(false);
  const [modalleaderassign_visible, setModalleaderassign_visible] = useState(false);
  const [modaldeveloper_visible, setModaldeveloper_visible] = useState(false);
  const [modalleaderqc_visible, setModalleaderqc_visible] = useState(false);
  const [modalQAassign_visible, setModalQAassign_visible] = useState(false);
  const [modalQA_visible, setModalQA_visible] = useState(false);
  const [modalresolved_visible, setModalresolved_visible] = useState(false);
  const [unittestlog_visible, setUnittestlog_visible] = useState(false);
  const [modaltimetracking_visible, setModaltimetracking_visible] = useState(false);
  const [modalcomplete_visible, setModalcomplete_visible] = useState(false);
  const [modalleaderreject_visible, setModalleaderreject_visible] = useState(false);

  //div
  const [container, setContainer] = useState(null);
  const [divcollapse, setDivcollapse] = useState("block")
  const [collapsetext, setCollapsetext] = useState("Hide details")


  // data
  const [ProgressStatus, setProgressStatus] = useState("");
  const [history_duedate_data, setHistory_duedate_data] = useState([]);
  const [selected, setSelected] = useState()
  const [SLA, setSLA] = useState(null);
  const [createddate, setCreateddate] = useState(null);
  const [resolveddate, setResolveddate] = useState(null);


  const getflow_output = async (trans_id) => {
    try {
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

      if (flow_output.status === 200) {
        if (userstate.taskdata.data[0] && userstate.taskdata.data[0].NodeName === "qa" && userstate.taskdata.data[0].QARecheck) {
          userdispatch({
            type: "LOAD_ACTION_FLOW",
            payload: flow_output.data.filter((x) => x.value !== "QApass")
          });
        }
        if (userstate.taskdata.data[0] && userstate.taskdata.data[0].NodeName === "qa" && !userstate.issuedata.details[0].QARecheck) {
          userdispatch({
            type: "LOAD_ACTION_FLOW",
            payload: flow_output.data.filter((x) => x.value !== "SendQALeader")
          });
        }
        if (userstate.taskdata.data[0] && userstate.taskdata.data[0].NodeName !== "qa") {
          userdispatch({ type: "LOAD_ACTION_FLOW", payload: flow_output.data })
        }
      }
    } catch (error) {

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
        userdispatch({ type: "LOAD_ISSUEDETAIL", payload: ticket_detail.data })
        setSLA(ticket_detail.data.SLA);
        setCreateddate(ticket_detail.data.CreateDate);
        setResolveddate(ticket_detail.data.ResolvedDate)
        // getflow_output(ticket_detail.data[0].TransId)
      }
    } catch (error) {

    }
  }

  const GetDueDateHistory = async () => {
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
    console.log("HandleChange", item)
    setProgressStatus(item.label);
    userdispatch({ type: "SELECT_NODE_OUTPUT", payload: item.data })
    if (item.data.NodeName === "support" && item.data.value === "SendIssue") { return (setVisible(true)) }
    if (item.data.NodeName === "developer_2" && item.data.value === "LeaderAssign") { setModalleaderassign_visible(true) }
    if (item.data.NodeName === "developer_2" && item.data.value === "LeaderQC") { setModalleaderqc_visible(true) }
    if (item.data.NodeName === "developer_2" && item.data.value === "LeaderReject") { setModalleaderreject_visible(true) }
    if (item.data.NodeName === "developer_2" && item.data.value === "Deploy") { return (setModalcomplete_visible(true)) }
    if (item.data.NodeName === "developer_1") { setModaldeveloper_visible(true) }

    if (item.data.NodeName === "qa_leader" && item.data.value === "QAassign") { setModalQAassign_visible(true) }
    if (item.data.NodeName === "qa_leader" && item.data.value !== "QAassign") { setModalQA_visible(true) }
    if (item.data.NodeName === "qa") { setModalQA_visible(true) }
    if (item.data.NodeName === "support" && item.data.value === "Resolved") { return (setModalresolved_visible(true)) }

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

  //////////////////////////////////////////////// NEW ทำ subtask /////////////////////
  const GetTaskDetail = async () => {
    try {
      const task_detail = await Axios({
        url: process.env.REACT_APP_API_URL + "/tickets/load-taskdetail",
        method: "GET",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
        params: {
          taskId: match.params.task
        }
      });

      if (task_detail.status === 200) {
        userdispatch({ type: "LOAD_TASKDATA", payload: task_detail.data })
        setCreateddate(task_detail.data.CreateDate);
        setResolveddate(task_detail.data.ResolvedDate)
      }

    } catch (error) {

    }
  }

  useEffect(() => {
    getdetail();
    GetTaskDetail();
  }, [])

  useEffect(() => {
    getdetail();
  }, [SLA])

  useEffect(() => {
    if (historyduedate_visible) {
      GetDueDateHistory();

    }

  }, [historyduedate_visible])


  //  console.log("issuedetail", userstate.issuedata.details[0] && userstate.issuedata.details[0])
  //  console.log("taskdata", userstate.taskdata.data[0] && userstate.taskdata.data[0])
  //  console.log("output", userstate.node.output_data.FlowOutputId)
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

                    <label className="topic-text">{userstate.issuedata.details[0] && userstate.issuedata.details[0].Number}</label>
                    <div className="issue-detail-box">
                      <Row>
                        <Col span={16} style={{ display: "inline" }}>
                          <Typography.Title level={4}>
                            {/* <Avatar size={32} icon={<UserOutlined />} />&nbsp;&nbsp;  {userstate.issuedata.details[0] && userstate.issuedata.details[0].Title} */}
                            <Avatar size={32} icon={<UserOutlined />} />&nbsp;&nbsp;  {userstate.taskdata.data[0] && userstate.taskdata.data[0].Title}
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
                            {userstate.taskdata.data[0] && userstate.taskdata.data[0].Description}
                          </p>

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
                          refId: userstate.taskdata.data[0] && userstate.taskdata.data[0].TaskId,
                          reftype: "Ticket_Task",
                        }}
                      />
                  </Col>
                </Row>

                {/* TAB Activity */}
                <Row style={{ marginTop: 36, marginRight: 24 }}>
                  <Col span={24}>
                    <label className="header-text">Activity</label>

                    {
                      <Tabs defaultActiveKey="1" >
                        <TabPane tab="Internal Note" key="1" >
                          <InternalComment />
                        </TabPane>
                        <TabPane tab="History Log" key="2">
                          <Historylog />
                        </TabPane>
                      </Tabs>
                    }


                  </Col>
                </Row>
              </div>
            </Col>
            {/* Content */}

            {/* SideBar */}
            <Col span={6} style={{ backgroundColor: "", height: 500, marginLeft: 20 }}>
              <Row style={{ marginBottom: 20 }}>
                <Col span={18}>
                  <label className="header-text">ProgressStatus</label>
                  <br />
                  <Select ref={selectRef}
                    // defaultValue={userstate.issuedata.details[0] && userstate.issuedata.details[0].FlowStatus}
                    value={userstate.taskdata.data[0] && userstate.taskdata.data[0].FlowStatus}
                    style={{ width: '100%' }} placeholder="None"
                    onClick={() => getflow_output(userstate.issuedata.details[0].TransId)}
                    onChange={(value, item) => HandleChange(value, item)}
                    options={userstate.actionflow && userstate.actionflow.map((x) => ({ value: x.ToNodeId, label: x.TextEng, data: x }))}
                    disabled={
                      userstate.taskdata.data[0] && userstate.taskdata.data[0].MailType === "out" 
                      || (userstate.taskdata.data[0] && userstate.taskdata.data[0].MailType === "in" && userstate.taskdata.data[0].Status === "Complete" &&
                      userstate.issuedata.details[0] && userstate.issuedata.details[0].InternalStatus !== "Pass" ) ? true : false
                    }
                  />
                </Col>
              </Row>
              <Row style={{ marginBottom: 20 }}>
                <Col span={18}>
                  <label className="header-text">Priority</label>
                  <br />
                  <label className="value-text">{userstate.taskdata.data[0] && userstate.taskdata.data[0].Priority}</label>
                </Col>
              </Row>
              <Row style={{ marginBottom: 20 }}>
                <Col span={3} style={{ marginTop: "10px" }}>
                  <label className="header-text">SLA</label>
                </Col>
                <Col span={18} >
                  {
                    userstate.taskdata.data[0] &&
                    <Clock
                      showseconds={false}
                      deadline={userstate.taskdata.data[0] && userstate.taskdata.data[0].DueDate}
                      createdate={userstate.taskdata.data[0].AssignIconDate === null ? undefined : userstate.taskdata.data[0].AssignIconDate}
                      resolvedDate={userstate.taskdata.data[0].ResolvedDate === null ? undefined : userstate.taskdata.data[0].ResolvedDate}
                      onClick={() => { setModaltimetracking_visible(true) }}
                    />
                  }

                </Col>
              </Row>

              <Row style={{ marginBottom: 20 }}>
                <Col span={24}>
                  <label className="header-text">DueDate</label>
                  <br />
                  <ClockCircleOutlined style={{ fontSize: 18 }} onClick={() => setHistoryduedate_visible(true)} />

                  {/* คลิกเปลี่ยน DueDate ได้เฉพาะ support */}
                  {
                    userstate.issuedata.details[0] && userstate.issuedata.details[0].NodeName === "support"
                      ? <Button type="link"
                        onClick={() => setModalduedate_visible(true)}
                      >
                        {userstate.taskdata.data[0] &&
                          (userstate.taskdata.data[0].DueDate === null ? "None" : moment(userstate.taskdata.data[0].DueDate).format("DD/MM/YYYY HH:mm"))}
                      </Button>
                      : <label>&nbsp;&nbsp;{userstate.taskdata.data[0] && moment(userstate.taskdata.data[0].DueDate).format("DD/MM/YYYY HH:mm")}</label>
                  }
                  {history_duedate_data.length > 1 ?
                    <Tag color="warning">
                      DueDate ถูกเลื่อน
                   </Tag> : ""
                  }
                </Col>
              </Row>

              <Row style={{ marginBottom: 20 }}>
                <Col span={18}>
                  <label className="header-text">Company</label>
                  <br />
                  <label className="value-text">{userstate.taskdata.data[0] && userstate.taskdata.data[0].CompanyName}</label>
                </Col>
              </Row>
              <Row style={{ marginBottom: 20 }}>
                <Col span={18}>
                  <label className="header-text">IssueType</label>
                  <br />

                  <label className="value-text">{userstate.taskdata.data[0] && userstate.taskdata.data[0].IssueType}</label>

                </Col>
              </Row>
              <Row style={{ marginBottom: 20 }}>
                <Col span={18}>
                  <label className="header-text">Product</label>
                  <br />

                  <label className="value-text">{userstate.taskdata.data[0] && `${userstate.taskdata.data[0].ProductName} - (${userstate.taskdata.data[0].ProductFullName})`}</label>
                </Col>
              </Row>
              <Row style={{ marginBottom: 20 }}>
                <Col span={18}>
                  <label className="header-text">Module</label>
                  <br />
                  <label className="value-text">{userstate.taskdata.data[0] && userstate.taskdata.data[0].ModuleName}</label>
                </Col>
              </Row>
              <Row style={{ marginBottom: 20 }}>
                <Col span={18}>
                  <label className="header-text">Assignee</label>
                  <br />
                  <label className="value-text">{userstate.taskdata.data[0] && userstate.taskdata.data[0].Assignee}</label>
                </Col>
              </Row>


            </Col>
            {/* SideBar */}
          </Row>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title="ประวัติ DueDate"
        visible={historyduedate_visible}
        onCancel={() => setHistoryduedate_visible(false)}
        cancelText="Close"
        okButtonProps={{ hidden: true }}
      >
        <Timeline>
          {history_duedate_data.map((item, index) => {
            return (
              <Timeline.Item>
                <p><b>ครั้งที่ {index + 1}  <ClockCircleOutlined style={{ fontSize: 18 }} />
                  {new Date(item.due_date).toLocaleDateString('en-GB')}</b></p>
                <p>{item.description}</p>
              </Timeline.Item>
            )
          })}
        </Timeline>
      </Modal>

      <ModalSupport
        title={ProgressStatus}
        visible={visible}
        width={800}
        onCancel={() => { return (setVisible(false), setSelected(null)) }}
        onOk={() => {
          setVisible(false);
        }}
        details={{
          ticketid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TicketId,
          taskid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TaskId,
          mailboxid: userstate.taskdata.data[0] && userstate.taskdata.data[0].MailboxId,
          flowoutputid: userstate.node.output_data.FlowOutputId

        }}
      />

      <ModalLeaderAssign
        title={ProgressStatus}
        visible={modalleaderassign_visible}
        onCancel={() => {
          return (setModalleaderassign_visible(false), setSelected(null))
        }}
        width={800}
        onOk={() => {
          setModalleaderassign_visible(false);
          setSelected(null);
        }}
        details={{
          ticketid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TicketId,
          taskid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TaskId,
          mailboxid: userstate.taskdata.data[0] && userstate.taskdata.data[0].MailboxId,
          flowoutputid: userstate.node.output_data.FlowOutputId
        }}
      />

      <ModalDeveloper
        title={ProgressStatus}
        visible={modaldeveloper_visible}
        onCancel={() => { return (setModaldeveloper_visible(false), setSelected(null)) }}
        width={800}
        onOk={() => {
          setModaldeveloper_visible(false);
          setSelected(null);
        }}
        details={{
          ticketid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TicketId,
          taskid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TaskId,
          mailboxid: userstate.taskdata.data[0] && userstate.taskdata.data[0].MailboxId,
          flowoutputid: userstate.node.output_data.FlowOutputId
        }}
      />

      <ModalLeaderQC
        title={ProgressStatus}
        visible={modalleaderqc_visible}
        onCancel={() => { return (setModalleaderqc_visible(false), setSelected(null)) }}
        width={800}
        onOk={() => {
          setModalleaderqc_visible(false);
        }}
        onCancel={() => {
          setModalleaderqc_visible(false);
          window.location.reload("false");
        }}
        details={{
          ticketid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TicketId,
          taskid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TaskId,
          mailboxid: userstate.taskdata.data[0] && userstate.taskdata.data[0].MailboxId,
          flowoutputid: userstate.node.output_data.FlowOutputId
        }}
      />

      <ModalLeaderReject
        title={ProgressStatus}
        visible={modalleaderreject_visible}
        onCancel={() => { return (setModalleaderreject_visible(false)) }}
        width={800}
        onOk={() => {
          setModalleaderreject_visible(false);
          window.location.reload("false");
        }}
        details={{
          ticketid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TicketId,
          taskid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TaskId,
          mailboxid: userstate.taskdata.data[0] && userstate.taskdata.data[0].MailboxId,
          flowoutputid: userstate.node.output_data.FlowOutputId
        }}

      />

      <ModalDueDate
        title="DueDate"
        visible={modalduedate_visible}
        width={600}
        onCancel={() => setModalduedate_visible(false)}
        onOk={() => {
          setModalduedate_visible(false);
        }}
      />

      <ModalqaAssign
        title={ProgressStatus}
        visible={modalQAassign_visible}
        width={800}
        onCancel={() => { return (setModalQAassign_visible(false)) }}
        onOk={() => {
          setModalQAassign_visible(false);
          window.location.reload("false");
        }}
        details={{
          ticketid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TicketId,
          taskid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TaskId,
          mailboxid: userstate.taskdata.data[0] && userstate.taskdata.data[0].MailboxId,
          flowoutputid: userstate.node.output_data.FlowOutputId
        }}
      />

      <ModalQA
        title={ProgressStatus}
        visible={modalQA_visible}
        onCancel={() => { return (setModalQA_visible(false), setSelected(null)) }}
        width={900}
        onOk={() => {
          setModalQA_visible(false);
        }}
        onCancel={() => {
          setModalQA_visible(false);
          window.location.reload("false");
        }}
        details={{
          ticketid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TicketId,
          taskid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TaskId,
          mailboxid: userstate.taskdata.data[0] && userstate.taskdata.data[0].MailboxId,
          flowoutputid: userstate.node.output_data.FlowOutputId
        }}
      />

      <ModalResolved
        title={ProgressStatus}
        visible={modalresolved_visible}
        width={800}
        onCancel={() => { return (setModalresolved_visible(false), setSelected(null)) }}
        onOk={() => {
          setModalresolved_visible(false);
        }}
        details={{
          ticketId: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
          mailboxId: userstate.issuedata.details[0] && userstate.issuedata.details[0].MailBoxId,
          productId: userstate.issuedata.details[0] && userstate.issuedata.details[0].ProductId,
          internaltype: userstate.issuedata.details[0] && userstate.issuedata.details[0].InternalTypeId,
          node_output_id: userstate.node.output_data && userstate.node.output_data.NodeOutputId,
          to_node_id: userstate.node.output_data && userstate.node.output_data.ToNodeId,
          to_node_action_id: userstate.node.output_data && userstate.node.output_data.ToNodeActionId,
          flowstatus: userstate.node.output_data && userstate.node.output_data.FlowStatus,
          groupstatus: userstate.node.output_data && userstate.node.output_data.GroupStatus,
          flowaction: userstate.node.output_data && userstate.node.output_data.FlowAction
        }}
      />

      <ModalTimetracking
        title="Time Tracking"
        width={600}
        visible={modaltimetracking_visible}
        onCancel={() => { return (setModaltimetracking_visible(false)) }}
        details={{
          transgroupid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TransGroupId,
          taskid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TaskId,

        }}
      />

      <ModalComplete
        title={ProgressStatus}
        width={600}
        visible={modalcomplete_visible}
        onCancel={() => { return (setModalcomplete_visible(false)) }}
        onOk={() => {
          setModalcomplete_visible(false);
        }}
        details={{
          ticketid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TicketId,
          taskid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TaskId,
          mailboxid: userstate.taskdata.data[0] && userstate.taskdata.data[0].MailboxId,
          flowoutputid: userstate.node.output_data.FlowOutputId
        }}
      />

    </MasterPage>
  );
}
