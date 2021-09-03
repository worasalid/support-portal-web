import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/charts';
import MasterPage from '../MasterPage'
import { Row, Col, Card, Spin, Table, Button } from 'antd';
import { PieChartOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

export default function AllDashBoard() {
    const history = useHistory();
    const [loading, setLoading] = useState(false)

    const dashBoardData =
        [
            {
                no: "1",
                dashboard_name: "DashBoard New Issue",
                description: "ดูข้อมูล New Issue ที่ลูกค้าแจ้งเข้ามา และ ยังไม่ได้ดำเนินการ (รายวัน)",
                url: "/internal/dashboard/dashboard1"
            },
            {
                no: "2",
                dashboard_name: "DashBoard All Site By Product",
                description: "ดูข้อมูล Issue ที่ค้างของแต่ละ site แยกตาม Product",
                url: "/internal/dashboard/dashboard2"
            },
            {
                no: "3",
                dashboard_name: "DashBoard All Site (OverDue) By Product",
                description: "ดูข้อมูล Issue ที่ค้างและเกิน SLA ของแต่ละ site แยกตาม Product",
                url: "/internal/dashboard/dashboard3"
            },
            {
                no: "4",
                dashboard_name: "DashBoard By Team",
                description: "ดูข้อมูล Issue ที่ค้างเป็นรายทีม",
                url: "/internal/dashboard/dashboard4"
            }
        ]

    useEffect(() => {

    }, [])

    return (
        <MasterPage>
            <Spin spinning={loading}>
                <Row gutter={16} style={{ padding: "24px 24px 24px 24px" }}>
                    <Col span={24}>
                        <h1>รายการ Dash Board</h1>
                    </Col>

                </Row>
                <Row gutter={16} style={{ padding: "10px 24px 24px 24px" }}>
                    <Col span={24}>
                        <Table dataSource={dashBoardData} >
                            <Column title="No" align="left"
                                width="5%"
                                render={(record, row, index) => {
                                    return (
                                        <label className="table-column-text12">
                                            {record.no}
                                        </label>
                                    )
                                }}
                            />
                            <Column title="Dash Board Name" align="left"
                                width="35%"
                                render={(record, row, index) => {
                                    return (
                                        <label className="table-column-text12">
                                            {record.dashboard_name}
                                        </label>
                                    )
                                }}
                            />
                            <Column title="Description" align="left"
                                width="50%"
                                render={(record, row, index) => {
                                    return (
                                        <label className="table-column-text12">
                                            {record.description}
                                        </label>
                                    )
                                }}
                            />
                            <Column align="center"
                                width="10%"
                                render={(record, row, index) => {
                                    return (
                                        <>
                                            <Button type="link" icon={<PieChartOutlined />}
                                                onClick={() => history.push({ pathname: record.url })}
                                            />
                                        </>
                                    )
                                }}
                            />

                        </Table>
                    </Col>
                </Row>
            </Spin>
        </MasterPage>
    )
}
