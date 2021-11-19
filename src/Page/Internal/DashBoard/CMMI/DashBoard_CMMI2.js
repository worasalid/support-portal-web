// Dashboard สรุปจำนวนการให้บริการ รายปี
import React, { useEffect, useState } from "react"
import { Row, Col, Card, Spin, Table, Select, DatePicker, Modal, Button } from 'antd';
import { Line } from '@ant-design/charts';
import { BarChartOutlined } from '@ant-design/icons';
import xlsx from 'xlsx';
import Axios from "axios";
import MasterPage from "../../MasterPage";
import moment from "moment"

const { Column, ColumnGroup } = Table;

export default function DashBoard_CMMI2() {
    const [loading, setLoading] = useState(true);
    const [modalChart, setModalChart] = useState(false);

    const [tableData, setTableData] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [company, setCompany] = useState([]);
    const [product, setProduct] = useState([]);
    const [priority, setPriority] = useState([]);

    // filter
    const [selectCompany, setSelectCompany] = useState(null);
    const [selectRow, setSelectRow] = useState([]);
    const [selectProduct, setSelectProduct] = useState([]);
    const [selectPriority, setSelectPriority] = useState([]);
    const [selectYear, setSelectYear] = useState(moment().format("YYYY"))

    var config = {
        xField: 'month',
        yField: 'total',
        seriesField: 'product',
        height: 500,
        yAxis: {
            label: {
                formatter: function formatter(v) {
                    return ''.concat(v).replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
                        return ''.concat(s, ',');
                    });
                },
            },
        },
        //color: ['#1979C9', '#D62A0D', '#FAA219'],

    };

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
        await Axios.get(process.env.REACT_APP_API_URL + "/dashboard/cmmi/dashboard_cmmi2", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                companyId: selectCompany,
                productId: selectProduct,
                priorityId: selectPriority,
                year: selectYear
            }
        }).then((res) => {
            setLoading(false);
            console.log("chartdata", res.data.chartdata)
            console.log("tabledata", res.data.tabledata)
            setTableData(res.data.tabledata)

            setChartData(res.data.chartdata.map((n, index) => ({
                company: n.CompanyName,
                product: n.Product,
                month: n.Month.toString(),
                total: n.Total
            })));

        }).catch((error) => {

        })
    }

    const exportExcel = (json) => {
        if (json !== undefined) {
            let ws = xlsx.utils.json_to_sheet(json.map((n, index) => {
                return {
                    No: index + 1,
                    บริษัท: n.CompanyFullName,
                    GoLiveDate: "",
                    Product: n.Product,
                    Month1: n.Month1,
                    Month2: n.Month2,
                    Month3: n.Month3,
                    Month4: n.Month4,
                    Month5: n.Month5,
                    Month6: n.Month6,
                    Month7: n.Month7,
                    Month8: n.Month8,
                    Month9: n.Month9,
                    Month10: n.Month10,
                    Month11: n.Month11,
                    Month12: n.Month12,

                }
            }));

            let wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws, 'Issue_Company');
            xlsx.writeFile(wb, `DashBoard CMMI 1 - ${moment().format("YYMMDD_HHmm")}.xlsx`);
        }
    }

    useEffect(() => {
        getCompany();
        getData();
        getPriority();
    }, [])

    useEffect(() => {
        getData();
        if (selectCompany !== null) {
            getProduct()
        }
    }, [selectCompany, selectProduct, selectPriority, selectYear])

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
                                        <BarChartOutlined style={{ fontSize: 24, color: "#5BC726" }} /> DashBoard สรุปจำนวนการให้บริการ แยกตามประเภท Priority
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
                                        <DatePicker onChange={(date, datestring) => setSelectYear(datestring)} defaultValue={moment()} picker="year" />
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
                        <Table dataSource={tableData} loading={loading} bordered
                        // pagination={{ pageSize: 5 }}
                        >

                            <Column title="Company" key="key"
                                align="left"
                                width="15%"
                                render={(record, row, index) => {
                                    return (
                                        <label className="table-column-text12">
                                            {record.CompanyName}
                                        </label>
                                    )
                                }}
                            />
                            <Column title="Company" key="key"
                                align="left"
                                //width="65%"
                                render={(record, row, index) => {
                                    return (
                                        <label className="table-column-text12">
                                            {record.CompanyFullName}
                                        </label>
                                    )
                                }}
                            />
                            <Column title="Product" key="key"
                                align="left"
                                //width="65%"
                                render={(record, row, index) => {
                                    return (
                                        <label className="table-column-text12">
                                            {record.Product}
                                        </label>
                                    )
                                }}
                            />
                            <Column title="Priority" key="key"
                                align="left"
                                //width="65%"
                                render={(record, row, index) => {
                                    return (
                                        <label className="table-column-text12">
                                            {record.PriorityType}
                                        </label>
                                    )
                                }}
                            />
                            <ColumnGroup title="Month">
                                <Column title="1" dataIndex="Month1" />
                                <Column title="2" dataIndex="Month2" />
                                <Column title="3" dataIndex="Month3" />
                                <Column title="4" dataIndex="Month4" />
                                <Column title="5" dataIndex="Month5" />
                                <Column title="6" dataIndex="Month6" />
                                <Column title="7" dataIndex="Month7" />
                                <Column title="8" dataIndex="Month8" />
                                <Column title="9" dataIndex="Month9" />
                                <Column title="10" dataIndex="Month10" />
                                <Column title="11" dataIndex="Month11" />
                                <Column title="12" dataIndex="Month12" />
                            </ColumnGroup>

                            <Column title="Total" key="key"
                                align="left"
                                //width="65%"
                                render={(record, row, index) => {
                                    return (
                                        <label className="table-column-text12">
                                            {record.Total}
                                        </label>
                                    )
                                }}
                            />

                            <Column title="" key="key"
                                align="left"
                                //width="65%"
                                render={(value, record, index) => {
                                    return (
                                        <BarChartOutlined style={{ fontSize: 24, color: "#5BC726" }}
                                            onClick={() => {
                                                setSelectRow(record);
                                                setModalChart(true);
                                                console.log("cxx", record)
                                            }}
                                        />
                                    )
                                }}
                            />
                        </Table>

                    </Card>
                    {/* </div> */}
                </Col>

            </Row>
            <Row gutter={16} style={{ marginTop: "10px", padding: "10px 24px 24px 24px" }}>
                <Col span={24}>

                </Col>
            </Row>

            <Modal title={selectRow.CompanyFullName}
                visible={modalChart}
                width={800}
                okButtonProps={{ hidden: true }}
                cancelText="Close"
                onCancel={() => setModalChart(false)}
            >
                <Line {...config} data={chartData && chartData.filter((n) => n.company === selectRow.CompanyName)}
                    style={{ height: 500 }}
                />
            </Modal>
        </MasterPage>
    )
}