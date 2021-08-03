import React, { useEffect, useState, useContext } from 'react'
import { Table, Button, Row, Col, Tooltip, Tag, Select } from 'antd';
import Column from 'antd/lib/table/Column';
import { HistoryOutlined, LeftCircleOutlined } from '@ant-design/icons';
import Axios from 'axios'
import moment from 'moment';
import MasterPage from '../MasterPage'
import { useRouteMatch, useHistory } from 'react-router-dom';
import AuthenContext from "../../../utility/authenContext";
import RicefSearch from "../../../Component/Search/Internal/ricefSearch";
import RicefContext, { ricefReducer, ricefState } from "../../../utility/ricefContext";

export default function InProgress() {
    const match = useRouteMatch();
    const history = useHistory();
    const { state, dispatch } = useContext(AuthenContext);
    const { state: ricefstate, dispatch: ricefdispatch } = useContext(RicefContext);

    const [ricef, setRicef] = useState(null)


    const GetRicef = async (value) => {
        try {
            const details = await Axios({
                url: process.env.REACT_APP_API_URL + "/ricef/load-inprogress",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    companyid: ricefstate.filter.companyState,
                    issuetype: ricefstate.filter.typeState,
                    productid: ricefstate.filter.productState,
                    moduleid: ricefstate.filter.moduleState,
                    progress: ricefstate.filter.progressState,
                    startdate: ricefstate.filter.date.startdate === "" ? "" : moment(ricefstate.filter.date.startdate, "DD/MM/YYYY").format("YYYY-MM-DD"),
                    enddate: ricefstate.filter.date.enddate === "" ? "" : moment(ricefstate.filter.date.enddate, "DD/MM/YYYY").format("YYYY-MM-DD"),
                    keyword: ricefstate.filter.keyword,
                }

            });
            if (details.status === 200) {
                setRicef(details.data)


            }
        } catch (error) {

        }
    }

    useEffect(() => {
        GetRicef()
    }, [])

    useEffect(() => {
        ricefdispatch({ type: "LOADING", payload: true })
        setTimeout(() => {
            GetRicef();
            ricefdispatch({ type: "LOADING", payload: false })
        }, 1000)

        ricefdispatch({ type: "SEARCH", payload: false })
    }, [ricefstate.search]);


    return (
        <MasterPage>
            {/* <Button type="link"
                onClick={() => history.goBack()}
            >
                <LeftCircleOutlined />

            </Button>

            <RicefSearch /> */}
            <Row style={{ padding: "24px 24px 24px 24px", textAlign: "left" }}>
                <Col span={24}>
                    <label style={{ fontSize: 20, verticalAlign: "top" }}>GAP Document</label>
                </Col>
            </Row>
            <RicefSearch Company="show" />

            <Row>
                <Col span={24} style={{ padding: "0px 24px 0px 24px" }}>
                    <Table dataSource={ricef} loading={ricefstate.loading}>
                        {/* <Column align="center" title="No" width="1%" dataIndex="RowNo" /> */}
                        <Column
                            title="IssueNo"
                            width="5%"
                            render={(record) => {
                                return (
                                    <>
                                        <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"}>
                                            {record.IssueNumber}
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
                                                <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"} style={{ color: "#808080" }}>
                                                    Type :
                          </label>
                                            </Col>
                                            <Col span={14}>
                                                <label
                                                    style={{ color: "#808080", fontSize: "10px" }}
                                                >
                                                    {record.TypeName === 'ChangeRequest' ? "CR" : record.TypeName}
                                                </label>
                                            </Col>
                                        </Row>
                                        <Row style={{ borderBottom: "1px dotted" }}>
                                            <Col span={8}>
                                                <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"} style={{ color: "#808080", fontSize: "10px" }}>
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
                                                <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"} style={{ color: "#808080", fontSize: "10px" }}>
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
                                                <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"} style={{ color: "#808080", fontSize: "10px" }}>
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


                        <Column title="Subject" width="35%"
                            render={(record) => {
                                return (
                                    <>
                                        <div>
                                            <label className="table-column-text">
                                                {record.Title}
                                            </label>
                                        </div>
                                        <div>
                                            <label
                                                onClick={() => {
                                                    return (
                                                        history.push({ pathname: "/internal/ricef/subject-" + record.RicefId })

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
                        <Column align="center" width="20%"
                            title={(state?.usersdata?.organize?.OrganizeCode === "dev" ? "Owner" : "Assignee")}
                            render={(record) => {
                                return (
                                    <>
                                        <label className="table-column-text">
                                            {record.AssigneeName}<br />
                                        </label>

                                        <Tooltip title="Company"><Tag color="#17a2b8">{record.CompanyName}</Tag></Tooltip>
                                    </>
                                )
                            }
                            }
                        />
                        <Column align="center" title="Progress" width="5%"
                            render={(record) => {
                                return (
                                    <>
                                        <label className="table-column-text">
                                            {record.Status}
                                        </label>
                                    </>
                                )
                            }}

                        />
                        <Column title={<HistoryOutlined style={{ fontSize: 30 }} />}
                            width="20%"
                            align="center"
                            render={(record) => {
                                return (
                                    <>
                                        <Row style={{ textAlign: "right" }}>
                                            <Col span={12}>
                                                <label className="value-text">Due Date</label>
                                            </Col>
                                            <Col span={12}>
                                                <label className="value-text">{moment(record.DueDate).format("DD/MM/YYYY")}</label>
                                            </Col>
                                        </Row>
                                        <Row style={{ textAlign: "right" }}>
                                            <Col span={12}>
                                                <label className="value-text">Assign Date</label>
                                            </Col>
                                            <Col span={12}>
                                                <label className="value-text">
                                                    {record.AssignDate === "" ? "-" : moment(record.AssignDate).format("DD/MM/YYYY")}
                                                </label>
                                            </Col>
                                        </Row>
                                        <Row style={{ textAlign: "right" }}>
                                            <Col span={12}>
                                                <label className="value-text">Resolved Date</label>
                                            </Col>
                                            <Col span={12}>
                                                <label className="value-text">
                                                    {record.ResolvedDate === "" ? "-" : moment(record.ResolvedDate).format("DD/MM/YYYY")}
                                                </label>

                                            </Col>
                                        </Row>
                                        <Row style={{ textAlign: "right" }}>
                                            <Col span={12}>
                                                <label className="value-text"> Complete Date</label>
                                            </Col>
                                            <Col span={12}>
                                                <label className="value-text">
                                                    {record.CompleteDate === "" ? "-" : moment(record.CompleteDate).format("DD/MM/YYYY")}
                                                </label>

                                            </Col>
                                        </Row>
                                    </>
                                )
                            }
                            }
                        />
                    </Table>
                </Col>
            </Row>
        </MasterPage>
    )
}