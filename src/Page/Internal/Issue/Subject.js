import { Col, Tag, Row, Select, Divider, Typography, Affix, Button, Avatar, Tabs, Modal, Timeline, Popconfirm } from "antd";
import React, { useState, useEffect, useContext, useRef } from "react";
import "../../../styles/index.scss";
import { useHistory, useRouteMatch } from "react-router-dom";
import CommentBox from "../../../Component/Comment/Internal/Comment";
import InternalComment from "../../../Component/Comment/Internal/Internal_comment";
import ModalSupport from "../../../Component/Dialog/Internal/modalSupport";
import Historylog from "../../../Component/History/Customer/Historylog";
import MasterPage from "../MasterPage";
import { ClockCircleOutlined, FileAddOutlined, UserOutlined } from "@ant-design/icons";
import Axios from "axios";
import IssueContext, { userReducer, userState } from "../../../utility/issueContext";
import ModalDueDate from "../../../Component/Dialog/Internal/modalDueDate";
import Issuesearch from "../../../Component/Search/Internal/IssueSearch";
import ModalDeveloper from "../../../Component/Dialog/Internal/modalDeveloper";
import ModalDocument from "../../../Component/Dialog/Internal/modalDocument";
import ModalQA from "../../../Component/Dialog/Internal/modalQA";
import ModalLeaderQC from "../../../Component/Dialog/Internal/modalLeaderQC";
import ModalLeaderAssign from "../../../Component/Dialog/Internal/modalLeaderAssign";

const { Option } = Select;
const { TabPane } = Tabs;


export default function Subject() {
  const match = useRouteMatch();
  const history = useHistory();
  const selectRef = useRef(null)
  const { state: userstate, dispatch: userdispatch } = useContext(IssueContext);

  //modal
  const [visible, setVisible] = useState(false);
  const [modalduedate_visible, setModalduedate_visible] = useState(false);
  const [historyduedate_visible, setHistoryduedate_visible] = useState(false);
  const [modalleaderassign_visible, setModalleaderassign_visible] = useState(false);
  const [modaldeveloper_visible, setModaldeveloper_visible] = useState(false);
  const [modalleaderqc_visible, setModalleaderqc_visible] = useState(false);
  const [modalQA_visible, setModalQA_visible] = useState(false);
  const [unittestlog_visible, setUnittestlog_visible] = useState(false);

  //div
  const [container, setContainer] = useState(null);
  const [divcollapse, setDivcollapse] = useState("block")
  const [collapsetext, setCollapsetext] = useState("Hide details")

  // data
  const [ProgressStatus, setProgressStatus] = useState("");
  const [history_duedate_data, setHistory_duedate_data] = useState([]);
  const [selected, setSelected] = useState()


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
    userdispatch({ type: "LOAD_ACTION_FLOW", payload: flow_output.data })
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
        getflow_output(ticket_detail.data[0].TransId)
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

  const SaveIssueType = async (value) => {
    const issuetype = await Axios({
      url: process.env.REACT_APP_API_URL + "/tickets/save_issuetype",
      method: "PATCH",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
      },
      params: {
        ticketId: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
        typeId: value

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

  function HandleChange(value, item) {
    setProgressStatus(item.label);
    userdispatch({ type: "SELECT_NODE_OUTPUT", payload: value })
    if (item.node === "support") { return (setVisible(true)) }
    if (item.node === "developer_2" && item.nodevalue === "LeaderAssign") { setModalleaderassign_visible(true) }
    if (item.node === "developer_1") { setModaldeveloper_visible(true) } 
    if (item.node === "developer_2" && item.nodevalue === "LeaderQC") { setModalleaderqc_visible(true) }
    if (item.node === "qa") { setModalQA_visible(true) }




  }

  useEffect(() => {
    getdetail();
    getIssueType();
  }, [])


  // useEffect(() => {
  //   getdetail();
  //   getDueDateHistory();

  // }, [modalduedate_visible, historyduedate_visible])


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

                {/* TAB */}
                <Row style={{ marginTop: 36, marginRight: 24 }}>
                  <Col span={24}>
                    <label className="header-text">Activity</label>
                    <Tabs defaultActiveKey="1">
                      <TabPane tab="Comment" key="1">
                        <CommentBox />
                      </TabPane>
                      <TabPane tab="Internal Note" key="2">
                        <InternalComment />
                      </TabPane>
                      <TabPane tab="History Log" key="3">
                        <Historylog />
                      </TabPane>
                    </Tabs>
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
                    value={selected}
                    style={{ width: '100%' }} placeholder="None"
                    // onChange={(value, item) => HandleChange({target: {value: value, item: item}})}
                    onChange={(value, item) => HandleChange(value, item)}
                    options={userstate.actionflow && userstate.actionflow.map((x) => ({ value: x.ToNodeId, label: x.TextEng, node: x.NodeName, nodevalue: x.value }))}


                  />
                </Col>
              </Row>
              <Row style={{ marginBottom: 20 }}>
                <Col span={18}>
                  <label className="header-text">Priority</label>
                  <br />
                  <label className="value-text"> {userstate.issuedata.details[0] && userstate.issuedata.details[0].Priority}</label>
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
                  <br />

                  <Select
                    style={{ width: '100%' }}
                    allowClear
                    showSearch
                    // defaultValue={2}
                    filterOption={(input, option) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    options={userstate.masterdata.issueTypeState && userstate.masterdata.issueTypeState.map((x) => ({ value: x.Id, label: x.Name }))}
                    onChange={(value) => SaveIssueType(value)}
                    value={userstate.issuedata.details[0] && userstate.issuedata.details[0].InternalTypeId}
                  />

                  {/* <label className="value-text">{userstate.issuedata.details[0] && userstate.issuedata.details[0].InternalIssueType}</label> */}

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
              <Row style={{ marginBottom: 20 }}>
                <Col span={24}>
                  <label className="header-text">DueDate</label>
                  <br />
                  <ClockCircleOutlined style={{ fontSize: 18 }} onClick={() => setHistoryduedate_visible(true)} />
                  <Button type="link"
                    onClick={() => setModalduedate_visible(true)}
                  >
                    {userstate.issuedata.details[0] &&
                      (userstate.issuedata.details[0].DueDate === null ? "None" : new Date(userstate.issuedata.details[0].DueDate).toLocaleDateString('en-GB'))}
                  </Button>
                  {history_duedate_data.length > 1 ?
                    <Tag color="warning">
                      DueDate ถูกเลื่อน
                   </Tag> : ""
                  }
                </Col>
              </Row>

              <Row style={{ marginBottom: 20 }}>
                <Col span={18}>
                  <label className="header-text">Document</label>
                  {/* <br /> */}
                  <Button icon={<FileAddOutlined />}
                    type="link"
                    onClick={() => setUnittestlog_visible(true)}
                  />

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
          ticketId: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
          mailboxId: userstate.issuedata.details[0] && userstate.issuedata.details[0].MailBoxId,
          productId: userstate.issuedata.details[0] && userstate.issuedata.details[0].ProductId,
          internaltype: userstate.issuedata.details[0] && userstate.issuedata.details[0].InternalTypeId,
          nodeoutput_id: userstate.node.output_id
        }}
      />

      <ModalLeaderAssign
        title={ProgressStatus}
        visible={modalleaderassign_visible}
        onCancel={() => { return (setModalleaderassign_visible(false), setSelected(null)) }}
        width={800}
        onOk={() => {
          setModalleaderassign_visible(false);
          setSelected(null);
        }}
        details={{
          ticketId: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
          mailboxId: userstate.issuedata.details[0] && userstate.issuedata.details[0].MailBoxId,
          productId: userstate.issuedata.details[0] && userstate.issuedata.details[0].ProductId,
          moduleId: userstate.issuedata.details[0] && userstate.issuedata.details[0].ModuleId,
          nodeoutput_id: userstate.node.output_id
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
          ticketId: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
          mailboxId: userstate.issuedata.details[0] && userstate.issuedata.details[0].MailBoxId,
          nodeoutput_id: userstate.node.output_id
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
        details={{
          ticketId: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
          mailboxId: userstate.issuedata.details[0] && userstate.issuedata.details[0].MailBoxId,
          nodeoutput_id: userstate.node.output_id
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

      <ModalQA
        title={ProgressStatus}
        visible={modalQA_visible}
        onCancel={() => { return (setModalQA_visible(false), setSelected(null)) }}
        width={800}
        onOk={() => {
          setModalQA_visible(false);

        }}
        details={{
          ticketId: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
          mailboxId: userstate.issuedata.details[0] && userstate.issuedata.details[0].MailBoxId,
          nodeoutput_id: userstate.node.output_id
        }}
      />



      <ModalDocument
        title="Document"
        visible={unittestlog_visible}
        width={800}
        onCancel={() => setUnittestlog_visible(false)}
        onOk={() => {
          setUnittestlog_visible(false);
        }}
        details={{
          refId: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
          reftype: "Master_Ticket",
        }}
      />

    </MasterPage>
  );
}
