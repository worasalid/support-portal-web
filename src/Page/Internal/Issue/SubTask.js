import { Col, Row, Select, Typography, Affix, Button, Avatar, Tabs, Modal, Timeline, Divider, Checkbox, message, Spin } from "antd";
import React, { useState, useEffect, useContext, useRef } from "react";
import "../../../styles/index.scss";
import { useHistory, useRouteMatch } from "react-router-dom";

import TaskComment from "../../../Component/Comment/Internal/TaskComment";
import ModalSupport from "../../../Component/Dialog/Internal/modalSupport";
import InternalHistorylog from "../../../Component/History/Internal/Historylog";
import MasterPage from "../MasterPage";
import { ArrowDownOutlined, ArrowUpOutlined, ClockCircleOutlined, UserOutlined, LeftCircleOutlined } from "@ant-design/icons";
import Axios from "axios";
import AuthenContext from "../../../utility/authenContext";
import IssueContext, { userReducer, userState } from "../../../utility/issueContext";
import ModalDueDate from "../../../Component/Dialog/Internal/modalDueDate";
import ModalDeveloper from "../../../Component/Dialog/Internal/modalDeveloper";
// import ModalDocument from "../../../Component/Dialog/Internal/modalDocument";
import ModalQA from "../../../Component/Dialog/Internal/modalQA";
import ModalLeaderQC from "../../../Component/Dialog/Internal/modalLeaderQC";
import ModalLeaderAssign from "../../../Component/Dialog/Internal/modalLeaderAssign";
import ClockSLA from "../../../utility/SLATime";
import moment from "moment";
import ModalqaAssign from "../../../Component/Dialog/Internal/modalqaAssign";
import TabsDocument from "../../../Component/Subject/Internal/tabsDocument";
import ModalTimetracking from "../../../Component/Dialog/Internal/modalTimetracking";
import ModalComplete from "../../../Component/Dialog/Internal/modalComplete";
import ModalReject from "../../../Component/Dialog/Internal/modalReject";
import ModalSendTask from "../../../Component/Dialog/Internal/modalSendTask";
import ModalManday from "../../../Component/Dialog/Internal/modalManday";
import ModalRequestInfoDev from "../../../Component/Dialog/Internal/Issue/modalRequestInfoDev";
import PreviewImg from "../../../Component/Dialog/Internal/modalPreviewImg";
import ModalDevSendVersion from "../../../Component/Dialog/Internal/Issue/modalDevSendVersion";
import ModalFileDownload from "../../../Component/Dialog/Internal/modalFileDownload";

const { Option } = Select;
const { TabPane } = Tabs;


export default function SubTask() {
  const match = useRouteMatch();
  const history = useHistory();
  const selectRef = useRef(null)
  const { state, dispatch } = useContext(AuthenContext);
  const { state: userstate, dispatch: userdispatch } = useContext(IssueContext);

  const [defaultFlow, setDefaultFlow] = useState(undefined)
  const [pageLoading, setPageLoading] = useState(true);

  //modal
  const [visible, setVisible] = useState(false);
  const [modalpreview, setModalpreview] = useState(false)
  const [modalduedate_visible, setModalduedate_visible] = useState(false);
  const [historyduedate_visible, setHistoryduedate_visible] = useState(false);
  const [modalsendtask_visible, setModalsendtask_visible] = useState(false);
  const [modalleaderassign_visible, setModalleaderassign_visible] = useState(false);
  const [modaldeveloper_visible, setModaldeveloper_visible] = useState(false);
  const [modalleaderqc_visible, setModalleaderqc_visible] = useState(false);
  const [modalQAassign_visible, setModalQAassign_visible] = useState(false);
  const [modalQA_visible, setModalQA_visible] = useState(false);
  const [modalmanday_visible, setModalmanday_visible] = useState(false);

  const [modaltimetracking_visible, setModaltimetracking_visible] = useState(false);
  const [modalcomplete_visible, setModalcomplete_visible] = useState(false);
  const [modalreject_visible, setModalreject_visible] = useState(false);
  const [modalRequestInfoDev, setModalRequestInfoDev] = useState(false);
  const [modalPreview, setModalPreview] = useState(false);
  const [modalDevSendVersion, setModalDevSendVersion] = useState(false);
  const [modalfiledownload_visible, setModalfiledownload_visible] = useState(false);

  //div
  const [container, setContainer] = useState(null);
  const [divcollapse, setDivcollapse] = useState("block")
  const [collapsetext, setCollapsetext] = useState("Hide details")
  const [divProgress, setDivProgress] = useState("hide")
  const [imgUrl, setImgUrl] = useState(null);

  // data
  const [ProgressStatus, setProgressStatus] = useState("");
  const [history_duedate_data, setHistory_duedate_data] = useState([]);
  const [selected, setSelected] = useState()
  const [SLA, setSLA] = useState(null);
  const [createddate, setCreateddate] = useState(null);
  const [resolveddate, setResolveddate] = useState(null);

  // Load ข้อมูล Detail ของ Issue และ ข้อมูล mailbox ล่าสุด
  const getMailBox = async () => {
    try {
      const mailbox = await Axios({
        url: process.env.REACT_APP_API_URL + "/workflow/load-mailbox",
        method: "GET",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
        params: {
          ticketid: match.params.id,
          taskid: match.params.task
        }
      });

      if (mailbox.status === 200) {
        userdispatch({ type: "LOAD_MAILBOX", payload: mailbox.data })
      }
    } catch (error) {

    }
  }

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

        if ((flow_output.data.filter((x) => x.Type === "Task").length) > 0) {
          setDivProgress("show")
        }

        if (userstate?.mailbox[0]?.NodeName === "qa" && userstate?.taskdata?.data[0]?.QA_Recheck === true) {
          userdispatch({
            type: "LOAD_ACTION_FLOW",
            payload: flow_output.data.filter((x) => x.value === "SendQALeader" || x.value === "QAReject")
          });
        }

        if (userstate?.mailbox[0]?.NodeName === "qa" && userstate?.taskdata?.data[0]?.QA_Recheck === false) {
          userdispatch({
            type: "LOAD_ACTION_FLOW",
            payload: flow_output.data.filter((x) => x.value === "QApass" || x.value === "RequestVersion" || x.value === "QAReject")
          });
        }

        if (userstate?.mailbox[0]?.NodeName === "qa_leader" && userstate?.mailbox[0]?.NodeActionText === "AssignTask") {
          userdispatch({
            type: "LOAD_ACTION_FLOW",
            payload: flow_output.data.filter((x) => x.value === "QAassign" || x.value === "QApass" || x.value === "RequestVersion" || x.value === "QAReject")
          });
        }

        if (userstate?.mailbox[0]?.NodeName === "qa_leader" && userstate?.mailbox[0]?.NodeActionText === "CheckResult") {
          userdispatch({
            type: "LOAD_ACTION_FLOW",
            payload: flow_output.data.filter((x) => x.value === "RecheckPass" || x.value === "RequestVersion" || x.value === "RejectRecheck")
          });
        }

        if (userstate?.mailbox[0]?.NodeName !== "qa" && userstate?.mailbox[0]?.NodeName !== "qa_leader") {
          userdispatch({ type: "LOAD_ACTION_FLOW", payload: flow_output.data.filter((x) => x.Type === "Task") })
        }
      }
    } catch (error) {

    }

  }

  const loadModule = async () => {
    try {
      const module = await Axios({
        url: process.env.REACT_APP_API_URL + "/master/modules",
        method: "GET",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
        params: {
          productId: userstate?.taskdata?.data[0]?.ProductId
        }
      });
      userdispatch({ type: "LOAD_MODULE", payload: module.data })
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
    setProgressStatus(item.label);
    userdispatch({ type: "SELECT_NODE_OUTPUT", payload: item.data })

    // Flow Bug
    if (userstate?.taskdata?.data[0]?.IssueType === "Bug") {
      if (item.data.NodeName === "support") {
        if (item.data.value === "SendToDev") { setModalsendtask_visible(true) }
        if (item.data.value === "ResolvedTask") { setModalsendtask_visible(true) }
        if (item.data.value === "RejectToQA") { setModalsendtask_visible(true) }
        if (item.data.value === "SendToDeploy") { setModalsendtask_visible(true) }
      }
      if (item.data.NodeName === "developer_2") {
        if (item.data.value === "LeaderAssign") {
          setModalleaderassign_visible(true)
        }
        if (item.data.value === "SendUnitTest") {
          setModaldeveloper_visible(true)
        }
        if (item.data.value === "LeaderQC" || item.data.value === "LeaderReject") {
          setModalsendtask_visible(true)
        }
        if (item.data.value === "SendVersion") {
          setModalDevSendVersion(true)
        }
        if (item.data.value === "RejectToSupport") { setModalsendtask_visible(true) }
        if (item.data.value === "Deploy") { setModalcomplete_visible(true) }
      }
      if (item.data.NodeName === "developer_1") {
        if (item.data.value === "SendUnitTest") { setModaldeveloper_visible(true) }
        if (item.data.value === "RejectToDevLeader") { setModalsendtask_visible(true) }
      }
      if (item.data.NodeName === "qa_leader") {
        if (item.data.value === "QAassign") { setModalQAassign_visible(true) }
        if (item.data.value === "QApass" || item.data.value === "RequestVersion") {
          setModalQA_visible(true)
        }
        if (item.data.value === "LeaderReject" || item.data.value === "RejectRecheck" || item.data.value === "QAReject" || item.data.value === "RecheckPass") {
          setModalsendtask_visible(true)
        }
      }
      if (item.data.NodeName === "qa") {
        if (item.data.value === "SendQALeader") {
          setModalQA_visible(true)
        }
        if (item.data.value === "QApass" || item.data.value === "RequestVersion") {
          setModalQA_visible(true)
        }
        if (item.data.value === "QAReject") {
          setModalsendtask_visible(true)
        }
      }

    }
    // Flow CR
    if (userstate?.taskdata?.data[0]?.IssueType === "ChangeRequest" || userstate?.taskdata?.data[0]?.IssueType === "Memo") {
      if (item.data.NodeName === "support") {
        if (item.data.value === "ResolvedTask" || item.data.value === "RejectToCR" || item.data.value === "SendToDeploy") {
          setModalsendtask_visible(true)
        }
      }
      if (item.data.NodeName === "cr_center") {
        if (item.data.value === "RequestManday" || item.data.value === "RequestDueDate") { setModalsendtask_visible(true) }
        if (item.data.value === "CheckManday" || item.data.value === "RejectManday") { setModalmanday_visible(true) }
        if (item.data.value === "ResolvedTask") { setModalsendtask_visible(true) }
        if (item.data.value === "RejectTask") { setModalsendtask_visible(true) }
      }
      if (item.data.NodeName === "developer_2") {
        if (item.data.value === "SendManday") { setModalmanday_visible(true) }
        if (item.data.value === "SendDueDate") { setModalduedate_visible(true) }
        if (item.data.value === "LeaderAssign") { setModalleaderassign_visible(true) }
        if (item.data.value === "LeaderQC" || item.data.value === "RejectToCR" || item.data.value === "LeaderReject") {
          setModalsendtask_visible(true)
        }
        if (item.data.value === "Deploy") {
          setModalcomplete_visible(true)
        }

      }
      if (item.data.NodeName === "developer_1") {
        if (item.data.value === "SendUnitTest") { setModaldeveloper_visible(true) }
        if (item.data.value === "RejectToDevLeader") { setModalsendtask_visible(true) }
      }
      if (item.data.NodeName === "qa_leader") {
        if (item.data.value === "QAassign") {
          setModalQAassign_visible(true)
        }
        if (item.data.value === "QApass") {
          setModalQA_visible(true)
        }
        if (item.data.value === "RecheckPass") { setModalsendtask_visible(true) }
        if (item.data.value === "LeaderReject" || item.data.value === "RejectRecheck" || item.data.value === "QAReject") { setModalsendtask_visible(true) }
      }
      if (item.data.NodeName === "qa") {
        if (item.data.value === "QApass") {
          setModalQA_visible(true)
        }
        if (item.data.value === "QAReject") {
          setModalsendtask_visible(true)
        }

      }
    }

    // Flow Use
    if (userstate?.taskdata?.data[0]?.IssueType === "Use") {
      if (item.data.NodeName === "support") {
        if (item.data.value === "RequestInfoDev") { setModalRequestInfoDev(true) }
      }
      if (item.data.NodeName === "developer_1") {
        if (item.data.value === "SendInfoToSupport") { setModalsendtask_visible(true) }
      }
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

  function onChange(value, item) {

    if (item.type === "module") {
      Modal.info({
        title: 'ต้องการเปลียนข้อมูล ใช่หรือไม่',
        content: (
          <div>
            <p></p>
          </div>
        ),
        okCancel() {

        },
        onOk() {
          updateModule(value, item)
        },
      });
    }
    if (item.type === "progress") {
      alert()
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

        setPageLoading(false);
      }

    } catch (error) {

    }
  }

  const updateReleaseNote = async (value) => {
    try {
      const result = await Axios({
        url: process.env.REACT_APP_API_URL + "/tickets/update-releasenote",
        method: "PATCH",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
        data: {
          taskid: match.params.task,
          ischeck: value
        }
      });
      message.loading({ content: 'Loading...', duration: 0.5 });
      if (result.status === 200) {
        message.success({ content: 'Success!', duration: 1 });
        GetTaskDetail();
      }

    } catch (error) {

    }
  }

  const updateModule = async (param) => {
    try {
      const result = await Axios({
        url: process.env.REACT_APP_API_URL + "/workflow/module",
        method: "PATCH",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
        data: {
          task_id: match.params.task,
          module_id: param
        }
      });

      if (result.status === 200) {
        window.location.reload(true);
      }

    } catch (error) {

    }
  }

  useEffect(() => {
    GetTaskDetail();
    getMailBox();
  }, [])

  useEffect(() => {
    if (historyduedate_visible) {
      GetDueDateHistory();
    }
  }, [historyduedate_visible])

  useEffect(() => {
    if (userstate?.taskdata?.data[0] !== undefined) {
      getflow_output(userstate?.taskdata?.data[0]?.TransId)
    }
  }, [userstate?.taskdata?.data[0]?.TransId])


  return (
    <MasterPage>
      <Spin spinning={pageLoading} tip="Loading...">
        <div style={{ height: "100%", overflowY: 'hidden' }} ref={setContainer} >

          <Row style={{ height: 'calc(100% - 0px)' }}>
            {/* Content */}
            <Col span={16} style={{ padding: "0px 24px 24px 24px", height: "100%", overflowY: "scroll" }}>

              <Row style={{ textAlign: "left" }}>
                <Col span={24} style={{ textAlign: "left" }}>
                  <div offsetTop={10} style={{ zIndex: 100, overflow: "hidden", position: "fixed", width: "400px" }}>
                    <Button
                      type="link"
                      icon={<LeftCircleOutlined />}
                      // style={{zIndex:99}}
                      style={{ fontSize: 18, padding: 0, backgroundColor: "white", width: "100%", textAlign: "left" }}
                      onClick={() => history.goBack()}
                    >
                      Back
                    </Button>
                  </div>
                </Col>
              </Row>
              <Row style={{ marginTop: 30 }}>
                <Col span={24}>
                  <label className="topic-text">
                    {userstate?.taskdata?.data[0]?.TicketNumber}
                    {userstate?.taskdata?.data[0]?.IsReOpen === true ? " (ReOpen)" : ""}
                  </label>
                </Col>
              </Row>

              {/* Issue Description */}
              <Row style={{ marginRight: 24 }}>
                <Col span={24}>
                  <div className="issue-detail-box">
                    <Row>
                      <Col span={16} style={{ display: "inline" }}>
                        <Typography.Title level={4}>
                          {/* <Avatar size={32} icon={<UserOutlined />} />&nbsp;&nbsp;  {userstate.issuedata.details[0] && userstate.issuedata.details[0].Title} */}
                          <Avatar size={32} icon={<UserOutlined />} />&nbsp;&nbsp;  {userstate?.taskdata?.data[0]?.Title}
                        </Typography.Title>
                      </Col>
                      <Col span={8} style={{ display: "inline", textAlign: "right" }}>
                        <Button title="file attach" type="link"
                          style={{ display: userstate?.taskdata?.data[0]?.cntFile === 0 ? "none" : "inline-block" }}
                          icon={<img
                            style={{ height: "20px", width: "20px" }}
                            src={`${process.env.PUBLIC_URL}/icons-attach.png`}
                            alt=""
                          />}
                          onClick={() => setModalfiledownload_visible(true)}
                        />
                        <Button title="preview" type="link"
                          icon={<img
                            style={{ height: "20px", width: "20px" }}
                            src={`${process.env.PUBLIC_URL}/icons-expand.png`}
                            alt=""
                          />}
                          onClick={() => setModalpreview(true)}
                        />
                        <Divider type="vertical" />
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
                        <div className="issue-description"
                          dangerouslySetInnerHTML={{ __html: userstate?.taskdata?.data[0]?.Description }}
                          onClick={e => {
                            if (e.target.tagName == "IMG") {
                              setImgUrl(e.target.src);
                              setModalPreview(true);
                            }
                          }}>

                        </div>
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
                      refId: userstate?.taskdata?.data[0]?.TaskId,
                      reftype: "Ticket_Task",
                    }}
                  />
                </Col>
              </Row>

              {/* TAB Activity */}
              <Row style={{ marginTop: 36, marginRight: 24 }} >
                <Col span={24} >
                  <label className="header-text">Activity</label>

                  {
                    <Tabs defaultActiveKey="1" size="small" >
                      <TabPane tab="Task Note" key="1" >
                        <TaskComment />
                      </TabPane>
                      <TabPane tab="History Log" key="2">
                        <InternalHistorylog subtype="task" />
                      </TabPane>
                    </Tabs>
                  }


                </Col>
              </Row>
              {/* </div> */}
            </Col>
            {/* Content */}

            {/* SideBar */}
            <Col span={8} style={{ padding: "0px 0px 0px 20px", height: "100%", overflowY: "auto" }}>
              <Row style={{ marginBottom: 20, marginTop: 24 }}>
                <Col span={18}>
                  <label className="header-text">Progress Status</label>
                </Col>
                <Col span={18}
                  style={{
                    marginTop: 10,
                    //display: userstate.taskdata.data[0]?.MailType === "in" && userstate?.actionflow?.length !== 0 ? "block" : "none"
                    display: userstate?.mailbox[0]?.MailType === "in" && userstate?.actionflow?.length !== 0 ? "block" : "none"
                  }}
                >
                  <Select ref={selectRef}
                    value={userstate.taskdata.data[0] && userstate.taskdata.data[0].FlowStatus}
                    style={{ width: '100%' }} placeholder="None"
                    onChange={(value, item) => HandleChange(value, item)}
                    options={userstate.actionflow && userstate.actionflow.map((x) => ({ value: x.FlowOutputId, label: x.TextEng, data: x }))}
                  />
                </Col>
                <Col span={18}
                  style={{
                    // display: userstate.taskdata.data[0]?.MailType === "in" && userstate?.actionflow?.length === 0 ? "block" : "none"
                    display: userstate?.mailbox[0]?.MailType === "in" && userstate?.actionflow?.length === 0 ? "block" : "none"
                  }}>
                  <label className="value-text">{userstate?.taskdata?.data[0]?.FlowStatus}</label>
                </Col>
                <Col span={18}
                  style={{
                    //display: userstate.taskdata.data[0]?.MailType === "out" ? "block" : "none"
                    display: userstate?.mailbox[0]?.MailType === "out" ? "block" : "none"
                  }}>
                  <label className="value-text">{userstate?.taskdata?.data[0]?.FlowStatus}</label>
                </Col>

              </Row>
              <Row style={{ marginBottom: 20 }}>
                <Col span={18}>
                  <label className="header-text">Priority</label>
                  <br />
                  <label className="value-text">{userstate?.taskdata?.data[0]?.Priority}</label>
                </Col>
              </Row>

              <Row style={{
                marginBottom: 20,
                display: userstate.taskdata.data[0]?.IssueType !== "ChangeRequest" &&
                  userstate.taskdata.data[0]?.DueDate !== null ? "inline-block" : "none"
              }}
              >
                {/* <Col span={3} style={{ marginTop: "10px" }}>
                  <label className="header-text">SLA</label>
                </Col> */}
                <Col span={24} >
                  <label className="header-text">Time Tracking</label>
                  {
                    userstate.taskdata.data[0] &&

                    <Button type="link"
                      icon={<ClockCircleOutlined style={{ fontSize: 18 }} />}
                      onClick={() => { setModaltimetracking_visible(true) }}
                    />
                  }

                </Col>
              </Row>

              <Row style={{ marginBottom: 20, display: userstate.taskdata.data[0]?.DueDate === null ? "none" : "block" }}>
                <Col span={24}>
                  <label className="header-text">DueDate</label>
                  <br />


                  {/* คลิกเปลี่ยน DueDate ได้เฉพาะ support */}
                  {/* {
                    userstate?.mailbox[0]?.NodeName === "cr_center"
                      ? <Button type="link"
                        onClick={() => setModalduedate_visible(true)}
                      >
                        {userstate.taskdata.data[0] &&
                          (userstate.taskdata.data[0].DueDate === null ? "None" : moment(userstate.taskdata.data[0].DueDate).format("DD/MM/YYYY HH:mm"))}
                      </Button>
                      : <label className="value-text">&nbsp;&nbsp;{userstate.taskdata.data[0] && moment(userstate.taskdata.data[0].DueDate).format("DD/MM/YYYY HH:mm")}</label>
                  }

                  <Button type="link"
                    icon={<ClockCircleOutlined style={{ fontSize: 18 }} />}
                    onClick={() => { setHistoryduedate_visible(true) }}
                  /> */}
                  <label className="value-text">&nbsp;&nbsp;{userstate.taskdata.data[0] && moment(userstate.taskdata.data[0].DueDate).format("DD/MM/YYYY HH:mm")}</label>
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
                  {
                    (userstate?.mailbox[0]?.NodeName === "support" || userstate?.mailbox[0]?.NodeName === "cr_center") &&
                      userstate.taskdata.data[0]?.MailType === "in" &&
                      userstate?.taskdata?.data[0]?.Status === "Waiting Progress"
                      ? <Select
                        style={{ width: '100%' }}
                        allowClear
                        showSearch

                        filterOption={(input, option) =>
                          option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onClick={() => loadModule()}
                        options={userstate.masterdata.moduleState.map((x) => ({ value: x.Id, label: x.Name, type: "module" }))}
                        onChange={(value, item) => onChange(value, item)}
                        value={userstate?.taskdata?.data[0]?.ModuleName}
                      />

                      : <label className="value-text">{userstate?.taskdata?.data[0]?.ModuleName}</label>
                  }
                </Col>
              </Row>

              <Row style={{
                marginBottom: 20,
                display: userstate.taskdata.data[0]?.IssueType === "ChangeRequest" &&
                  userstate.taskdata.data[0]?.Manday !== null ? "block" : "none"
              }}>
                <Col span={18}>
                  <label className="header-text">Manday</label>
                  <label style={{ marginLeft: 10 }} className="value-text">{userstate.taskdata.data[0]?.Manday}</label>
                </Col>

              </Row>

              <Row style={{ marginBottom: 20, }}>
                <Col span={18}>
                  <label className="header-text">Release Note</label>&nbsp;&nbsp;
                  <Checkbox
                    checked={userstate.taskdata.data[0]?.IsReleaseNote}
                    onChange={(x) => updateReleaseNote(x.target.checked)} />
                </Col>
              </Row>

              <Row
                style={{
                  marginBottom: 20,
                  display: userstate?.taskdata?.data[0]?.IssueType === "Bug" && userstate.taskdata.data[0]?.PatchUpdate !== null ? "block" : "none"
                }}>
                <Col span={18}>
                  <label className="header-text">Version</label>
                  <br />
                  <label className="value-text">
                    {userstate.taskdata.data[0]?.Version}
                  </label>
                </Col>
              </Row>

              <Row
                style={{
                  marginBottom: 20,
                  display: userstate?.taskdata?.data[0]?.IssueType === "Bug" && userstate.taskdata.data[0]?.PatchUpdate !== null ? "block" : "none"
                }}>
                <Col span={18}>
                  <label className="header-text">วันที่ Update Patch</label>
                  <br />
                  <label className="value-text">
                    {moment(userstate.taskdata.data[0]?.PatchUpdate).format("DD/MM/YYYY HH:mm")}
                  </label>
                </Col>
              </Row>

            </Col>
            {/* SideBar */}
          </Row>
        </div>

        {/* Modal */}
        <Modal
          title="Preview"
          width={1000}
          visible={modalpreview}
          onCancel={() => setModalpreview(false)}
        >
          <Row>
            <Col span={16} style={{ display: "inline" }}>
              <Typography.Title level={4}>
                <Avatar size={32} icon={<UserOutlined />} />&nbsp;&nbsp;  {userstate?.taskdata?.data[0]?.Title}
              </Typography.Title>
            </Col>
          </Row>
          <div className="issue-description" dangerouslySetInnerHTML={{ __html: userstate?.taskdata?.data[0]?.Description }} ></div>
        </Modal>

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

        <ModalSendTask
          title={ProgressStatus}
          visible={modalsendtask_visible}
          width={800}
          onCancel={() => { return (setModalsendtask_visible(false), setSelected(null)) }}
          onOk={() => {
            setModalsendtask_visible(false);
          }}
          details={{
            ticketid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TicketId,
            taskid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TaskId,
            mailboxid: userstate.taskdata.data[0] && userstate.taskdata.data[0].MailboxId,
            flowoutputid: userstate.node.output_data.FlowOutputId,
            flowoutput: userstate.node.output_data
          }}
        />

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
            flowoutputid: userstate.node.output_data.FlowOutputId,
            flowoutput: userstate.node.output_data
          }}
        />

        <ModalManday
          title={ProgressStatus}
          visible={modalmanday_visible}
          width={800}
          onCancel={() => { return (setModalmanday_visible(false)) }}
          onOk={() => {
            setModalmanday_visible(false);
          }}
          details={{
            ticketid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TicketId,
            taskid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TaskId,
            mailboxid: userstate.taskdata.data[0] && userstate.taskdata.data[0].MailboxId,
            flowoutput: userstate.node.output_data,

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
            // window.location.reload("false");
          }}
          details={{
            ticketid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TicketId,
            taskid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TaskId,
            mailboxid: userstate.taskdata.data[0] && userstate.taskdata.data[0].MailboxId,
            flowoutputid: userstate.node.output_data.FlowOutputId
          }}
        />

        <ModalReject
          title={ProgressStatus}
          visible={modalreject_visible}
          onCancel={() => { return (setModalreject_visible(false)) }}
          width={800}
          onOk={() => {
            setModalreject_visible(false);
            // window.location.reload("false");
          }}
          details={{
            ticketid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TicketId,
            taskid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TaskId,
            mailboxid: userstate.taskdata.data[0] && userstate.taskdata.data[0].MailboxId,
            flowoutputid: userstate.node.output_data.FlowOutputId,
            flowoutput: userstate.node.output_data
          }}

        />

        <ModalDueDate
          title={ProgressStatus}
          visible={modalduedate_visible}
          width={800}
          onCancel={() => setModalduedate_visible(false)}
          onOk={() => {
            setModalduedate_visible(false);
          }}
          details={{
            ticketid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TicketId,
            taskid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TaskId,
            mailboxid: userstate.taskdata.data[0] && userstate.taskdata.data[0].MailboxId,
            flowoutput: userstate.node.output_data,
            duedate: userstate.taskdata.data[0]?.DueDate === null ? null : moment(userstate.taskdata.data[0]?.DueDate).format("DD/MM/YYYY")
          }}
        />

        <ModalqaAssign
          title={ProgressStatus}
          visible={modalQAassign_visible}
          width={800}
          onCancel={() => { return (setModalQAassign_visible(false)) }}
          onOk={() => {
            setModalQAassign_visible(false);
            // window.location.reload("false");
          }}
          details={{
            ticketid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TicketId,
            taskid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TaskId,
            mailboxid: userstate.taskdata.data[0] && userstate.taskdata.data[0].MailboxId,
            flowoutputid: userstate.node.output_data.FlowOutputId
          }}
        />

        <ModalRequestInfoDev
          title={ProgressStatus}
          visible={modalRequestInfoDev}
          onCancel={() => { return (setModalRequestInfoDev(false), setSelected(null)) }}
          width={800}
          onOk={() => {
            setModalRequestInfoDev(false);
          }}
          onCancel={() => {
            setModalRequestInfoDev(false);

          }}
          details={{
            ticketid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TicketId,
            taskid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TaskId,
            mailboxid: userstate.taskdata.data[0] && userstate.taskdata.data[0].MailboxId,
            flowoutputid: userstate.node.output_data.FlowOutputId,
            flowoutput: userstate.node.output_data
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
            // window.location.reload("false");
          }}
          details={{
            ticketid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TicketId,
            taskid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TaskId,
            mailboxid: userstate.taskdata.data[0] && userstate.taskdata.data[0].MailboxId,
            flowoutputid: userstate.node.output_data.FlowOutputId
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

        <PreviewImg
          title="Preview"
          visible={modalPreview}
          width={800}
          footer={null}
          onCancel={() => {
            setModalPreview(false);
            setImgUrl(null);
          }}
          pathUrl={imgUrl}
        />

        <ModalDevSendVersion
          title="Confirm Deploy File (Patch Version)"
          width={800}
          visible={modalDevSendVersion}
          onCancel={() => { return (setModalDevSendVersion(false)) }}
          onOk={() => {
            setModalDevSendVersion(false);
          }}
          details={{
            ticketid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TicketId,
            taskid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TaskId,
            mailboxid: userstate.taskdata.data[0] && userstate.taskdata.data[0].MailboxId,
            flowoutputid: userstate.node.output_data.FlowOutputId,
            product_code: userstate?.taskdata?.data[0]?.ProductName
          }}
        />

        <ModalFileDownload
          title="File Download"
          visible={modalfiledownload_visible}
          onCancel={() => { return (setModalfiledownload_visible(false)) }}
          width={600}
          onOk={() => {
            setModalfiledownload_visible(false);

          }}
          details={{
            refId: userstate?.taskdata.data[0]?.TaskId,
            reftype: "Ticket_Task",
            grouptype: "attachment"
          }}
        />

      </Spin>
    </MasterPage >
  );
}
