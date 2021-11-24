import React, { useEffect, useState } from "react"
import { Row, Col, Card, Spin, Table, Select, DatePicker, Modal, Button } from 'antd';
import { Line } from '@ant-design/charts';
import { BarChartOutlined } from '@ant-design/icons';
import xlsx from 'xlsx';
import Axios from "axios";
import MasterPage from "../../MasterPage";
import moment from "moment"

const { Column, ColumnGroup } = Table;
const { RangePicker } = DatePicker;

export default function DashBoard_CMMI4() {
    const [loading, setLoading] = useState(false);

    const [tableData, setTableData] = useState([]);
    const [company, setCompany] = useState([]);
    const [product, setProduct] = useState([]);
    const [priority, setPriority] = useState([]);

    // filter
    const [selectCompany, setSelectCompany] = useState(null);
    // const [selectRow, setSelectRow] = useState([]);
    const [selectProduct, setSelectProduct] = useState([]);
    const [selectPriority, setSelectPriority] = useState([]);
    const [selectDate, setSelectDate] = useState([]);

    const [test, setTest] = useState("123")

    const getCompany = async () => {
        await Axios.get(process.env.REACT_APP_API_URL + "/master/company", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
        }).then((res) => {
            setCompany(res.data)
        }).catch((error) => {

        })
    }

    const getProduct = async () => {
        await Axios.get(process.env.REACT_APP_API_URL + "/master/customer-products", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                company_id: selectCompany
            }
        }).then((res) => {
            setProduct(res.data);

        }).catch((error) => {

        })
    }

    const getPriority = async () => {
        await Axios.get(process.env.REACT_APP_API_URL + "/master/priority", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
        }).then((res) => {
            setPriority(res.data);
        }).catch(() => {

        })
    }

    const getData = async () => {
        setLoading(true);
        await Axios.get(process.env.REACT_APP_API_URL + "/dashboard/cmmi/dashboard_cmmi4", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                companyId: selectCompany,
                productId: selectProduct,
                priorityId: selectPriority,
                startdate: (selectDate[0] === undefined || selectDate[0] === "") ? "" : moment(selectDate[0], "DD/MM/YYYY").format("YYYY-MM-DD"),
                enddate: (selectDate[1] === undefined || selectDate[1] === "") ? "" : moment(selectDate[1], "DD/MM/YYYY").format("YYYY-MM-DD"),

            }
        }).then((res) => {
            setLoading(false);
            setTableData(res.data.tabledata)


        }).catch((error) => {
            setLoading(false);
        })
    }

    const exportExcel = (json) => {
        if (json !== undefined) {
            let ws = xlsx.utils.json_to_sheet(json.map((n, index) => {
                return {
                    No: index + 1,
                    Company: n.CompanyName,
                    CompanyName: n.CompanyFullName,
                    Product: n.Product,
                    Priority: n.Priority,
                    จำนวน: n.Issue,
                    จำนวนนาที: n.TotalMinute,
                    เวลาเฉลี่ย: n.AVG_Minute,
                    เวลาต่ำสุด: n.MinMinute,
                    เวลาสูงสุด: n.MaxMinute

                }
            }));

            let wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws, 'sheet1');
            xlsx.writeFile(wb, `DashBoard CMMI 4 - ${moment().format("YYMMDD_HHmm")}.xlsx`);
        }
    }

    useEffect(() => {
        getCompany();
        getData();
        getPriority();
    }, [])

    useEffect(() => {
        getData();
        getProduct()
    }, [selectCompany, selectProduct, selectPriority, selectDate])

    return (
        <MasterPage bgColor="#f0f2f5">
            <Row gutter={16} style={{ padding: "10px 24px 0px 24px" }}>
                <Col span={24}>
                    {/* <div > */}
                    <Card
                        title={
                            <>
                                <Row>
                                    <Col span={24}>
                                        <BarChartOutlined style={{ fontSize: 24, color: "#5BC726" }} /> DashBoard สรุปและวิเคราะห์บริการ แยกตาม Product และ Priority
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: 24 }}>
                                    <Col span={4}>

                                    </Col>
                                    <Col span={8}>
                                        <Select
                                            placeholder="Select Company"
                                            mode='multiple'
                                            showSearch
                                            allowClear
                                            maxTagCount={2}
                                            style={{ width: "90%" }}
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            onChange={(value, item) => setSelectCompany(value)}
                                            options={company && company.map((x) => ({ value: x.Id, label: x.Name }))}
                                        >
                                        </Select>
                                    </Col>
                                    <Col span={6}>
                                        <Select
                                            placeholder="Select Product"
                                            mode='multiple'
                                            disabled={selectCompany === null ? true : false}
                                            showSearch
                                            allowClear
                                            maxTagCount={2}
                                            style={{ width: "90%" }}
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            onChange={(value) => setSelectProduct(value)}
                                            options={product && product.map((n) => ({ value: n.ProductId, label: n.Name }))}
                                        >
                                        </Select>
                                    </Col>
                                    <Col span={6}>
                                        <Select
                                            placeholder="Select Priority"
                                            mode='multiple'
                                            showSearch
                                            allowClear
                                            maxTagCount={2}
                                            style={{ width: "90%" }}
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            onChange={(value) => setSelectPriority(value)}
                                            options={priority && priority.map((n) => ({ value: n.Id, label: n.Name }))}
                                        >
                                        </Select>
                                    </Col>
                                </Row>
                            </>
                        }
                        bordered={true}
                        style={{ width: "100%" }} className="card-dashboard"
                        extra={
                            <>
                                <Row style={{ marginTop: 52 }}>
                                    <Col span={24}>
                                        <RangePicker format="DD/MM/YYYY" style={{ width: "80%" }}
                                            defaultValue={[moment('01/01/YYYY', "DD/MM/YYYY"), moment()]}
                                            onChange={(date, dateString) => setSelectDate(dateString)}
                                        />
                                        <Button type="link"
                                            onClick={() => exportExcel(tableData && tableData)}
                                            title="Excel Export"
                                        >
                                            <img
                                                style={{ height: "25px" }}
                                                src={`${process.env.PUBLIC_URL}/icons-excel.png`}
                                                alt="Excel Export"
                                            />
                                        </Button>
                                    </Col>
                                </Row>
                            </>
                        }
                    >
                        <Row>
                            <Col span={24} style={{ textAlign: "right" }}>
                                <label>
                                    ข้อมูล ณ วันที่ &nbsp;
                                    {
                                        selectDate[0] === undefined ?
                                            `${moment().dayOfYear(1).format("DD/MM/YYYY")} - ${moment().format("DD/MM/YYYY")}` :
                                            `${moment(selectDate[0], "DD/MM/YYYY").format("DD/MM/YYYY")} - ${moment(selectDate[1], "DD/MM/YYYY").format("DD/MM/YYYY")}`
                                    }
                                </label>
                            </Col>
                        </Row>

                        <Table dataSource={tableData} loading={loading} bordered
                        >

                            <Column title="Company" key="key"
                                align="center"
                                width="20%"
                                fixed="left"
                                render={(record, row, index) => {
                                    return (
                                        <Row>
                                            <Col span={24} style={{ textAlign: "left" }}>
                                                <label className="table-column-text12" >
                                                    {record.CompanyName}
                                                </label>
                                            </Col>
                                        </Row>
                                    )
                                }}
                            />

                            <Column title="Product" key="key"
                                align="center"
                                width="20%"
                                fixed="left"
                                render={(record, row, index) => {
                                    return (
                                        <Row>
                                            <Col span={24} style={{ textAlign: "left" }}>
                                                <label className="table-column-text12" >
                                                    {record.Product}
                                                </label>
                                            </Col>
                                        </Row>
                                    )
                                }}
                            />
                            <Column title="Priority" key="key"
                                align="left"
                                width="10%"
                                render={(record, row, index) => {
                                    return (
                                        <Row>
                                            <Col span={24} style={{ textAlign: "left" }}>
                                                <label className="table-column-text12" >
                                                    {record.Priority}
                                                </label>
                                            </Col>
                                        </Row>
                                    )
                                }}
                            />
                            <ColumnGroup title="สถิติการให้บริการ">
                                <Column title="จำนวนครั้ง" className="table-column-text12" align="center" width="10%" dataIndex="Issue" />
                                <Column title="จำนวน (นาที)" className="table-column-text12" align="center" width="10%" dataIndex="TotalMinute" />
                                <Column title="เวลาเฉลี่ย (นาที)" align="center" width="10%"
                                    render={(value, record, index) => {
                                        return (
                                            <Row>
                                                <Col span={24} style={{ textAlign: "center" }}>
                                                    <label>
                                                        {parseFloat(record.AVG_Minute).toFixed(2)}
                                                    </label>
                                                </Col>
                                            </Row>
                                        )
                                    }}
                                />
                                <Column title="เวลาต่ำสุด (นาที)" align="center" width="10%" dataIndex="MinMinute" />
                                <Column title="เวลาสูงสุด (นาที)" align="center" width="10%" dataIndex="MaxMinute" />
                            </ColumnGroup>



                        </Table>
                    </Card>
                    {/* </div> */}
                </Col>
            </Row>

        </MasterPage>
    )
}