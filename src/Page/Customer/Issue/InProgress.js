import { Button, Col, Row, Table, Tag } from "antd";
import moment from "moment";
import Axios from "axios";
import React, { useEffect, useState, useContext, useReducer, useRef } from "react";
import { useHistory } from "react-router-dom";
import IssueSearch from "../../../Component/Search/Customer/IssueSearch";
import MasterPage from "../MasterPage";
import Column from "antd/lib/table/Column";
import { DownloadOutlined } from "@ant-design/icons";
import AuthenContext from "../../../utility/authenContext";
import IssueContext, { customerReducer, customerState } from "../../../utility/issueContext";
import DuedateLog from "../../../Component/Dialog/Customer/duedateLog";
import ModalFileDownload from "../../../Component/Dialog/Customer/modalFileDownload";
import Notification from "../../../Component/Notifications/Customer/Notification";


export default function InProgress() {
  const history = useHistory();
  const [loading, setLoadding] = useState(false);
  const notiRef = useRef();

  // modal
  const [visible, setVisible] = useState(false);
  const [historyduedate_visible, setHistoryduedate_visible] = useState(false);
  const [modalfiledownload_visible, setModalfiledownload_visible] = useState(false);

  // data
  // const { state: customerstate, dispatch: customerdispatch } = useContext(IssueContext);
  const [customerstate, customerdispatch] = useReducer(customerReducer, customerState);
  const { state, dispatch } = useContext(AuthenContext);
  const [ProgressStatus, setProgressStatus] = useState("");
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageTotal, setPageTotal] = useState(0);
  const [recHover, setRecHover] = useState(-1);

  const loadIssue = async (value) => {
    setLoadding(true);
    try {
      customerdispatch({ type: "LOADING", payload: true })

      const results = await Axios({
        url: process.env.REACT_APP_API_URL + "/tickets/loadticket-customer",
        method: "GET",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
        params: {
          issue_type: customerstate.filter.TypeState,
          productId: customerstate.filter.productState,
          moduleId: customerstate.filter.moduleState,
          startdate: customerstate.filter.date.startdate === "" ? "" : moment(customerstate.filter.date.startdate, "DD/MM/YYYY").format("YYYY-MM-DD"),
          enddate: customerstate.filter.date.enddate === "" ? "" : moment(customerstate.filter.date.enddate, "DD/MM/YYYY").format("YYYY-MM-DD"),
          priority: customerstate.filter.priorityState,
          version: customerstate.filter.versionState,
          scene: customerstate.filter.scene,
          keyword: customerstate.filter.keyword,
          task: "InProgress",
          pageCurrent: pageCurrent,
          pageSize: pageSize
        }
      });

      if (results.status === 200) {
        setLoadding(false);
        setPageTotal(results.data.total)
        customerdispatch({ type: "LOAD_ISSUE", payload: results.data.data })

      }
      customerdispatch({ type: "LOADING", payload: false })
    } catch (error) {
      customerdispatch({ type: "LOADING", payload: false })
    }
  };

  useEffect(() => {
    if (customerstate.search === true) {
      if (pageCurrent !== 1) {
        setPageCurrent(1);
        setPageSize(10);
      } else {
        loadIssue();
      }
    }
    customerdispatch({ type: "SEARCH", payload: false })
  }, [customerstate.search, visible]);

  useEffect(() => {
    loadIssue();
  }, [pageCurrent]);

  return (
    <IssueContext.Provider value={{ state: customerstate, dispatch: customerdispatch }}>
      <MasterPage>
        <Row style={{ padding: "24px 24px 24px 24px", textAlign: "left" }}>
          <Col span={24}>
            <label style={{ fontSize: 20, verticalAlign: "top" }}>รายการแจ้งปัญหา</label>
          </Col>
        </Row>
        <IssueSearch Version="show" />
        <Row>
          <Col span={24} style={{ padding: "0px 24px 0px 24px" }}>
            <Table dataSource={customerstate.issuedata.data} loading={loading} className="header-sticky"
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
              pagination={{ current: pageCurrent, pageSize: pageSize, total: pageTotal }}

              onChange={(x) => { return (setPageCurrent(x.current), setPageSize(x.pageSize)) }}
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
              }}
            >

              <Column
                title="IssueNo"
                width="5%"
                render={(record) => {
                  return (
                    <>
                      <label className="table-column-text11">
                        {record.Number}
                      </label>
                    </>
                  )
                }}
              />

              <Column
                title="Details"
                width="15%"
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
                            {record.IssueType}
                            {/* {record.IssueType === 'ChangeRequest' ? "CR" : record.IssueType} */}
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
                render={(record) => {
                  return (
                    <>
                      <div>
                        <label className="table-column-text11">
                          {record.Title}
                          {record.IsReOpen === true ? " (ReOpen)" : ""}
                        </label>
                      </div>
                      <div>
                        <label
                          onClick={() => {
                            customerdispatch({ type: "SELECT_DATAROW", payload: record });
                            history.push({ pathname: "/customer/issue/subject/" + record.Id });
                            //updateCountNoti(record.Id);
                            notiRef.current.updateNoti(record.Id);
                          }}

                          className="table-column-detail">รายละเอียด</label>
                      </div>

                    </>
                  )
                }
                }
              />
              <Column title="Issue Date"
                align="center"
                width="10%"
                render={(record) => {
                  return (
                    <>
                      <label className="table-column-text11">
                        {moment(record.AssignIconDate).format("DD/MM/YYYY")}<br />
                        {moment(record.AssignIconDate).format("HH:mm")}
                      </label>

                    </>
                  )
                }

                }
              />

              <Column title="Due Date"
                align="center"
                width="10%"
                render={(record) => {
                  return (
                    <>
                      <label className="table-column-text11">
                        {record.DueDate === null ? "" : moment(record.DueDate).format("DD/MM/YYYY")}<br />
                        {record.DueDate === null ? "" : moment(record.DueDate).format("HH:mm")}
                      </label>
                      <br />
                      {record.cntDueDate >= 1 ?
                        <Tag style={{ marginLeft: 16, cursor: "pointer" }} color="warning"
                          onClick={() => {
                            customerdispatch({ type: "SELECT_DATAROW", payload: record })
                            setHistoryduedate_visible(true)
                          }}
                        >
                          DueDate ถูกเลื่อน
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
                    <label className="table-column-text11">{record.ProgressStatus}</label>
                  );
                }}
              />
              <Column title={<DownloadOutlined style={{ fontSize: 30 }} />}
                width="10%"
                align="center"
                render={(record) => {
                  return (
                    <>
                      <Button type="link"
                        onClick={() => {
                          return (
                            customerdispatch({ type: "SELECT_DATAROW", payload: record }),
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

        <DuedateLog
          title="ประวัติ DueDate"
          visible={historyduedate_visible}
          onCancel={() => setHistoryduedate_visible(false)}
          details={{
            ticketId: customerstate.issuedata.datarow.Id,
            duedate: customerstate.issuedata.datarow.SLA_DueDate
          }}
        >
        </DuedateLog>


        <ModalFileDownload
          title="File Download"
          visible={modalfiledownload_visible}
          onCancel={() => { return (setModalfiledownload_visible(false)) }}
          width={600}
          onOk={() => {
            setModalfiledownload_visible(false);

          }}
          details={{
            refId: customerstate.issuedata.datarow.Id,
            reftype: "Master_Ticket",
            grouptype: "attachment"
          }}

        />
        {/* </Spin> */}
        <div hidden={true}>
          <Notification ref={notiRef} />
        </div>
      </MasterPage >
    </IssueContext.Provider>
  );
}
