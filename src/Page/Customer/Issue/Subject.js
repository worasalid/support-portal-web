import { Col, Row, Select, Typography, Spin, Button, Avatar, Tabs, Tag, Modal, Skeleton, Result } from "antd";
import React, { useContext, useState, useEffect, useMemo } from "react";
import "../../../styles/index.scss";
import { useHistory, useRouteMatch } from "react-router-dom";
import CommentBox from "../../../Component/Comment/Customer/Comment";
import ModalSendIssue from "../../../Component/Dialog/Customer/modalSendIssue";
import Historylog from "../../../Component/History/Customer/Historylog";
import IssueContext, { customerReducer, customerState } from "../../../utility/issueContext";
import AuthenContext from "../../../utility/authenContext";
import MasterPage from "../MasterPage";
import { ArrowDownOutlined, ArrowUpOutlined, LeftCircleOutlined, UserOutlined } from "@ant-design/icons";
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
import PreviewImg from "../../../Component/Dialog/Internal/modalPreviewImg";
import ModalFileDownload from "../../../Component/Dialog/Customer/modalFileDownload";

const { Option } = Select;
const { TabPane } = Tabs;


export default function Subject() {
  const match = useRouteMatch();
  const history = useHistory();
  const { state, dispatch } = useContext(AuthenContext);
  const { state: customerstate, dispatch: customerdispatch } = useContext(IssueContext);
  const [loadingPage, setLoadingPage] = useState(false);

  // div
  const [container, setContainer] = useState(null);
  const [divcollapse, setDivcollapse] = useState("block");
  const [collapsetext, setCollapsetext] = useState("Hide details");

  // modal
  //const [visible, setVisible] = useState(false);
  const [modalsendissue_visible, modalSendissue_visible] = useState(false);
  const [historyduedate_visible, setHistoryduedate_visible] = useState(false);
  const [modalcomplete_visible, setModalcomplete_visible] = useState(false);
  const [modalreopen_visible, setModalreopen_visible] = useState(false);
  const [modalcancel_visible, setModalcancel_visible] = useState(false);
  const [modalconfirmManday_visible, setModalconfirmManday_visible] = useState(false);
  const [modalPO_visible, setModalPO_visible] = useState(false);
  const [modalDueDate_visible, setModalDueDate_visible] = useState(false);
  const [modalPreview, setModalPreview] = useState(false);
  const [modalfiledownload, setModalfiledownload] = useState(false);

  // data
  const [history_duedate_data, setHistory_duedate_data] = useState([]);
  const [mailbox, setMailbox] = useState([]);
  //const [issueType, setIssueType] = useState([]);
  const [ProgressStatus, setProgressStatus] = useState("");
  const [imgUrl, setImgUrl] = useState(null);
  const [permission, setPermission] = useState({})

  const cusScene = [
    {
      name: "None",
      value: "None"
    },
    {
      name: "Application",
      value: "Application"
    },
    {
      name: "Report",
      value: "Report"
    },
    {
      name: "Printform",
      value: "Printform"
    },
    {
      name: "Data",
      value: "Data"
    },
    {
      name: "API",
      value: "API"
    }
  ]

  const getdetail = async () => {
    setLoadingPage(true);
    await Axios({
      url: process.env.REACT_APP_API_URL + "/tickets/loaddetail",
      method: "GET",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
      },
      params: {
        ticketId: match.params.id
      }
    }).then((result) => {
      setLoadingPage(false);
      customerdispatch({ type: "LOAD_ISSUEDETAIL", payload: result.data })
      if (result.data.length !== 0) {
        getMailbox(result.data[0]);
      }
    }).catch(() => {

    })
  }

  const getIssueType = async () => {
    await Axios({
      url: process.env.REACT_APP_API_URL + "/master/issue-types",
      method: "GET",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
      }
    }).then((result) => {
      customerdispatch({ type: "LOAD_TYPE", payload: result.data })
    }).catch(() => {

    })
  }

  const getproducts = async () => {
    await Axios({
      url: process.env.REACT_APP_API_URL + "/master/customer-products",
      method: "get",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
      },
      params: {
        company_id: state?.usersdata?.users?.company_id
      }
    }).then((result) => {
      customerdispatch({ type: "LOAD_PRODUCT", payload: result.data })
    }).catch(() => {

    })
  }

  const getMailbox = async (value) => {
    await Axios({
      url: process.env.REACT_APP_API_URL + "/workflow/mailbox-customer",
      method: "GET",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
      },
      params: {
        ticket_id: value.Id
      }
    }).then((result) => {
      setMailbox(result.data[0]);
      getflow_output(value, result.data[0].TransId);
    }).catch(() => {

    })

  }

  const getflow_output = async (value, trans_id) => {
    try {
      const flow_output = await Axios({
        url: process.env.REACT_APP_API_URL + "/workflow/action_flow",
        method: "GET",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
        params: {
          trans_id: trans_id
        }
      });

      if (flow_output.status === 200) {
        let result = flow_output.data.filter((x) => x.Type === null || x.Type === "Issue" || x.Type === (value.IsCloudSite === true ? "OnCloud" : "OnPremise"))

        if (value.ProgressStatus === "Automatic Update Patch") {
          customerdispatch({
            type: "LOAD_ACTION_FLOW",
            // payload: result.filter((x) => x.value !== "SendToDeploy")
            payload: result
          })
        } else {
          customerdispatch({
            type: "LOAD_ACTION_FLOW",
            payload: result
          })
        }
      }

    } catch (error) {

    }
  }

  const getDueDateHistory = async () => {
    await Axios({
      url: process.env.REACT_APP_API_URL + "/tickets/log_duedate",
      method: "GET",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
      },
      params: {
        ticketId: match.params.id
      }
    }).then((result) => {
      setHistory_duedate_data(result.data)
    }).catch(() => {

    })
  }

  const getPriority = async () => {
    await Axios({
      url: process.env.REACT_APP_API_URL + "/master/priority",
      method: "GET",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
      },
    }).then((res) => {
      customerdispatch({ type: "LOAD_PRIORITY", payload: res.data })

    }).catch((error) => {

    });
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

    // CR/Memo FLOW
    if (customerstate.issuedata.details[0].IssueType === "ChangeRequest" || customerstate.issuedata.details[0].IssueType === "Memo") {

      if (item.data.NodeName === "customer" && item.data.value === "AssignIcon" || item.data.value === "Pass" || item.data.value === "SendInfo" ||
        item.data.value === "Continue" || item.data.value === "SendToDeploy") {
        modalSendissue_visible(true)
      }
      if (item.data.NodeName === "customer" && item.data.value === "Hold") {
        modalSendissue_visible(true)
      }
      if (item.data.NodeName === "customer" && item.data.value === "ConfirmManday" || item.data.value === "RejectManday") {
        setModalconfirmManday_visible(true)
      }
      if (item.data.NodeName === "customer" && item.data.value === "Reject" || item.data.value === "RejectPO") {
        modalSendissue_visible(true)
      }
      if (item.data.NodeName === "customer" && item.data.value === "SendPO") {
        setModalPO_visible(true)
      }
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

    // Use Flow
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

  function onChange(value, item) {
    if (item.group === "product") {
      Modal.info({
        title: 'เปลียนข้อมูล Product',
        content: (
          <div>

          </div>
        ),
        okCancel() {

        },
        onOk() {
          updateProduct(item)
        },
      });
    }
    if (item.group === "issuetype") {
      Modal.info({
        title: 'เปลียนข้อมูล Issue Type',
        content: (
          <div>

          </div>
        ),
        okCancel() {

        },
        onOk() {
          updateIssueType(item)
        },
      });
    }
    if (item.group === "scene") {
      Modal.info({
        title: 'เปลียนข้อมูล Scene',
        content: (
          <div>

          </div>
        ),
        okCancel() {

        },
        onOk() {
          updateScene(item)
        },
      });
    }
    if (item.group === "priority") {
      Modal.info({
        title: 'เปลียนข้อมูล priority',
        content: (
          <div>

          </div>
        ),
        okCancel() {

        },
        onOk() {
          updatePriority(item)
        },
      });
    }
  }

  const updateProduct = async (params) => {
    try {
      const scene = await Axios({
        url: process.env.REACT_APP_API_URL + "/tickets/product",
        method: "PATCH",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
        data: {
          ticketid: match.params.id,
          product_id: params.value,
          history: {
            value: customerstate?.issuedata?.details[0]?.ProductName,
            value2: params.code
          }
        }
      });
      if (scene.status === 200) {
        Modal.success({
          title: 'บันทึกข้อมูลเรียบร้อย',
          content: (
            <div>
              <p></p>
            </div>
          ),
          okText: "Close",
          onOk() {

            window.location.reload(true)
          },
        });
      }

    } catch (error) {

    }
  }

  const updateScene = async (params) => {
    try {
      const scene = await Axios({
        url: process.env.REACT_APP_API_URL + "/tickets/scene",
        method: "PATCH",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
        data: {
          ticketid: match.params.id,
          scene: params.value,
          history: {
            value: customerstate?.issuedata?.details[0]?.Scene,
            value2: params.label
          }
        }
      });
      if (scene.status === 200) {
        Modal.success({
          title: 'บันทึกข้อมูลเรียบร้อย',
          content: (
            <div>
              <p></p>
            </div>
          ),
          okText: "Close",
          onOk() {

            window.location.reload(true)
          },
        });
      }

    } catch (error) {

    }
  }

  const updatePriority = async (params) => {
    try {
      const scene = await Axios({
        url: process.env.REACT_APP_API_URL + "/tickets/priority",
        method: "PATCH",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
        data: {
          ticketid: match.params.id,
          priority: params.value,
          history: {
            value: customerstate?.issuedata?.details[0]?.Priority,
            value2: params.label
          }
        }
      });
      if (scene.status === 200) {
        Modal.success({
          title: 'บันทึกข้อมูลเรียบร้อย',
          content: (
            <div>
              <p></p>
            </div>
          ),
          okText: "Close",
          onOk() {

            window.location.reload(true)
          },
        });
      }

    } catch (error) {

    }
  }

  const updateIssueType = async (params) => {
    try {
      const scene = await Axios({
        url: process.env.REACT_APP_API_URL + "/tickets/issuetype",
        method: "PATCH",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
        data: {
          ticketid: match.params.id,
          issue_type: params.value,
          history: {
            value: customerstate?.issuedata?.details[0]?.IssueType,
            value2: params.label
          }
        }
      });
      if (scene.status === 200) {
        Modal.success({
          title: 'บันทึกข้อมูลเรียบร้อย',
          content: (
            <div>
              <p></p>
            </div>
          ),
          okText: "Close",
          onOk() {

            window.location.reload(true)
          },
        });
      }

    } catch (error) {

    }
  }

  useEffect(() => {
    getdetail();

  }, [])

  useEffect(() => {
    if (state?.usersdata?.users?.company_id) {
      getIssueType();
      getproducts();
      getPriority();

      setPermission(state?.usersdata?.permission)
    }
  }, [state?.usersdata?.users?.company_id]);

  useEffect(() => {
    if (historyduedate_visible) {
      getDueDateHistory();
    }
  }, [historyduedate_visible])

  const tabDocDetail = useMemo(() => {
    return {
      refId: customerstate?.issuedata?.details[0]?.Id
    }
  }, [customerstate?.issuedata?.details[0]?.Id])


  return (
    <MasterPage>

      {
        customerstate?.issuedata?.details[0]?.Id !== undefined
          ?
          <Spin spinning={loadingPage} tip="Loading..." style={{ height: "100%" }}>
            <Skeleton loading={loadingPage}>
              <div style={{ height: "100%" }} >
                <div style={{ height: "100%", overflowY: 'hidden' }} ref={setContainer} >
                  <Row style={{ padding: "0px 0px 0px 24px" }}>
                    <Col>
                      <Button
                        type="link"
                        icon={<LeftCircleOutlined />}
                        style={{ fontSize: 18, padding: 0 }}
                        onClick={() => history.goBack()}
                      >
                        Back
                      </Button>
                    </Col>
                  </Row>

                  <Row style={{ height: 'calc(100% - 32px)' }}>
                    {/* Content */}
                    <Col span={16} style={{ padding: "24px 24px 24px 24px", height: "100%", overflowY: "scroll" }}>

                      {/* Issue Description */}
                      <Row style={{ marginRight: 24 }}>
                        <Col span={24}>
                          <label className="topic-text">{customerstate.issuedata.details[0] && customerstate.issuedata.details[0].Number}</label>
                          &nbsp; &nbsp;
                          <label style={{ fontSize: 30, color: "red" }}
                            hidden={customerstate?.issuedata?.details[0]?.GroupStatus === "Cancel" ? false : true}
                          >
                            ยกเลิก
                          </label>
                          <div className="issue-detail-box">
                            <Row>
                              <Col span={2} style={{ display: "inline" }}>
                                <Avatar size={32} icon={<UserOutlined />} />
                              </Col>
                              <Col span={16} style={{ display: "inline" }}>
                                <Typography.Title level={4}>
                                  {customerstate.issuedata.details[0]?.Title}
                                </Typography.Title>
                              </Col>
                              <Col span={6} style={{ display: "inline", textAlign: "right" }}>
                                <Button title="file attach" type="link"
                                  style={{ display: customerstate?.issuedata?.details[0]?.cntFile === 0 ? "none" : "inline-block" }}
                                  icon={<img
                                    style={{ height: "20px", width: "20px" }}
                                    src={`${process.env.PUBLIC_URL}/icons-attach.png`}
                                    alt=""
                                  />}
                                  onClick={() => setModalfiledownload(true)}
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
                            <Row>
                              <div style={{ display: divcollapse }}>
                                <div className="issue-description"
                                  dangerouslySetInnerHTML={{ __html: customerstate?.issuedata?.details[0]?.Description }}
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

                    </Col>
                    {/* Content */}

                    {/* SideBar */}
                    <Col
                      span={8}
                      style={{ backgroundColor: "#fafafa", padding: 24, border: "1px" }}
                    >
                      <Row style={{ marginBottom: 20 }}>
                        <Col span={18}>
                          <label className="header-text">Progress Status.</label>
                          <br />
                          <Select
                            style={{ width: "100%", marginTop: 8 }}

                            placeholder="None"
                            onChange={(value, item) => HandleChange(value, item)}
                            value={customerstate.issuedata.details[0] && customerstate.issuedata.details[0].ProgressStatus}
                            options={customerstate && customerstate.actionflow.map((x) => ({ value: x.FlowOutputId, label: x.TextEng, data: x }))}
                            disabled={
                              mailbox?.MailType === "in" && mailbox?.GroupStatus === "Open" && permission.send_flow_to_icon === false ? true : 
                              mailbox?.MailType === "in" && mailbox?.GroupStatus !== "Open" ? false : true
                            }
                          >
                          </Select>
                        </Col>

                      </Row>

                      <Row style={{ marginBottom: 20 }}
                        // hidden={customerstate?.issuedata?.details[0]?.AssignIconDate !== null ? true : false}
                        hidden={customerstate?.issuedata?.details[0]?.GroupStatus !== "Open" ? true : false}
                      >
                        <Col span={18}>
                          <label className="header-text">IssueType</label>
                          <br />
                          <Select
                            style={{ width: "100%", marginTop: 8 }}

                            placeholder="None"
                            onChange={onChange}
                            value={`${customerstate?.issuedata?.details[0]?.IssueType}`}
                            options={customerstate && customerstate.masterdata.issueTypeState.map((x) => ({ value: x.Id, label: x.Name, group: "issuetype" }))}
                            disabled={
                              mailbox?.MailType === "in" ? false : true
                            }
                          >
                          </Select>
                        </Col>
                      </Row>

                      <Row style={{ marginBottom: 20 }}
                        // hidden={customerstate?.issuedata?.details[0]?.AssignIconDate === null ? true : false}
                        hidden={customerstate?.issuedata?.details[0]?.GroupStatus === "Open" ? true : false}
                      >
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

                          {
                            // customerstate?.issuedata?.details[0]?.AssignIconDate !== null ?
                            customerstate?.issuedata?.details[0]?.GroupStatus !== "Open" ?
                              <label className="value-text">
                                {renderColorPriority(customerstate?.issuedata?.details[0]?.Priority)}&nbsp;&nbsp;
                                {customerstate?.issuedata?.details[0]?.Priority}
                              </label>
                              :
                              <Select
                                style={{ width: "100%", marginTop: 8 }}
                                placeholder="None"
                                onChange={onChange}
                                value={customerstate?.issuedata?.details[0]?.Priority}
                                options={customerstate?.masterdata?.priorityState.map((x) => ({ value: x.Id, label: x.Name, group: "priority" }))}
                              />
                          }
                        </Col>
                      </Row>

                      <Row style={{ marginBottom: 20 }}
                        // hidden={customerstate?.issuedata?.details[0]?.AssignIconDate !== null ? true : false}
                        hidden={customerstate?.issuedata?.details[0]?.GroupStatus !== "Open" ? true : false}
                      >
                        <Col span={18}>
                          <label className="header-text">Product</label>
                          <br />
                          <Select
                            style={{ width: "100%", marginTop: 8 }}
                            onChange={onChange}
                            value={`${customerstate?.issuedata?.details[0]?.ProductName} (${customerstate?.issuedata?.details[0]?.ProductFullName})`}
                            options={customerstate && customerstate.masterdata.productState.map((x) => ({ value: x.ProductId, label: `${x.Name} - (${x.FullName})`, code: x.Name, group: "product" }))}
                          >
                          </Select>
                        </Col>
                      </Row>

                      <Row style={{ marginBottom: 20 }}
                        // hidden={customerstate?.issuedata?.details[0]?.AssignIconDate === null ? true : false}
                        hidden={customerstate?.issuedata?.details[0]?.GroupStatus === "Open" ? true : false}
                      >
                        <Col span={18}>
                          <label className="header-text">Product</label>
                          <br />
                          <label className="value-text">{customerstate.issuedata.details[0] && `${customerstate.issuedata.details[0].ProductName} (${customerstate.issuedata.details[0].ProductFullName})`}</label>
                        </Col>
                      </Row>


                      <Row style={{ marginBottom: 20 }}
                        // hidden={customerstate?.issuedata?.details[0]?.AssignIconDate !== null ? true : false}
                        hidden={customerstate?.issuedata?.details[0]?.GroupStatus !== "Open" ? true : false}
                      >
                        <Col span={18}>
                          <label className="header-text">Scene</label>
                          <br />
                          <Select
                            style={{ width: "100%", marginTop: 8 }}

                            placeholder="None"
                            onChange={onChange}
                            value={customerstate?.issuedata?.details[0]?.Scene === null ? "None" : customerstate?.issuedata?.details[0]?.Scene}
                            options={cusScene.map((x) => ({ value: x.value, label: x.name, group: "scene" }))}
                            disabled={
                              // customerstate?.issuedata?.details[0]?.MailType === "out" ? true : false
                              mailbox?.MailType === "in" ? false : true
                            }
                          />
                        </Col>
                      </Row>

                      <Row style={{ marginBottom: 20 }}
                        // hidden={customerstate?.issuedata?.details[0]?.AssignIconDate === null ? true : false}
                        hidden={customerstate?.issuedata?.details[0]?.GroupStatus === "Open" ? true : false}
                      >
                        <Col span={18}>
                          <label className="header-text">Scene</label>
                          <br />
                          <label className="value-text">{customerstate?.issuedata.details[0]?.Scene}</label>
                        </Col>
                      </Row>

                      <Row style={{
                        marginBottom: 20,
                        display: customerstate.issuedata.details[0]?.IssueType === "ChangeRequest" &&
                          customerstate.issuedata.details[0]?.Manday !== null ? "block" : "none"
                      }}>
                        <Col span={18}>
                          <label className="header-text">Manday</label>
                          <label style={{ marginLeft: 10 }} className="value-text">{customerstate?.issuedata?.details[0]?.Manday}</label>
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
                        </Col>
                      </Row>

                      <Row style={{ marginBottom: 20 }} hidden={customerstate?.issuedata.details[0]?.Version !== null ? false : true}>
                        <Col span={18}>
                          <label className="header-text">Version</label>
                          <br />
                          <label className="value-text">{customerstate?.issuedata?.details[0]?.Version}</label>
                        </Col>
                      </Row>

                    </Col>
                  </Row>
                </div>
              </div>
            </Skeleton>

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
                mailboxid: mailbox?.MailBoxId,
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
                mailboxid: mailbox?.MailBoxId,
                flowoutputid: customerstate.node.output_data?.FlowOutputId,
                flowoutput: customerstate.node.output_data,
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
                mailboxid: mailbox?.MailBoxId,
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
                mailboxid: mailbox?.MailBoxId,
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
                mailboxid: mailbox?.MailBoxId,
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
                mailboxid: mailbox?.MailBoxId,
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
                mailboxid: mailbox?.MailBoxId,
                flowoutputid: customerstate.node.output_data && customerstate.node.output_data.FlowOutputId
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

            <ModalFileDownload
              title="File Download"
              visible={modalfiledownload}
              onCancel={() => setModalfiledownload(false)}
              width={600}
              onOk={() => {
                setModalfiledownload(false);

              }}
              details={{
                refId: customerstate?.issuedata?.details[0]?.Id,
                reftype: "Master_Ticket",
                grouptype: "attachment"
              }}
            />
          </Spin>
          :
          <Skeleton loading={loadingPage}>
            <Result
              status="404"
              title="404"
              subTitle="Sorry, the page you visited does not exist."
              extra={
                <Button type="primary" onClick={() => history.push({ pathname: "/customer/issue/mytask" })}>Back Home</Button>
              }
            />
          </Skeleton>
      }
    </MasterPage>
  );
}
