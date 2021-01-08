import React, { useEffect, useState, useRef } from 'react'
import { Table, Button, Row, Col, Form, Modal, Upload } from 'antd';
import Column from 'antd/lib/table/Column';
import { EditOutlined, LeftCircleOutlined, UploadOutlined } from '@ant-design/icons';
import Axios from 'axios'
import moment from 'moment';
import MasterPage from '../MasterPage'
import { useRouteMatch, useHistory } from 'react-router-dom';

export default function RicefDetails() {
    const match = useRouteMatch();
    const history = useHistory();

    const [loading, setLoading] = useState(true);
    const [ricef, setRicef] = useState(null)

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
        GetRicef(match.params.batchid)

    }, [])

    return (
        <MasterPage>
            <Button type="link"
                onClick={() => history.goBack()}
            ><LeftCircleOutlined /></Button>


            <Table dataSource={ricef} loading={loading}>
                {/* <Column align="center" title="No" width="1%" dataIndex="RowNo" /> */}
                <Column align="center" title="IssueNumber" width="20%" dataIndex="IssueNumber" />
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
                                                history.push({ pathname: "/internal/ricef/subject-" + record.Id })

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
                <Column align="center" title="Owner" width="20%" dataIndex="Owner" />
                <Column align="center" title="Progress" width="20%" dataIndex="Status" />
            </Table>
        </MasterPage>
    )
}