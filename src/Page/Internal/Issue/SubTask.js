import { Col, Row, Select, Typography, Button, Avatar, Tabs, Modal, Timeline, Skeleton, Checkbox, message, Spin, Divider, Tooltip } from "antd";
import React, { useState, useEffect, useContext, useRef } from "react";
import "../../../styles/index.scss";
import { useHistory, useRouteMatch } from "react-router-dom";
import _ from 'lodash'
import TaskComment from "../../../Component/Comment/Internal/TaskComment";
import ModalSupport from "../../../Component/Dialog/Internal/modalSupport";
import InternalHistorylog from "../../../Component/History/Internal/Historylog";
import MasterPage from "../MasterPage";
import { InfoCircleOutlined, ClockCircleOutlined, UserOutlined, LeftCircleOutlined } from "@ant-design/icons";
import Axios from "axios";
import AuthenContext from "../../../utility/authenContext";
import IssueContext, { userReducer, userState } from "../../../utility/issueContext";
import ModalDueDate from "../../../Component/Dialog/Internal/modalDueDate";
import ModalDeveloper from "../../../Component/Dialog/Internal/modalDeveloper";
// import ModalDocument from "../../../Component/Dialog/Internal/modalDocument";
import ModalQA from "../../../Component/Dialog/Internal/modalQA";
import ModalLeaderQC from "../../../Component/Dialog/Internal/modalLeaderQC";
import ModalLeaderAssign from "../../../Component/Dialog/Internal/modalLeaderAssign";
// import ClockSLA from "../../../utility/SLATime";
import { Icon } from '@iconify/react';
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
import ModalRequestInfoQA from "../../../Component/Dialog/Internal/Issue/modalRequestInfoQA";
import TrackingTimeDevelop from "../../../Component/Dialog/Internal/Issue/modalTimeDevelop";
import { CalculateTime } from "../../../utility/calculateTime";
import ModalChangeDueDateDev from "../../../Component/Dialog/Internal/Issue/modalChangeDueDateDev";
import DuedateLog from "../../../Component/Dialog/Internal/Issue/modalTaskDueDateLog";
import ModalSA from "../../../Component/Dialog/Internal/modalSA";
import ModalSA_Assessment from "../../../Component/Dialog/Internal/modalSA_Assessment";
import ModalChangeAssign from "../../../Component/Dialog/Internal/Issue/modalChangeAssign";

const { Option } = Select;
const { TabPane } = Tabs;
const calculateTime = new CalculateTime()

export default function SubTask() {
  const match = useRouteMatch();
  const history = useHistory();
  const selectRef = useRef(null);
  const trackingRef = useRef(null);
  // const { state, dispatch } = useContext(AuthenContext);
  const { state: userstate, dispatch: userdispatch } = useContext(IssueContext);

  // const [defaultFlow, setDefaultFlow] = useState(undefined)
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
  const [modalRequestInfoQA, setModalRequestInfoQA] = useState(false);
  const [modalPreview, setModalPreview] = useState(false);
  const [modalDevSendVersion, setModalDevSendVersion] = useState(false);
  const [modalfiledownload_visible, setModalfiledownload_visible] = useState(false);
  const [modalTimeDevelop, setModalTimeDevelop] = useState(false);
  const [modalChangeDueDateDev, setModalChangeDueDateDev] = useState(false);
  const [modalTaskDueDate, setModalTaskDueDate] = useState(false);
  const [modalSA, setModalSA] = useState(false);
  const [modalAssessment, setModalAssessment] = useState(false);
  const [modalChangeAssign, setModalChangeAssign] = useState(false);

  //div
  const [container, setContainer] = useState(null);
  const [divcollapse, setDivcollapse] = useState("block")
  const [collapsetext, setCollapsetext] = useState("Hide details")
  const [divProgress, setDivProgress] = useState("hide")
  const [imgUrl, setImgUrl] = useState(null);

  // data
  const [ProgressStatus, setProgressStatus] = useState("");
  const [history_duedate_data, setHistory_duedate_data] = useState([]);
  const [selected, setSelected] = useState();
  const [createddate, setCreateddate] = useState(null);
  const [resolveddate, setResolveddate] = useState(null);
  const [duration, setDuration] = useState(null);
  const [selectModule, setSelectModule] = useState(null);

  const [btnBackTop, setBtnBackTop] = useState(false);
  const scrollRef = useRef(null);

  //////////////////////////////////////////////// call Api ////////////////////////////////////////////////////////////////////////
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
        userdispatch({ type: "LOAD_MAILBOX", payload: mailbox.data });
        GetTaskDetail(mailbox.data[0]);
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


        // เงื่อนไข flow ของ อื่นๆ ของทีมอื่น ที่ไม่ใช่ QA
        if (userstate?.mailbox[0]?.NodeName !== "qa" || userstate?.mailbox[0]?.NodeName !== "qa_leader") {
          userdispatch({ type: "LOAD_ACTION_FLOW", payload: flow_output.data.filter((x) => x.Type === "Task") })
        }

        // เงื่อนไข flow ของ QA
        if (userstate?.mailbox[0]?.NodeName === "qa" && userstate?.mailbox[0]?.NodeName !== "qa_leader") {
          if (userstate?.taskdata?.data[0]?.IssueType === "Use") {
            userdispatch({
              type: "LOAD_ACTION_FLOW",
              payload: flow_output.data.filter((x) => x.value === "SendInfoToSupport")
            })

          } else {
            if (userstate?.mailbox[0]?.NodeName === "qa" && userstate?.taskdata?.data[0]?.QA_Recheck === true) {
              userdispatch({
                type: "LOAD_ACTION_FLOW",
                payload: flow_output.data.filter((x) => x.value === "SendQALeader" || x.value === "QAReject" || x.value === "QARejectDev")
              });
            }

            if (userstate?.mailbox[0]?.NodeName === "qa" && userstate?.taskdata?.data[0]?.QA_Recheck === false) {
              userdispatch({
                type: "LOAD_ACTION_FLOW",
                payload: flow_output.data.filter((x) => x.value === "QApass" || x.value === "RequestVersion" || x.value === "QAReject" || x.value === "QARejectDev")
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
          }

        }

        // เงื่อนไข flow ของ CR CENTER
        if (userstate?.mailbox[0]?.NodeName === "cr_center") {
          if (userstate?.mailbox[0]?.NodeName === "cr_center" && userstate?.taskdata?.data[0]?.FlowStatus === "Waiting Progress") {
            userdispatch({
              type: "LOAD_ACTION_FLOW",
              payload: flow_output.data.filter((x) => x.Type === "Task")
            })
          }

          if (userstate?.mailbox[0]?.NodeName === "cr_center" && userstate?.taskdata?.data[0]?.FlowStatus === "Manday Estimated") {
            userdispatch({
              type: "LOAD_ACTION_FLOW",
              payload: flow_output.data.filter((x) => x.Type === "Task" && (x.value === "RejectManday" || x.value === "RejectMandaySA"))
            })
          }
        }

        if (userstate?.mailbox[0]?.NodeName === "support") {

          /// Flow Bug
          if (userstate?.taskdata?.data[0]?.IssueType === "Bug") {
            if (userstate?.taskdata?.data[0]?.FlowStatus === "Waiting Progress") {
              userdispatch({
                type: "LOAD_ACTION_FLOW",
                payload: flow_output.data.filter((x) => x.Type === "Task" && x.value === "SendToDev")
              })
            }
            if (userstate?.taskdata?.data[0]?.FlowStatus === "Return to Support") {
              userdispatch({
                type: "LOAD_ACTION_FLOW",
                payload: flow_output.data.filter((x) => x.Type === "Task" && (x.value === "SendToDev" || x.value === "ResolvedTask"))
              })
            }
            if (userstate?.taskdata?.data[0]?.Status === "Resolved" || userstate?.taskdata?.data[0]?.Status === "Done") {
              userdispatch({
                type: "LOAD_ACTION_FLOW",
                payload: flow_output.data.filter((x) => x.Type === "Task" && x.value !== "SendToDev")
              })
            }
          }

          /// Flow Use
          if (userstate?.taskdata?.data[0]?.IssueType === "Use") {
            if (userstate?.taskdata?.data[0]?.FlowStatus === "Waiting Progress" || userstate?.taskdata?.data[0]?.FlowStatus === "Return to Support") {
              userdispatch({
                type: "LOAD_ACTION_FLOW",
                payload: flow_output.data.filter((x) => x.Type === "Task" && (x.value === "RequestInfoDev" || x.value === "RequestInfoQA"))
              })
            }
            if (userstate?.taskdata?.data[0]?.FlowStatus !== "Waiting Progress") {
              userdispatch({
                type: "LOAD_ACTION_FLOW",
                payload: flow_output.data.filter((x) => x.Type === "Task" && x.value !== "SendToDev")
              })
            }
          }

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

  const GetTaskDetail = async (param) => {
    try {
      const task_detail = await Axios({
        url: process.env.REACT_APP_API_URL + "/tickets/load-taskdetail",
        method: "GET",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
        params: {
          taskId: match.params.task,
          node_name: param.NodeName
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
    await Axios({
      url: process.env.REACT_APP_API_URL + "/workflow/module",
      method: "PATCH",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
      },
      data: {
        task_id: match.params.task,
        module_id: param
      }
    }).then(() => {
      window.location.reload(true);
    }).catch(() => {

    });

  }

  const getDevelopDuration = async () => {
    await Axios.get(`${process.env.REACT_APP_API_URL}/tickets/time-develop`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
      },
      params: {
        ticket_id: userstate?.taskdata?.data[0]?.TicketId,
        task_id: userstate?.taskdata?.data[0]?.TaskId
      }
    }).then((res) => {
      setDuration(_.sum(res.data.map((n) => calculateTime.getMiniteDuration(n.start_date, n.end_date))))
    }).catch((error) => {

    })
  }

  //////////////////////////////////////////////// function ////////////////////////////////////////////////
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
        if (item.data.value === "SendUnitTest" || item.data.value === "SendToQA") {
          setModaldeveloper_visible(true)
        }
        if (item.data.value === "RejectToDevLeader") {
          setModalsendtask_visible(true)
        }
      }

      if (item.data.NodeName === "qa_leader") {
        if (item.data.value === "QAassign") { setModalQAassign_visible(true) }
        if (item.data.value === "QApass" || item.data.value === "RequestVersion") {
          setModalQA_visible(true)
        }
        if (item.data.value === "LeaderReject" || item.data.value === "RejectRecheck" || item.data.value === "QAReject" || item.data.value === "RecheckPass"
          || item.data.value === "QARejectDev") {
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
        if (item.data.value === "QAReject" || item.data.value === "QARejectDev") {
          setModalsendtask_visible(true)
        }
      }

    }
    // Flow CR
    if (userstate?.taskdata?.data[0]?.IssueType === "ChangeRequest" || userstate?.taskdata?.data[0]?.IssueType === "Memo") {
      if (item.data.NodeName === "support") {
        if (item.data.value === "ResolvedTask" || item.data.value === "RejectToCR" || item.data.value === "RequestDeploy") {
          setModalsendtask_visible(true)
        }
      }

      if (item.data.NodeName === "cr_center") {
        if (item.data.value === "RequestManday" || item.data.value === "RequestDueDate" || item.data.value === "SendToSA") {
          setModalsendtask_visible(true);
        }
        if (item.data.value === "RejectManday" || item.data.value === "RejectMandaySA") {
          setModalsendtask_visible(true)
        }
        if (item.data.value === "ResolvedTask") {
          setModalsendtask_visible(true)
        }
        if (item.data.value === "RejectTask") {
          setModalsendtask_visible(true)
        }
        if (item.data.value === "SendToDeploy" || item.data.value === "CheckDeploy") {
          setModalsendtask_visible(true)
        }
        if (item.data.value === "CancelTask") {
          setModalsendtask_visible(true)
        }
      }

      if (item.data.NodeName === "developer_2") {
        if (item.data.value === "SendManday") { setModalmanday_visible(true) }
        if (item.data.value === "SendDueDate") { setModalduedate_visible(true) }
        if (item.data.value === "LeaderAssign") { setModalleaderassign_visible(true) }
        if (item.data.value === "LeaderQC" || item.data.value === "RejectToCR" || item.data.value === "LeaderReject" ||
          item.data.value === "RequestInfo" || item.data.value === "SendInfoToSA") {
          setModalsendtask_visible(true)
        }
        if (item.data.value === "Deploy") {
          setModalcomplete_visible(true)
        }

      }

      if (item.data.NodeName === "developer_1") {
        if (item.data.value === "SendUnitTest" || item.data.value === "SendToQA") {
          setModaldeveloper_visible(true)
        }
        if (item.data.value === "RejectToDevLeader" || item.data.value === "SendInfoToSA") {
          setModalsendtask_visible(true);
        }
      }

      if (item.data.NodeName === "qa_leader") {
        if (item.data.value === "QAassign") {
          setModalQAassign_visible(true)
        }
        if (item.data.value === "QApass") {
          setModalQA_visible(true)
        }
        if (item.data.value === "RecheckPass") { setModalsendtask_visible(true) }
        if (item.data.value === "LeaderReject" || item.data.value === "RejectRecheck" || item.data.value === "QAReject"
          || item.data.value === "QARejectDev") {
          setModalsendtask_visible(true)
        }
      }

      if (item.data.NodeName === "qa") {
        if (item.data.value === "QApass") {
          setModalQA_visible(true)
        }
        if (item.data.value === "QAReject" || item.data.value === "QARejectDev") {
          setModalsendtask_visible(true)
        }

      }

      if (item.data.NodeName === "sa") {
        if (item.data.value === "SendManday") {
          setModalSA(true)
        }
        if (item.data.value === "RejectToCR") {
          setModalsendtask_visible(true)
        }
        if (item.data.value === "RequestInfoDev") {
          setModalRequestInfoDev(true)
        }
      }
    }

    // Flow Use
    if (userstate?.taskdata?.data[0]?.IssueType === "Use") {
      if (item.data.NodeName === "support") {
        if (item.data.value === "RequestInfoDev") { setModalRequestInfoDev(true) }
        if (item.data.value === "RequestInfoQA") { setModalRequestInfoQA(true) }
        if (item.data.value === "ResolvedTask") { setModalsendtask_visible(true) }
      }
      if (item.data.NodeName === "developer_1") {
        if (item.data.value === "SendInfoToSupport") { setModalsendtask_visible(true) }
      }
      if (item.data.NodeName === "qa") {
        if (item.data.value === "SendInfoToSupport") { setModalsendtask_visible(true) }
      }
    }
  }

  function onChange(value, item) {
    if (item.type === "module") {
      if (userstate?.mailbox[0]?.NodeName === "developer_2") {
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
            setSelectModule(item);
            setModalChangeAssign(true);
          },
        });
      } else {
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
    }
  }

  // This function will scroll the window to the top 
  const scrollToTop = () => {
    scrollRef.current.scrollTo({
      top: 0,
      behavior: 'smooth' // for smoothly scrolling
    });

  };

  const scrollBarPosition = () => {
    if (scrollRef?.current?.scrollTop > 100) {
      setBtnBackTop(true);
    } else {
      setBtnBackTop(false)
    }
  }

  useEffect(() => {
    getMailBox();
    GetTaskDetail();
  }, [])

  useEffect(() => {
    if (historyduedate_visible) {
      GetDueDateHistory();
    }
  }, [historyduedate_visible])

  useEffect(() => {
    if (userstate?.taskdata?.data[0] !== undefined) {
      getflow_output(userstate?.taskdata?.data[0]?.TransId)
      getDevelopDuration();
    }
  }, [userstate?.taskdata?.data[0]?.TransId])

  useEffect(() => {
    if (!modalTimeDevelop) {
      getDevelopDuration()
    }
  }, [modalTimeDevelop])




  return (
    <MasterPage>
      <Spin spinning={pageLoading} tip="Loading">
        <Skeleton loading={pageLoading}>
          <div style={{ height: "100%", overflowY: 'hidden' }} ref={setContainer} >
            <Row style={{ height: 'calc(100% - 0px)' }}>
              {/* Content */}
              <Col ref={scrollRef} span={16} style={{ padding: "0px 24px 24px 24px", height: "100%", overflowY: "scroll" }}
                onScroll={(e) => scrollBarPosition()}
              >
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
                        <Col span={2} style={{ display: "inline" }}>
                          <Avatar size={32} icon={<UserOutlined />} />
                        </Col>
                        <Col span={16} style={{ display: "inline" }}>
                          <Typography.Title level={4}>
                            {userstate?.taskdata?.data[0]?.Title}
                          </Typography.Title>
                        </Col>
                        <Col span={6} style={{ display: "inline", textAlign: "right" }}>
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
                      <br />
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
                      <Tabs defaultActiveKey="1" size="small" style={{ overflow: "visible" }}>
                        <TabPane tab="Task Note" key="1">
                          <TaskComment />
                        </TabPane>
                        <TabPane tab="History Log" key="2">
                          <InternalHistorylog subtype="task" />
                        </TabPane>
                      </Tabs>
                    }
                  </Col>
                </Row>

                <div style={{ textAlign: "right", position: "sticky", bottom: 150 }}>
                  {btnBackTop && (
                    <button onClick={() => scrollToTop()} className="back-to-top">
                      &#8679;
                    </button>
                  )}
                </div>
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
                      display: userstate?.mailbox[0]?.MailType === "in" && userstate?.actionflow?.length !== 0 ? "block" : "none"
                    }}
                  >
                    <Select ref={selectRef}
                      value={userstate.taskdata.data[0] && userstate.taskdata.data[0].FlowStatus}
                      style={{ width: '100%' }} placeholder="None"
                      onChange={(value, item) => HandleChange(value, item)}
                      options={userstate.actionflow && userstate.actionflow.map((x) => ({ value: x.FlowOutputId, label: x.TextEng, data: x }))}
                      disabled={userstate.taskdata.data[0]?.Status === "Cancel" ? true : false}
                    />
                  </Col>
                  <Col span={18}
                    style={{
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
                  display: userstate.taskdata.data[0]?.IssueType !== "ChangeRequest" ? "inline-block" : "none"
                }}
                >
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

                <Row style={{ marginBottom: 20 }}>
                  <Col span={24}>
                    <label className="header-text">DueDate</label>

                    &nbsp;   &nbsp;
                    {
                      userstate?.mailbox[0]?.NodeName === "developer_2" || userstate?.mailbox[0]?.NodeName === "developer_1" ?
                        <label className="value-text text-link" onClick={() => setModalChangeDueDateDev(true)}>

                          {
                            userstate.taskdata.data[0]?.DueDate === null ? "None" : userstate.taskdata.data[0] && moment(userstate.taskdata.data[0].DueDate).format("DD/MM/YYYY HH:mm")
                          }
                        </label>
                        :
                        <label className="value-text">

                          {
                            userstate.taskdata.data[0]?.DueDate === null ? "None" : userstate.taskdata.data[0] && moment(userstate.taskdata.data[0].DueDate).format("DD/MM/YYYY HH:mm")
                          }
                        </label>
                    }
                    <span hidden={userstate.taskdata.data[0]?.cntDueDate === 0 ? true : false}>
                      <Divider type="vertical" />
                      <Tooltip title="ประวัติการเลื่อน Due">
                        <ClockCircleOutlined className="icon-hover" style={{ fontSize: 18, color: "#1890ff" }}
                          onClick={() => setModalTaskDueDate(true)}
                        />
                      </Tooltip>
                    </span>
                  </Col>
                </Row>


                <Row style={{ marginBottom: 20 }}
                  hidden={userstate?.mailbox[0]?.NodeName !== "developer_1" && userstate?.mailbox[0]?.NodeName !== "developer_2" ? true : false}
                >
                  <Col span={24} >
                    <label className="header-text">Develop Time</label>
                    {
                      duration !== 0 ?
                        <label className="value-text" style={{
                          marginLeft: 12,
                          textAlign: "right", marginRight: 16, color: "orange", cursor: "pointer"
                        }}
                          onClick={() => setModalTimeDevelop(true)}>
                          {
                            moment.duration(duration, 'minute')._data.hours !== 0 ?
                              `${moment.duration(duration, 'minute')._data.hours} ชม ` : ""
                          }

                          {
                            moment.duration(duration, 'minute')._data.minutes !== 0 ?
                              `${moment.duration(duration, 'minute')._data.minutes} นาที ` : ""
                          }
                          <Icon icon="carbon:time" width="18" height="18" />
                        </label> : <label style={{ marginLeft: 12 }} className="text-link" onClick={() => setModalTimeDevelop(true)}>None</label>
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
                    {
                      (userstate?.mailbox[0]?.NodeName === "support" || userstate?.mailbox[0]?.NodeName === "cr_center" || userstate?.mailbox[0]?.NodeName === "developer_2") &&
                        userstate.taskdata.data[0]?.MailType === "in" &&
                        (userstate?.taskdata?.data[0]?.Status === "Waiting Progress" || userstate?.taskdata?.data[0]?.Status === "InProgress") &&
                        (userstate?.taskdata?.data[0]?.FlowStatus === "Return to Support" || userstate?.taskdata?.data[0]?.FlowStatus === "Return to CR Center" || userstate?.taskdata?.data[0]?.FlowStatus === "Waiting Progress" || userstate?.taskdata?.data[0]?.FlowStatus === "Wait H.Dev Assign")
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
                  display: (userstate.taskdata.data[0]?.IssueType === "ChangeRequest" || userstate.taskdata.data[0]?.IssueType === "Memo") &&
                    userstate.taskdata.data[0]?.Manday !== null ? "block" : "none"
                }}>
                  <Col span={18}>
                    <label className="header-text">Manday</label>
                    <label style={{ marginLeft: 10 }} className="value-text">{userstate.taskdata.data[0]?.Manday}</label>
                  </Col>
                </Row>

                <Row
                  hidden={userstate.taskdata.data[0]?.IsAssessment === 0 ? true : false}
                  style={{ marginBottom: 20 }}
                >
                  <Col span={18}>
                    <label className="header-text">ผลประเมินผลของ SA</label>
                    <Button icon={<InfoCircleOutlined />} type="link" onClick={() => setModalAssessment(true)} />
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

                {/* <Row
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
                </Row> */}

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
        </Skeleton>

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
            flowoutput: userstate.node.output_data,
            task_remain: userstate?.taskdata?.data[0]?.TaskRemain
          }}
        />

        <ModalSupport
          title={ProgressStatus}
          visible={visible}
          width={800}
          onCancel={() => { setVisible(false); setSelected(null) }}
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
          onCancel={() => setModalmanday_visible(false)}
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
          onCancel={() => { setModaldeveloper_visible(false); setSelected(null) }}
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
          onCancel={() => { setModalleaderqc_visible(false); setSelected(null) }}
          width={800}
          onOk={() => {
            setModalleaderqc_visible(false);
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
          onCancel={() => setModalreject_visible(false)}
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
          onCancel={() => setModalQAassign_visible(false)}
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
          onCancel={() => { setModalRequestInfoDev(false); setSelected(null) }}
          width={800}
          onOk={() => {
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

        <ModalRequestInfoQA
          title={ProgressStatus}
          visible={modalRequestInfoQA}
          onCancel={() => { setModalRequestInfoQA(false); setSelected(null) }}
          width={800}
          onOk={() => {
            setModalRequestInfoQA(false);
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
          onCancel={() => { setModalQA_visible(false); setSelected(null) }}
          width={900}
          onOk={() => {
            setModalQA_visible(false);
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
          onCancel={() => setModaltimetracking_visible(false)}
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
          width={1200}
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
          onCancel={() => setModalDevSendVersion(false)}
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
          onCancel={() => setModalfiledownload_visible(false)}
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

        <TrackingTimeDevelop
          title="Time Develop"
          ref={trackingRef}
          width={600}
          visible={modalTimeDevelop}
          onCancel={() => setModalTimeDevelop(false)}
          details={{
            ticketId: userstate?.taskdata?.data[0]?.TicketId,
            taskId: userstate.taskdata.data[0] && userstate.taskdata.data[0].TaskId,

          }}
        />

        <ModalChangeDueDateDev
          visible={modalChangeDueDateDev}
          onCancel={() => setModalChangeDueDateDev(false)}
          onOk={() => setModalChangeDueDateDev(false)}
          details={{
            task_id: userstate?.taskdata?.data[0]?.TaskId,
            duedate: userstate?.taskdata?.data[0]?.DueDate
          }}
        />

        <DuedateLog
          visible={modalTaskDueDate}
          onCancel={() => setModalTaskDueDate(false)}
          onOk={() => setModalTaskDueDate(false)}
          details={{
            ticketId: userstate?.taskdata?.data[0]?.TicketId,
            taskId: userstate?.taskdata?.data[0]?.TaskId,
          }}
        />

        <ModalSA
          title={ProgressStatus}
          visible={modalSA}
          width={800}
          onCancel={() => setModalSA(false)}
          onOk={() => {
            setModalSA(false);
          }}
          details={{
            ticketid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TicketId,
            taskid: userstate.taskdata.data[0] && userstate.taskdata.data[0].TaskId,
            mailboxid: userstate.taskdata.data[0] && userstate.taskdata.data[0].MailboxId,
            flowoutputid: userstate.node.output_data.FlowOutputId,
            flowoutput: userstate?.node.output_data,
            product_code: userstate?.taskdata?.data[0]?.ProductName
          }}
        />

        <ModalSA_Assessment
          title="ข้อมูลประเมิน ผลกระทบ"
          visible={modalAssessment}
          width={600}
          onCancel={() => setModalAssessment(false)}
          details={{
            ticketid: userstate?.taskdata?.data[0]?.TicketId,
            taskid: userstate?.taskdata?.data[0]?.TaskId,
          }}
        />

        <ModalChangeAssign
          //title="เปลี่ยน Module"
          visible={modalChangeAssign}
          width={600}
          onCancel={() => setModalChangeAssign(false)}
          onOk={() => window.location.reload(true)}
          details={{
            ticketId: userstate?.taskdata?.data[0]?.TicketId,
            taskId: userstate?.taskdata?.data[0]?.TaskId,
            mailboxId: userstate?.taskdata?.data[0]?.MailboxId,
            flowoutputId: userstate?.node.output_data?.FlowOutputId,
            productCode: userstate?.taskdata?.data[0]?.ProductName,
            oldModule: userstate?.taskdata?.data[0]?.ModuleName,
            newModule: selectModule
          }}
        />

      </Spin >
    </MasterPage >
  );
}
