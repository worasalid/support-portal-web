import React, { useEffect, useState, useContext } from 'react'
import { Table, Button, Row, Col, Form, Modal, Upload, Tooltip, Tag } from 'antd';
import Column from 'antd/lib/table/Column';
import { LeftCircleOutlined, HistoryOutlined } from '@ant-design/icons';
import Axios from 'axios'
import moment from 'moment';
import MasterPage from '../MasterPage'
import { useRouteMatch, useHistory } from 'react-router-dom';
import AuthenContext from "../../../utility/authenContext";
import RicefContext, { ricefReducer, ricefState } from "../../../utility/ricefContext";
import RicefSearch from "../../../Component/Search/Internal/ricefSearch";

export default function RicefDetails() {
    const match = useRouteMatch();
    const history = useHistory();
    const { state, dispatch } = useContext(AuthenContext);
    const { state: ricefstate, dispatch: ricefdispatch } = useContext(RicefContext);

    const [loading, setLoading] = useState(true);


    const [ricef, setRicef] = useState(null)
    const [company, setCompany] = useState(null);

    const GetCompany = async (value) => {
        try {
            const companyby_id = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/company",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    id: value
                }
            });
            if (companyby_id.status === 200) {
                setCompany(companyby_id.data)
            }
        } catch (error) {

        }
    }

    const GetRicef = async (value) => {
        try {
            const details = await Axios({
                url: process.env.REACT_APP_API_URL + "/ricef/load-ricef",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    batchid: value,
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
                setTimeout(() => {
                    setLoading(false)
                }, 500)

            }
        } catch (error) {

        }
    }

    useEffect(() => {
        GetCompany(match.params.compid)
       // GetRicef(match.params.batchid)

    }, [])

    useEffect(() => {
        ricefdispatch({ type: "LOADING", payload: true })
        setTimeout(() => {
            GetRicef(match.params.batchid)
            ricefdispatch({ type: "LOADING", payload: false })
        }, 1000)

        ricefdispatch({ type: "SEARCH", payload: false })
    }, [ricefstate.search]);


    return (
        <MasterPage>
            <div style={{ padding: "24px 24px 24px 24px" }}>
                <Row style={{ marginBottom: 30 }}>
                    <Col span={24}>
                        <Button type="link"
                            onClick={() => history.goBack()}
                        >
                            <LeftCircleOutlined style={{ fontSize: 30 }} title="Back" />
                        </Button>
                        <label style={{ fontSize: 20, verticalAlign: "top" }}>{company && company[0].FullNameTH}</label>
                    </Col>
                </Row>
                <RicefSearch />

                <Table dataSource={ricef} loading={ricefstate.loading}>
                    {/* <Column align="center" title="No" width="1%" dataIndex="RowNo" /> */}
                    <Column align="left" title="IssueNumber" width="5%" dataIndex=""

                        render={(record) => {
                            return (
                                <div>
                                    <label className="table-column-text">
                                        {record.IssueNumber}
                                    </label>

                                </div>
                            );
                        }}
                    />

                    <Column
                        title="Details"
                        width="14%"
                        render={(record) => {
                            return (
                                <div>
                                    <Row style={{ borderBottom: "1px dotted" }}>
                                        <Col span={10}>
                                            <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"} style={{ color: "#808080", fontSize: "10px" }}>
                                                Type :
                          </label>
                                        </Col>
                                        <Col span={14}>
                                            <label
                                                style={{ color: "#808080", fontSize: "10px" }}
                                            >
                                                {record.IssueType === 'ChangeRequest' ? "CR" : record.TypeName}
                                            </label>
                                        </Col>
                                    </Row>
                                    <Row style={{ borderBottom: "1px dotted" }}>
                                        <Col span={10}>
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
                                        <Col span={10}>
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
                                        <Col span={10}>
                                            <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"} style={{ color: "#808080", fontSize: "10px" }}>
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
                        width="35%"
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

                    <Column align="center" title="Owner" width="20%"
                        render={(record) => {
                            return (
                                <>
                                    <label className="table-column-text">
                                        {record.OwnerName}<br />
                                    </label>
                                    <label className="table-column-text">
                                        {record.OwnerName2}
                                    </label>
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
                        }
                        }
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
            </div>
        </MasterPage>
    )
}