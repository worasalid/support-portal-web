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
import { DownloadOutlined } from "@ant-design/icons";
import AuthenContext from "../../../utility/authenContext";
import IssueContext, { userReducer, userState } from "../../../utility/issueContext";
import MasterContext from "../../../utility/masterContext";
import DuedateLog from "../../../Component/Dialog/Internal/duedateLog";
import ModalQA from "../../../Component/Dialog/Internal/modalQA";
import ModalFileDownload from "../../../Component/Dialog/Internal/modalFileDownload";

export default function Cancel() {
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
  const [pageCurrent,setPageCurrent] = useState(1);
  const [pageSize,setPageSize] = useState(10);
  const [pageTotal,setPageTotal] = useState(0);
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
    userdispatch({ type: "LOAD_ACTION_FLOW", payload: flow_output.data })
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
        <Row style={{ marginBottom: 16, textAlign: "left" }}>
          <Col span={24}>
            <label style={{ fontSize: 20, verticalAlign: "top" }}>รายการแจ้งปัญหา</label>
          </Col>
        </Row>
        <IssueSearch />
        <Row>
          <Col span={24}>
            <Table dataSource={userstate.issuedata.data} loading={userstate.loading}
              // scroll={{y:350}}
              pagination={{ pageSize: pageSize, total:pageTotal }}
              style={{ padding: "5px 5px" }}
              onChange={(x) => {return( setPageCurrent(x.current), setPageSize(x.pageSize))} }
              footer={(x) => {
                return (
                  <>
                  <div style={{textAlign:"right"}}>
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
                title="Issue No"
                width="20%"
                render={(record) => {
                  return (
                    <div>
                      {/* <label className={record.MailStatus === "Read" ? "table-column-text" : "table-column-text-unread"}> */}
                      <label>
                        {record.Number}
                      </label>

                      <div style={{ marginTop: 10, fontSize: "smaller" }}>
                        {
                          record.IssueType === 'ChangeRequest' ?
                            <Tooltip title="Issue Type"><Tag color="#108ee9">CR</Tag></Tooltip> :
                            <Tooltip title="Issue Type"><Tag color="#108ee9">{record.IssueType}</Tag></Tooltip>
                        }
                         <Tooltip title="Priority"><Tag color="#808080">{record.Priority}</Tag></Tooltip>
                        {/* <Divider type="vertical" /> */}
                        <Tooltip title="Product"><Tag color="#808080">{record.ProductName}</Tag></Tooltip>
                        {/* <Divider type="vertical" /> */}
                        <Tooltip title="Module"><Tag color="#808080">{record.ModuleName}</Tag></Tooltip>
                      </div>
                    </div>
                  );
                }}
              />

              <Column title="Subject"
                width="30%"
                render={(record) => {
                  return (
                    <>
                      <div>
                        {/* <label className={record.MailStatus === "Read" ? "table-column-text" : "table-column-text-unread"}> */}
                        <label>
                          {record.Title}
                        </label>
                      </div>
                      <div>
                        <label
                          onClick={() => {
                            return (
                              history.push({ pathname: "/internal/issue/subject/" + record.Id })
                              // ,(record.MailStatus !== "Read" ? UpdateStatusMailbox(record.MailBoxId) : "")
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
                width="10%"
                render={(record) => {
                  return (
                    <>

                      <div>
                        {/* <label className={record.MailStatus === "Read" ? "table-column-text" : "table-column-text-unread"}> */}
                        <label>
                          {record.CreateBy}
                        </label>
                      </div>

                      <div>
                        {/* <label className={record.MailStatus === "Read" ? "table-column-text" : "table-column-text-unread"}> */}
                        <label>
                          {new Date(record.CreateDate).toLocaleDateString('en-GB')}
                        </label>
                      </div>
                      <Tooltip title="Company"><Tag color="#f50">{record.CompanyName}</Tag></Tooltip>

                    </>
                  )
                }

                }
              />
              {/* <Column
                title="Assignee"
                align="center"
                width="10%"
                dataIndex="Assignee"
              ></Column> */}
              <Column title="Due Date"
               width="10%"
                align="center"
                render={(record) => {
                  return (
                    <>
                      {/* <label className={record.MailStatus === "Read" ? "table-column-text" : "table-column-text-unread"}> */}
                      <label>
                        {record.DueDate === null ? "" : new Date(record.DueDate).toLocaleDateString('en-GB')}
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
                    <>
                      {/* <label className={record.MailStatus === "Read" ? "table-column-text" : "table-column-text-unread"}> */}
                      <div>
                        <label>
                          {record.FlowStatus}
                        </label>
                      </div>
                      <div>
                        {record.CompleteDate === null ? "" : new Date(record.CompleteDate).toLocaleDateString('en-GB')}
                      </div>
                    </>
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
