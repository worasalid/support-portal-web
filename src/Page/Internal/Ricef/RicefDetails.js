import React, { useEffect, useState, useContext } from 'react'
import { Table, Button, Row, Col, Form, Modal, Upload, Tooltip, Tag } from 'antd';
import Column from 'antd/lib/table/Column';
import { CloudUploadOutlined, DownloadOutlined, EditOutlined, LeftCircleOutlined, UploadOutlined } from '@ant-design/icons';
import Axios from 'axios'
import moment from 'moment';
import MasterPage from '../MasterPage'
import { useRouteMatch, useHistory } from 'react-router-dom';
import AuthenContext from "../../../utility/authenContext";

export default function RicefDetails() {
    const match = useRouteMatch();
    const history = useHistory();
    const { state, dispatch } = useContext(AuthenContext);

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
                    batchid: value
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

    console.log("organize", state)

    return (
        <MasterPage>
            <Button type="link"
                onClick={() => history.goBack()}
            >
                <LeftCircleOutlined />

            </Button>
            <Row style={{ marginBottom: 30 }}>
                <Col span={24}>
                    <label style={{ fontSize: 20, verticalAlign: "top" }}>{company && company[0].FullNameTH}</label>
                </Col>
            </Row>


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
                    width="30%"
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
                <Column align="center" title="DueDate" width="10%" dataIndex=""
                    render={(record) => {
                        return (
                            moment(record.DueDate).format("DD/MM/YYYY")
                        )
                    }
                    }
                />
                <Column align="center" title="Owner" width="20%" dataIndex="OwnerName" />
                <Column align="center" title="Assignee" width="20%" dataIndex=""
                    render={(record) => {
                        return (
                            <>
                             {record.Assignee}  <br />
                             {moment(record.AssignDate).format("DD/MM/YYYY")}
                           </>
                        )
                    }
                    }
                />
                <Column align="center" title="Progress" width="10%" dataIndex="Status" />
                {/* <Column title={<DownloadOutlined style={{ fontSize: 30 }} />}
                    width="10%"
                    align="center"
                    render={(record) => {
                        return (
                            <>
                                <Button type="link"
                                    // onClick={() => window.open(process.env.REACT_APP_FILE_DOWNLOAD_URL + '/' + record.FileId, "_blank")}
                                    onClick={() => {
                                        return (
                                            <>
                                            </>
                                            // setModalfiledownload_visible(true)
                                        )
                                    }
                                    }
                                >

                                </Button>
                            </>
                        )
                    }
                    }
                /> */}
            </Table>


        </MasterPage>
    )
}