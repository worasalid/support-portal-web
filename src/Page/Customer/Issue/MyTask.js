import { Button, Col, Dropdown, Menu, Row, Table, Typography, Tag, Divider, Select, DatePicker, Input, Tooltip } from "antd";

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


export default function InProgress() {
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const [loading, setLoadding] = useState(false);

  // const [customerstate, customerdispatch] = useReducer(customerReducer, customerState);
  const {state: customerstate, dispatch: customerdispatch } = useContext(IssueContext);
  const { state, dispatch } = useContext(AuthenContext);
  const [ProgressStatus, setProgressStatus] = useState("");
  const [mailboxid, setMailboxid] = useState();
  const [outputnode_id, setOutputnode_id] = useState()

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
          task: "mytask"
        }
      });

      if (results.status === 200) {
        customerdispatch({ type: "LOAD_ISSUE", payload: results.data })

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

  useEffect(() => {
    customerdispatch({ type: "LOADING", payload: true })
    setTimeout(() => {
      loadIssue();
      customerdispatch({ type: "LOADING", payload: false })
    }, 1000)

    customerdispatch({ type: "SEARCH", payload: false })
  }, [customerstate.search, visible]);

  return (
    // <IssueContext.Provider value={{ state: customerstate, dispatch: customerdispatch }}>
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
                          onClick={() => {
                            return (
                              customerdispatch({ type: "SELECT_DATAROW", payload: record }),
                              history.push({ pathname: "/Customer/Issue/Subject/" + record.Id })
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
                      <label className="table-column-text">
                        {new Date(record.CreateDate).toLocaleDateString('en-GB')}
                      </label>
                    </>
                  )
                }

                }
              />

              <Column title="Due Date" dataIndex="" />
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
                            setProgressStatus(x.item.props.children[1]);
                            setOutputnode_id(x.key)

                          }}
                        >

                          {customerstate.actionflow && customerstate.actionflow.map((x) => {
                            return (
                              <Menu.Item key={x.ToNodeId}>{x.TextEng}</Menu.Item>
                            )
                          })}
                        </Menu>
                      }
                      trigger="click"
                    >
                      <Button type="link"
                        onClick={() => {
                          getflow_output(record.TransId)

                          customerdispatch({ type: "SELECT_DATAROW", payload: record })
                          setMailboxid(record.MailId);
                        }}
                      >{record.GroupStatus}</Button>
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
        <ModalSendIssue
          title={ProgressStatus}
          visible={visible}
          onCancel={() => setVisible(false)}
          width={700}
          onOk={() => setVisible(false)}
          datarow={{ data: customerstate.issuedata.datarow, outputnode_id: outputnode_id }}
        />
        {/* </Spin> */}
      </MasterPage>
    // </IssueContext.Provider>
  );
}
