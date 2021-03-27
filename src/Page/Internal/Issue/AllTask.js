import { Button, Col, Row, Table, Tag, Tooltip } from "antd";
import moment from "moment";
import Axios from "axios";
import React, { useEffect, useState, useContext, useReducer } from "react";
import { useHistory } from "react-router-dom";
import IssueSearch from "../../../Component/Search/Internal/IssueSearch";
import MasterPage from "../MasterPage";
import Column from "antd/lib/table/Column";
import { DownloadOutlined } from "@ant-design/icons";
import AuthenContext from "../../../utility/authenContext";
import IssueContext, { userReducer, userState } from "../../../utility/issueContext";
import MasterContext from "../../../utility/masterContext";
import ModalFileDownload from "../../../Component/Dialog/Internal/modalFileDownload";
import ClockSLA from "../../../utility/SLATime";
import ModalTimetracking from "../../../Component/Dialog/Internal/modalTimetracking";

export default function AllTask() {
  const history = useHistory();

  //modal
  const [visible, setVisible] = useState(false);
  const [modaldeveloper_visible, setModaldeveloper_visible] = useState(false);
  const [modalQA_visible, setModalQA_visible] = useState(false);
  const [historyduedate_visible, setHistoryduedate_visible] = useState(false);
  const [modalfiledownload_visible, setModalfiledownload_visible] = useState(false);
  const [modaltimetracking_visible, setModaltimetracking_visible] = useState(false);

  // data
  const [userstate, userdispatch] = useReducer(userReducer, userState);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageTotal, setPageTotal] = useState(0);
  const { state, dispatch } = useContext(AuthenContext);
  const { state: masterstate, dispatch: masterdispatch } = useContext(MasterContext);
  const [ProgressStatus, setProgressStatus] = useState("");
  const [issueAllStatus, setIssueAllStatus] = useState(null)
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
          progress: userstate.filter.progress,
          scene: userstate.filter.scene,
          startdate: userstate.filter.date.startdate === "" ? "" : moment(userstate.filter.date.startdate, "DD/MM/YYYY").format("YYYY-MM-DD"),
          enddate: userstate.filter.date.enddate === "" ? "" : moment(userstate.filter.date.enddate, "DD/MM/YYYY").format("YYYY-MM-DD"),
          keyword: userstate.filter.keyword,
          task: "alltask",
          pageCurrent: pageCurrent,
          pageSize: pageSize
        }
      });

      if (results.status === 200) {
        setPageTotal(results.data.total);
        setIssueAllStatus(results.data.issue_status);
        userdispatch({ type: "LOAD_ISSUE", payload: results.data.data });
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

  useEffect(() => {
    userdispatch({ type: "LOADING", payload: true })
    setTimeout(() => {
      loadIssue();
      userdispatch({ type: "LOADING", payload: false })
    }, 1000)

    userdispatch({ type: "SEARCH", payload: false })
  }, [userstate.search, pageCurrent]);


  return (
    <IssueContext.Provider value={{ state: userstate, dispatch: userdispatch }}>
      <MasterPage>
        <Row style={{padding:"24px 24px 24px 24px", textAlign: "left" }}>
          <Col span={24}>
            <label style={{ fontSize: 20, verticalAlign: "top" }}>รายการแจ้งปัญหา</label>
          </Col>
        </Row>

        <IssueSearch Progress="show" />


        <Row>
          <Col span={24} style={{ padding: "0px 24px 0px 24px" }}>
            <Table dataSource={userstate.issuedata.data} loading={userstate.loading}
              pagination={{ pageSize: pageSize, total: pageTotal }}
              //scroll={{y:250}}
              style={{ padding: "5px 5px" }}
              onChange={(x) => { return (setPageCurrent(x.current), setPageSize(x.pageSize)) }}
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
              }
              }
            >

              <Column
                title="IssueNo"
                width="5%"
                render={(record) => {
                  return (
                    <>
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
                width="15%"
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
                      <Row style={{ borderBottom: "1px dotted" }}>
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
                      </Row>
                    </div>
                  );
                }}
              />

              <Column title="Subject"
                width="35%"
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
                              (record.MailStatus !== "Read" ? UpdateStatusMailbox(record.MailBoxId) : "")
                            )
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
                width="15%"
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
                      <Tooltip title="Company">
                        <Tag color="#17a2b8" style={{ fontSize: 8 }} >
                          <label className="table-column-text" style={{ fontSize: 8 }}>
                            {record.CompanyName}
                          </label>
                        </Tag>
                      </Tooltip>

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
                      <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"}>
                        {record.DueDate === null ? "" : moment(record.DueDate).format('DD/MM/YYYY')} <br />
                        {record.DueDate === null ? "" : moment(record.DueDate).format('HH:mm')}
                      </label>
                      <br />
                      {record.cntDueDate > 1 ?
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
                          {record.InternalStatus}<br />
                          {/* {record.FlowStatus} */}
                        </label>
                      </div>
                    </>
                  );

                }}
              />

              <Column
                title="Time Tracking"
                align="center"
                width="10%"
                render={(record) => {
                  return (

                    <>
                      <div style={{ display: record.IssueType === "Bug" && record.DueDate !== null ? "block" : "none" }}>
                        {/* <Clock
                          showseconds={false}
                          deadline={record.DueDate}
                          createdate={record.AssignIconDate === null ? undefined : record.AssignIconDate}
                          resolvedDate={record.ResolvedDate === null ? undefined : record.ResolvedDate}
                          onClick={() => { setModaltimetracking_visible(true); userdispatch({ type: "SELECT_DATAROW", payload: record }) }}
                        /> */}
                        <ClockSLA
                          start={moment(record.AssignIconDate)}
                          due={moment(record.DueDate)}
                          end={record.ResolvedDate === null ? moment() : moment(record.ResolvedDate)}

                        />
                      </div>
                    </>
                  )
                }
                }
              />

              <Column title={<DownloadOutlined style={{ fontSize: 30 }} />}
                width="10%"
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
