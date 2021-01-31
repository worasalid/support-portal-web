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
            <Button type="link"
                onClick={() => history.goBack()}
            >
                <LeftCircleOutlined />

            </Button>

            <RicefSearch />


            <Table dataSource={ricef} loading={ricefstate.loading}>
                {/* <Column align="center" title="No" width="1%" dataIndex="RowNo" /> */}
                <Column align="left" title="IssueNumber" width="20%" dataIndex=""
                    render={(record) => {
                        return (
                            <div>
                                <label className="table-column-text">
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

                                <Tooltip title="Company"><Tag color="#f50">{record.CompanyName}</Tag></Tooltip>
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


        </MasterPage>
    )
}