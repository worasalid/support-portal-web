import { Button, Col, Row, Table, Tag, Tooltip, Result } from "antd";
import { DownloadOutlined, TrademarkOutlined } from "@ant-design/icons";
import moment from "moment";
import Axios from "axios";
import React, { useEffect, useState, useContext, useReducer } from "react";
import { useHistory } from "react-router-dom";
import ModalSupport from "../../../Component/Dialog/Internal/modalSupport";
import ModalDeveloper from "../../../Component/Dialog/Internal/modalDeveloper";
import IssueSearch from "../../../Component/Search/Internal/IssueSearch";
import MasterPage from "../MasterPage";
import Column from "antd/lib/table/Column";
import AuthenContext from "../../../utility/authenContext";
import IssueContext, { userReducer, userState } from "../../../utility/issueContext";
import MasterContext from "../../../utility/masterContext";
import DuedateLog from "../../../Component/Dialog/Internal/duedateLog";
import ModalQA from "../../../Component/Dialog/Internal/modalQA";
import ModalFileDownload from "../../../Component/Dialog/Internal/modalFileDownload";
import ClockSLA from "../../../utility/SLATime";
import { Icon } from '@iconify/react';

export default function Cancel() {
  return (
    <>
      {
        process.env.REACT_APP_MENU_CANCEL_MAINTENANCE === "true" ?
          <MasterPage>
            <Result
              icon={<Icon icon="akar-icons:circle-alert" color="gray" width="100" height="100" />}
              title="กำลังอยู่ในระหว่าง ปรับปรุงระบบ"
              subTitle="Issue ที่กำลังดำเนินการ ใน Out Box ไม่สามารถค้นหาได้ชั่วคราว ให้ค้นหาที่ inbox (เมนู All Issue ,All Task) และ กรองสถานะ"
            />
          </MasterPage>
          :
          <PageCancel />
      }
    </>
  )
}

export function PageCancel() {
  const history = useHistory();
  const [loading, setLoadding] = useState(false);

  //modal
  const [visible, setVisible] = useState(false);
  const [modaldeveloper_visible, setModaldeveloper_visible] = useState(false);
  const [modalQA_visible, setModalQA_visible] = useState(false);
  const [historyduedate_visible, setHistoryduedate_visible] = useState(false);
  const [modalfiledownload_visible, setModalfiledownload_visible] = useState(false);

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
    // setLoadding(true);
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
          startdate: userstate.filter.date.startdate === "" ? "" : moment(userstate.filter.date.startdate, "DD/MM/YYYY").format("YYYY-MM-DD"),
          enddate: userstate.filter.date.enddate === "" ? "" : moment(userstate.filter.date.enddate, "DD/MM/YYYY").format("YYYY-MM-DD"),
          keyword: userstate.filter.keyword,
          task: "Cancel",
          pageCurrent: pageCurrent,
          pageSize: pageSize
        }
      });

      if (results.status === 200) {

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


  useEffect(() => {
    userdispatch({ type: "LOADING", payload: true })
    setTimeout(() => {
      loadIssue();
      userdispatch({ type: "LOADING", payload: false })
    }, 1000)

    userdispatch({ type: "SEARCH", payload: false })
  }, [userstate.search, visible, modaldeveloper_visible, modalQA_visible]);

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
            <Table dataSource={userstate.issuedata.data} loading={userstate.loading}
              className="header-sticky"
              pagination={{ pageSize: pageSize, total: pageTotal }}
              style={{ padding: "5px 5px" }}
              onChange={(x) => { return (setPageCurrent(x.current), setPageSize(x.pageSize)) }}
              footer={(x) => {
                return (
                  <>
                    <div style={{ textAlign: "right" }}>
                      <label>จำนวนเคส : </label>
                      <label>{x.length}</label>
                    </div>
                  </>
                )
              }}
              onRow={(record, rowIndex) => {
                // console.log(record, rowIndex)
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
                title="IssueNo" width="5%"
                render={(record) => {
                  return (
                    <>
                      <Tooltip title="ReleaseNote">
                        <TrademarkOutlined
                          style={{ display: record.IsReleaseNote === 1 ? "inline-block" : "none", fontSize: 12, color: "#17A2B8" }}
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
                title="Details" width="20%"
                render={(record) => {
                  return (
                    <div>

                      <Row style={{ borderBottom: "1px dotted" }}>
                        <Col span={8}>
                          <label style={{ color: "#808080", fontSize: "10px" }}>
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

              <Column title="Subject" width="40%"
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
                            updateCountNoti(record.Id);
                            window.location.reload(true);
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

              <Column title="Issue By" width="10%"
                align="center"
                render={(record) => {
                  return (
                    <>

                      <div>
                        <label className="table-column-text">
                          {record.CreateBy}
                        </label>
                      </div>

                      <div>
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

              <Column title="Due Date" width="10%"
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

                      <label className="table-column-text">
                        {record.DueDate === null ? "" : moment(record.DueDate).format('DD/MM/YYYY')}<br />
                        {record.DueDate === null ? "" : moment(record.DueDate).format('HH:mm')}
                      </label>
                      <br />
                      <div style={{ display: record.cntDueDate >= 1 ? "block" : "none" }}>
                        <Tag style={{ marginLeft: 16 }} color="warning"
                          onClick={() => {
                            userdispatch({ type: "SELECT_DATAROW", payload: record })
                            setHistoryduedate_visible(true)
                          }}
                        >
                          เลื่อน Due
                        </Tag>
                      </div>
                    </>
                  )
                }}
              />

              <Column
                title="ProgressStatus" width="10%"
                align="center"
                render={(record) => {
                  return (
                    <>
                      <div>
                        <label className="table-column-text">
                          {record.FlowStatus}
                        </label>
                        <label
                          style={{ display: record.IsReOpen === true ? "block" : "none" }}
                          className="table-column-text">
                          (ReOpen)
                        </label>
                        <br />
                        <label className="table-column-text">
                          {moment(record.CancelDate).format("DD/MM/YYYY")}
                        </label>
                        <br />
                        <label className="table-column-text">
                          {moment(record.CancelDate).format("HH:mm")}
                        </label>
                      </div>
                    </>
                  );
                }}
              />

              <Column
                title="Time Tracking" width="5%"
                align="center"
                render={(record) => {
                  return (
                    <>
                      <div style={{ display: record.IssueType === "Bug" && record.DueDate !== null ? "block" : "none" }}>
                        <ClockSLA
                          start={moment(record.AssignIconDate)}
                          due={moment(record.DueDate)}
                          end={moment()}
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

        {/* </Spin> */}
      </MasterPage>
    </IssueContext.Provider>
  );
}
