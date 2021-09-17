import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/charts';
import MasterPage from '../MasterPage'
import { Row, Col, Card, Spin, DatePicker, Tabs, Select, Checkbox, Button, Progress } from 'antd';
import { FileOutlined } from '@ant-design/icons';
import Axios from "axios";
import { useHistory } from 'react-router-dom';
import xlsx from 'xlsx';
import moment from "moment";
import { Icon } from '@iconify/react';

const { Meta } = Card;

export default function MyDashboard() {
    const history = useHistory();
    const [loading, setLoading] = useState(false);

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
        await Axios.get(process.env.REACT_APP_API_URL + "/master/customer-products", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
        }).then((result) => {
            setCusProduct(result.data)
        }).catch((error) => {

        })
    }

    const getData = async (param) => {
        setLoading(true);
        await Axios({
            url: process.env.REACT_APP_API_URL + "/dashboard/customer/mytask",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                product_id: selectCusProduct
            }
        }).then((result) => {
            setLoading(false);
            setDashboard(result.data.total[0]);
            setChartData(result.data.chartdata.map((n) => ({
                productcode: n.ProductCode,
                status: n.Status === "Resolved" ? "Waiting Deploy" : n.Status,
                value: n.Value
            })));
            setExcelData(result.data.exceldata)
        }).catch(() => {
            setLoading(false);
        })
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
                        <Col xs={24} sm={12} md={8} lg={8} xl={4}>
                            <Card bordered hoverable
                                style={{ width: "100%" }}
                                onClick={() => history.push({ pathname: "/customer/issue/mytask" })}
                            >
                                <Row>
                                    <Col span={12}>
                                        <Progress type="circle" strokeColor="#5B8FF9" percent={Math.round((dashboard?.MyTask * 100) / dashboard?.Total)} width={60} />
                                    </Col>
                                    <Col span={12} style={{ textAlign: "center" }}>
                                        <Meta
                                            //avatar={<FileOutlined style={{ fontSize: 25 }} />}
                                            title={<label className="card-title-menu" style={{ color: "#5B8FF9" }}>MyTask</label>}
                                            description={
                                                <label className="dashboard-card-value" >
                                                    {dashboard?.MyTask}
                                                </label>
                                            }
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={8} xl={4}>
                            <Card bordered hoverable
                                style={{ width: "100%" }}
                                onClick={() => history.push({ pathname: "/customer/issue/inprogress" })}
                            >
                                <Row>
                                    <Col span={12}>
                                        <Progress type="circle" strokeColor="#8CD170" percent={Math.round((dashboard?.InProgress * 100) / dashboard?.Total)} width={60} />
                                    </Col>
                                    <Col span={12} style={{ textAlign: "center" }}>
                                        <Meta
                                            title={<label className="card-title-menu" style={{ color: "#8CD170" }}>InProgress</label>}
                                            description={
                                                <label className="dashboard-card-value" >
                                                    {dashboard?.InProgress}
                                                </label>
                                            }
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={8} xl={4}>
                            <Card bordered hoverable
                                style={{ width: "100%" }}
                                onClick={() => history.push({ pathname: "/customer/issue/pass" })}
                            >
                                <Row>
                                    <Col span={8}>
                                        <Progress type="circle" strokeColor="#FF5500" percent={Math.round((dashboard?.Resolved * 100) / dashboard?.Total)} width={60} />
                                    </Col>
                                    <Col span={16} style={{ textAlign: "center" }}>
                                        <Meta
                                            title={<label className="card-title-menu" style={{ color: "#FF5500" }}>Waiting Deploy</label>}
                                            description={
                                                <label className="dashboard-card-value" >
                                                    {dashboard?.Resolved}
                                                </label>
                                            }
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={8} xl={4}>
                            <Card bordered hoverable
                                style={{ width: "100%" }}
                                onClick={() => history.push({ pathname: "/customer/issue/cancel" })}
                            >
                                <Row>
                                    <Col span={12}>
                                        <Progress type="circle" strokeColor="#CD201F" percent={Math.round((dashboard?.Cancel * 100) / dashboard?.Total)} width={60} />
                                    </Col>
                                    <Col span={12} style={{ textAlign: "center" }}>
                                        <Meta
                                            title={<label className="card-title-menu" style={{ color: "#CD201F" }}>Cancel</label>}
                                            description={
                                                <label className="dashboard-card-value" >
                                                    {dashboard?.Cancel}
                                                </label>
                                            }
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={8} xl={4}>
                            <Card bordered hoverable
                                style={{ width: "100%" }}
                                onClick={() => history.push({ pathname: "/customer/issue/complete" })}
                            >
                                <Row>
                                    <Col span={12}>
                                        <Progress type="circle" strokeColor="#87D068" percent={Math.round((dashboard?.Complete * 100) / dashboard?.Total)} width={60} />
                                    </Col>
                                    <Col span={12} style={{ textAlign: "center" }}>
                                        <Meta
                                            title={<label className="card-title-menu" style={{ color: "#87D068" }}>Complete</label>}
                                            description={
                                                <label className="dashboard-card-value" >
                                                    {dashboard?.Complete}
                                                </label>
                                            }
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={8} xl={4}>
                            <Card bordered={true} style={{ width: "100%" }}>
                                <Meta style={{ textAlign: "center" }}
                                    title={<label className="card-title-menu" >Total</label>}
                                    description={
                                        <label className="dashboard-card-value" >
                                            {dashboard?.Total}
                                        </label>
                                    }
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={16} style={{ marginTop: "30px" }}>
                        <Col span={24}>
                            <Card bordered={true} className="card-dashboard"
                                title={
                                    <>
                                        <Row>
                                            <Col span={16}>
                                                <label>จำนวน Issue</label>
                                            </Col>
                                            <Col span={8} hidden={cusProduct?.length > 1 ? false : true}>
                                                <Select
                                                    placeholder="Select Product"
                                                    mode="multiple"
                                                    showSearch
                                                    allowClear
                                                    maxTagCount={1}
                                                    defaultActiveFirstOption
                                                    style={{ width: "100%" }}
                                                    filterOption={(input, option) =>
                                                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                    onChange={(value) => setSelectCusProduct(value)}
                                                    options={cusProduct && cusProduct.map((n) => ({ value: n.ProductId, label: n.Name + ` (${n.FullName})` }))}
                                                >
                                                </Select>
                                                &nbsp;
                                            </Col>
                                        </Row>
                                    </>
                                }
                                extra={
                                    <>
                                        <Row align="middle">
                                            <Col span={24} style={{ marginLeft: 10 }}>
                                                <Checkbox style={{ display: cusProduct?.length > 1 ? "inline-block" : "none" }} onChange={(value) => setIsStack(value.target.checked)}>
                                                    Is Stack
                                                </Checkbox>

                                                <Button type="text"
                                                    onClick={() => ExportExcel(excelData)}
                                                    icon={
                                                        <Icon icon="vscode-icons:file-type-excel2" fontSize="18px" />
                                                    }
                                                >
                                                    <label style={{ fontSize: "16px", cursor: "pointer" }}> Export </label>
                                                </Button>
                                            </Col>
                                        </Row>
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
