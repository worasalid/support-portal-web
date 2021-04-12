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
                    height={200}
                    //scrollbar="true"
                    xAxis={{ position: "bottom" }}
                />
            </Card>
        </>
    )
})

export default function MyDashboard() {
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState([]);
    const [dashBoardWeekly, setDashBoardWeekly] = useState([]);
    const [filterDate, setFilterDate] = useState([]);
    const [dashboardType, setDashBoardType] = useState("Weekly");

    const weekdata = [
        {
            day: "Monday",
            status: "Open",
            value: 3
        },
        {
            day: "Monday",
            status: "InProgress",
            value: 5
        },
        {
            day: "Monday",
            status: "Resolved",
            value: 5
        },
        {
            day: "Tuesday",
            status: "InProgress",
            value: 3
        },
        {
            day: "Wednesday",
            status: "InProgress",
            value: 40
        },
        {
            day: "Thursday",
            status: "InProgress",
            value: 4
        },
        {
            day: "Friday",
            status: "InProgress",
            value: 4
        },
        {
            day: "Friday",
            status: "Open",
            value: 2
        }
    ]
    const monthdata = [
        {
            month: "Jan",
            status: "Open",
            value: 3
        },
        {
            month: "Feb",
            status: "Complete",
            value: 3
        },
        {
            month: "Feb",
            status: "Open",
            value: 4
        },
        {
            month: "Mar",
            status: "InProgress",
            value: 3
        },
        {
            month: "Apr",
            status: "InProgress",
            value: 10
        },
        {
            month: "May	",
            status: "InProgress",
            value: 4
        },
        {
            month: "Jun",
            status: "InProgress",
            value: 4
        },
        {
            month: "Jul",
            status: "Open",
            value: 2
        },
        {
            month: "Aug",
            status: "Open",
            value: 2
        },
        {
            month: "Sep",
            status: "Open",
            value: 2
        },
        {
            month: "Oct",
            status: "Open",
            value: 2
        },
        {
            month: "Nov",
            status: "Open",
            value: 2
        },
        {
            month: "Dec",
            status: "Open",
            value: 2
        }

    ]



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
        xField: 'month',
        yField: 'value',
        seriesField: 'status',
        isStack: true,
        // label: {
        //     position: 'middle',
        //     content: function content(item) {
        //         return item.Value.toFixed(0);
        //     },
        //     style: { fill: '#fff' },
        // },
        columnWidthRatio: 0.8,
        legend: {
            layout: 'horizontal',
            position: 'bottom'
        },
        color: function color(x) {
            if (x.status === "Open" || x.status === "Hold") { return "gray" }
            if (x.status === "InProgress") { return "#5B8FF9" }
            if (x.status === "Resolved") { return "#FF5500" }
            if (x.status === "Cancel") { return "#CD201F" }
            if (x.status === "Complete") { return "#87D068" }

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
                    dash_board_type: "total"  // Day, Weely, Month, Year
                }

            });
            if (issuestatus.status === 200) {
                setTimeout(() => {
                    //setLoading(false)
                    setDashboard(issuestatus.data.total)
                }, 1000)
            }

        } catch (error) {
            //setLoading(false)
        }
    }

    const GetIssueStatus = async (param) => {
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
                    dash_board_type: dashboardType  // Day, Weely, Month, Year
                }

            });
            if (issuestatus.status === 200) {
                setTimeout(() => {
                    setLoading(false)
                    setDashBoardWeekly(issuestatus.data.total)
                }, 1000)
            }

        } catch (error) {
            setLoading(false)
        }
    }




    useEffect(() => {
        GetIssueTotal();
        GetIssueStatus();
    }, [])

    useEffect(() => {
    }, [dashboard])

    return (
        <MasterPage bgColor="#f0f2f5">
            <Spin spinning={loading}>
                <div style={{ padding: "24px 24px 24px 24px" }}>
                    <Row gutter={16}>
                        <Col span={4}>
                            {/* <Card bordered={true} style={{ width: "100%" }}>
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
                    */}
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
                            {/* <Card bordered={true} style={{ width: "100%" }}>
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
                        </Card> */}
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
                            {/* <Card bordered={true} style={{ width: "100%" }}>
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
                        </Card> */}
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
                            {/* <Card bordered={true} style={{ width: "100%" }}>
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
                        </Card> */}
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
                            {/* <Card bordered={true} style={{ width: "100%" }}>
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
                        </Card> */}
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
                        <Col span={12}>
                            {/* <Card title="Issue" bordered={true} style={{ width: "100%" }}>
                                <Column {...config}
                                    data={dashboard.filter((x) => x.Status !== "Total")}
                                    height={200}
                                    //scrollbar="true"
                                    xAxis={{ position: "bottom" }}
                                />
                            </Card> */}
                            {<DashBoard data={dashboard} />}
                        </Col>
                        <Col span={12}>
                            <div className="card-container">
                                <Tabs type="card" defaultActiveKey="Day" onChange={(x) => setDashBoardType(x)}>
                                    <TabPane tab="By Weekly" key="weekly">
                                        <Row style={{ marginBottom: 24 }}>
                                            <Col span={12}>

                                            </Col>
                                            <Col span={12}>
                                                <RangePicker format="DD/MM/YYYY" style={{ width: "100%" }}
                                                    onChange={(date, dateString) => GetIssueStatus(dateString)}
                                                />
                                            </Col>
                                        </Row>
                                        <Column {...configWeek}
                                            // groupField="type"
                                            // tooltip="xxx"
                                            style={{ height: 280 }}
                                            data={dashBoardWeekly.filter((x) => x.status !== "Total")}
                                            //scrollbar="true"
                                            xAxis={{ position: "bottom" }}
                                        />

                                    </TabPane>
                                    <TabPane tab="By Monthly" key="monthly">
                                        <Row style={{ marginBottom: 24 }}>
                                            <Col span={12}>

                                            </Col>
                                            <Col span={12}>
                                                <RangePicker format="DD/MM/YYYY" style={{ width: "100%" }}
                                                    onChange={(date, dateString) => setFilterDate(dateString)}
                                                />
                                            </Col>
                                        </Row>
                                        <Column {...configMonth}
                                            style={{ height: 280 }}
                                            data={monthdata.filter((x) => x.status !== "Total")}
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
        </MasterPage>
    )
}
