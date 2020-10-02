import { Button, Col, Dropdown, Menu, Row, Table, Typography, Tag, Divider, Select, DatePicker, Input, Tooltip } from "antd";

import Axios from "axios";
import React, { useEffect, useState, useContext, useReducer } from "react";
import { useHistory } from "react-router-dom";
import ModalSendIssue from "../../../Component/Dialog/Customer/modalSendIssue";
import IssueSearch from "../../../Component/Search/Customer/IssueSearch";
import MasterPage from "../MasterPage";
import Column from "antd/lib/table/Column";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import AuthenContext from "../../../utility/authenContext";
import IssueContext, { customerReducer, customerState } from "../../../utility/issueContext";
import { issueCusReducer, productReducer, moduleReducer, issueTypeReducer, keywordReducer, initState } from "../../../utility/reducer";
import DuedateLog from "../../../Component/Dialog/Customer/duedateLog";

export default function InProgress() {
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const [historyduedate_visible, setHistoryduedate_visible] = useState(false);
  const [loading, setLoadding] = useState(false);

  const [customerstate, customerdispatch] = useReducer(customerReducer, customerState);
  const [ticketid, setTicketid] = useState(null);

  const { state, dispatch } = useContext(AuthenContext);


  const [ProgressStatus, setProgressStatus] = useState("");


  let page = {
    data: {
      ProgressStatusData: [
        {
          text: "InProgress",
          value: "InProgress",
        },
        {
          text: "Cancel",
          value: "Complete",
        },
        {
          text: "Complete",
          value: "Complete",
        },
      ],
    },
    loaddata: {
      loadProgressStatus: [],
    },
  };

  const loadIssue = async (value) => {
    // setLoadding(true);
    try {
      const results = await Axios({
        url: process.env.REACT_APP_API_URL + "/tickets/load",
        method: "GET",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },
        params: {
          issue_type: customerstate.filter.TypeState,
          productId: customerstate.filter.productState,
          moduleId: customerstate.filter.moduleState,
          startdate: customerstate.filter.date.startdate,
          enddate: customerstate.filter.date.enddate,
          priority: customerstate.filter.priorityState,
          keyword: customerstate.filter.keyword,
          task: "inprogress"
        }
      });

      if (results.status === 200) {
        customerdispatch({ type: "LOAD_ISSUE", payload: results.data })

      }
    } catch (error) {

    }
  };

  useEffect(() => {
    customerdispatch({ type: "LOADING", payload: true })
    setTimeout(() => {
      loadIssue();
      customerdispatch({ type: "LOADING", payload: false })
    }, 1000)


    customerdispatch({ type: "SEARCH", payload: false })
  }, [customerstate.search]);

  return (
    <IssueContext.Provider value={{ state: customerstate, dispatch: customerdispatch }}>
      <MasterPage>
        <Row style={{ marginBottom: 16, textAlign: "left" }}>
          <Col span={24}>
            <label style={{ fontSize: 20, verticalAlign: "top" }}>รายการแจ้งปัญหา</label>
          </Col>
        </Row>
        <IssueSearch />
        <Row>
          <Col span={24}>
            <Table dataSource={customerstate.issuedata.data} loading={customerstate.loading}  >

              <Column
                title="Issue No"
                width="25%"
                render={(record) => {
                  return (
                    <div>
                      {/* <a href="/#"
                        onClick={(e) => {
                          e.preventDefault();
                          history.push({
                            pathname: "/Customer/Issue/Subject/" + record.Id,
                          });
                        }}
                      >
                      
                      </a> */}
                      <label className="table-column-text">{record.Number}</label>
                      <div style={{ marginTop: 10, fontSize: "smaller" }}>
                        {
                          record.IssueType === 'Bug' ?
                            <Tooltip title="Issue Type"><Tag color="#f50">{record.IssueType}</Tag></Tooltip> :
                            <Tooltip title="Issue Type"><Tag color="#108ee9">{record.IssueType}</Tag></Tooltip>
                        }
                        <Divider type="vertical" />
                        <Tooltip title="Product"><Tag color="#808080">{record.ProductName}</Tag></Tooltip>
                        <Divider type="vertical" />
                        <Tooltip title="Module"><Tag color="#808080">{record.ModuleName}</Tag></Tooltip>
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
                        <label className="table-column-text">{record.Title}</label>
                      </div>
                      <div>
                        <label
                          onClick={() => history.push({ pathname: "/Customer/Issue/Subject/" + record.Id })}
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
                      <label className="table-column-text">
                        {new Date(record.CreateDate).toLocaleDateString('en-GB')}
                      </label>
                    </>
                  )
                }

                }
              />

              <Column title="Due Date"
                align="center"
                render={(record) => {
                  return (
                    <>
                      <label className="table-column-text">
                        {record.DueDate === null ? "" : new Date(record.DueDate).toLocaleDateString('en-GB')}
                      </label>
                      <br />
                      {record.cntDueDate > 1 ?
                        <Tag style={{ marginLeft: 16 }} color="warning"
                          onClick={() => {
                            return (
                              setTicketid(record.Id),
                              setHistoryduedate_visible(true))
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
                    <Dropdown
                      overlayStyle={{
                        width: 300,
                        boxShadow:
                          "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.31) 0px 0px 1px",
                      }}
                      overlay={
                        <Menu
                          onSelect={(x) => console.log(x.selectedKeys)}
                          onClick={(x) => {
                            setVisible(true);
                            setProgressStatus(x.key);
                          }}
                        >
                          {page.data.ProgressStatusData.filter(
                            (x) => x.text !== record.GroupStatus
                          ).map((x) => (
                            <Menu.Item key={x.text}>{x.text}</Menu.Item>
                          ))}
                        </Menu>
                      }
                      trigger="click"
                    >
                      {/* <Button type="link">{record.ProgressStatus}</Button> */}
                      <a href="/#">{record.GroupStatus}</a>
                    </Dropdown>
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
                        onClick={() => window.open(process.env.REACT_APP_FILE_DOWNLOAD_URL + '/' + record.FileId, "_blank")}
                      >
                        {record.FileId === null ? "" : <DownloadOutlined style={{ fontSize: 30, color: "#007bff" }} />}
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
            ticketId: ticketid
          }}
        >
        </DuedateLog>

        {/* <ModalSendIssue
          title={ProgressStatus}
          visible={visible}
          onCancel={() => setVisible(false)}
          onOk={() => {
            setVisible(false);
            loadIssue();
          }}
        /> */}
        {/* </Spin> */}
      </MasterPage>
    </IssueContext.Provider>
  );
}
