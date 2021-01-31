import { Col, Tag, Row, Select, Divider, Typography, Affix, Button, Avatar, Tabs, Modal, Timeline, Popconfirm } from "antd";
import React, { useState, useEffect, useContext, useRef } from "react";
import "../../../styles/index.scss";
import { useHistory, useRouteMatch } from "react-router-dom";
import CommentBox from "../../../Component/Comment/Internal/Comment";
import InternalComment from "../../../Component/Comment/Internal/Internal_comment";
import Historylog from "../../../Component/History/Customer/Historylog";
import MasterPage from "../MasterPage";
import { ArrowDownOutlined, ArrowUpOutlined, ClockCircleOutlined, ConsoleSqlOutlined, FileAddOutlined, PoweroffOutlined, UserOutlined } from "@ant-design/icons";
import Axios from "axios";
import IssueContext, { userReducer, userState } from "../../../utility/issueContext";
import ModalDueDate from "../../../Component/Dialog/Internal/modalDueDate";
import Clock from "../../../utility/countdownTimer";
import moment from "moment";
import TabsDocument from "../../../Component/Subject/Customer/tabsDocument";
import ModalTimetracking from "../../../Component/Dialog/Internal/modalTimetracking";
import ListSubTask from "../../../Component/Subject/Internal/listSubTask";
import ModalCreateTask from "../../../Component/Dialog/Internal/modalCreateTask";
import ModalResolved from "../../../Component/Dialog/Internal/modalResolved";
import ModalSendIssue from "../../../Component/Dialog/Internal/Issue/modalSendIssue";
import ModalSA from "../../../Component/Dialog/Internal/modalSA";
import ModalManday from "../../../Component/Dialog/Internal/modalManday";
import ModalMandayLog from "../../../Component/Dialog/Internal/modalMandayLog";
import ModalSA_Assessment from "../../../Component/Dialog/Internal/modalSA_Assessment";
import ModalQuotation from "../../../Component/Dialog/Internal/modalQuotation";
import ModalChangeDueDate from "../../../Component/Dialog/Internal/modalChangeDueDate";


const { Option } = Select;
const { TabPane } = Tabs;


export default function Subject() {
  const match = useRouteMatch();
  const history = useHistory();
  const selectRef = useRef(null)
  const subTaskRef = useRef(null)
  const { state: userstate, dispatch: userdispatch } = useContext(IssueContext);


  //modal
  // const [visible, setVisible] = useState(false);
  const [modalsendissue_visible, setModalsendissue_visible] = useState(false);
  const [modaladdtask, setModaladdtask] = useState(false);
  const [modalduedate_visible, setModalduedate_visible] = useState(false);
  const [modalChangeduedate, setModalChangeduedate] = useState(false);
  const [historyduedate_visible, setHistoryduedate_visible] = useState(false);
  const [modalresolved_visible, setModalresolved_visible] = useState(false);
  const [modalsa_visible, setModalsa_visible] = useState(false);
  const [modaltimetracking_visible, setModaltimetracking_visible] = useState(false);
  const [modalcomplete_visible, setModalcomplete_visible] = useState(false);
  const [modalmanday_visible, setModalmanday_visible] = useState(false);
  const [modalmandaylog_visible, setModalmandaylog_visible] = useState(false);
  const [modalAssessment_visible, setModalAssessment_visible] = useState(false);
  const [modalQuotation_visible, setModalQuotation_visible] = useState(false);

  //div
  const [container, setContainer] = useState(null);
  const [divcollapse, setDivcollapse] = useState("block")
  const [collapsetext, setCollapsetext] = useState("Hide details")
  const [divProgress, setDivProgress] = useState("hide")


  // data
  const [ProgressStatus, setProgressStatus] = useState("");
  const [history_duedate_data, setHistory_duedate_data] = useState([]);
  const [duedate, setDuedate] = useState(null);
  const [selected, setSelected] = useState()
  const [SLA, setSLA] = useState(null);
  const [createddate, setCreateddate] = useState(null);
  const [resolveddate, setResolveddate] = useState(null);
  const [history_loading, setHistory_loading] = useState(false);



  const getIssueType = async () => {
    try {
      const issuetype = await Axios({
        url: process.env.REACT_APP_API_URL + "/master/issue-types",
        method: "GET",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
      });
      userdispatch({ type: "LOAD_TYPE", payload: issuetype.data })
    } catch (error) {

    }
  }

  const GetPriority = async () => {
    try {
      const priority = await Axios({
        url: process.env.REACT_APP_API_URL + "/master/priority",
        method: "GET",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
      });
      userdispatch({ type: "LOAD_PRIORITY", payload: priority.data })
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
        if ((flow_output.data.filter((x) => x.Type === "Issue").length) > 0) {
          setDivProgress("show")
        }
        userdispatch({
          type: "LOAD_ACTION_FLOW",
          payload: flow_output.data.filter((x) => x.Type === "Issue")
        });
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

  const SaveIssueType = async (value, item) => {
    const issuetype = await Axios({
      url: process.env.REACT_APP_API_URL + "/tickets/save-issuetype",
      method: "PATCH",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
      },
      data: {
        ticketid: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
        typeid: value,
      }
    });
    if (issuetype.status === 200) {

      Modal.info({
        title: 'บันทึกข้อมูลเรียบร้อย',
        content: (
          <div>
            <p></p>
          </div>
        ),
        onOk() {
          getdetail();
        },
      });
    }

  }

  const UpdatePriority = async (value, item) => {
    console.log("UpdatePriority", value)
    try {
      const priority = await Axios({
        url: process.env.REACT_APP_API_URL + "/tickets/update-priority",
        method: "PATCH",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
        data: {
          ticketid: userstate.issuedata.details[0]?.Id,
          priority: value,
          //internaltype: userstate.issuedata.details[0] && userstate.issuedata.details[0].InternalTypeId,
          history: {
            value: userstate.issuedata.details[0] && userstate.issuedata.details[0].Priority,
            value2: item.label
          }
        }
      });

      if (priority.status === 200) {
        Modal.info({
          title: 'บันทึกข้อมูลเรียบร้อย',
          content: (
            <div>
              <p></p>
            </div>
          ),
          onOk() {
            getdetail();
            setHistory_loading(true);
          },
        });
      }

    } catch (error) {
      Modal.info({
        title: 'บันทึกข้อมูลไม่สำเร็จ',
        content: (
          <div>
            <p>{error.messeage}</p>
            <p>{error.respone.data}</p>
          </div>
        ),
        onOk() {
          getdetail();
        },
      });
    }
  }

  function HandleChange(value, item) {
    console.log("value", value)
    console.log("item", item)
    setProgressStatus(item.label);
    userdispatch({ type: "SELECT_NODE_OUTPUT", payload: item.data })

    // Bug Flow
    if (userstate.issuedata.details[0]?.IssueType === "Bug") {
      if (userstate.issuedata.details[0] && userstate.issuedata.details[0].NodeName === "support" && item.data.value === "Resolved" || item.data.value === "Deploy") { return (setModalresolved_visible(true)) }
      if (userstate.issuedata.details[0]?.NodeName === "support" && item.data.value === "RequestInfo") {
        setModalsendissue_visible(true)
      }
    }
    //CR FLOW
    if (userstate.issuedata.details[0]?.IssueType === "ChangeRequest") {
      if (userstate.issuedata.details[0]?.NodeName === "support") {
        if (item.data.value === "SendCR_Center") {
          setModalsendissue_visible(true)
        }
        if (item.data.value === "SendManday") {
          setModalsendissue_visible(true)
        }
        if (item.data.value === "ConfirmManday") {
          setModalsendissue_visible(true)
        }
        if (item.data.value === "SendDueDate" || item.data.value === "RequestDueDate") {
          setModalduedate_visible(true)
        }
      }
      if (userstate.issuedata.details[0]?.NodeName === "cr_center") {
        if (item.data.value === "SendToSA") {
          setModalsendissue_visible(true)
        }
        if (item.data.value === "SendManday") {
          setModalmanday_visible(true)
        }
        if (item.data.value === "CheckManday") {
          setModalsendissue_visible(true)
        }
        if (item.data.value === "ApproveCR") {
          setModalsendissue_visible(true)
        }
        if (item.data.value === "SendPR") {
          setModalQuotation_visible(true)
        }
        if (item.data.value === "ConfirmPayment") {
          setModalsendissue_visible(true)
        }
        if (item.data.value === "RequestDueDate") {
          setModalduedate_visible(true)
        }
        if (item.data.value === "SendDueDate") {
          setModalduedate_visible(true)
        }

      }
      if (userstate.issuedata.details[0]?.NodeName === "sa") { return setModalsa_visible(true) }
    }
    // Use Flow
    if (userstate.issuedata.details[0]?.IssueType === "Use") {
      if (userstate.issuedata.details[0]?.NodeName === "support") {
        if (item.data.value === "RequestInfo") {
          setModalsendissue_visible(true)
        }
        if (item.data.value === "SendToSA") {
          setModalsendissue_visible(true)
        }
        if (item.data.value === "Resolved") {
          setModalsendissue_visible(true)
        }


      }
      if (userstate.issuedata.details[0]?.NodeName === "sa") {
        if (item.data.value === "Assessment") {
          setModalsendissue_visible(true)
        }
      }

    }


    if (item.data.value === "Reject") { return setModalsendissue_visible(true) }

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
    getflow_output(userstate?.issuedata?.details[0]?.TransId);
  }, [userstate?.issuedata?.details[0]?.TransId])

  useEffect(() => {
    if (modalChangeduedate === false) {
      getdetail();
    }
  }, [modalChangeduedate])


  // useEffect(() => {
  //   getdetail();
  // }, [SLA])

  useEffect(() => {
    if (historyduedate_visible) {
      GetDueDateHistory();
    }
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
            <Col span={16} style={{ paddingTop: 10 }}>
              <div style={{ height: "80vh", overflowY: "scroll" }}>
                {/* Issue Description */}
                <Row style={{ marginRight: 24 }}>
                  <Col span={24}>

                    <label className="topic-text">{userstate.issuedata.details[0] && userstate.issuedata.details[0].Number}</label>
                    <div className="issue-detail-box">
                      <Row>
                        <Col span={16} style={{ display: "inline" }}>
                          <Typography.Title level={4}>
                            <Avatar size={32} icon={<UserOutlined />} />&nbsp;&nbsp;  {userstate.issuedata.details[0] && userstate.issuedata.details[0].Title}
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
                            {userstate.issuedata.details[0] && userstate.issuedata.details[0].Description}
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
                        refId: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
                        //reftype: "Master_Ticket",
                      }}
                    />
                  </Col>
                </Row>

                {/* SubTask */}
                <Row style={{ marginTop: 26, marginRight: 24, textAlign: "right" }}>
                  <Col span={24}
                    style={{
                      display: userstate.issuedata.details[0]?.IssueType === "ChangeRequest" &&
                        userstate.issuedata.details[0]?.NodeName === "cr_center" &&
                        userstate.issuedata.details[0]?.Manday === null ? "block" : "none"
                    }} >

                    <Button icon={<FileAddOutlined />}
                      disabled={userstate.issuedata.details[0]?.FlowStatus === "Waiting SA" ? true : false}
                      shape="round"
                      onClick={() => setModaladdtask(true)} >
                      CreateTask
                        </Button>
                  </Col>
                  <Col span={24}
                    style={{
                      display: userstate.issuedata.details[0]?.IssueType === "Bug" &&
                        userstate.issuedata.details[0].NodeName === "support" &&
                        userstate.issuedata.details[0].InternalStatus !== "Resolved" &&
                        userstate.issuedata.details[0].InternalStatus !== "Deploy" ? "block" : "none"
                    }}>
                    <Button icon={<FileAddOutlined />}
                      shape="round"
                      onClick={() => userstate.issuedata.details[0]?.InternalPriority === null ? alert("กรุณา ระบุ Priority") : setModaladdtask(true)} >
                      CreateTask
                        </Button>
                  </Col>
                </Row>
                <Row style={{ marginRight: 24 }}>
                  <Col span={24}>
                    <ListSubTask
                      // ticketId={match.params.id} ref={subTaskRef}
                      ticketId={userstate.issuedata.details[0]?.Id}
                      ref={subTaskRef}
                      mailtype={userstate.issuedata.details[0] && userstate.issuedata.details[0].MailType}
                    />
                  </Col>
                </Row>

                {/* TAB Activity */}
                <Row style={{ marginTop: 36, marginRight: 24 }}>
                  <Col span={24}>
                    <label className="header-text">Activity</label>

                    {
                      userstate.issuedata.details[0] && userstate.issuedata.details[0].NodeName === "support"
                        ?
                        <Tabs defaultActiveKey="1" >
                          <TabPane tab="Comment" key="1">
                            <CommentBox />
                          </TabPane>
                          <TabPane tab="History Log" key="2">
                            <Historylog loading={history_loading} />
                          </TabPane>
                        </Tabs>

                        :
                        <Tabs defaultActiveKey="1" >
                          {/* <TabPane tab="Internal Note" key="1" >
                            <InternalComment />
                          </TabPane> */}
                          <TabPane tab="History Log" key="1">
                            <Historylog loading={history_loading} />
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
                  <label className="header-text">Progress Status</label>
                </Col>
                <Col span={18} style={{ marginTop: 10 }}>

                  {
                    userstate.issuedata.details[0] && userstate.issuedata.details[0].MailType === "in"
                      && (userstate.issuedata.details[0].NodeName === "support" || userstate.issuedata.details[0].NodeName === "sa" || userstate.issuedata.details[0].NodeName === "cr_center")
                      && divProgress === "show"

                      ? <Select ref={selectRef}
                        value={userstate.issuedata.details[0] && userstate.issuedata.details[0].FlowStatus}
                        style={{ width: '100%' }} placeholder="None"
                        onClick={() => getflow_output(userstate.issuedata.details[0].TransId)}
                        onChange={(value, item) => HandleChange(value, item)}
                        options={userstate.actionflow && userstate.actionflow.map((x) => ({ value: x.FlowOutputId, label: x.TextEng, data: x }))}
                      />

                      : <label className="value-text">{userstate.issuedata.details[0] && userstate.issuedata.details[0].FlowStatus}</label>
                  }

                </Col>
              </Row>
              <Row style={{ marginBottom: 20 }} align="middle">
                <Col span={24}>
                  <label className="header-text">Priority</label>
                  <label className="value-text"> (Customer)</label>
                </Col>
                <Col span={18}>
                  <label className="value-text">{userstate.issuedata.details[0]?.Priority}</label>
                </Col>
              </Row>

              <Row style={{ marginBottom: 20 }} align="middle">
                <Col span={24}>
                  <label className="header-text">Priority</label>
                  <label className="value-text"> (ICON)</label>
                </Col>
                <Col span={18} style={{ marginTop: 10 }}>
                  {
                    (userstate.issuedata.details[0]?.MailType === "in" && userstate.issuedata.details[0]?.NodeName === "support" && userstate.issuedata.details[0]?.NodeActionText === "CheckIssue")
                      ? <Select
                        style={{ width: '100%' }}
                        allowClear
                        showSearch

                        filterOption={(input, option) =>
                          option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onClick={() => GetPriority()}

                        options={userstate.masterdata.priorityState && userstate.masterdata.priorityState.map((x) => ({ value: x.Id, label: x.Name }))}
                        onChange={(value, item) => UpdatePriority(value, item)}
                        value={userstate.issuedata.details[0] && userstate.issuedata.details[0].InternalPriority}
                      />
                      : <label className="value-text">
                        {renderColorPriority(userstate.issuedata.details[0] && userstate.issuedata.details[0].InternalPriority)}&nbsp;&nbsp;
                         {userstate.issuedata.details[0] && userstate.issuedata.details[0].InternalPriority}
                      </label>
                  }
                </Col>
              </Row>


              <Row style={{
                marginBottom: 20,
                display: userstate.issuedata.details[0]?.IssueType !== "ChangeRequest" &&
                  userstate.issuedata.details[0]?.SLA_DueDate !== null ? "block" : "none"
              }}
              >

                <Col span={24} style={{ marginTop: "10px" }}>
                  <label className="header-text">SLA</label>
                  {
                    userstate.issuedata.details[0] &&
                    <Clock
                      showseconds={false}
                      deadline={userstate.issuedata.details[0] && userstate.issuedata.details[0].SLA_DueDate}
                      createdate={userstate.issuedata.details[0].AssignIconDate === null ? undefined : userstate.issuedata.details[0].AssignIconDate}
                      resolvedDate={userstate.issuedata.details[0].ResolvedDate === null ? undefined : userstate.issuedata.details[0].ResolvedDate}
                      onClick={() => { setModaltimetracking_visible(true) }}
                    />
                  }
                  <label className="header-text">DueDate</label>
                  <label className="value-text" style={{ marginLeft: 10 }}>
                    {(userstate?.issuedata?.details[0]?.SLA_DueDate === null ? "None" : moment(userstate?.issuedata?.details[0]?.SLA_DueDate).format("DD/MM/YYYY HH:mm"))}
                  </label>

                </Col>
              </Row>


              <Row style={{ marginBottom: 20, display: userstate.issuedata.details[0]?.DueDate === null ? "none" : "block" }}>
                <Col span={18}>
                  <label className="header-text">DueDate (Customer)</label>

                  <ClockCircleOutlined style={{ fontSize: 18, marginLeft: 12 }} onClick={() => setHistoryduedate_visible(true)} />
                  <br />
                  {/* คลิกเปลี่ยน DueDate ได้เฉพาะ support */}
                  {
                    userstate.issuedata.details[0] && userstate.issuedata.details[0].NodeName === "support"
                      ? <label className="text-link value-text"
                        onClick={() => setModalChangeduedate(true)}
                      >
                        {userstate.issuedata.details[0] &&
                          (userstate.issuedata.details[0].DueDate === null ? "None" : moment(userstate.issuedata.details[0].DueDate).format("DD/MM/YYYY HH:mm"))}
                      </label>
                      : <label>&nbsp;&nbsp;{userstate.issuedata.details[0] && moment(userstate.issuedata.details[0].DueDate).format("DD/MM/YYYY HH:mm")}</label>
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
                  <label className="value-text">{userstate.issuedata.details[0] && userstate.issuedata.details[0].CompanyName}</label>
                </Col>
              </Row>
              <Row style={{ marginBottom: 20 }}>
                <Col span={18}>
                  <label className="header-text">IssueType</label>
                </Col>
                <Col span={18} style={{ marginTop: 10 }}>
                  {
                    (userstate.issuedata.details[0]?.MailType === "in" && userstate.issuedata.details[0]?.NodeName === "support" && userstate.issuedata.details[0]?.NodeActionText === "CheckIssue")
                      ? <Select
                        style={{ width: '100%' }}
                        allowClear
                        showSearch

                        filterOption={(input, option) =>
                          option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onClick={() => getIssueType()}
                        options={userstate.masterdata.issueTypeState && userstate.masterdata.issueTypeState.map((x) => ({ value: x.Id, label: x.Name }))}
                        onChange={(value, item) => SaveIssueType(value, item)}
                        value={userstate.issuedata.details[0] && userstate.issuedata.details[0].InternalTypeText}
                      />

                      : <label className="value-text">{userstate.issuedata.details[0] && userstate.issuedata.details[0].InternalTypeText}</label>
                  }

                </Col>
              </Row>
              <Row style={{ marginBottom: 20 }}>
                <Col span={18}>
                  <label className="header-text">Product</label>
                  <br />
                  <label className="value-text">{userstate.issuedata.details[0] && `${userstate.issuedata.details[0].ProductName} - (${userstate.issuedata.details[0].ProductFullName})`}</label>
                </Col>
              </Row>
              <Row style={{ marginBottom: 20 }}>
                <Col span={18}>
                  <label className="header-text">Module</label>
                  <br />
                  <label className="value-text">{userstate.issuedata.details[0] && userstate.issuedata.details[0].ModuleName}</label>
                </Col>
              </Row>

              <Row style={{
                marginBottom: 20,
                display: userstate.issuedata.details[0]?.IssueType === "ChangeRequest" && userstate.issuedata.details[0]?.IsAssessment === 1 ? "block" : "none"
              }}>
                <Col span={18}>
                  <label className="header-text">SA ประเมินผลกระทบ</label>
                  <Button type="link" onClick={() => setModalAssessment_visible(true)}> รายละเอียด </Button>
                </Col>
              </Row>

              <Row style={{
                marginBottom: 20,
                display: userstate.issuedata.details[0]?.IssueType === "ChangeRequest" &&
                  userstate.issuedata.details[0]?.Manday ? "block" : "none"
              }}>
                <Col span={18}>
                  <label className="header-text">Manday</label>
                  <Button type="link" onClick={() => setModalmandaylog_visible(true)} >{userstate.issuedata.details[0]?.Manday}</Button>

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

      <ModalCreateTask
        title={ProgressStatus}
        visible={modaladdtask}
        width={800}
        onCancel={() => { return (setModaladdtask(false), setSelected(null)) }}
        onOk={() => {
          setModaladdtask(false);
          subTaskRef.current.GetTask()
        }}
        details={{
          ticketid: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
          mailboxid: userstate.issuedata.details[0] && userstate.issuedata.details[0].MailBoxId
          // productId: userstate.issuedata.details[0] && userstate.issuedata.details[0].ProductId

        }}
      />

      <ModalDueDate
        title="DueDate"
        visible={modalduedate_visible}
        width={800}
        onCancel={() => setModalduedate_visible(false)}
        onOk={() => {
          setModalduedate_visible(false);
        }}
        details={{
          ticketid: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
          mailboxid: userstate.issuedata.details[0] && userstate.issuedata.details[0].MailBoxId,
          flowoutput: userstate.node.output_data,
          duedate: userstate.issuedata.details[0]?.DueDate === null ? null : moment(userstate.issuedata.details[0]?.DueDate).format("DD/MM/YYYY")
        }}
      />

      <ModalChangeDueDate
        title="เปลียน Due Date"
        visible={modalChangeduedate}
        width={800}
        onCancel={() => setModalChangeduedate(false)}
        onOk={() => {
          setModalChangeduedate(false);
        }}
        details={{
          ticketid: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
        }}
      />

      <ModalTimetracking
        title="Time Tracking"
        width={600}
        visible={modaltimetracking_visible}
        onCancel={() => { return (setModaltimetracking_visible(false)) }}
        details={{
          transgroupId: userstate.issuedata.details[0] && userstate.issuedata.details[0].TransGroupId,

        }}
      />

      <ModalSendIssue
        title={ProgressStatus}
        visible={modalsendissue_visible}
        width={800}
        onCancel={() => { return (setModalsendissue_visible(false), setSelected(null)) }}
        onOk={() => {
          setModalsendissue_visible(false);
        }}
        details={{
          ticketid: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
          mailboxid: userstate.issuedata.details[0] && userstate.issuedata.details[0].MailBoxId,
          flowoutput: userstate.node.output_data
        }}
      />

      <ModalSA
        title={ProgressStatus}
        visible={modalsa_visible}
        width={800}
        onCancel={() => { return (setModalsa_visible(false)) }}
        onOk={() => {
          setModalsa_visible(false);
        }}
        details={{
          ticketid: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
          mailboxid: userstate.issuedata.details[0] && userstate.issuedata.details[0].MailBoxId,
          flowoutput: userstate.node.output_data
        }}
      />

      <ModalResolved
        title="Resolved"
        visible={modalresolved_visible}
        width={800}
        onCancel={() => { return (setModalresolved_visible(false), setSelected(null)) }}
        onOk={() => {
          setModalresolved_visible(false);
        }}
        details={{
          ticketid: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
          mailboxid: userstate.issuedata.details[0] && userstate.issuedata.details[0].MailBoxId,
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
          ticketid: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
          mailboxid: userstate.issuedata.details[0] && userstate.issuedata.details[0].MailBoxId,
          flowoutput: userstate.node.output_data,
          costmanday: userstate.issuedata.details[0]?.CostPerManday
        }}
      />

      <ModalMandayLog
        title="ข้อมูล Manday"
        visible={modalmandaylog_visible}
        width={800}
        onCancel={() => { return (setModalmandaylog_visible(false)) }}
        details={{
          ticketid: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
          mailtype: userstate.issuedata.details[0]?.MailType,
          cost: userstate.issuedata.details[0]?.Cost,
          totalmanday: userstate.issuedata.details[0]?.Manday
        }}
      />

      <ModalSA_Assessment
        title="ข้อมูลประเมิน ผลกระทบ"
        visible={modalAssessment_visible}
        width={600}
        onCancel={() => { return (setModalAssessment_visible(false)) }}
        details={{
          ticketid: userstate.issuedata.details[0]?.Id,
        }}
      />

      <ModalQuotation
        title={ProgressStatus}
        visible={modalQuotation_visible}
        width={800}
        onCancel={() => { return (setModalQuotation_visible(false), setSelected(null)) }}
        onOk={() => {
          setModalQuotation_visible(false);
        }}
        details={{
          ticketid: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
          mailboxid: userstate.issuedata.details[0] && userstate.issuedata.details[0].MailBoxId,
          flowoutput: userstate.node.output_data
        }}
      />



    </MasterPage>
  );
}
