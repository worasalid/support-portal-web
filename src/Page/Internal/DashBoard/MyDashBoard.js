import React, { useState, useEffect } from 'react';
import { Column, Pie } from '@ant-design/charts';
import MasterPage from '../MasterPage'
import { Row, Col, Card, Spin, Table, Checkbox, Button } from 'antd';
import { FileOutlined } from '@ant-design/icons';
import Axios from "axios";
import { useHistory } from 'react-router-dom';
import xlsx from 'xlsx';
import moment from "moment"

const { Meta } = Card;


export default function MyDashboard() {
    const history = useHistory()
    const [loading, setLoading] = useState(true)
    const [dashboard, setDashboard] = useState([])
    const [chartCompany, setChartCompany] = useState([])
    const [statusbyCompany, setStatusbyCompany] = useState([])

    //data
    const [excelData, setExcelData] = useState([])

    //filter
    const [isStack, setIsStack] = useState(false)

    const chartCompany_config = {
        xField: 'Company',
        yField: 'Value',
        seriesField: 'Status',
        //isPercent: true,
        isStack: isStack,
        isGroup: !isStack,
        // slider: {
        //     start: 0,
        //     end: 2,
        //     maxLimit: 100,
        // },
        columnWidthRatio: 0.3,
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
            if (x.Status === "MyTask") { return "#5B8FF9" }
            if (x.Status === "InProgress") { return "#87D068" }
            if (x.Status === "Resolved") { return "#FF5500" }
            if (x.Status === "Cancel") { return "#CD201F" }
        },
    };

    const piechart_config = {
        appendPadding: 10,
        angleField: 'total',
        colorField: 'company',
        radius: 0.75,
        label: {
            type: 'spider',
            labelHeight: 28,
            content: '{name} ({value})',
        },
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    };

    const getDashboadData = async () => {
        try {
            const issuestatus = await Axios({
                url: process.env.REACT_APP_API_URL + "/dashboard/user/mytask",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                }
            });

            if (issuestatus.status === 200) {
                setLoading(false);
                setDashboard(issuestatus.data.total);
                setChartCompany(issuestatus.data.chartdata);

                setExcelData(issuestatus.data.exceldata);
                setStatusbyCompany(issuestatus.data.table.map((n, index) => {
                    return {
                        key: index,
                        company: n.Company,
                        mytask: n.MyTask,
                        inprogress: n.InProgress,
                        resolved: n.Resolved,
                        cancel: n.Cancel,
                        total: n.Total
                    }
                }));
            }

        } catch (error) {
            setLoading(false)
        }
    }

    const exportExcel = (json) => {
        if (json !== undefined) {
            let ws = xlsx.utils.json_to_sheet(json.map((x, index) => {
                return {
                    No: index + 1,
                    Issue: x.Number,
                    Company: x.CompanyName,
                    IssueType: x.IssueType,
                    Priority: x.Priority,
                    Status: x.GroupStatus,
                    Title: x.Title,
                    AssignDate: x.AssignIconDate,
                    DueDate: x.DueDate,
                    OverDueAll: x.OverDueAll,
                    OverDue: x.OverDue
                }
            }));
            let wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws, 'Issue');
            xlsx.writeFile(wb, `My DashBoard - ${moment().format("YYMMDD_HHmm")}.xlsx`);
        }
    }

    useEffect(() => {
        getDashboadData()
    }, [])

    return (
        <MasterPage bgColor="#f0f2f5">
            <Spin spinning={loading}>
                <Row gutter={16} style={{ padding: "24px 24px 24px 24px" }}>
                    <Col xs={24} sm={12} md={8} lg={8} xl={6}>
                        <Card bordered hoverable
                            style={{ width: "100%" }}
                            onClick={() => history.push({ pathname: "/internal/issue/mytask" })}
                        >
                            <Meta
                                avatar={<FileOutlined style={{ fontSize: 25 }} />}
                                title={<label className="card-title-menu" style={{ color: "#5B8FF9" }}>MyTask</label>}
                                description={
                                    <label className="dashboard-card-value" >
                                        {dashboard[0]?.MyTask}
                                    </label>
                                }
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={8} xl={6}>
                        <Card bordered hoverable
                            style={{ width: "100%" }}
                            onClick={() => history.push({ pathname: "/internal/issue/inprogress" })}
                        >
                            <Meta
                                avatar={<FileOutlined style={{ fontSize: 25 }} />}
                                title={<label className="card-title-menu" style={{ color: "#87D068" }}>InProgress</label>}
                                description={
                                    <label className="dashboard-card-value" >
                                        {dashboard[0]?.InProgress}
                                    </label>

                                }
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={8} xl={6}>
                        <Card bordered hoverable
                            style={{ width: "100%" }}
                            onClick={() => history.push({ pathname: "/internal/issue/resolved" })}
                        >
                            <Meta
                                avatar={<FileOutlined style={{ fontSize: 25 }} />}
                                title={<label className="card-title-menu" style={{ color: "#FF5500" }}>Resolved</label>}
                                description={
                                    <label className="dashboard-card-value" >
                                        {dashboard[0]?.Resolved}
                                    </label>

                                }
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={8} xl={6}>
                        <Card bordered hoverable
                            style={{ width: "100%" }}
                            onClick={() => history.push({ pathname: "/internal/issue/cancel" })}
                        >
                            <Meta
                                avatar={<FileOutlined style={{ fontSize: 25 }} />}
                                title={<label className="card-title-menu" style={{ color: "#CD201F" }}>Cancel</label>}
                                description={
                                    <label className="dashboard-card-value" >
                                        {dashboard[0]?.Cancel}
                                    </label>

                                }
                            />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={16} style={{ padding: "12px 24px 24px 24px" }}>
                    <Col span={24}>
                        <div >
                            <Card title="Issue By Company" bordered={true} className="card-dashboard" style={{ width: "100%" }}
                                extra={
                                    <>
                                        <Checkbox checked={isStack} onChange={(value) => setIsStack(value.target.checked)}>
                                            Is Stack
                                        </Checkbox>

                                        <Button type="link"
                                            hidden={chartCompany.length === 0 ? true : false}
                                            onClick={() => exportExcel(excelData && excelData)}
                                            title="Excel Export"
                                        >
                                            <img
                                                style={{ height: "25px" }}
                                                src={`${process.env.PUBLIC_URL}/icons-excel.png`}
                                                alt="Excel Export"
                                            />
                                        </Button>
                                    </>
                                }
                            >
                                <Column
                                    // {...chartCompany_config}
                                    data={chartCompany.filter((n) => n.Value !== 0)}
                                    height={300}
                                    xField="Company"
                                    yField="Value"
                                    seriesField="Status"
                                    xAxis={{ position: "bottom" }}
                                    isStack={isStack}
                                    isGroup={!isStack}
                                    columnWidthRatio={0.3}
                                    legend={{
                                        layout: "horizontal",
                                        position: "bottom"
                                    }}
                                    label={{
                                        position: "middle",
                                        style: { fill: '#fff' },
                                        content: (item) => {
                                            return item.Value.toFixed(0);
                                        }
                                    }}
                                    color={(x) => {
                                        if (x.Status === "MyTask") { return "#5B8FF9" }
                                        if (x.Status === "InProgress") { return "#87D068" }
                                        if (x.Status === "Resolved") { return "#FF5500" }
                                        if (x.Status === "Cancel") { return "#CD201F" }
                                    }}
                                />

                            </Card>
                        </div>
                    </Col>

                </Row>

                <Row gutter={16} style={{ padding: "24px 24px 24px 24px" }}>
                    <Col span={12}>
                        <Table dataSource={statusbyCompany}>
                            <Column title="No"
                                width="5%"
                                render={(record, value, index) => {
                                    return (
                                        <>
                                            {index + 1}
                                        </>
                                    )
                                }}
                            />
                            <Column title="Company" width="55%" dataIndex="company" />
                            <Column title="MyTask" width="10%" dataIndex="mytask" />
                            <Column title="InProgress" width="10%" dataIndex="inprogress" />
                            <Column title="Resolved" width="10%" dataIndex="resolved" />
                            <Column title="Cancel" width="10%" dataIndex="cancel" />
                        </Table>
                    </Col>
                    <Col span={12}>
                        <Card title="Total By Company" bordered={true} className="card-dashboard" style={{ width: "100%" }}>
                            <Pie {...piechart_config}
                                height={300}
                                data={statusbyCompany}
                            />
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </MasterPage>
    )
}
