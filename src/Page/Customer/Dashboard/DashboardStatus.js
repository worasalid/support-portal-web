import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/charts';
import MasterPage from '../MasterPage'
import { Row, Col, Card, Spin, DatePicker, Tabs } from 'antd';
import { FileOutlined } from '@ant-design/icons';
import Axios from "axios";
import moment from 'moment';

const { Meta } = Card;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;


const DashBoard = React.memo(({ data }) => {
    const config = {
        xField: 'Status',
        yField: 'Value',
        label: {
            position: 'middle',
            content: function content(item) {
                return item.Value.toFixed(0);
            },
            style: { fill: '#fff' },
        },
        columnWidthRatio: 0.4,
        legend: {
            layout: 'horizontal',
            position: 'bottom'
        },
        color: function color(x) {
            if (x.Status === "Open" || x.Status === "Hold") { return "gray" }
            if (x.Status === "InProgress") { return "#5B8FF9" }
            if (x.Status === "Resolved") { return "#FF5500" }
            if (x.Status === "Cancel") { return "#CD201F" }
            if (x.Status === "ReOpen") { return "#CD201F" }
            if (x.Status === "Complete") { return "#87D068" }

        },
    };

    return (
        <>
            <Card title="Issue" bordered={true} style={{ width: "100%" }}>
                <Column {...config}
                    data={data.filter((x) => x.Status !== "Total")}
                    height={280}
                    //scrollbar="true"
                    xAxis={{ position: "bottom" }}
                />
            </Card>
        </>
    )
})

export default function DashboardStatus() {
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState([]);
    const [dashBoardWeekly, setDashBoardWeekly] = useState([]);
    const [dashBoardMonthly, setDashBoardMonthly] = useState([]);
    const [filterDate, setFilterDate] = useState([]);
    const [dashboardType, setDashBoardType] = useState("total");

    const [dates, setDates] = useState([]);

    const config = {
        xField: 'Status',
        yField: 'Value',
        seriesField: 'Status',
        label: {
            position: 'middle',
            content: function content(item) {
                return item.Value.toFixed(0);
            },
            style: { fill: '#fff' },
        },
        meta: {
            Status: { alias: '类别' },
            Value: { alias: '销售额' },
        },
        columnWidthRatio: 0.4,
        legend: {
            layout: 'horizontal',
            position: 'bottom'
        },
        color: function color(x) {
            if (x.Status === "Open" || x.Status === "Hold") { return "gray" }
            if (x.Status === "InProgress") { return "#5B8FF9" }
            if (x.Status === "Resolved") { return "#FF5500" }
            if (x.Status === "Cancel") { return "#CD201F" }
            if (x.Status === "ReOpen") { return "#CD201F" }
            if (x.Status === "Complete") { return "#87D068" }

        }
    }

    const configWeek = {
        xField: 'Status',
        yField: 'Value',
        // seriesField: 'status',
        // isStack: true,
        label: {
            position: 'middle',
            // content: function content(item) {
            //     return item.Value.toFixed(0);
            // },
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

    const configMonth = {
        xField: 'Status',
        yField: 'Value',
        seriesField: 'Status',
        isStack: true,
        label: {
            position: 'middle',
            content: function content(item) {
                return item.Value.toFixed(0);
            },
            style: { fill: '#fff' },
        },
        columnWidthRatio: 0.8,
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

    const GetIssueTotal = async (param) => {
        try {
            const issuestatus = await Axios({
                url: process.env.REACT_APP_API_URL + "/dashboard/issue-status",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    dash_board_type: dashboardType
                }

            });
            if (issuestatus.status === 200) {
                setLoading(false);
                setDashboard(issuestatus.data.total)
            }

        } catch (error) {
            //setLoading(false)
        }
    }

    const getIssueByWeek = async (param) => {
        setLoading(true);
        try {
            const issuestatus = await Axios({
                url: process.env.REACT_APP_API_URL + "/dashboard/issue-status",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    start_date: moment(param[0], "DD/MM/YYYY").format("YYYY-MM-DD"),
                    end_date: moment(param[1], "DD/MM/YYYY").format("YYYY-MM-DD"),
                    dash_board_type: dashboardType
                }

            });
            if (issuestatus.status === 200) {
                setLoading(false);
                setDashBoardWeekly(issuestatus.data.total);
            }

        } catch (error) {
            setLoading(false)
        }
    }

    const getIssueByMonth = async (param) => {
        setLoading(true);
        try {
            const issuestatus = await Axios({
                url: process.env.REACT_APP_API_URL + "/dashboard/issue-status",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    start_date: moment(param, "MM/YYYY").format("YYYY-MM"),
                    dash_board_type: dashboardType
                }

            });
            if (issuestatus.status === 200) {
                setLoading(false);
                setDashBoardMonthly(issuestatus.data.total);
            }

        } catch (error) {
            setLoading(false)
        }
    }

    useEffect(() => {
        GetIssueTotal();
    }, [])

    useEffect(() => {
        if (dashboardType === "weekly") {
            getIssueByWeek([moment(moment().add(-7, 'day').format("DD/MM/YYYY"), "DD/MM/YYYY"), moment(moment().format("DD/MM/YYYY"), "DD/MM/YYYY")]);
        }
        if (dashboardType === "monthly") {
            getIssueByMonth(moment(moment().format("MM/YYYY"), "MM/YYYY"));
        }

    }, [dashboardType])


    return (
        <MasterPage bgColor="#f0f2f5">
            <Spin spinning={loading}>
                <div style={{ padding: "24px 24px 24px 24px" }}>
                    <Row gutter={16}>
                        <Col span={4}>

                            <Card className="card-box issue-active" bordered hoverable
                                style={{ width: "100%" }}
                            >
                                <Meta
                                    avatar={<FileOutlined style={{ fontSize: 25 }} />}
                                    title={<label className="card-title-menu" style={{ color: "#5B8FF9" }}>Open</label>}
                                    description={
                                        <label className="dashboard-card-value" >
                                            {dashboard[0]?.Value}
                                        </label>

                                    }
                                />
                            </Card>
                        </Col>
                        <Col span={4}>
                        
                            <Card className="card-box issue-active" bordered hoverable
                                style={{ width: "100%" }}
                            >
                                <Meta
                                    avatar={<FileOutlined style={{ fontSize: 25 }} />}
                                    title={<label className="card-title-menu" style={{ color: "#5B8FF9" }}>InProgress</label>}
                                    description={
                                        <label className="dashboard-card-value" >
                                            {dashboard[1]?.Value}
                                        </label>

                                    }
                                />
                            </Card>
                        </Col>
                        <Col span={4}>
                           
                            <Card className="card-box issue-active" bordered hoverable
                                style={{ width: "100%" }}
                            >
                                <Meta
                                    avatar={<FileOutlined style={{ fontSize: 25 }} />}
                                    title={<label className="card-title-menu" style={{ color: "#FF5500" }}>Resolved</label>}
                                    description={
                                        <label className="dashboard-card-value" >
                                            {dashboard[2]?.Value}
                                        </label>

                                    }
                                />
                            </Card>
                        </Col>
                        <Col span={4}>
                           
                            <Card className="card-box issue-active" bordered hoverable
                                style={{ width: "100%" }}
                            >
                                <Meta
                                    avatar={<FileOutlined style={{ fontSize: 25 }} />}
                                    title={<label className="card-title-menu" style={{ color: "#CD201F" }}>Cancel</label>}
                                    description={
                                        <label className="dashboard-card-value" >
                                            {dashboard[3]?.Value}
                                        </label>

                                    }
                                />
                            </Card>
                        </Col>
                        <Col span={4}>
                           
                            <Card className="card-box issue-active" bordered hoverable
                                style={{ width: "100%" }}
                            >
                                <Meta
                                    avatar={<FileOutlined style={{ fontSize: 25 }} />}
                                    title={<label className="card-title-menu" style={{ color: "#87D068" }}>Complete</label>}
                                    description={
                                        <label className="dashboard-card-value" >
                                            {dashboard[5]?.Value}
                                        </label>

                                    }
                                />
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
                                        {dashboard[7]?.Value}
                                    </label>
                                </div>
                            </Card>
                        </Col>
                    </Row>


                    <Row gutter={16} style={{ marginTop: "30px" }}>
                        {/* <Col span={12}>
                            {<DashBoard data={dashboard} />}
                        </Col> */}
                        <Col span={24}>
                            <div className="card-container">
                                <Tabs type="card" defaultActiveKey="Day" onChange={(x) => setDashBoardType(x)}>
                                    <TabPane tab="Total" key="total">
                                        <Row>
                                            <Col span={24}>

                                            </Col>
                                        </Row>
                                        <Column {...config}
                                            tooltip="xxx"
                                            style={{ height: 350 }}
                                            data={dashboard.filter((x) => x.Status !== "Total")}
                                            xAxis={{
                                                position: "bottom",
                                            }}
                                        />

                                    </TabPane>
                                    <TabPane tab="By Weekly" key="weekly">
                                        <Row style={{ marginBottom: 24 }}>
                                            <Col span={16}>

                                            </Col>
                                            <Col span={8}>
                                                <RangePicker format="DD/MM/YYYY" style={{ width: "100%" }}
                                                    defaultValue={
                                                        [
                                                            moment(moment().add(-7, 'day').format("DD/MM/YYYY"), "DD/MM/YYYY"),
                                                            moment(moment().format("DD/MM/YYYY"), "DD/MM/YYYY")
                                                        ]
                                                    }
                                                    disabledDate={(current) => {
                                                        if (!dates || dates.length === 0) {
                                                            return false;
                                                        }
                                                        const tooLate = dates[0] && current.diff(dates[0], 'days') >= 7;
                                                        const tooEarly = dates[1] && dates[1].diff(current, 'days') >= 7;
                                                        return tooEarly || tooLate;
                                                    }}
                                                    onOpenChange={() => setDates([])}
                                                    onChange={(date, dateString) => { getIssueByWeek(dateString) }}
                                                    onCalendarChange={val => setDates(val)}
                                                />
                                            </Col>
                                        </Row>
                                        <Column {...configWeek}
                                            style={{ height: 280 }}
                                            data={dashBoardWeekly.filter((x) => x.status !== "Total")}
                                            //scrollbar="true"
                                            xAxis={{ position: "bottom" }}
                                        />

                                    </TabPane>
                                    <TabPane tab="By Monthly" key="monthly">
                                        <Row style={{ marginBottom: 24 }}>
                                            <Col span={16}>

                                            </Col>
                                            <Col span={8}>
                                                <DatePicker  picker="month" format="MM/YYYY"  style={{ width: "100%" }}
                                                    defaultValue={moment(moment().format("MM/YYYY"), "MM/YYYY")}
                                                    onChange={(date, dateString) => { getIssueByMonth(dateString) }}
                                                />
                                            </Col>
                                        </Row>
                                        <Column {...configMonth}
                                            style={{ height: 280 }}
                                            data={dashBoardMonthly.filter((x) => x.status !== "Total")}
                                            //scrollbar="true"
                                            xAxis={{ position: "bottom" }}
                                        />
                                    </TabPane>
                                </Tabs>
                            </div>

                        </Col>
                    </Row>


                </div>
            </Spin>
        </MasterPage >
    )
}
