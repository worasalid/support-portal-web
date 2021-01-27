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
        GetRicef(match.params.batchid)

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
                <Column align="left" title="IssueNumber" width="20%" dataIndex=""

                    render={(record) => {
                        return (
                            <div>
                                <label>
                                    {record.IssueNumber}
                                </label>

                                <div style={{ marginTop: 10, fontSize: "smaller" }}>
                                    {
                                        record.IssueType === 'ChangeRequest' ?
                                            <Tooltip title="Issue Type"><Tag color="#108ee9">CR</Tag></Tooltip> :
                                            <Tooltip title="Issue Type"><Tag color="#f50">{record.TypeName}</Tag></Tooltip>
                                    }

                                    <Tooltip title="Priority"><Tag color="#808080">{record.Priority}</Tag></Tooltip>

                                    {/* <Divider type="vertical" /> */}
                                    <Tooltip title="Module"><Tag color="#808080">{record.ModuleName}</Tag></Tooltip>
                                </div>
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
             
                <Column align="center" title="Owner" width="20%" dataIndex="OwnerName" />
               
                <Column align="center" title="Progress" width="5%" dataIndex="Status" />
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


        </MasterPage>
    )
}