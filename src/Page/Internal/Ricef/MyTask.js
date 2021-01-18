import React, { useEffect, useState, useContext } from 'react'
import { Table, Button, Row, Col, Tooltip, Tag } from 'antd';
import Column from 'antd/lib/table/Column';
import { HistoryOutlined, LeftCircleOutlined } from '@ant-design/icons';
import Axios from 'axios'
import moment from 'moment';
import MasterPage from '../MasterPage'
import { useRouteMatch, useHistory } from 'react-router-dom';
import AuthenContext from "../../../utility/authenContext";
import RicefSearch from "../../../Component/Search/Internal/ricefSearch";

export default function MyTask() {
    const match = useRouteMatch();
    const history = useHistory();
    const { state, dispatch } = useContext(AuthenContext);

    const [loading, setLoading] = useState(true);


    const [ricef, setRicef] = useState(null)


    const GetRicef = async (value) => {
        try {
            const details = await Axios({
                url: process.env.REACT_APP_API_URL + "/ricef/load-mytask",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },

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
        GetRicef()
    }, [])

    console.log("state", state?.usersdata?.organize?.OrganizeCode)

    return (
        <MasterPage>
            <Button type="link"
                onClick={() => history.goBack()}
            >
                <LeftCircleOutlined />

            </Button>

            <RicefSearch />


            <Table dataSource={ricef} loading={loading}>
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
                <Column align="center"
                    title={(state?.usersdata?.organize?.OrganizeCode === "dev" ? "Owner" : "Assignee")}
                    width="20%"
                    render={(record) => {
                        return (
                            <>
                                {record.OwnerName}<br />
                                <Tooltip title="Company"><Tag color="#f50">{record.CompanyName}</Tag></Tooltip>
                            </>
                        )
                    }
                    }
                />
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