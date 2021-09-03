import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/charts';
import MasterPage from '../MasterPage'
import { Row, Col, Card, Spin, DatePicker, Tabs, Select, Checkbox, Button } from 'antd';
import { FileOutlined } from '@ant-design/icons';
import Axios from "axios";
import { useHistory } from 'react-router-dom';
import xlsx from 'xlsx';
import moment from "moment";

const { Meta } = Card;

export default function MyDashboard() {
    const history = useHistory();
    const [loading, setLoading] = useState(true);

    //data
    const [cusProduct, setCusProduct] = useState(null)
    const [dashboard, setDashboard] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [excelData, setExcelData] = useState([])

    const [selectCusProduct, setSelectCusProduct] = useState(null);
    const [isStack, setIsStack] = useState(false);

    const config = {
        xField: cusProduct?.length > 1 ? 'productcode' : 'status',
        yField: 'value',
        seriesField: 'status',
        isStack: isStack,
        isGroup: !isStack,
        label: {
            position: 'middle',
            content: function content(item) {
                return item.value.toFixed(0);
            },
            style: { fill: '#fff' },
        },
        columnWidthRatio: isStack && selectCusProduct !== null ? 0.1 :
            isStack && selectCusProduct === null ? 0.2 : 0.4,
        legend: {
            layout: 'horizontal',
            position: 'bottom'
        },
        color: function color(x) {
            if (x.status === "MyTask") { return "#5B8FF9" }
            if (x.status === "InProgress") { return "#87D068" }
            if (x.status === "Waiting Deploy") { return "#FF5500" }
            if (x.status === "Cancel") { return "#CD201F" }
        }
    }

    const getProduct = async () => {
        try {
            const result = await Axios.get(process.env.REACT_APP_API_URL + "/master/customer-products", {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
            });

            if (result.status === 200) {
                setCusProduct(result.data)
            }

        } catch (error) {

        }
    }

    const getData = async (param) => {
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/dashboard/customer/mytask",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    product_id: selectCusProduct
                }
            });

            if (result.status === 200) {
                setLoading(false);
                setDashboard(result.data.total);
                setChartData(result.data.chartdata.map((n) => ({
                    productcode: n.ProductCode,
                    status: n.Status === "Resolved" ? "Waiting Deploy" : n.Status,
                    value: n.Value
                })));
                setExcelData(result.data.exceldata)
            }

        } catch (error) {
            setLoading(false)
        }
    }

    const ExportExcel = (json) => {
        if (json !== undefined) {
            let ws = xlsx.utils.json_to_sheet(json.map((x) => (
                {
                    No: x.Row,
                    Issue: x.Number,
                    IssueType: x.IssueType,
                    Priority: x.Priority,
                    Title: x.Title,
                    Status: x.GroupStatus,
                    Progress: x.ProgressStatus,
                    AssignDate: x.AssignIconDate,
                    DueDate: x.DueDate,
                    OverDue: x.OverDue

                })
            ));

            let wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws, 'Issue');
            xlsx.writeFile(wb, `My DashBoard - ${moment().format("YYMMDD_HHmm")}.xlsx`);
        }
    }


    useEffect(() => {
        getData();
        getProduct();
    }, [])

    useEffect(() => {
        if (selectCusProduct !== null) {
            getData();
        }
    }, [selectCusProduct])


    return (
        <MasterPage bgColor="#f0f2f5">
            <Spin spinning={loading}>
                <div style={{ padding: "24px 24px 24px 24px" }}>
                    <Row gutter={16}>
                        <Col span={4}>

                            <Card className="card-box issue-active" bordered hoverable
                                style={{ width: "100%" }}
                                onClick={() => history.push({ pathname: "/customer/issue/mytask" })}
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

                        <Col span={4}>
                            <Card className="card-box issue-active" bordered hoverable
                                style={{ width: "100%" }}
                                onClick={() => history.push({ pathname: "/customer/issue/inprogress" })}
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

                        <Col span={4}>

                            <Card className="card-box issue-active" bordered hoverable
                                style={{ width: "100%" }}
                                onClick={() => history.push({ pathname: "/customer/issue/pass" })}
                            >
                                <Meta
                                    avatar={<FileOutlined style={{ fontSize: 25 }} />}
                                    title={<label className="card-title-menu" style={{ color: "#FF5500" }}>Waiting Deploy</label>}
                                    description={
                                        <label className="dashboard-card-value" >
                                            {dashboard[0]?.Resolved}
                                        </label>

                                    }
                                />
                            </Card>
                        </Col>

                        <Col span={4}>
                            <Card className="card-box issue-active" bordered hoverable
                                style={{ width: "100%" }}
                                onClick={() => history.push({ pathname: "/customer/issue/cancel" })}
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

                        <Col span={4}>
                            <Card className="card-box issue-active" bordered hoverable
                                style={{ width: "100%" }}
                                onClick={() => history.push({ pathname: "/customer/issue/complete" })}
                            >
                                <Meta
                                    avatar={<FileOutlined style={{ fontSize: 25 }} />}
                                    title={<label className="card-title-menu" style={{ color: "#87D068" }}>Complete</label>}
                                    description={
                                        <label className="dashboard-card-value" >
                                            {dashboard[0]?.Complete}
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
                                        {
                                            dashboard[0]?.MyTask + dashboard[0]?.InProgress + dashboard[0]?.Resolved +
                                            dashboard[0]?.Cancel + dashboard[0]?.Complete

                                        }
                                    </label>
                                </div>
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={16} style={{ marginTop: "30px" }}>
                        <Col span={24}>
                            <Card bordered={true}
                                title={
                                    <>
                                        <Row>
                                            <Col span={16}>
                                                <label>จำนวน Issue</label>
                                            </Col>
                                            <Col span={6} hidden={cusProduct?.length > 1 ? false : true}>
                                                <Select
                                                    placeholder="Select Product"
                                                    showSearch
                                                    allowClear
                                                    defaultActiveFirstOption
                                                    style={{ width: "100%" }}
                                                    filterOption={(input, option) =>
                                                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                    onChange={(value) => setSelectCusProduct(value)}
                                                    options={cusProduct && cusProduct.map((n) => ({ value: n.ProductId, label: n.Name + ` (${n.FullName})` }))}
                                                >
                                                </Select>
                                            </Col>
                                        </Row>
                                    </>
                                }
                                extra={
                                    <>
                                        <Checkbox style={{ display: cusProduct?.length > 1 ? "block" : "none" }} onChange={(value) => setIsStack(value.target.checked)}>
                                            Is Stack
                                        </Checkbox>

                                        <Button type="default"
                                            onClick={() => ExportExcel(excelData)}
                                            icon={
                                                <img
                                                    style={{ height: "25px" }}
                                                    src={`${process.env.PUBLIC_URL}/icons-excel.png`}
                                                    alt="Excel Export"
                                                />
                                            }>
                                            Export
                                        </Button>
                                    </>
                                }
                            >
                                <Column {...config}
                                    style={{ height: 350 }}
                                    data={chartData.filter((n) => n.value !== 0)}
                                    xAxis={{
                                        position: "bottom",
                                    }}
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            </Spin>
        </MasterPage >
    )
}
