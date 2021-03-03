import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/charts';
import MasterPage from '../MasterPage'
import { Row, Col, Card, Spin } from 'antd';
import Axios from "axios";

export default function MyDashboard() {
    const [loading, setLoading] = useState(true)
    const [dashboard, setDashboard] = useState([])


    var config = {

        xField: 'Status',
        yField: 'Value',
        //seriesField: 'status',
        //isPercent: true,
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
            if (x.Status === "Open" || x.Status === "Hold") { return "gray" }
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
        <MasterPage bgColor="#f0f2f5">
            <Spin spinning={loading}>
                <Row gutter={16}>
                    <Col span={4}>
                        <Card bordered={true} style={{ width: "100%" }}>
                            <div>
                                <Row>
                                    <Col span={12}>
                                        <label className="dashboard-card-status" >
                                            Open
                                          </label>
                                    </Col>
                                    <Col span={12}>
                                        <label className="dashboard-card-status" >
                                            Hold
                                         </label>
                                    </Col>
                                </Row>
                            </div>
                            <div>
                                <Row>
                                    <Col span={12}>
                                        <label className="dashboard-card-value">
                                            {dashboard[0]?.Value}
                                        </label>
                                    </Col>
                                    <Col span={12}>
                                        <label className="dashboard-card-value">
                                            {dashboard[4]?.Value}
                                        </label>
                                    </Col>
                                </Row>
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
                                    {dashboard[5]?.Value}
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
                                    {dashboard[6]?.Value}
                                </label>
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: "30px" }}>
                    <Col span={18}>
                        <div >
                            <Card title="Issue" bordered={true} style={{ width: "100%" }}>
                                <Column {...config}
                                    data={dashboard.filter((x) => x.Status !== "Total")}
                                    height={200}
                                    //scrollbar="true"
                                    xAxis={{ position: "bottom" }}
                                />

                            </Card>
                        </div>
                    </Col>
                    <Col span={6}>
                        <div className="site-card-wrapper">
                            <Row gutter={8}>
                                <Col span={24}>
                                    {/* <Card bordered={true}>
                                    <div>Open</div>
                                    <div>2</div>
                                </Card> */}
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            </Spin>
        </MasterPage>
    )
}
