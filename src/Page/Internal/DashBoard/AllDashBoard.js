import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/charts';
import MasterPage from '../MasterPage'
import { Row, Col, Input, Spin, Table, Button } from 'antd';
import { PieChartOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

export default function AllDashBoard() {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [filterDashBoard, setFilterDashBoard] = useState(null)

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
                dashboard_name: "DashBoard All Issue",
                description: "ข้อมูล Issue ทั้งหมดในระบบ",
                url: "/internal/dashboard/allissue"
            },
            {
                no: "3",
                dashboard_name: "DashBoard All Site By Product",
                description: "ดูข้อมูล Issue ทุกสถานะ ของแต่ละ site แยกตาม Product และ Module",
                url: "/internal/dashboard/dashboard2"
            },
            {
                no: "4",
                dashboard_name: "DashBoard All Site (OverDue) By Product",
                description: "ดูข้อมูล Issue ที่ค้างและเกิน SLA ของแต่ละ site แยกตาม Product และ Module",
                url: "/internal/dashboard/dashboard3"
            },
            {
                no: "5",
                dashboard_name: "DashBoard By Team",
                description: "ดูข้อมูล Issue ที่ค้างเป็นรายทีม",
                url: "/internal/dashboard/dashboard4"
            },
            {
                no: "6",
                dashboard_name: "DashBoard Satisfaction",
                description: "ดูข้อมูล ความพึงพอใจของลูกค้า",
                url: "/internal/dashboard/dashboard5"
            },
            {
                no: "7",
                dashboard_name: "DashBoard CMMI1",
                description: "สรุปจำนวนการให้บริการ รายปี",
                url: "/internal/dashboard/cmmi/dashboard_cmmi1"
            },
            {
                no: "8",
                dashboard_name: "DashBoard CMMI2",
                description: "สรุปจำนวนการให้บริการ แยกตามประเภท Priority รายปี",
                url: "/internal/dashboard/cmmi/dashboard_cmmi2"
            },
            {
                no: "9",
                dashboard_name: "DashBoard CMMI3",
                description: "รายงานสรุปและวิเคราะห์บริการ แยกตาม Product และ Priority",
                url: "/internal/dashboard/cmmi/dashboard_cmmi3"
            },
            {
                no: "10",
                dashboard_name: "DashBoard CMMI4",
                description: "รายงานสถิติการให้บริการ แยกตาม Product และ Priority",
                url: "/internal/dashboard/cmmi/dashboard_cmmi4"
            },
            {
                no: "11",
                dashboard_name: "DashBoard CMMI5",
                description: "รายงานสรุปจำนวนการ Login เข้าใช้งานระบบ (Summary)",
                url: "/internal/dashboard/cmmi/dashboard_cmmi5"
            },
            {
                no: "12",
                dashboard_name: "DashBoard CMMI5_1",
                description: "รายงานสรุปจำนวนการ Login เข้าใช้งานระบบ (Detail)",
                url: "/internal/dashboard/cmmi/dashboard_cmmi5_1"
            },
            {
                no: "13",
                dashboard_name: "DashBoard TimeSheet1",
                description: "รายงานสรุปจำนวนวัน ที่ใช้แก้ไข และ พัฒนา ของทีม Developer",
                url: "/internal/dashboard/timesheet1"
            },
            {
                no: "14",
                dashboard_name: "DashBoard TimeSheet2",
                description: "รายงานสรุป รายละเอียด เวลาที่ใช้พัฒนา ของทีม Developer",
                url: "/internal/dashboard/timesheet2"
            },
            {
                no: "15",
                dashboard_name: "DashBoard TimeSheet3",
                description: "รายงานสรุป จำนวนเวลาที่ใช้พัฒนา ของทีม Developer (รายวัน)",
                url: "/internal/dashboard/timesheet3"
            },
            {
                no: "16",
                dashboard_name: "DashBoard CR CENTER",
                description: "รายงานรายละเอียด ข้อมูล CR , Memo",
                url: "/internal/dashboard/dashboard6"
            },
          
        ]

    const searchDashboard = (param) => {
        let result = dashBoardData.filter(o =>
            Object.keys(o).some(k =>
                String(o[k])
                    .toLowerCase()
                    .includes(param.toLowerCase())
            )
        );
        setFilterDashBoard(result);
    }

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
                    <Col span={16}>
                    </Col>
                    <Col span={8}>
                        <Input.Search placeholder="ชื่อ dashboard , description" allowClear
                            enterButton
                            onSearch={searchDashboard}
                        />
                    </Col>
                </Row>
                <Row gutter={16} style={{ padding: "10px 24px 24px 24px" }}>
                    <Col span={24}>
                        <Table dataSource={filterDashBoard === null ? dashBoardData : filterDashBoard} >
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
