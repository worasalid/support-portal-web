import React, { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "antd";
import { LeftCircleOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
import moment from "moment";
import Axios from "axios";
import MasterPage from "../MasterPage";
import { useHistory, useRouteMatch } from "react-router";

export default function ScriptSQL() {
    const { Column } = Table;
    const history = useHistory();
    const match = useRouteMatch();

    const [company, setCompany] = useState(null);

    const dataSource = [
        {
            key: '1',
            no: 'step 1',
            process: "Master_Ticket",
            description: "นำเข้าข้อมูล ticket"
        },
        {
            key: '2',
            no: 'step 2',
            process: "WF_Trans_Group",
            description: "นำเข้าข้อมูล สถานะของ ticket"
        },
        {
            key: '3',
            no: 'step 3',
            process: "WF_Trans_Node",
            description: "สร้าง Transaction node ผู้ใช้งาน"
        },
        {
            key: '4',
            no: 'step 4',
            process: "WF_Trans_MailBox",
            description: "สร้าง Transaction mail"
        },
        {
            key: '5',
            no: 'step 5',
            process: "Log_Ticket_Comment",
            description: "นำเข้าข้อมูล note ของแต่ละ ticket"
        },
    ];

    // function
    const GetCompany = async (value) => {
        try {
            const company = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/company",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    id: match.params.id
                }
            });
            if (company.status === 200) {
                setCompany(company.data)
            }

        } catch (error) {

        }
    }

    useEffect(() => {
        GetCompany()
    }, [])



    return (
        <MasterPage>
            <div style={{ padding: "24px 24px 24px 24px", textAlign: "left" }}>
                <Row>
                    <Col span={24}>
                        <Button
                            type="link"
                            icon={<LeftCircleOutlined />}
                            // style={{zIndex:99}}
                            style={{ fontSize: 18, padding: 0, backgroundColor: "white", width: "100%", textAlign: "left" }}
                            onClick={() => history.goBack()}
                        >
                            Back
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <label>
                            {company && company[0]?.FullNameTH}
                        </label>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <Table dataSource={dataSource}>
                            <Column title="No" width="10%" dataIndex="no" key="no" />
                            <Column title="Table" width="20%" dataIndex="process" key="process" />
                            <Column title="รายละเอียด" width="70%" dataIndex="description" key="description" />

                            <Column title="Action" width="70%" dataIndex="description" key="description"
                                render={(record) => {
                                    return (
                                        <>
                                            <Button type="link"
                                                icon={<ConsoleSqlOutlined style={{ fontSize: 24 }} />}
                                                onClick={() => {
                                                    alert("Insert")
                                                }}
                                            >
                                                Insert
                                            </Button>

                                            <Button type="link"
                                                icon={<ConsoleSqlOutlined style={{ fontSize: 24 }} />}
                                                onClick={() => {
                                                    alert("update")
                                                }}
                                            >
                                                Update
                                            </Button>
                                        </>
                                    )
                                }}
                            />
                        </Table>
                    </Col>
                </Row>
            </div>
        </MasterPage>
    )
}