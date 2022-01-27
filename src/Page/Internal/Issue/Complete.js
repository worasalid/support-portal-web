import { Button, Col, Dropdown, Menu, Row, Table, Typography, Tag, Divider, Select, DatePicker, Input, Tooltip } from "antd";
import moment from "moment";
import Axios from "axios";
import React, { useEffect, useState, useContext, useReducer } from "react";
import { useHistory } from "react-router-dom";
import ModalSupport from "../../../Component/Dialog/Internal/modalSupport";
import ModalDeveloper from "../../../Component/Dialog/Internal/modalDeveloper";
import IssueSearch from "../../../Component/Search/Internal/IssueSearch";
import MasterPage from "../MasterPage";
import Column from "antd/lib/table/Column";
import { DownloadOutlined, TrademarkOutlined, ConsoleSqlOutlined, ClockCircleOutlined } from "@ant-design/icons";
import AuthenContext from "../../../utility/authenContext";
import IssueContext, { userReducer, userState } from "../../../utility/issueContext";
import MasterContext from "../../../utility/masterContext";
import DuedateLog from "../../../Component/Dialog/Internal/duedateLog";
import ModalQA from "../../../Component/Dialog/Internal/modalQA";
import ModalFileDownload from "../../../Component/Dialog/Internal/modalFileDownload";
import ClockSLA from "../../../utility/SLATime";
import ModalTimetracking from "../../../Component/Dialog/Internal/modalTimetracking";
import { CalculateTime } from "../../../utility/calculateTime";

export default function Complete() {
  const history = useHistory();
  const [loading, setLoadding] = useState(false);

  //modal
  const [visible, setVisible] = useState(false);
  const [modaldeveloper_visible, setModaldeveloper_visible] = useState(false);
  const [modalQA_visible, setModalQA_visible] = useState(false);
  const [historyduedate_visible, setHistoryduedate_visible] = useState(false);
  const [modalfiledownload_visible, setModalfiledownload_visible] = useState(false);
  const [modaltimetracking_visible, setModaltimetracking_visible] = useState(false);

  // data
  const [userstate, userdispatch] = useReducer(userReducer, userState);
  const { state, dispatch } = useContext(AuthenContext);
  const { state: masterstate, dispatch: masterdispatch } = useContext(MasterContext);
  const [ProgressStatus, setProgressStatus] = useState("");
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageTotal, setPageTotal] = useState(0);
  const [recHover, setRecHover] = useState(-1);


  const loadIssue = async (value) => {
    setLoadding(true);
    try {
      const results = await Axios({
        url: process.env.REACT_APP_API_URL + "/tickets/loadticket-user",
        method: "GET",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
        params: {
          companyId: userstate.filter.companyState,
          issue_type: userstate.filter.TypeState,
          productId: userstate.filter.productState,
          moduleId: userstate.filter.moduleState,
          version: userstate.filter.versionState,
          scene: userstate.filter.scene,
          startdate: userstate.filter.date.startdate === "" ? "" : moment(userstate.filter.date.startdate, "DD/MM/YYYY").format("YYYY-MM-DD"),
          enddate: userstate.filter.date.enddate === "" ? "" : moment(userstate.filter.date.enddate, "DD/MM/YYYY").format("YYYY-MM-DD"),
          keyword: userstate.filter.keyword,
          is_release_note: userstate.filter.isReleaseNote,
          task: "Complete",
          pageCurrent: pageCurrent,
          pageSize: pageSize
        }
      });

      if (results.status === 200) {
        setLoadding(false);
        setPageTotal(results.data.total)
        userdispatch({ type: "LOAD_ISSUE", payload: results.data.data })
      }
    } catch (error) {

    }
  };

  const updateCountNoti = async (param) => {
    try {
      const result = await Axios({
        url: process.env.REACT_APP_API_URL + "/master/notification",
        method: "PATCH",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
        params: {
          ticket_id: param
        }
      });

      if (result.status === 200) {

      }
    } catch (error) {

    }
  }

  const UpdateStatusMailbox = async (value) => {
    const mailbox = await Axios({
      url: process.env.REACT_APP_API_URL + "/tickets/read",
      method: "PATCH",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
      },
      params: {
        mailbox_id: value
      }
    });
  }


  function HandleChange(items) {
    console.log("Menu", items.item.props.node)
    if (items.item.props.node === "support") { setVisible(true) }
    if (items.item.props.node === "developer_1") { setModaldeveloper_visible(true) }
    if (items.item.props.node === "qa" || items.item.props.node === "developer_2") { setModalQA_visible(true) }

  }

  useEffect(() => {
    if (userstate.search === true) {
      if (pageCurrent !== 1) {
        setPageCurrent(1);
        setPageSize(10);
      } else {
        loadIssue();
      }
    }
    userdispatch({ type: "SEARCH", payload: false })
  }, [userstate.search, pageCurrent]);

  useEffect(() => {
    loadIssue();
  }, [pageCurrent]);

  return (
    <IssueContext.Provider value={{ state: userstate, dispatch: userdispatch }}>
      <MasterPage>
        <Row style={{ padding: "24px 24px 24px 24px", textAlign: "left" }}>
          <Col span={24}>
            <label style={{ fontSize: 20, verticalAlign: "top" }}>รายการแจ้งปัญหา</label>
          </Col>
        </Row>
        <IssueSearch />
        <Row>
          <Col span={24} style={{ padding: "0px 24px 0px 24px" }}>
            <Table dataSource={userstate.issuedata.data} loading={loading}
              // scroll={{y:350}}
              style={{ padding: "5px 5px" }}
              pagination={{ current: pageCurrent, pageSize: pageSize, total: pageTotal }}
              onChange={(x) => { setPageCurrent(x.current); setPageSize(x.pageSize) }}
              footer={(x) => {
                return (
                  <>
                    <div style={{ textAlign: "right" }}>
                      <label>จำนวนเคส : </label>
                      <label>{pageTotal}</label>
                    </div>
                  </>
                )
              }}
              onRow={(record, rowIndex) => {
                return {
                  onClick: event => { }, // click row
                  onDoubleClick: event => { }, // double click row
                  onContextMenu: event => { }, // right button click row
                  onMouseEnter: event => { setRecHover(rowIndex) }, // mouse enter row
                  onMouseLeave: event => { setRecHover(-1) }, // mouse leave row
                };
              }}
              rowClassName={(record, index) => {
                return (
                  (index === recHover ? "table-hover" : "")
                )
              }
              }
            >


              <Column
                title="IssueNo"
                width="5%"
                render={(record) => {
                  return (
                    <>
                      <Tooltip title="ReleaseNote">
                        <TrademarkOutlined
                          style={{ display: record.IsReleaseNote === 1 ? "inline-block" : "none", fontSize: 16, color: "#17A2B8" }}
                        />
                      </Tooltip>
                      &nbsp;
                      <Tooltip title="SQL Script">
                        <ConsoleSqlOutlined
                          style={{ display: record.SQL_Script === 1 ? "inline-block" : "none", fontSize: 16, color: "#17A2B8" }}
                        />
                      </Tooltip>
                      <br />
                      <label className="table-column-text">
                        {record.Number}
                      </label>
                    </>
                  )
                }
                }
              />

              <Column
                title="Details"
                width="20%"
                render={(record) => {
                  return (
                    <div>
                      <Row style={{ borderBottom: "1px dotted" }}>
                        <Col span={8}>
                          <label className="table-column-text" style={{ color: "#808080" }}>
                            Type :
                          </label>
                        </Col>
                        <Col span={14}>
                          <label style={{ color: "#808080", fontSize: "10px" }}>
                            {record.IssueType === 'ChangeRequest' ? "CR" : record.IssueType}
                          </label>
                        </Col>
                      </Row>
                      <Row style={{ borderBottom: "1px dotted" }}>
                        <Col span={8}>
                          <label style={{ color: "#808080", fontSize: "10px" }}>
                            Priority :
                          </label>
                        </Col>
                        <Col span={14} >
                          <label style={{ color: "#808080", fontSize: "10px" }}>
                            {record.Priority}
                          </label>
                          {/* <hr style={{margin:"2px", border:"1px dotted #ccc"}} /> */}

                        </Col>
                      </Row>
                      <Row style={{ borderBottom: "1px dotted" }}>
                        <Col span={8}>
                          <label style={{ color: "#808080", fontSize: "10px" }}>
                            Product :
                          </label>
                        </Col>
                        <Col span={14}>
                          <label style={{ color: "#808080", fontSize: "10px" }}>
                            {record.ProductName}
                          </label>
                        </Col>
                      </Row>
                      {/* <Row style={{ borderBottom: "1px dotted" }}>
                        <Col span={8}>
                          <label style={{ color: "#808080", fontSize: "10px" }}>
                            Module :
                          </label>
                        </Col>
                        <Col span={14}>
                          <label style={{ color: "#808080", fontSize: "10px" }}>
                            {record.ModuleName}
                          </label>
                        </Col>
                      </Row> */}
                      <Row style={{ borderBottom: "1px dotted" }}>
                        <Col span={8}>
                          <label style={{ color: "#808080", fontSize: "10px" }}>
                            Scene :
                          </label>
                        </Col>
                        <Col span={14}>
                          <label style={{ color: "#808080", fontSize: "10px" }}>
                            {record.Scene}
                          </label>
                        </Col>
                      </Row>

                      <Row hidden={record.IssueType === "ChangeRequest" || record.IssueType === "Memo" || record.IssueType === "Bug" ? false : true}
                        style={{ borderBottom: "1px dotted" }}>
                        <Col span={8}>
                          <label style={{ color: "#808080", fontSize: "10px" }}>
                            {record.IssueType === "ChangeRequest" || record.IssueType === "Memo" ? "Version :" : "Patch :"}
                          </label>
                        </Col>
                        <Col span={14}>
                          <label style={{ color: "#808080", fontSize: "10px" }}>
                            {record.Version}
                          </label>
                        </Col>
                      </Row>
                    </div>
                  );
                }}
              />

              <Column title="Subject"
                width="40%"
                render={(record) => {
                  return (
                    <>
                      <div>
                        <label className="table-column-text">
                          {record.Title}
                        </label>
                        <Tag color="#00CC00"
                          style={{
                            borderRadius: "25px", width: "50px", height: 18, marginLeft: 10,
                            display: record.TaskCnt > 1 ? "inline-block" : "none"
                          }}>
                          <label style={{ fontSize: 10, alignContent: "center", verticalAlign: "center" }}>{record.TaskCnt} Task</label>
                        </Tag>
                      </div>
                      <div>
                        <label
                          onClick={() => {
                            history.push({ pathname: "/internal/issue/subject/" + record.Id });
                            updateCountNoti(record.Id)
                            // ,(record.MailStatus !== "Read" ? UpdateStatusMailbox(record.MailBoxId) : "")

                          }
                          }
                          className="table-column-detail">
                          รายละเอียด
                        </label>
                      </div>

                    </>
                  )
                }
                }
              />

              <Column title="Issue By"
                align="center"
                width="10%"
                render={(record) => {
                  return (
                    <>
                      <div>
                        <label className="table-column-text">
                          {record.CreateBy}
                        </label>
                      </div>

                      <div>
                        {/* <label className={record.MailStatus === "Read" ? "table-column-text" : "table-column-text-unread"}> */}
                        <label className="table-column-text">
                          {moment(record.AssignIconDate).format("DD/MM/YYYY HH:mm")}
                        </label>
                      </div>
                      <Tooltip title="Company"><Tag color="#17a2b8">{record.CompanyName}</Tag></Tooltip>

                    </>
                  )
                }

                }
              />

              <Column title="Due Date"
                width="8%"
                align="center"
                render={(record) => {
                  return (
                    <>
                      <label className="table-column-text">
                        {record.DueDate === null ? "" : moment(record.DueDate).format("DD/MM/YYYY")}
                      </label>
                      <br />
                      <label className="table-column-text">
                        {record.DueDate === null ? "" : moment(record.DueDate).format("HH:mm")}
                      </label>
                      <br />
                      {record.cntDueDate >= 1 ?
                        <Tag style={{ marginLeft: 16 }} color="warning"
                          onClick={() => {
                            userdispatch({ type: "SELECT_DATAROW", payload: record })
                            setHistoryduedate_visible(true)
                          }
                          }
                        >
                          เลื่อน Due
                        </Tag> : ""
                      }

                    </>
                  )
                }
                }
              />
              <Column
                title="ProgressStatus"
                width="10%"
                align="center"
                render={(record) => {
                  return (
                    <>
                      <div>
                        <label className="table-column-text">
                          {record.FlowStatus}
                        </label>
                      </div>
                      <label className="table-column-text">
                        {moment(record.CompleteDate).format("DD/MM/YYYY")}
                      </label>
                      <br />
                      <label className="table-column-text">
                        {moment(record.CompleteDate).format("HH:mm")}
                      </label>

                    </>
                  );
                }}
              />
              <Column
                title="Time Tracking"
                align="center"
                width="5%"
                render={(record) => {
                  return (
                    <>
                      <div style={{ display: record.IssueType === "Bug" && record.DueDate !== null ? "block" : "none" }}>
                        {/* <ClockSLA
                          start={moment(record.AssignIconDate)}
                          due={moment(record.DueDate)}
                          end={record.ResolvedDate === null ? moment() : moment(record.ResolvedDate)}
                        /> */}
                        <RenderSLA sla={record.SLA} ticket_sla={record.TicketSLA} />
                      </div>
                    </>
                  )
                }
                }
              />

              <Column title={<DownloadOutlined style={{ fontSize: 30 }} />}
                width="5%"
                align="center"
                render={(record) => {
                  return (
                    <>
                      <Button type="link"
                        // onClick={() => window.open(process.env.REACT_APP_FILE_DOWNLOAD_URL + '/' + record.FileId, "_blank")}
                        onClick={() => {
                          return (
                            userdispatch({ type: "SELECT_DATAROW", payload: record }),
                            setModalfiledownload_visible(true)
                          )
                        }
                        }
                      >
                        {record.cntFile === 0 ? "" : <DownloadOutlined style={{ fontSize: 30, color: "#007bff" }} />}
                      </Button>
                    </>
                  )
                }
                }
              />
            </Table>
          </Col>
        </Row>

        {/* Modal */}
        <DuedateLog
          title="ประวัติ DueDate"
          visible={historyduedate_visible}
          onCancel={() => setHistoryduedate_visible(false)}
          details={{
            ticketId: userstate.issuedata.datarow.Id
          }}
        >
        </DuedateLog>

        <ModalSupport
          title={ProgressStatus}
          visible={visible}
          onCancel={() => setVisible(false)}
          width={800}
          onOk={() => {
            setVisible(false);
            loadIssue();
          }}
          details={{
            ticketId: userstate.issuedata.datarow.Id,
            mailboxId: userstate.issuedata.datarow.MailBoxId,
            productId: userstate.issuedata.datarow.ProductId,
            nodeoutput_id: userstate.node.output_id
          }}
        />

        <ModalDeveloper
          title={ProgressStatus}
          visible={modaldeveloper_visible}
          onCancel={() => setModaldeveloper_visible(false)}
          width={800}
          onOk={() => {
            setModaldeveloper_visible(false);
            loadIssue();
          }}
          details={{
            ticketId: userstate.issuedata.datarow.Id,
            mailboxId: userstate.issuedata.datarow.MailBoxId,
            nodeoutput_id: userstate.node.output_id
          }}
        />

        <ModalQA
          title={ProgressStatus}
          visible={modalQA_visible}
          onCancel={() => { return (setModalQA_visible(false)) }}
          width={800}
          onOk={() => {
            setModalQA_visible(false);

          }}
          details={{
            ticketId: userstate.issuedata.datarow.Id,
            mailboxId: userstate.issuedata.datarow.MailBoxId,
            nodeoutput_id: userstate.node.output_id
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
            refId: userstate.issuedata.datarow.Id,
            reftype: "Master_Ticket",
            grouptype: "attachment"
          }}

        />

        <ModalTimetracking
          title="Time Tracking"
          width={600}
          visible={modaltimetracking_visible}
          onCancel={() => { return (setModaltimetracking_visible(false)) }}
          details={{
            transgroupId: userstate.issuedata.datarow.TransGroupId,

          }}
        />

        {/* </Spin> */}
      </MasterPage>
    </IssueContext.Provider>
  );
}

export function RenderSLA({ sla = 0, ticket_sla = 0 }) {
  const calculateTime = new CalculateTime();
  return (
    <Button
      type="default"
      className={
        ticket_sla < sla ? "sla-warning" : "sla-overdue"
      }
      size="middle"
      shape="round"
      ghost={ticket_sla < sla ? true : false}
    >
      {ticket_sla < sla ?

        <label className="value-text">
          {
            calculateTime.countDownSLA(sla, ticket_sla).en_1.d === 0 ? "" : `${calculateTime.countDownSLA(sla, ticket_sla).en_1.d}d `
          }
          {
            calculateTime.countDownSLA(sla, ticket_sla).en_1.h === 0 ? "" : `${calculateTime.countDownSLA(sla, ticket_sla).en_1.h}h `
          }
          {
            calculateTime.countDownSLA(sla, ticket_sla).en_1.m === 0 ? "" : `${calculateTime.countDownSLA(sla, ticket_sla).en_1.m}m `
          }

        </label>
        :
        <label className="value-text">
          {"-"}
          {
            calculateTime.countSLAOverDue(sla, ticket_sla).en_1.d === 0 ? "" : `${calculateTime.countSLAOverDue(sla, ticket_sla).en_1.d}d `
          }
          {
            calculateTime.countSLAOverDue(sla, ticket_sla).en_1.h === 0 ? "" : `${calculateTime.countSLAOverDue(sla, ticket_sla).en_1.h}h `
          }
          {
            calculateTime.countSLAOverDue(sla, ticket_sla).en_1.m === 0 ? "" : `${calculateTime.countSLAOverDue(sla, ticket_sla).en_1.m}m `
          }
        </label>
      }
      < ClockCircleOutlined style={{ fontSize: 16, verticalAlign: "0.1em" }} />
    </Button>
  )
}
