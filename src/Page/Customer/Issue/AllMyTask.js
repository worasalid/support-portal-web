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
import IssueContext, { customerReducer, customerState } from "../../../utility/issueContext";
import DuedateLog from "../../../Component/Dialog/Customer/duedateLog";
import ModalFileDownload from "../../../Component/Dialog/Customer/modalFileDownload";




export default function AllMyTask() {
  const history = useHistory();
  const [loading, setLoadding] = useState(false);

  // modal
  const [visible, setVisible] = useState(false);
  const [historyduedate_visible, setHistoryduedate_visible] = useState(false);
  const [modalfiledownload_visible, setModalfiledownload_visible] = useState(false);

  // data
  const { state: customerstate, dispatch: customerdispatch } = useContext(IssueContext);
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
          progress: customerstate.filter.progress,
          keyword: customerstate.filter.keyword,
          task: "allmytask",
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

  const getflow_output = async (value) => {
    const flow_output = await Axios({
      url: process.env.REACT_APP_API_URL + "/workflow/action_flow",
      method: "GET",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
      },
      params: {
        trans_id: value
      }
    });
    customerdispatch({ type: "LOAD_ACTION_FLOW", payload: flow_output.data })
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

  useEffect(() => {
    //customerdispatch({ type: "CLEAR_FILTER", payload: {} })
  }, []);


  useEffect(() => {
    customerdispatch({ type: "LOADING", payload: true })
    setTimeout(() => {
      loadIssue();
      customerdispatch({ type: "LOADING", payload: false })
    }, 1000)

    customerdispatch({ type: "SEARCH", payload: false })
  }, [customerstate.search, visible, pageCurrent]);


  return (
    <MasterPage>
      <Row style={{ marginBottom: 16, textAlign: "left" }}>
        <Col span={24}>
          <label style={{ fontSize: 20, verticalAlign: "top" }}>รายการแจ้งปัญหา</label>
        </Col>
      </Row>
      <IssueSearch Progress="show" />
      <Row>
        <Col span={24}>
          <Table dataSource={customerstate.issuedata.data} loading={customerstate.loading}
            footer={(x) => {
              return (
                <>
                  <div style={{ textAlign: "right" }}>
                    <label>จำนวนเคส : </label>
                    <label>{x.length}</label>
                    <label> / จากทั้งหมด : </label>
                    <label>{pageTotal}</label>
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
              title="Issue No"
              width="25%"

              render={(record, index) => {
                return (
                  <div>
                    <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"}>
                      {record.Number}
                    </label>
                    <div style={{ marginTop: 10, fontSize: "smaller" }}>
                      <Tooltip title="Issue Type">
                        <Tag color={record.IssueType === 'Bug' ? "#f50" : "#108ee9"} >
                          <label style={{ fontSize: "10px" }}>
                            {record.IssueType}
                          </label>
                        </Tag>
                      </Tooltip>
                      {/* <Divider type="vertical" /> */}
                      <Tooltip title="Priority">
                        <Tag color="#808080">
                          <label style={{ fontSize: "10px" }}>
                            {record.Priority}
                          </label>
                        </Tag>
                      </Tooltip>
                      {/* <Divider type="vertical" /> */}
                      <Tooltip title="Product">
                        <Tag color="#808080">
                          <label style={{ fontSize: "10px" }}>
                            {record.ProductName}
                          </label>
                        </Tag>
                      </Tooltip>
                      {/* <Divider type="vertical" /> */}
                      <Tooltip title="Module">
                        <Tag color="#808080">
                          <label style={{ fontSize: "10px" }}>
                            {record.ModuleName}
                          </label>
                        </Tag>
                      </Tooltip>
                    </div>
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
                      {moment(record.CreateDate).format("DD/MM/YYYY")}<br />
                      {moment(record.CreateDate).format("HH:mm")}
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
