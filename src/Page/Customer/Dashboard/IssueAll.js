import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/charts';
import MasterPage from '../MasterPage'
import { Row, Col, Card, Spin, DatePicker, Tabs, Select, Checkbox, Button, Progress, Table, Carousel } from 'antd';
import { FileOutlined } from '@ant-design/icons';
import Axios from "axios";
import moment from 'moment';
import xlsx from 'xlsx';
import { Icon } from '@iconify/react';

const { Meta } = Card;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

export default function IssueAll() {
    const [loading, setLoading] = useState(false);

    //filter
    const [selectCusProduct, setSelectCusProduct] = useState(null);
    const [isStack, setIsStack] = useState(false);
    const [cusProduct, setCusProduct] = useState(null);

    //data
    const [dashboard, setDashboard] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [excelData, setExcelData] = useState([]);

    // chart config
    const config = {
        xField: cusProduct?.length > 1 ? 'product_code' : 'status',
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
        columnWidthRatio: isStack && selectCusProduct !== null ? 0.3 :
            isStack && selectCusProduct === null ? 0.5 : 0.6,
        legend: {
            layout: 'horizontal',
            position: 'bottom'
        },
        color: function color(x) {
            if (x.status === "Open") { return "#5B8FF9" }
            if (x.status === "InProgress") { return "#87D068" }
            if (x.status === "Resolved") { return "#FF5500" }
            if (x.status === "Deploy") { return "#FF5500" }
            if (x.status === "Cancel") { return "#CD201F" }
            if (x.status === "Hold") { return "#CD201F" }
            if (x.status === "Complete") { return "#CD201F" }
        }
    }

    const getData = async (param) => {
        setLoading(true);

        await Axios({
            url: process.env.REACT_APP_API_URL + "/dashboard/customer/all",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                product_id: selectCusProduct,
                start_date: "",
                end_date: ""
            }

        }).then((result) => {
            setLoading(false);
            setDashboard(result.data.total[0]);
            setChartData(result.data.chartdata.map((n) => {
                return {
                    product_code: n.ProductCode,
                    status: n.Status,
                    value: n.Value
                }
            }));
            setTableData(result.data.tabledata);
            setExcelData(result.data.exceldata);
        }).catch(() => {

        })
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
                <div style={{ padding: "12px 24px 24px 24px" }}>
                    {/* Dashboard */}

                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Card bordered hoverable
                                style={{ width: "100%", height: "100px" }}
                            >
                                <Row>
                                    <Col span={12}>
                                        <Progress type="circle" strokeColor="#868686" percent={Math.round((dashboard?.Open * 100) / dashboard?.Total)} width={60} />
                                    </Col>
                                    <Col span={12}>
                                        <Meta
                                            title={<label className="card-title-menu" style={{ color: "#868686" }}>Open</label>}
                                            description={
                                                <label className="dashboard-card-value" >
                                                    {dashboard?.Open}
                                                </label>
                                            }
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Card bordered hoverable
                                style={{ width: "100%", height: "100px" }}
                            >
                                <Row>
                                    <Col span={12}>
                                        <Progress type="circle" strokeColor="#8CD170" percent={Math.round((dashboard?.InProgress * 100) / dashboard?.Total)} width={60} />
                                    </Col>
                                    <Col span={12}>
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

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Card bordered hoverable
                                style={{ width: "100%", height: "100px" }}
                            >
                                <Row>
                                    <Col span={12}>
                                        <Progress type="circle" strokeColor="#FF5500" percent={Math.round((dashboard?.Resolved * 100) / dashboard?.Total)} width={60} />
                                    </Col>
                                    <Col span={12}>
                                        <Meta
                                            title={<label className="card-title-menu" style={{ color: "#FF5500" }}>Resolved</label>}
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

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Card bordered hoverable
                                style={{ width: "100%", height: "100px" }}
                            >
                                <Row>
                                    <Col span={12}>
                                        <Progress type="circle" strokeColor="#FF5500" percent={Math.round((dashboard?.Deploy * 100) / dashboard?.Total)} width={60} />
                                    </Col>
                                    <Col span={12}>
                                        <Meta
                                            title={<label className="card-title-menu" style={{ color: "#FF5500" }}>Waiting Deploy</label>}
                                            description={
                                                <label className="dashboard-card-value" >
                                                    {dashboard?.Deploy}
                                                </label>
                                            }
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={16} style={{ marginTop: 12 }}>
                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Card bordered hoverable
                                style={{ width: "100%", height: "100px" }}
                            >
                                <Row>
                                    <Col span={12}>
                                        <Progress type="circle" strokeColor="#CD201F" percent={Math.round((dashboard?.Cancel * 100) / dashboard?.Total)} width={60} />
                                    </Col>
                                    <Col span={12}>
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

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Card bordered hoverable
                                style={{ width: "100%", height: "100px" }}
                            >
                                <Row>
                                    <Col span={12}>
                                        <Progress type="circle" strokeColor="#868686" percent={Math.round((dashboard?.Hold * 100) / dashboard?.Total)} width={60} />
                                    </Col>
                                    <Col span={12}>
                                        <Meta
                                            title={<label className="card-title-menu" style={{ color: "#868686" }}>Hold</label>}
                                            description={
                                                <label className="dashboard-card-value" >
                                                    {dashboard?.Hold}
                                                </label>
                                            }
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Card bordered hoverable
                                style={{ width: "100%", height: "100px" }}
                            >
                                <Row>
                                    <Col span={12}>
                                        <Progress type="circle" strokeColor="#87D068" percent={Math.round((dashboard?.Complete * 100) / dashboard?.Total)} width={60} />
                                    </Col>
                                    <Col span={12}>
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

                        <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                            <Card bordered hoverable style={{ width: "100%", height: "100px" }}>
                                <Row>
                                    <Col span={12}>

                                    </Col>
                                    <Col span={12}>
                                        <Meta
                                            title={<label className="card-title-menu" >Total</label>}
                                            description={
                                                <label className="dashboard-card-value" >
                                                    {dashboard?.Total}
                                                </label>
                                            }
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    </Row>

                    {/* chart */}
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
                                    // tooltip=""
                                    style={{ height: 350 }}
                                    data={chartData.filter((n) => n.value !== 0)}
                                    xAxis={{
                                        position: "bottom",
                                    }}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* table */}
                    <Row gutter={16} style={{ marginTop: "30px" }}>
                        <Col span={24}>
                            <Table dataSource={tableData}>
                                <Column title="Product Code"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                {record.ProductCode}
                                            </>
                                        )
                                    }}
                                />
                                <Column title="Product Name"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                {record.ProductName}
                                            </>
                                        )
                                    }}
                                />
                                <Column title="Open" align="center"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                {record.Open}
                                            </>
                                        )
                                    }}
                                />
                                <Column title="InProgress" align="center"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                {record.InProgress}
                                            </>
                                        )
                                    }}
                                />
                                <Column title="Resolved" align="center"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                {record.Resolved}
                                            </>
                                        )
                                    }}
                                />
                                <Column title="Waiting Deploy" align="center"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                {record.Deploy}
                                            </>
                                        )
                                    }}
                                />
                                <Column title="Cancel" align="center"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                {record.Cancel}
                                            </>
                                        )
                                    }}
                                />
                                <Column title="Hold" align="center"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                {record.Hold}
                                            </>
                                        )
                                    }}
                                />
                                <Column title="Complete" align="center"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                {record.Complete}
                                            </>
                                        )
                                    }}
                                />
                                <Column title="Total" align="center"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                {record.Total}
                                            </>
                                        )
                                    }}
                                />
                            </Table>
                        </Col>
                    </Row>
                </div>
            </Spin>
        </MasterPage >
    )
}
