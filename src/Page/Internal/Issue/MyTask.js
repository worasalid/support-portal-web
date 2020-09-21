import { Button, Col, Dropdown, Menu, Row, Table, Typography, Tag, Divider, Select, DatePicker, Input, Tooltip } from "antd";

import Axios from "axios";
import React, { useEffect, useState, useContext, useReducer } from "react";
import { useHistory } from "react-router-dom";
import ModalSupport from "../../../Component/Dialog/Internal/modalSupport";
import IssueSearch from "../../../Component/Search/Internal/IssueSearch";
import MasterPage from "../MasterPage";
import Column from "antd/lib/table/Column";
import { DownloadOutlined } from "@ant-design/icons";
import AuthenContext from "../../../utility/authenContext";
import IssueContext, { userReducer, userState } from "../../../utility/issueContext";
import MasterContext from "../../../utility/masterContext";

export default function Mytask() {
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const [loading, setLoadding] = useState(false);

  const [userstate, userdispatch] = useReducer(userReducer, userState);
  const { state, dispatch } = useContext(AuthenContext);
  const { state: masterstate, dispatch: masterdispatch } = useContext(MasterContext);
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
          companyId: userstate.filter.companyState,
          issue_type: userstate.filter.TypeState,
          productId: userstate.filter.productState,
          moduleId: userstate.filter.moduleState,
          startdate: userstate.filter.date.startdate,
          enddate: userstate.filter.date.enddate,
          keyword: userstate.filter.keyword,
          task: "mytask"
        }
      });

      if (results.status === 200) {
      
        masterdispatch({ type: "COUNT_MYTASK", payload: results.data.length })
        userdispatch({ type: "LOAD_ISSUE", payload: results.data })
      }
    } catch (error) {

    }
  };

  useEffect(() => {
    userdispatch({ type: "LOADING", payload: true })
    setTimeout(() => {
      loadIssue();
      userdispatch({ type: "LOADING", payload: false })
    }, 1000)


    userdispatch({ type: "SEARCH", payload: false })
  }, [userstate.search]);

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
              style={{ padding: "5px 5px" }}
            >

              <Column
                title="Issue No"
                width="20%"
                render={(record) => {
                  return (
                    <div>
                      <label className="table-column-text">{record.Number}</label>
                      <div style={{ marginTop: 10, fontSize: "smaller" }}>
                        {
                          record.IssueType === 'ChangeRequest' ?
                            <Tooltip title="Issue Type"><Tag color="#108ee9">CR</Tag></Tooltip> :
                            <Tooltip title="Issue Type"><Tag color="#108ee9">{record.IssueType}</Tag></Tooltip>
                        }
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
                render={(record) => {
                  return (
                    <>
                      <div>
                        <label className="table-column-text">{record.Title}</label>
                      </div>
                      <div>
                        <label
                          onClick={() => history.push({ pathname: "/internal/issue/subject/" + record.Id })}
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
                        <label className="table-column-text">
                          {record.CreateBy}
                        </label>
                      </div>

                      <div>
                        <label className="table-column-text">
                          {new Date(record.CreateDate).toLocaleDateString('en-GB')}
                        </label>
                      </div>
                      <Tooltip title="Company"><Tag color="#f50">{record.CompanyName}</Tag></Tooltip>

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
        <ModalSupport
          title={ProgressStatus}
          visible={visible}
          onCancel={() => setVisible(false)}
          onOk={() => {
            setVisible(false);
            loadIssue();
          }}
        />
        {/* </Spin> */}
      </MasterPage>
    </IssueContext.Provider>
  );
}
