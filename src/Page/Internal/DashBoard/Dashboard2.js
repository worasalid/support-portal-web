import React, { useState, useEffect } from 'react';
import { Column, Pie } from '@ant-design/charts';
import MasterPage from '../MasterPage'
import { Row, Col, Card, Spin, Table, Select, DatePicker, Checkbox, Button, Tabs, Empty } from 'antd';
import moment from "moment"
import Axios from "axios";
import xlsx from 'xlsx'
import { BarChartOutlined } from '@ant-design/icons';
import { Icon } from '@iconify/react';
import _ from "lodash";
import Slider from "react-slick";

const { RangePicker } = DatePicker;

export default function Dashboard3() {
    const [loading, setLoading] = useState(true);
    const [slickCount, setSlickCount] = useState(0);

    //data
    const [product, setProduct] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [excelData, setExcelData] = useState([]);
    const [tabProduct, setTabProduct] = useState([]);

    // filter
    const [selectProduct, setSelectProduct] = useState([]);
    const [selectDate, setSelectDate] = useState([]);
    const [isStack, setIsStack] = useState(false);
    const [tabSelect, setTabSelect] = useState("")

    const chartData_config = {
        xField: 'CompanyName',
        yField: 'Value',
        seriesField: 'GroupStatus',
        //isPercent: true,
        isStack: isStack,
        isGroup: !isStack,
        //scrollbar: { type: 'horizontal' },
        slider: {
            start: 0,
            end: 1,
            maxLimit: 100,
        },
        columnWidthRatio: 0.4,
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
            // if (x.developer === "InProgress") { return "#5B8FF9" } // สีฟ้า
            if (x.GroupStatus === "InProgress") { return "#52C41A" } // เขียว
            if (x.GroupStatus === "ReOpen") { return "#FF5500" } // สีส้ม
            if (x.GroupStatus === "Resolved") { return "#FF5500" } // สีส้ม
            if (x.GroupStatus === "Cancel") { return "#CD201F" }//สีแดง
        },
        onclick: function onclick() {
            alert()
        },

    };

    const piechart_config = {
        appendPadding: 10,
        angleField: 'Total',
        colorField: 'CompanyName',
        radius: 0.75,
        label: {
            type: 'spider',
            labelHeight: 28,
            content: '{name} ({value})'
            //content: '{name}\n{percentage}',
        },
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    };


    const getProduct = async () => {
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/products",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
            });

            if (result.status === 200) {
                setProduct(result.data);
                setLoading(false);
            }
        } catch (error) {

        }
    }

    const getData = async () => {
        setLoading(true);

        await Axios({
            url: process.env.REACT_APP_API_URL + "/dashboard/dashboard2",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                product_id: selectProduct,
                startdate: (selectDate[0] === undefined || selectDate[0] === "") ? "" : moment(selectDate[0], "DD/MM/YYYY").format("YYYY-MM-DD"),
                enddate: (selectDate[1] === undefined || selectDate[1] === "") ? "" : moment(selectDate[1], "DD/MM/YYYY").format("YYYY-MM-DD"),
            }
        }).then((res) => {

            setTabProduct(_.uniqBy(res.data.chartdata, 'Product').map((n) => {
                return {
                    product: n.Product
                }
            }));
            setSlickCount(Math.ceil(res.data.chartdata.length / 10))
            setChartData(res.data.chartdata.map((o, index) => {
                return {
                    no: index + 1,
                    CompanyName: o.CompanyName,
                    GroupStatus: o.GroupStatus,
                    Product: o.Product,
                    Value: o.Value
                }
            }));
            setTableData(res.data.tabledata);
            setExcelData(res.data.exceldata);
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        })
    }

    const ExportExcel = (json) => {
        if (json !== undefined) {
            let ws = xlsx.utils.json_to_sheet(json.map((o, index) => {
                return {
                    No: index + 1,
                    Issue: o.Number,
                    Company: o.CompanyName,
                    IssueType: o.IssueType,
                    Priority: o.Priority,
                    Scene: o.Scene,
                    Status: o.GroupStatus,
                    Product: o.Product,
                    Module: o.ModuleName,
                    "Task Status": o.TaskStatus,
                    FlowStatus: o.FlowStatus,
                    HandOver: o.NodeName,
                    User: o.DisplayAllName,
                    Title: o.Title,
                    AssignDate: o.AssignIconDate,
                    DueDate: o.DueDate,
                    OverDueAll: o.OverDueAll,
                    OverDue: o.OverDue,
                    "DueDate (Dev)": o.DueDate_Dev,
                    "DueDate (Dev) ครั้งที่ 2": o.DueDate_Dev2,
                    "DueDate (Dev) ครั้งที่ 3": o.DueDate_Dev3,
                    "จำนวน ReOpen": o.CntReOpen === 0 ? "" : o.CntReOpen
                }
            }));
            let wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws, 'Issue');
            xlsx.writeFile(wb, `DashBoard All Site By Product - ${moment().format("YYMMDD_HHmm")}.xlsx`);
        }
    }

    useEffect(() => {
        getProduct();
    }, [])

    useEffect(() => {
        if (selectProduct.length !== 0) {
            getData();
        }
    }, [selectProduct.length, selectDate && selectDate[0], isStack]);


    return (
        <MasterPage bgColor="#f0f2f5">
            <Spin spinning={loading}>
                <Row gutter={16} style={{ padding: "10px 24px 0px 24px" }}>
                    <Col span={24}>
                        <Card
                            title={
                                <Row>
                                    <Col span={10}>
                                        <BarChartOutlined style={{ fontSize: 24, color: "#5BC726" }} /> DashBoard All Site By Product
                                    </Col>
                                    <Col span={8}>
                                        <Select
                                            placeholder="Select Product"
                                            mode='multiple'
                                            maxTagCount={1}
                                            showSearch
                                            allowClear
                                            style={{ width: "90%" }}
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            options={product && product.map((x) => ({ value: x.Id, label: `${x.Name} - (${x.FullName})`, code: x.Name }))}
                                            onChange={(value, item) => { setSelectProduct(value) }}
                                        >
                                        </Select>
                                    </Col>
                                    <Col span={6}>
                                        <RangePicker format="DD/MM/YYYY" style={{ width: "90%" }}
                                            disabled={selectProduct.length === 0 ? true : false}
                                            onChange={(date, dateString) => setSelectDate(dateString)}
                                        />
                                    </Col>
                                </Row>
                            }
                            bordered={true}
                            style={{ width: "100%" }} className="card-dashboard"
                            extra={
                                <>
                                    <Checkbox onChange={(value) => setIsStack(value.target.checked)}
                                        disabled={selectProduct.length === 0 ? true : false}
                                    >
                                        Is Stack
                                    </Checkbox>
                                    <Button type="link"
                                        hidden={selectProduct.length === 0 ? true : false}
                                        onClick={() => ExportExcel(excelData && excelData)}
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
                            {
                                selectProduct.length === 0 ? <Empty /> :
                                    <>
                                        <Row>
                                            {
                                                tabProduct.map((n, index) => (
                                                    <Col span={2}
                                                        onClick={(value) => { setTabSelect(n.product); console.log("product", n.product) }}
                                                    >
                                                        <Button
                                                            type={
                                                                (tabSelect === "" ? tabProduct[0]?.product : tabSelect) === n.product ? 'primary' : 'default'
                                                            }
                                                            shape='round'>
                                                            <label>{n.product}</label>
                                                        </Button>
                                                    </Col>
                                                ))
                                            }
                                        </Row>
                                        <div style={{ padding: "24px 24px 0px 24px" }}>
                                            <Slider
                                                dots={true}
                                                infinite={true}
                                                speed={500}
                                                slidesToShow={1}
                                                slidesToScroll={1}
                                                swipeToSlide={true}
                                                prevArrow={
                                                    <Icon icon="dashicons:arrow-left-alt2" color="gray" />
                                                }
                                                nextArrow={
                                                    <Icon icon="dashicons:arrow-right-alt2" color="gray" />
                                                }
                                            >
                                                {
                                                    Array.from(Array(slickCount), (e, index) => {
                                                        return (
                                                            <div>
                                                                <Column {...chartData_config}
                                                                    data={
                                                                        chartData.filter((o) => o.Product === (tabSelect === "" ? tabProduct[0]?.product : tabSelect)
                                                                            && (o.no > (index) * 10) && (o.no <= (index + 1) * 10))
                                                                    }
                                                                    height={300}
                                                                    xAxis={{ position: "bottom" }}
                                                                />
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </Slider>
                                        </div>

                                        <Row gutter={16} style={{ marginTop: "48px", padding: "0px 0px 24px 24px" }}>
                                            <Col span={24}>
                                                <Card className="card-dashboard" title="">
                                                    <Table dataSource={tabSelect === "" ? tableData : _.filter(tableData, { Product: tabSelect })} loading={loading}>
                                                        <Column title="No" align="center"
                                                            width="10%"
                                                            render={(record, row, index) => {
                                                                return (
                                                                    <label className="table-column-text12">
                                                                        {index + 1}
                                                                    </label>
                                                                )
                                                            }}
                                                        />

                                                        <Column title="Company"
                                                            align="left"
                                                            width="40%"
                                                            render={(record, row, index) => {
                                                                return (
                                                                    <label className="table-column-text12">
                                                                        {record.CompanyName}
                                                                    </label>
                                                                )
                                                            }}
                                                        />

                                                        <Column title="InProgress"
                                                            align="center"
                                                            width="10%"
                                                            render={(record, row, index) => {
                                                                return (
                                                                    <label className="table-column-text12">
                                                                        {record.InProgress}
                                                                    </label>
                                                                )
                                                            }}
                                                        />

                                                        <Column title="ReOpen"
                                                            align="center"
                                                            width="10%"
                                                            render={(record, row, index) => {
                                                                return (
                                                                    <label className="table-column-text12">
                                                                        {record.ReOpen}
                                                                    </label>
                                                                )
                                                            }}
                                                        />

                                                        <Column title="Resolved"
                                                            align="center"
                                                            width="10%"
                                                            render={(record, row, index) => {
                                                                return (
                                                                    <label className="table-column-text12">
                                                                        {record.Resolved}
                                                                    </label>
                                                                )
                                                            }}
                                                        />

                                                        <Column title="Cancel"
                                                            align="center"
                                                            width="10%"
                                                            render={(record, row, index) => {
                                                                return (
                                                                    <label className="table-column-text12">
                                                                        {record.Cancel}
                                                                    </label>
                                                                )
                                                            }}
                                                        />

                                                        <Column title="Complete"
                                                            align="center"
                                                            width="10%"
                                                            render={(record, row, index) => {
                                                                return (
                                                                    <label className="table-column-text12">
                                                                        {record.Complete}
                                                                    </label>
                                                                )
                                                            }}
                                                        />

                                                        <Column title="Total"
                                                            align="center"
                                                            width="10%"
                                                            render={(record, row, index) => {
                                                                return (
                                                                    <>
                                                                        {record.Total}
                                                                    </>
                                                                )
                                                            }}
                                                        />
                                                    </Table>
                                                </Card>
                                            </Col>
                                            {/* <Col span={14}>
                                                <Card title="Issue Total" bordered={true} style={{ width: "100%" }} loading={loading} className="card-dashboard">
                                                    <Pie {...piechart_config}
                                                        data={tabSelect === "" ? tableData : _.filter(tableData, { Product: tabSelect })}
                                                        height={300}
                                                    />
                                                </Card>
                                            </Col> */}
                                        </Row>
                                    </>
                            }
                        </Card>
                    </Col>
                </Row >
            </Spin >
        </MasterPage >
    )
}
