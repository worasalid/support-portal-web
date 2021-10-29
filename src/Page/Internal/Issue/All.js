import { Button, Col, Row, Table, Tag, Tooltip } from "antd";
import moment from "moment";
import Axios from "axios";
import React, { useEffect, useState, useContext, useReducer, useRef } from "react";
import { useHistory } from "react-router-dom";
import IssueSearch from "../../../Component/Search/Internal/IssueSearch";
import MasterPage from "../MasterPage";
import Column from "antd/lib/table/Column";
import { DownloadOutlined, TrademarkOutlined, ConsoleSqlOutlined } from "@ant-design/icons";
import AuthenContext from "../../../utility/authenContext";
import IssueContext, { userReducer, userState } from "../../../utility/issueContext";
import MasterContext from "../../../utility/masterContext";
import ModalFileDownload from "../../../Component/Dialog/Internal/modalFileDownload";
import ClockSLA from "../../../utility/SLATime";
import ModalTimetracking from "../../../Component/Dialog/Internal/modalTimetracking";
import Notification from "../../../Component/Notifications/Internal/Notification";

export default function AllIssue() {
  const history = useHistory();
  const notiRef = useRef();
  //modal
  const [visible, setVisible] = useState(false);
  const [modaldeveloper_visible, setModaldeveloper_visible] = useState(false);
  const [modalQA_visible, setModalQA_visible] = useState(false);
  const [historyduedate_visible, setHistoryduedate_visible] = useState(false);
  const [modalfiledownload_visible, setModalfiledownload_visible] = useState(false);
  const [modaltimetracking_visible, setModaltimetracking_visible] = useState(false);

  // data
  const [userstate, userdispatch] = useReducer(userReducer, userState);
  const [loading, setLoadding] = useState(false);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageTotal, setPageTotal] = useState(0);
  const { state, dispatch } = useContext(AuthenContext);
  const { state: masterstate, dispatch: masterdispatch } = useContext(MasterContext);
  const [ProgressStatus, setProgressStatus] = useState("");
  const [issueAllStatus, setIssueAllStatus] = useState(null)
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
          progress: userstate.filter.progress,
          scene: userstate.filter.scene,
          startdate: userstate.filter.date.startdate === "" ? "" : moment(userstate.filter.date.startdate, "DD/MM/YYYY").format("YYYY-MM-DD"),
          enddate: userstate.filter.date.enddate === "" ? "" : moment(userstate.filter.date.enddate, "DD/MM/YYYY").format("YYYY-MM-DD"),
          keyword: userstate.filter.keyword,
          task: "allissue",
          is_release_note: userstate.filter.isReleaseNote,
          pageCurrent: pageCurrent,
          pageSize: pageSize
        }
      });

      if (results.status === 200) {
        setPageTotal(results.data.total);
        setIssueAllStatus(results.data.issue_status);
        userdispatch({ type: "LOAD_ISSUE", payload: results.data.data });
        setLoadding(false);
      }
    } catch (error) {

    }
  };

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

  function rederPriorityText(param) {
    switch (param) {
      case 'Critical':
        return (
          <label className="blinktext" style={{ fontSize: "10px", color: "#C0392B", fontWeight: "bold" }}>{param}</label>
        )
      case 'High':
        return (
          <label style={{ fontSize: "10px", color: "#E74C3C", fontWeight: "bold" }}>{param}</label>
        )
      case 'Medium':
        return (
          <label style={{ fontSize: "10px", color: "#DC7633" }}>{param}</label>
        )
      case 'Low':
        return (
          <label style={{ fontSize: "10px", color: "#27AE60" }}>{param}</label>
        )
    }
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
  }, [userstate.search]);

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

        <IssueSearch Progress="show" />
        {/* <Row style={{ textAlign: "left", marginTop:30 }}>
       
          <Col span={3} style={{ textAlign: "left" }}>
            <Tag color="default">Open</Tag>:&nbsp;&nbsp;
            {issueAllStatus?.open}
          </Col>
          <Col span={3} style={{ textAlign: "left" }}>
            <Tag color="#FFA500">InProgress</Tag>:&nbsp;&nbsp;
            {issueAllStatus?.inprogress}
          </Col>
          <Col span={3} style={{ textAlign: "left" }}>
            <Tag color=" #87d068">Resolved</Tag>:&nbsp;&nbsp;
            {issueAllStatus?.resolved}
          </Col>
          <Col span={3} style={{ textAlign: "left" }}>

            <Tag color=" #87d068">Complete</Tag>:&nbsp;&nbsp;
            {issueAllStatus?.complete}
          </Col>
        </Row> */}

        <Row>
          <Col span={24} style={{ padding: "0px 24px 0px 24px" }}>
            <Table dataSource={userstate.issuedata.data} loading={loading}
              pagination={{ current: pageCurrent, pageSize: pageSize, total: pageTotal }}
              //scroll={{y:250}}
              style={{ padding: "5px 5px" }}
              onChange={(x) => { setPageCurrent(x.current); setPageSize(x.pageSize) }}
              footer={(x) => {
                return (
                  <>
                    <div style={{ textAlign: "right" }}>
                      <label>จำนวนเคส : </label>
                      <label>{x.length}</label>
                      <label> จากทั้งหมด : </label>
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
              }}
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
                }}
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
                          {rederPriorityText(record.Priority)}
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
                      <Row hidden={record.IssueType === "ChangeRequest" || record.IssueType === "Memo" ? false : true}
                        style={{ borderBottom: "1px dotted" }}>
                        <Col span={8}>
                          <label style={{ color: "#808080", fontSize: "10px" }}>
                            Version :
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
                        <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"}>
                          {record.Title}
                        </label>
                        <Tag color="#00CC00"
                          style={{
                            borderRadius: "25px", width: "50px", height: 18, marginLeft: 10,
                            display: record.TaskCnt > 1 ? "inline-block" : "none"
                          }}
                        >
                          <label style={{ fontSize: 10 }}>{record.TaskCnt} Task</label>
                        </Tag>
                      </div>
                      <div>
                        <label
                          onClick={() => {
                            return (
                              history.push({ pathname: "/internal/issue/subject/" + record.Id }),
                              (record.MailStatus !== "Read" ? UpdateStatusMailbox(record.MailBoxId) : ""),
                              notiRef.current.updateNoti(record.Id)
                            )
                          }}
                          
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
                      <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"}>
                        {record.CreateBy}
                      </label>
                    </div>

                    <div>
                      <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"}>
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
              width="10%"
              align="center"
              render={(record) => {
                return (
                  <>
                    <div style={{
                      display: state?.usersdata?.organize?.OrganizeCode === "support" &&
                        record.Is_DueDate === 0 ? "inline-block" : "none"
                    }}>
                      <label className="table-column-text" style={{ color: "red" }}>
                        กรุณาแจ้ง DueDate ลูกค้า
                      </label>
                    </div>
                    <div style={{
                      display: state?.usersdata?.organize?.OrganizeCode === "cr_center" &&
                        record.Is_SLA_DueDate === 0 ? "inline-block" : "none"
                    }}>
                      <label className="table-column-text" style={{ color: "red" }}>
                        กรุณาระบุ DueDate
                      </label>
                    </div>

                    <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"}>
                      {record.DueDate === null ? "" : moment(record.DueDate).format('DD/MM/YYYY')}
                    </label>
                    <br />
                    <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"}>
                      {record.DueDate === null ? "" : moment(record.DueDate).format('HH:mm')}
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
                        {record.InternalStatus === "Open" ? "Open" : record.GroupStatus}<br />
                        {record.FlowStatus === null || record.GroupStatus === record.FlowStatus ? "" : `(${record.FlowStatus})`}
                      </label>

                    </div>
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
                      <ClockSLA
                        start={moment(record.AssignIconDate)}
                        due={moment(record.SLA_DueDate)}
                        end={record.ResolvedDate === null ? moment() : moment(record.ResolvedDate)}
                        type={record.Priority}
                      />
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
                      onClick={() => {
                        userdispatch({ type: "SELECT_DATAROW", payload: record });
                        setModalfiledownload_visible(true);
                      }}>
                      {record.cntFile === 0 ? "" : <DownloadOutlined style={{ fontSize: 30, color: "#007bff" }} />}
                    </Button>


                    {/* FileUrl จากระบบเดิม แสดงเฉพาะ เคสที่ Migrate ข้อมูลมา*/}
                    <Button type="link"
                      hidden={record.FileUrl === "" ? true : false}
                      icon={<DownloadOutlined style={{ fontSize: 30, color: "#007bff" }} />}
                      onClick={() => {
                        window.open(record.FileUrl)
                      }}
                    >
                    </Button>
                  </>
                )
              }
              }
            />
          </Table>
        </Col>
      </Row>


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
      <div hidden={true}>
        <Notification ref={notiRef} />
      </div>
    </MasterPage>
    </IssueContext.Provider >
  );
}
