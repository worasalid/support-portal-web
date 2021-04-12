import { Col, Tag, Row, Select, Divider, Typography, Button, Avatar, Tabs, Modal, Menu, Spin, Dropdown, Affix } from "antd";
import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import "../../../styles/index.scss";
import { useHistory, useRouteMatch } from "react-router-dom";
import CommentBox from "../../../Component/Comment/Internal/Comment";
import InternalCommentBox from "../../../Component/Comment/Internal/Internal_comment";
import Historylog from "../../../Component/History/Customer/Historylog";
import InternalHistorylog from "../../../Component/History/Internal/Historylog";
import MasterPage from "../MasterPage";
import {
  ArrowDownOutlined, ArrowUpOutlined, ClockCircleOutlined, FileAddOutlined, LeftCircleOutlined, UserOutlined,
  UpCircleOutlined, DownCircleOutlined, InfoCircleOutlined, SmallDashOutlined
} from "@ant-design/icons";
import Axios from "axios";
import AuthenContext from "../../../utility/authenContext";
import IssueContext, { userReducer, userState } from "../../../utility/issueContext";
import ModalDueDate from "../../../Component/Dialog/Internal/modalDueDate";
// import Clock from "../../../utility/countdownTimer";
import ClockSLA from "../../../utility/SLATime";
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
import ModalSaveDueDate from "../../../Component/Dialog/Internal/Issue/modalSaveDueDate";
import DuedateLog from "../../../Component/Dialog/Internal/duedateLog";
import PreviewImg from "../../../Component/Dialog/Internal/modalPreviewImg";
import ModalFileDownload from "../../../Component/Dialog/Internal/modalFileDownload";


const { Option } = Select;
const { SubMenu } = Menu;
const { TabPane } = Tabs;


export default function Subject() {
  const match = useRouteMatch();
  const history = useHistory();
  const selectRef = useRef(null)
  const subTaskRef = useRef(null)
  const clockRef = useRef(null)
  const clockRef2 = useRef(null)
  const { state, dispatch } = useContext(AuthenContext);
  const { state: userstate, dispatch: userdispatch } = useContext(IssueContext);
  const [loadingPage, setLoadingPage] = useState(true);
  const [tabKey, setTabKey] = useState("1")

  //modal
  // const [visible, setVisible] = useState(false);
  const [modalpreview, setModalpreview] = useState(false)
  const [modalsendissue_visible, setModalsendissue_visible] = useState(false);
  const [modaladdtask, setModaladdtask] = useState(false);
  const [modalduedate_visible, setModalduedate_visible] = useState(false);
  const [modalChangeduedate, setModalChangeduedate] = useState(false);
  const [modalSaveDuedate, setModalSaveDuedate] = useState(false);
  const [historyduedate_visible, setHistoryduedate_visible] = useState(false);
  const [modalresolved_visible, setModalresolved_visible] = useState(false);
  const [modalsa_visible, setModalsa_visible] = useState(false);
  const [modaltimetracking_visible, setModaltimetracking_visible] = useState(false);
  const [modalmanday_visible, setModalmanday_visible] = useState(false);
  const [modalmandaylog_visible, setModalmandaylog_visible] = useState(false);
  const [modalAssessment_visible, setModalAssessment_visible] = useState(false);
  const [modalQuotation_visible, setModalQuotation_visible] = useState(false);
  const [modalPreview, setModalPreview] = useState(false);
  const [modalfiledownload_visible, setModalfiledownload_visible] = useState(false);

  //div
  const [container, setContainer] = useState(null);
  const [divcollapse, setDivcollapse] = useState("block")
  const [collapsetext, setCollapsetext] = useState("Hide details")
  const [divProgress, setDivProgress] = useState("hide")
  const [imgUrl, setImgUrl] = useState(null);

  //div
  const [activityCollapse, setActivityCollapse] = useState("block")
  const [activityIcon, setActivityIcon] = useState(<DownCircleOutlined style={{ fontSize: 20, color: "#1890ff" }} />)


  // data
  const [ProgressStatus, setProgressStatus] = useState("");
  const [history_duedate_data, setHistory_duedate_data] = useState([]);
  const [history_loading, setHistory_loading] = useState(false);
  const [duedateType, setDuedateType] = useState(null)


  // Load ข้อมูล Master 
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

  // Load flow ที่จะใช้ในการ Action งาน
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
        // if ((flow_output.data.filter((x) => x.Type === "Issue").length) > 0) {
        //   setDivProgress("show")
        // }
        userdispatch({
          type: "LOAD_ACTION_FLOW",
          payload: flow_output.data.filter((x) => x.Type === "Issue" || x.Type === null)
        });
      }
    } catch (error) {

    }

  }

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
          ticketid: match.params.id
        }
      });

      if (mailbox.status === 200) {
        userdispatch({ type: "LOAD_MAILBOX", payload: mailbox.data })
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
        setLoadingPage(false);
        userdispatch({ type: "LOAD_ISSUEDETAIL", payload: ticket_detail.data })
        // getflow_output(ticket_detail.data[0].TransId)
      }
    } catch (error) {

    }
  }

  // Update ข้อมูล
  const SaveIssueType = async (value, item) => {
    const issuetype = await Axios({
      url: process.env.REACT_APP_API_URL + "/tickets/update-issuetype",
      method: "PATCH",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
      },
      data: {
        ticketid: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
        typeid: value,
        transid: userstate?.mailbox[0]?.TransId
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
          subTaskRef.current.GetTask();
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
        Modal.success({
          title: 'บันทึกข้อมูลเรียบร้อย',
          content: (
            <div>
              <p></p>
            </div>
          ),
          okText: "Close",
          onOk() {
            getdetail();
            setHistory_loading(true);
            window.location.reload()
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

  // Fuction 
  function HandleChange(value, item) {

    setProgressStatus(item.label);
    userdispatch({ type: "SELECT_NODE_OUTPUT", payload: item.data })

    // Bug Flow
    if (userstate.issuedata.details[0]?.IssueType === "Bug") {
      if (userstate?.mailbox[0]?.NodeName === "support") {
        if (item.data.value === "RequestInfo" || item.data.value === "Hold") { return setModalsendissue_visible(true) }
        if (item.data.value === "Resolved" || item.data.value === "Deploy") {
          if (userstate.issuedata.details[0]?.taskResolved > 0) {
            Modal.warning({
              title: 'มี Task งานที่ยังไม่เสร็จ',
              content: (
                <div>
                  <label style={{ color: "red", fontSize: 12 }}> *** กรุณา Resolved งานก่อน</label>
                </div>
              ),
              okText: "Close",
              onOk() {

              }
            });
          } else {
            setModalresolved_visible(true);
          }
        }
      }
    }
    //CR FLOW
    if (userstate.issuedata.details[0]?.IssueType === "ChangeRequest" || userstate.issuedata.details[0]?.IssueType === "Memo") {
      if (userstate?.mailbox[0]?.NodeName === "support") {
        if (item.data.value === "SendCR_Center") {
          setModalsendissue_visible(true)
        }
        if (item.data.value === "RequestInfo") {
          setModalsendissue_visible(true)
        }
        if (item.data.value === "Hold") {
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
        if (item.data.value === "Resolved") {
          setModalsendissue_visible(true)
        }
      }
      if (userstate?.mailbox[0]?.NodeName === "cr_center") {
        if (item.data.value === "RequestInfo") {
          setModalsendissue_visible(true)
        }
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
        if (item.data.value === "RejectToSupport") {
          setModalsendissue_visible(true)
        }
        if (item.data.value === "RequestDueDate") {
          setModalduedate_visible(true)
        }
        if (item.data.value === "SendDueDate") {
          setModalduedate_visible(true)
        }

      }
      if (userstate?.mailbox[0]?.NodeName === "sa") { return setModalsa_visible(true) }
    }
    // Use Flow
    if (userstate.issuedata.details[0]?.IssueType === "Use") {
      if (userstate?.mailbox[0]?.NodeName === "support") {
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

      if (userstate?.mailbox[0]?.NodeName === "sa") {
        if (item.data.value === "Assessment") {
          setModalsendissue_visible(true)
        }
      }
    }

    if (item.data.value === "Reject") { return setModalsendissue_visible(true) }

  }
  function onChange(value, item) {

    if (item.type !== "progress") {
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
          if (item.type === "issuetype") {
            SaveIssueType(value);
          }
          if (item.type === "priority") {
            UpdatePriority(value, item)
          }
        },
      });
    }
    if (item.type === "progress") {
      alert()
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
    if (userstate?.issuedata?.details[0] !== undefined) {
      getdetail();
      getMailBox();
    }
    if (userstate?.mailbox[0]?.NodeName === "support") {
      // setTabKey("1");
      if (userstate?.mailbox[0]?.NodeName !== "support" && userstate?.mailbox[0]?.NodeName !== undefined) {
        setTabKey("4")
      }

    }



  }, [])


  useEffect(() => {
    if (userstate?.mailbox[0]?.TransId !== undefined) {
      getflow_output(userstate?.mailbox[0]?.TransId);
    }
  }, [userstate?.mailbox[0]?.TransId])

  useEffect(() => {
    if (modalChangeduedate === false) {
      getdetail();
      getMailBox();
    }
  }, [modalChangeduedate])


  useEffect(() => {
    if (historyduedate_visible) {
      // GetDueDateHistory();
    }
  }, [historyduedate_visible])

  useEffect(() => {
    if (modalSaveDuedate === false) {
      // getdetail();
    }
  }, [modalSaveDuedate])


  const tabDocDetail = useMemo(() => {
    return {
      refId: userstate?.issuedata?.details[0]?.Id
    }
  }, [userstate?.issuedata?.details[0]?.Id])

  const ticketTaskId = useMemo(() => {
    return {
      refId: userstate?.issuedata?.details[0]?.Id
    }
  }, [userstate?.issuedata?.details[0]?.Id])


  return (
    <MasterPage>
      <Spin spinning={loadingPage} tip="Loading..." style={{ height: "100%" }}>
        <div style={{ height: "100%", overflowY: 'hidden' }} ref={setContainer} >
          {/* <Row style={{ padding: "0px 0px 0px 24px" }}>
            <Col span={16}>
              <Button
                type="link"
                icon={<LeftCircleOutlined />}
                style={{ fontSize: 18, padding: 0 }}
                onClick={() => history.goBack()}
              >
                Back
                </Button>
            </Col >
            <Col span={8} style={{ textAlign: "right" }}>
              <Dropdown

                placement="bottomCenter"
                overlayStyle={{ width: 200, boxShadow: "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.31) 0px 0px 1px" }}
                overlay={(
                  <Menu mode="inline" theme="light" onMouseOver="">
                    <Button type="link" onClick={() => history.push("/Login")}>Log Out</Button> <br />
                  </Menu>
                )} trigger="click">

                <Button type="text" icon={<SmallDashOutlined style={{fontSize: 24}} />} />

              </Dropdown>
            </Col>
          </Row> */}
          {/* </Affix> */}

          <Row style={{ height: 'calc(100% - 0px)' }}>
            {/* Content */}

            <Col span={16} style={{ padding: "0px 24px 24px 24px", height: "100%", overflowY: "scroll" }}>
              <Row style={{textAlign:"left"}}>
                <Col span={24} style={{textAlign:"left"}}>
                  <div offsetTop={10} style={{zIndex:100,overflow: "hidden",position: "fixed",width:"400px"}}>
                    <Button
                      type="link"
                      icon={<LeftCircleOutlined />}
                      // style={{zIndex:99}}
                      style={{ fontSize: 18, padding: 0, backgroundColor: "white",width:"100%",textAlign:"left" }}
                      onClick={() => history.goBack()}
                    >
                      Back
                        </Button>
                  </div>
                </Col>
              </Row>

              {/* Issue Description */}
              <Row style={{ marginRight: 24, overflow: "hidden" }}>
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
                        <Button title="file attach" type="link"
                          style={{ display: userstate?.issuedata?.details[0]?.cntFile === 0 ? "none" : "inline-block" }}
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
                          dangerouslySetInnerHTML={{ __html: userstate?.issuedata?.details[0]?.Description }}
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
                    details={tabDocDetail}
                  />
                </Col>
              </Row>

              {/* SubTask */}
              <Row style={{ marginTop: 26, marginRight: 24, textAlign: "right" }}>

                {/* ปุ่ม Create CR */}
                <Col span={24}
                  style={{
                    display: (userstate.issuedata.details[0]?.IssueType === "ChangeRequest" || userstate.issuedata.details[0]?.IssueType === "Memo") &&
                      userstate?.mailbox[0]?.NodeName === "cr_center" &&
                      userstate.issuedata.details[0]?.Manday === null ? "block" : "none"
                  }} >

                  <Button icon={<FileAddOutlined />}
                    disabled={userstate.issuedata.details[0]?.FlowStatus === "Waiting SA" ? true : false}
                    shape="round"
                    onClick={() => setModaladdtask(true)} >
                    CreateTask
                        </Button>
                </Col>

                {/* ปุ่ม Create Bug, Use */}
                <Col span={24}
                  style={{
                    display: (userstate?.issuedata?.details[0]?.IssueType === "Bug" || userstate?.issuedata?.details[0]?.IssueType === "Use") &&
                      userstate?.mailbox[0]?.NodeName === "support" ? "block" : "none"
                  }}>
                  <Button icon={<FileAddOutlined />}
                    shape="round"
                    onClick={() => userstate.issuedata.details[0]?.InternalPriority === null ?
                      Modal.info({
                        title: 'กรุณา ระบุ Priority',
                        okText: "Close"
                      })
                      : setModaladdtask(true)}
                  >
                    CreateTask
                        </Button>
                </Col>
              </Row>
              <Row style={{ marginRight: 24 }}>
                <Col span={24}>
                  <ListSubTask
                    ticketId={match.params.id} ref={subTaskRef}
                    //  ticketId={userstate?.issuedata?.details[0]?.Id}
                    // ticketId={ticketTaskId}
                    ref={subTaskRef}
                  // mailtype={userstate?.mailbox[0]?.MailType}
                  />
                </Col>
              </Row>

              {/* TAB Activity */}
              <Row style={{ marginTop: 36, marginRight: 24 }}>
                <Col span={24}>
                  <label className="header-text">Activity</label>
                  <span
                    style={{ marginTop: 10, marginLeft: 12, marginRight: 12, cursor: "pointer" }}
                    onClick={
                      () => {
                        return (
                          setActivityCollapse(activityCollapse === 'block' ? 'none' : 'block'),
                          setActivityIcon(activityCollapse === 'block' ? <UpCircleOutlined style={{ fontSize: 20, color: "#1890ff" }} /> : <DownCircleOutlined style={{ fontSize: 20, color: "#1890ff" }} />)
                        )
                      }
                    }
                  >
                    {activityIcon}
                  </span>

                  <div style={{ display: activityCollapse }}>
                    {
                      userstate?.mailbox[0]?.NodeName === "support"
                        ?

                        <Tabs defaultActiveKey={"1"} onChange={(key) => { setTabKey(key) }}>
                          <TabPane tab="Comment" key="1">
                            <CommentBox />
                          </TabPane>
                          <TabPane tab="Internal Note" key="2">
                            {
                              tabKey === "2" ? <InternalCommentBox /> : ""
                            }

                          </TabPane>
                          <TabPane tab="History Log" key="3">
                            <InternalHistorylog loading={history_loading} />
                          </TabPane>
                        </Tabs>
                        :
                        <Tabs defaultActiveKey={"1"} onChange={(key) => setTabKey(key)}>
                          <TabPane tab="Issue Note" key="1" >
                            {
                              tabKey === "1" ? <InternalCommentBox /> : ""
                            }
                          </TabPane>
                          <TabPane tab="History Log" key="2">
                            <InternalHistorylog loading={history_loading} />
                          </TabPane>
                        </Tabs>
                    }
                  </div>
                </Col>
              </Row>
              {/* </div> */}
            </Col>

            {/* Content */}

            {/* SideBar */}
            <Col span={8} style={{ padding: "0px 0px 0px 20px", height: "100%", overflowY: "auto" }}>
              <Row style={{ marginBottom: 20, marginTop:24 }}>
                <Col span={18}>
                  <label className="header-text">Progress Status</label>
                </Col>
                <Col span={18} style={{ marginTop: 10 }}>

                  {
                    // userstate?.mailbox[0]?.MailType === "in"
                    //   && (userstate?.mailbox[0]?.NodeName === "support" || userstate?.mailbox[0]?.NodeName === "sa" || userstate?.mailbox[0]?.NodeName === "cr_center")
                    userstate?.mailbox[0]?.MailType === "in" && userstate?.actionflow?.length !== 0

                      ? <Select ref={selectRef}
                        value={userstate?.mailbox[0]?.FlowStatus}
                        style={{ width: '100%' }} placeholder="None"
                        //onClick={() => getflow_output(userstate?.mailbox[0]?.TransId)}
                        onClick={() => userstate.issuedata.details[0]?.InternalPriority === null ?
                          Modal.info({
                            title: 'กรุณา ระบุ Priority',
                            okText: "Close"
                          })
                          : getflow_output(userstate?.mailbox[0]?.TransId)}
                        onChange={(value, item) => HandleChange(value, item)}
                        options={userstate.actionflow && userstate.actionflow.map((x) => ({ value: x.FlowOutputId, label: x.TextEng, data: x }))}
                      />

                      : <label className="value-text">{userstate?.mailbox[0]?.FlowStatus}</label>
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
                    (userstate?.mailbox[0]?.MailType === "in" && userstate?.mailbox[0]?.NodeName === "support" && userstate?.mailbox[0]?.NodeActionText === "CheckIssue")
                      ? <Select
                        style={{ width: '100%' }}
                        allowClear
                        showSearch

                        filterOption={(input, option) =>
                          option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onClick={() => GetPriority()}

                        options={userstate.masterdata.priorityState && userstate.masterdata.priorityState.map((x) => ({ value: x.Id, label: x.Name, type: "priority" }))}
                        onChange={(value, item) => onChange(value, item)}
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
                display: (userstate.issuedata.details[0]?.IssueType === "Bug" || userstate.issuedata.details[0]?.IssueType === "Use") &&
                  (userstate.issuedata.details[0]?.SLA_DueDate !== undefined &&
                    userstate.issuedata.details[0]?.SLA_DueDate !== null) ? "block" : "none"
              }}
              >

                <Col span={24} style={{ marginTop: "10px" }}>
                  <label className="header-text">SLA</label>
                  {
                    userstate.issuedata.details[0] &&
                    // <Clock
                    //   ref={clockRef}
                    //   showseconds={false}
                    //   deadline={userstate.issuedata.details[0] && userstate.issuedata.details[0].SLA_DueDate}
                    //   createdate={userstate.issuedata.details[0].AssignIconDate === null ? undefined : userstate.issuedata.details[0].AssignIconDate}
                    //   resolvedDate={userstate.issuedata.details[0].ResolvedDate === null ? undefined : userstate.issuedata.details[0].ResolvedDate}
                    // // onClick={() => { setModaltimetracking_visible(true) }}
                    // />
                    <ClockSLA
                      start={moment(userstate?.issuedata?.details[0]?.AssignIconDate)}
                      due={moment(userstate?.issuedata?.details[0]?.SLA_DueDate)}
                      end={userstate?.issuedata?.details[0]?.ResolvedDate === null ? moment() : moment(userstate?.issuedata?.details[0]?.ResolvedDate)}

                    />
                  }
                  <label className="header-text">DueDate</label>
                  <label className="value-text" style={{ marginLeft: 10 }}>
                    {(userstate?.issuedata?.details[0]?.SLA_DueDate === null ? "None" : moment(userstate?.issuedata?.details[0]?.SLA_DueDate).format("DD/MM/YYYY HH:mm"))}
                  </label>

                </Col>
              </Row>

              {/*  DueDate (Internal) เคส CR , Memo*/}
              <Row style={{
                marginBottom: 20,
                display: userstate.issuedata.details[0]?.IssueType === "ChangeRequest" || userstate.issuedata.details[0]?.IssueType === "Memo" ? "block" : "none"
              }}>
                <Col span={18}>
                  <label className="header-text">DueDate (ICON)</label>

                  <Button type="link" icon={<ClockCircleOutlined
                    style={{ fontSize: 18, marginLeft: 12 }} />}
                  />

                  <br />
                  {
                    userstate?.mailbox[0]?.NodeName === "cr_center"
                      ? <label className="text-link value-text"
                        onClick={() => (setModalSaveDuedate(true), setDuedateType("internal"))}
                      >
                        {userstate.issuedata.details[0] &&
                          (userstate.issuedata.details[0].SLA_DueDate === null ? "None" : moment(userstate.issuedata.details[0].SLA_DueDate).format("DD/MM/YYYY HH:mm"))}
                      </label>
                      : <label className="value-text">
                        &nbsp;&nbsp;
                        {(userstate?.issuedata.details[0]?.SLA_DueDate === null ? "None" : moment(userstate?.issuedata?.details[0]?.SLA_DueDate).format("DD/MM/YYYY HH:mm"))}
                      </label>
                  }
                  {/* {history_duedate_data.length >= 1 ?
                    <Tag color="warning">
                      DueDate ถูกเลื่อน
                   </Tag> : ""
                  } */}
                </Col>
              </Row>

              {/*  DueDate (Customer) เคส CR , Memo*/}
              <Row style={{
                marginBottom: 20,
                display: (userstate.issuedata.details[0]?.IssueType === "ChangeRequest" || userstate.issuedata.details[0]?.IssueType === "Memo")
                  && userstate?.issuedata?.details[0]?.SLA_DueDate !== null
                  && userstate?.issuedata?.details[0]?.DueDate === null ? "block" : "none"
              }}>
                <Col span={18}>
                  <label className="header-text">DueDate (Customer)</label>

                  <Button type="link"
                    icon={<ClockCircleOutlined style={{ fontSize: 18, marginLeft: 12 }} />}
                    onClick={() => setHistoryduedate_visible(true)}
                  />
                  {/* <ClockCircleOutlined style={{ fontSize: 18, marginLeft: 12 }} onClick={() => setHistoryduedate_visible(true)} /> */}
                  <br />
                  {
                    userstate?.mailbox[0]?.NodeName === "support"
                      ? <label className="text-link value-text"
                        onClick={() => (setModalSaveDuedate(true), setDuedateType("customer"))}
                      >
                        {userstate.issuedata.details[0] &&
                          (userstate.issuedata.details[0].DueDate === null ? "None" : moment(userstate.issuedata.details[0].DueDate).format("DD/MM/YYYY HH:mm"))}
                      </label>
                      : <label className="value-text">
                        &nbsp;&nbsp;
                        {(userstate?.issuedata.details[0]?.DueDate === null ? "None" : moment(userstate?.issuedata?.details[0]?.DueDate).format("DD/MM/YYYY HH:mm"))}
                      </label>
                  }

                </Col>
              </Row>

              {/* Change DueDate (Customer) */}
              <Row style={{ marginBottom: 20, display: userstate.issuedata.details[0]?.DueDate === null ? "none" : "block" }}>
                <Col span={18}>
                  <label className="header-text">DueDate (Customer)</label>

                  <Button type="link"
                    icon={<ClockCircleOutlined style={{ fontSize: 18, marginLeft: 12 }} />}
                    onClick={() => setHistoryduedate_visible(true)}
                  />

                  <br />
                  {/* คลิกเปลี่ยน DueDate ได้เฉพาะ support */}
                  {
                    userstate?.mailbox[0]?.NodeName === "support" || userstate?.mailbox[0]?.NodeName === "cr_center"
                      ? <label className="text-link value-text"
                        onClick={() => setModalChangeduedate(true)}
                      >
                        {userstate.issuedata.details[0] &&
                          (userstate.issuedata.details[0].DueDate === null ? "None" : moment(userstate.issuedata.details[0].DueDate).format("DD/MM/YYYY HH:mm"))}
                      </label>
                      : <label className="value-text">&nbsp;&nbsp;{userstate.issuedata.details[0] && moment(userstate.issuedata.details[0].DueDate).format("DD/MM/YYYY HH:mm")}</label>
                  }
                  &nbsp; &nbsp;
                  {userstate?.issuedata.details[0]?.cntDueDate >= 1 ?
                    <Tag color="warning" onClick={() => setHistoryduedate_visible(true)}>
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
                    (userstate?.mailbox[0]?.MailType === "in" && userstate?.mailbox[0]?.NodeName === "support" && userstate?.mailbox[0]?.NodeActionText === "CheckIssue")
                      ? <Select
                        style={{ width: '100%' }}
                        allowClear
                        showSearch

                        filterOption={(input, option) =>
                          option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onClick={() => getIssueType()}
                        options={userstate.masterdata.issueTypeState && userstate.masterdata.issueTypeState.map((x) => ({ value: x.Id, label: x.Name, type: "issuetype" }))}
                        onChange={(value, item) => onChange(value, item)}
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
              {/* <Row style={{ marginBottom: 20 }}>
                  <Col span={18}>
                    <label className="header-text">Module</label>
                    <br />
                    <label className="value-text">{userstate.issuedata.details[0] && userstate.issuedata.details[0].ModuleName}</label>
                  </Col>
                </Row> */}
              <Row style={{ marginBottom: 20 }}>
                <Col span={18}>
                  <label className="header-text">Scene</label>
                  <br />
                  <label className="value-text">{userstate?.issuedata?.details[0]?.Scene}</label>
                </Col>
              </Row>

              <Row style={{
                marginBottom: 20,
                display: (userstate.issuedata.details[0]?.IssueType === "ChangeRequest" || userstate.issuedata.details[0]?.IssueType === "Memo") &&
                  userstate.issuedata.details[0]?.IsAssessment === 1 ? "block" : "none"
              }}>
                <Col span={18}>
                  <label className="header-text">ผลประเมินผลของ SA</label>
                  <Button icon={<InfoCircleOutlined />} type="link" onClick={() => setModalAssessment_visible(true)} />
                </Col>
              </Row>

              <Row style={{
                marginBottom: 20,
                display: (userstate.issuedata.details[0]?.IssueType === "ChangeRequest" || userstate.issuedata.details[0]?.IssueType === "Memo") &&
                  userstate.issuedata.details[0]?.Manday ? "block" : "none"
              }}>
                <Col span={18}>
                  <label className="header-text">Total Manday</label>
                  <Button type="link" onClick={() => setModalmandaylog_visible(true)} >{userstate.issuedata.details[0]?.Manday}</Button>

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
          okButtonProps={{ hidden: true }}
          cancelText="Close"
          onCancel={() => setModalpreview(false)}
        >
          <Row>
            <Col span={16} style={{ display: "inline" }}>
              <Typography.Title level={4}>
                <Avatar size={32} icon={<UserOutlined />} />&nbsp;&nbsp;  {userstate.issuedata.details[0] && userstate.issuedata.details[0].Title}
              </Typography.Title>
            </Col>
          </Row>

          <div className="issue-description"
            dangerouslySetInnerHTML={{ __html: userstate?.issuedata?.details[0]?.Description }} >

          </div>
          {/* <img 
            src="https://space-api.iconrem.com/files/16"
            /> */}
        </Modal>

        <DuedateLog
          title="ประวัติ DueDate"
          visible={historyduedate_visible}
          onCancel={() => setHistoryduedate_visible(false)}
          details={{
            ticketId: userstate?.issuedata.details[0]?.Id
          }}
        />

        <ModalCreateTask
          title={ProgressStatus}
          visible={modaladdtask}
          width={800}
          onCancel={() => { return (setModaladdtask(false)) }}
          onOk={() => {
            setModaladdtask(false);
            subTaskRef.current.GetTask()
          }}
          details={{
            ticketid: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
            mailboxid: userstate?.mailbox[0]?.MailBoxId,
            title: userstate?.issuedata?.details[0]?.Title,
            productid: userstate?.issuedata?.details[0]?.ProductId

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
            mailboxid: userstate?.mailbox[0]?.MailBoxId,
            flowoutput: userstate.node.output_data,
            duedate: userstate.issuedata.details[0]?.DueDate === null ? null : moment(userstate.issuedata.details[0]?.DueDate).format("DD/MM/YYYY")
          }}
        />

        <ModalSaveDueDate
          title="กำหนด Due Date"
          visible={modalSaveDuedate}
          width={800}
          onCancel={() => setModalSaveDuedate(false)}
          onOk={() => {
            setModalSaveDuedate(false);
          }}
          details={{
            ticketid: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
            type: duedateType
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
            duedate: userstate?.issuedata?.details[0]?.DueDate
          }}
        />

        <ModalTimetracking
          title="Time Tracking"
          width={600}
          visible={modaltimetracking_visible}
          onCancel={() => { return (setModaltimetracking_visible(false)) }}
          details={{
            transgroupId: userstate?.mailbox[0]?.TransGroupId,

          }}
        />

        <ModalSendIssue
          title={ProgressStatus}
          visible={modalsendissue_visible}
          width={800}
          onCancel={() => { return (setModalsendissue_visible(false)) }}
          onOk={() => {
            setModalsendissue_visible(false);
          }}
          details={{
            ticketid: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
            mailboxid: userstate?.mailbox[0]?.MailBoxId,
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
            mailboxid: userstate?.mailbox[0]?.MailBoxId,
            flowoutput: userstate.node.output_data,
            product_code: userstate?.issuedata?.details[0]?.ProductName
          }}
        />

        <ModalResolved
          title="Resolved"
          visible={modalresolved_visible}
          width={800}
          onCancel={() => { return (setModalresolved_visible(false)) }}
          onOk={() => {
            setModalresolved_visible(false);
          }}
          details={{
            ticketid: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
            mailboxid: userstate?.mailbox[0]?.MailBoxId,
            flowoutput: userstate.node.output_data,
            iscloudsite: userstate?.issuedata?.details[0]?.IsCloudSite

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
            mailboxid: userstate?.mailbox[0]?.MailBoxId,
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
            mailtype: userstate?.mailbox[0]?.MailType,
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
          onCancel={() => { return (setModalQuotation_visible(false)) }}
          onOk={() => {
            setModalQuotation_visible(false);
          }}
          details={{
            ticketid: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
            mailboxid: userstate?.mailbox[0]?.MailBoxId,
            flowoutput: userstate.node.output_data
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

        <ModalFileDownload
          title="File Download"
          visible={modalfiledownload_visible}
          onCancel={() => { return (setModalfiledownload_visible(false)) }}
          width={600}
          onOk={() => {
            setModalfiledownload_visible(false);

          }}
          details={{
            refId: userstate?.issuedata?.details[0]?.Id,
            reftype: "Master_Ticket",
            grouptype: "attachment"
          }}
        />

      </Spin>
    </MasterPage >
  );
}
