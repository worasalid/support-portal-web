import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/charts';
import MasterPage from '../MasterPage'
import { Row, Col, Card, Spin, Table } from 'antd';
import Axios from "axios";

export default function MyDashboard() {
    const [loading, setLoading] = useState(true)
    const [dashboard, setDashboard] = useState([])
    const [chartCompany, setChartCompany] = useState([])
    const [statusbyCompany, setStatusbyCompany] = useState([])

    const chartCompany_config = {
        xField: 'CompanyCode',
        yField: 'Value',
        seriesField: 'Status',
        //isPercent: true,
        isStack: true,

        // slider: {
        //     start: 0,
        //     end: 2,
        //     maxLimit: 100,
        // },

        label: {
            position: 'middle',
            content: function content(item) {
                return item.Value.toFixed(0);
            },
            style: { fill: '#fff' },
        },
        legend: {
            layout: 'horizontal',
            position: 'bottom'
        },
        color: function color(x) {
            if (x.Status === "Open") { return "gray" }
            if (x.Status === "InProgress") { return "#5B8FF9" }
            if (x.Status === "Resolved") { return "#FF5500" }
            if (x.Status === "Cancel") { return "#CD201F" }
            if (x.Status === "Complete") { return "#87D068" }

        },
    };

    const dashboard_config = {
        xField: 'Status',
        yField: 'Value',
        seriesField: 'Status',
        //isStack: true,
        // slider: {
        //     start: 0,
        //     end: 2,
        //     maxLimit: 100,
        // },

        label: {
            position: 'middle',
            content: function content(item) {
                return item.Value.toFixed(0);
            },
            style: { fill: '#fff' },
        },
        legend: {
            layout: 'horizontal',
            position: 'bottom'
        },
        color: function color(x) {
            if (x.Status === "Open") { return "gray" }
            if (x.Status === "InProgress") { return "#5B8FF9" }
            if (x.Status === "Resolved") { return "#FF5500" }
            if (x.Status === "Cancel") { return "#CD201F" }
            if (x.Status === "Complete") { return "#87D068" }

        },
    };


    const GetIssueStatus = async () => {
        try {
            const issuestatus = await Axios({
                url: process.env.REACT_APP_API_URL + "/dashboard/issue-status",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                }

            });
            if (issuestatus.status === 200) {
                setTimeout(() => {
                    setLoading(false)
                    setDashboard(issuestatus.data.total)
                    setChartCompany(issuestatus.data.data)
                    setStatusbyCompany(issuestatus.data.datagroup)
                }, 1000)
            }

        } catch (error) {
            setLoading(false)
            alert("Error")
        }
    }

    useEffect(() => {
        GetIssueStatus()

    }, [])

    return (
        <MasterPage>
            <Spin spinning={loading}>
                <Row gutter={16}>
                    <Col span={4}>
                        <Card bordered={true} style={{ width: "100%" }}>
                            <div>
                                <label className="dashboard-card-status" >
                                    Open
                            </label>

                            </div>
                            <div>
                                <label className="dashboard-card-value">
                                    {dashboard[0]?.Value}
                                </label>
                            </div>
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card bordered={true} style={{ width: "100%" }}>
                            <div>
                                <label className="dashboard-card-status">
                                    InProgress
                            </label>

                            </div>
                            <div>
                                <label className="dashboard-card-value" style={{ color: "#5B8FF9" }}>
                                    {dashboard[1]?.Value}
                                </label>
                            </div>
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card bordered={true} style={{ width: "100%" }}>
                            <div>
                                <label className="dashboard-card-status">
                                    Resolved
                            </label>

                            </div>
                            <div>
                                <label className="dashboard-card-value" style={{ color: "#FF5500" }}>
                                    {dashboard[2]?.Value}
                                </label>
                            </div>
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card bordered={true} style={{ width: "100%" }}>
                            <div>
                                <label className="dashboard-card-status">
                                    Cancel
                            </label>

                            </div>
                            <div>
                                <label className="dashboard-card-value" style={{ color: "#CD201F" }}>
                                    {dashboard[3]?.Value}
                                </label>
                            </div>
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card bordered={true} style={{ width: "100%" }}>
                            <div>
                                <label className="dashboard-card-status">
                                    Complete
                            </label>

                            </div>
                            <div>
                                <label className="dashboard-card-value" style={{ color: "#87D068" }}>
                                    {dashboard[4]?.Value}
                                </label>
                            </div>
                        </Card>
                    </Col>
                    <Col span={4}>
                        <Card bordered={true} style={{ width: "100%" }}>
                            <div>
                                <label className="dashboard-card-status">
                                    Total
                            </label>

                            </div>
                            <div>
                                <label className="dashboard-card-value">
                                    {dashboard[5]?.Value}
                                </label>
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: "30px" }}>
                    <Col span={18}>
                        <div >
                            <Card title="Issue By Company" bordered={true} style={{ width: "100%" }}>
                                <Column {...chartCompany_config}
                                    data={chartCompany}
                                    height={200}
                                    //scrollbar="true"
                                    xAxis={{ position: "bottom" }}
                                />

                            </Card>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div className="site-card-wrapper">
                            <Card title="Total" bordered={true} style={{ width: "100%" }}>
                                <Column {...dashboard_config}
                                    data={dashboard.filter((x) => x.Status !== "Total")}
                                    height={200}
                                    //scrollbar="true"
                                    xAxis={{ position: "bottom" }}
                                />

                            </Card>
                        </div>
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: "30px" }}>
                    <Col span={12}>
                        <Table dataSource={statusbyCompany}>
                            <Column title="No" width="5%" dataIndex="Row"/>
                            <Column title="Company"
                                align="center"
                                width="55%"
                                render={(record) => {
                                    return (
                                        <>
                                            {record.CompanyCode}
                                        </>
                                    )
                                }

                                }
                            />
                               <Column title="Open" width="10%" dataIndex="Open" />
                               <Column title="InProgress" width="10%" dataIndex="InProgress"/>
                               <Column title="Resolved" width="10%" dataIndex="Resolved"/>
                               <Column title="Complete" width="10%" dataIndex="Complete"/>
                        </Table>
                    </Col>
                </Row>
            </Spin>
        </MasterPage>
    )
}
