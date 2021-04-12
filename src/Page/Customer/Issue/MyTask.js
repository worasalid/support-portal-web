import { Button, Col, Row, Table, Tag, Divider, Tooltip } from "antd";
import moment from "moment";
import Axios from "axios";
import React, { useEffect, useState, useContext, useReducer } from "react";
import { useHistory } from "react-router-dom";
import ModalSendIssue from "../../../Component/Dialog/Customer/modalSendIssue";
import IssueSearch from "../../../Component/Search/Customer/IssueSearch";
import MasterPage from "../MasterPage";
import Column from "antd/lib/table/Column";
import { DownloadOutlined } from "@ant-design/icons";
import AuthenContext from "../../../utility/authenContext";
import IssueContext from "../../../utility/issueContext";
import DuedateLog from "../../../Component/Dialog/Customer/duedateLog";
import ModalFileDownload from "../../../Component/Dialog/Customer/modalFileDownload";




export default function MyTask() {
  const history = useHistory();
  const [loading, setLoadding] = useState(false);

  // modal
  const [visible, setVisible] = useState(false);
  const [historyduedate_visible, setHistoryduedate_visible] = useState(false);
  const [modalfiledownload_visible, setModalfiledownload_visible] = useState(false);

  // data
  const { state: customerstate, dispatch: customerdispatch } = useContext(IssueContext);
  //const [customerstate, customerdispatch] = useReducer(customerReducer, customerState);
  const { state, dispatch } = useContext(AuthenContext);
  const [ProgressStatus, setProgressStatus] = useState("");
  const [pageCurrent, setPageCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pageTotal, setPageTotal] = useState(0);
  const [recHover, setRecHover] = useState(-1);

  const loadIssue = async (value) => {
    // setLoadding(true);
    try {
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
          scene: customerstate.filter.scene,
          keyword: customerstate.filter.keyword,
          task: "mytask",
          pageCurrent: pageCurrent,
          pageSize: pageSize
        }
      });

      if (results.status === 200) {
        setPageTotal(results.data.total)
        customerdispatch({ type: "LOAD_ISSUE", payload: results.data.data })

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
    customerdispatch({ type: "LOADING", payload: true })
    setTimeout(() => {
      loadIssue();
      customerdispatch({ type: "LOADING", payload: false })
    }, 1000)

    customerdispatch({ type: "SEARCH", payload: false })
  }, [customerstate.search, visible, pageCurrent]);


  useEffect(() => {
    if (customerstate.search) {

    }
  }, [customerstate.search])


  return (
    <MasterPage>
      <Row style={{ padding: "24px 24px 24px 24px", textAlign: "left" }}>
        <Col span={24}>
          <label style={{ fontSize: 20, verticalAlign: "top" }}>รายการแจ้งปัญหา</label>
        </Col>
      </Row>
      <IssueSearch />
      <Row>
        <Col span={24} style={{ padding: "0px 24px 0px 24px" }}>
          <Table dataSource={customerstate.issuedata.data} loading={customerstate.loading}
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
            pagination={{ pageSize: pageSize, total: pageTotal }}

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
                  </div>
                );
              }}
            />


            <Column title="Subject"
              render={(record) => {
                return (
                  <>
                    <div>
                      <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"}>
                        {record.Title}
                      </label>
                    </div>
                    <div>
                      <label
                        onClick={() => {
                          return (
                            customerdispatch({ type: "SELECT_DATAROW", payload: record }),
                            history.push({ pathname: "/customer/issue/subject/" + record.Id }),
                            (record.MailStatus !== "Read" ? UpdateStatusMailbox(record.MailBoxId) : "")
                          )
                        }
                        }
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
                    <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"}>
                      {
                        record.AssignIconDate === null ?
                          <label style={{fontSize:12, color:"red"}}>
                            ยังไม่ได้ส่งเรื่องให้ ICON
                          </label> :
                          <label>
                            {moment(record.AssignIconDate).format("DD/MM/YYYY")}<br />
                            {moment(record.AssignIconDate).format("HH:mm")}
                          </label>
                      }
                    </label>

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
                    {record.GroupStatus === "Wait For Progress" ? "" :
                      <label className="table-column-text">
                        {record.SLA === null ? "" : moment(record.SLA).format("DD/MM/YYYY")}<br />
                        {record.SLA === null ? "" : moment(record.SLA).format("HH:mm")}
                      </label>
                    }
                    <br />

                    {record.cntDueDate >= 1 ?
                      <Tag color="warning"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          customerdispatch({ type: "SELECT_DATAROW", payload: record })
                          setHistoryduedate_visible(true)
                        }
                        }
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
                  <label className="table-column-text">{record.ProgressStatus}</label>
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

      <ModalSendIssue
        title={ProgressStatus}
        visible={visible}
        onCancel={() => setVisible(false)}
        width={700}
        onOk={() => setVisible(false)}
        details={{
          ticketId: customerstate.issuedata.details[0] && customerstate.issuedata.details[0].Id,
          mailboxId: customerstate.issuedata.details[0] && customerstate.issuedata.details[0].MailBoxId,
          node_output_id: customerstate.node.output_data && customerstate.node.output_data.NodeOutputId,
          to_node_id: customerstate.node.output_data && customerstate.node.output_data.ToNodeId,
          to_node_action_id: customerstate.node.output_data && customerstate.node.output_data.ToNodeActionId,
          flowstatus: customerstate.node.output_data && customerstate.node.output_data.FlowStatus,
          flowaction: customerstate.node.output_data && customerstate.node.output_data.FlowAction
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
          refId: customerstate.issuedata.datarow.Id,
          reftype: "Master_Ticket",
          grouptype: "attachment"
        }}

      />


      {/* </Spin> */}
    </MasterPage >
  );
}
