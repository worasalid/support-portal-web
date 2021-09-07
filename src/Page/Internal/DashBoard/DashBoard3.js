import React, { useState, useEffect } from 'react';
import { Column, Pie } from '@ant-design/charts';
import MasterPage from '../MasterPage'
import { Row, Col, Card, Spin, Table, Select, DatePicker, Checkbox, Button } from 'antd';
import moment from "moment"
import Axios from "axios";
import xlsx from 'xlsx'
import { BarChartOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;


export default function Dashboard3() {
    const [loading, setLoading] = useState(true);

    //data
    const [product, setProduct] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [excelData, setExcelData] = useState([]);

    // filter
    const [selectProduct, setSelectProduct] = useState([]);
    const [selectDate, setSelectDate] = useState([]);
    const [isStack, setIsStack] = useState(false)

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
            //if (x.status === "ReOpen") { return "#CD201F" }//สีแดง
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
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/dashboard/dashboard3",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    product_id: selectProduct?.value,
                    startdate: (selectDate[0] === undefined || selectDate[0] === "") ? "" : moment(selectDate[0], "DD/MM/YYYY").format("YYYY-MM-DD"),
                    enddate: (selectDate[1] === undefined || selectDate[1] === "") ? "" : moment(selectDate[1], "DD/MM/YYYY").format("YYYY-MM-DD"),
                }
            });

            if (result.status === 200) {
                setChartData(result.data.chartdata);
                setTableData(result.data.tabledata);
                setExcelData(result.data.exceldata);

                setLoading(false);
            }

        } catch (error) {
            setLoading(false);
        }


    }

    const ExportExcel = (json) => {
        if (json !== undefined) {
            let ws = xlsx.utils.json_to_sheet(json.map((x) => {
                return {
                    No: x.Row,
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
            xlsx.writeFile(wb, `DashBoard All Site (OverDue) By Product - ${moment().format("YYMMDD_HHmm")}.xlsx`);
        }
    }


    useEffect(() => {
        getProduct();
    }, [])

    useEffect(() => {
        getData();
    }, [selectProduct?.value, selectDate && selectDate[0], isStack]);


    return (
        <MasterPage bgColor="#f0f2f5">
            <Spin spinning={loading}>
                {/* <Row gutter={16} style={{ marginTop: "0px", padding: "10px 24px 0px 0px" }}>
                    <Col span={24} style={{ textAlign: "right" }}>
                        <label
                            style={{ fontSize: 10 }}
                            hidden={selectProduct.length === 0 ? true : false}
                        >ข้อมูลล่าสุดเมื่อ : {moment().format("DD/MM/YYYY HH:mm:ss")}</label>
                    </Col>
                </Row> */}

                <Row gutter={16} style={{ padding: "10px 24px 0px 24px" }}>
                    <Col span={24}>
                        {/* <div > */}
                        <Card
                            title={
                                <Row>
                                    <Col span={10}>
                                        <BarChartOutlined style={{ fontSize: 24, color: "#5BC726" }} /> DashBoard All Site (OverDue) By Product

                                    </Col>
                                    <Col span={8}>
                                        <Select
                                            placeholder="Select Product"
                                            showSearch
                                            style={{ width: "90%" }}
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            onChange={(value, item) => setSelectProduct(item)}
                                            options={product && product.map((x) => ({ value: x.Id, label: `${x.Name} - (${x.FullName})` }))}
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
                            <Column {...chartData_config}
                                data={chartData && chartData}
                                height={300}
                                xAxis={{ position: "bottom" }}
                            />
                        </Card>
                        {/* </div> */}
                    </Col>

                </Row>
                <Row gutter={16} style={{ marginTop: "10px", padding: "10px 24px 24px 24px" }}>
                    <Col span={10}>
                        <Table dataSource={tableData} loading={loading}>
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
                                width="65%"
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
                    </Col>
                    <Col span={14}>
                        <Card title="Issue Total" bordered={true} style={{ width: "100%" }} loading={loading} className="card-dashboard">
                            <Pie {...piechart_config}
                                data={tableData}
                                height={300}
                            />
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </MasterPage>
    )
}
