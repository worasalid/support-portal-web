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

export default function DashBoard_CMMI3() {
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
        await Axios.get(process.env.REACT_APP_API_URL + "/dashboard/cmmi/dashboard_cmmi3", {
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
        getPriority();

    }, [])

    useEffect(() => {

        if (selectCompany !== null && selectCompany.length !== 0) {
            getData();
            getProduct()
        }
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
                                        <RangePicker format="DD/MM/YYYY" style={{ width: "90%" }}
                                            onChange={(date, dateString) => setSelectDate(dateString)}
                                        />
                                        {/* <Button type="link"
                                            onClick={() => exportExcel(tableData && tableData)}
                                            title="Excel Export"
                                        >
                                            <img
                                                style={{ height: "25px" }}
                                                src={`${process.env.PUBLIC_URL}/icons-excel.png`}
                                                alt="Excel Export"
                                            />
                                        </Button> */}
                                    </Col>
                                </Row>
                            </>
                        }
                    >
                        <Table dataSource={tableData} loading={loading} bordered size="small"
                            scroll={{ x: 2500 }}
                        >

                            <Column title="Company" key="key"
                                align="center"
                                width="10%"
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
                                width="10%"
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
                                width="5%"
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
                            <ColumnGroup title="SLA" width="10%">
                                <Column title="นาที" align="center" dataIndex="SLA" />
                                <Column title="ระดับ บริการ" align="center" />
                            </ColumnGroup>
                            <ColumnGroup title="ประมาณการ" width="10%">
                                <Column title="จำนวน" align="center" />
                                <Column title="นาที" align="center" />
                            </ColumnGroup>
                            <ColumnGroup title="เกิดขึ้นจริง" width="10%">
                                <Column title="จำนวน" align="center" dataIndex="IssueCnt" />
                                <Column title="นาที" align="center" dataIndex="IssueAllMinute" />
                                <Column title="เฉลี่ย (นาที)" align="center"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="table-column-text12">
                                                    {parseFloat(record.IssueAllMinute / record.IssueCnt).toFixed(2)}
                                                </label>
                                            </>
                                        )
                                    }}
                                />
                            </ColumnGroup>
                            <ColumnGroup title="ผลต่าง" width="10%">
                                <Column title="จำนวน" align="center" />
                                <Column title="นาที" align="center" />
                                <Column title="% (นาที)" align="center" />
                            </ColumnGroup>

                            <ColumnGroup title="เปรียบเทียบกับSLA" width="20%">
                                <ColumnGroup title="ภายใน SLA" >
                                    <Column title="จำนวน" align="center" dataIndex="IssueNotOver" />
                                    <Column title="นาที" align="center" dataIndex="IssueNotOver_Minute" />
                                    <Column title="เฉลี่ย (นาที)" align="center"
                                        render={(value, record, index) => {
                                            return (
                                                <>
                                                    <label className="table-column-text12">
                                                        {parseFloat(record.IssueNotOver_Minute / record.IssueNotOver).toFixed(2)}
                                                    </label>
                                                </>
                                            )
                                        }}
                                    />
                                </ColumnGroup>
                                <ColumnGroup title="เกิน SLA">
                                    <Column title="จำนวน" align="center" dataIndex="IssueOver" />
                                    <Column title="นาที" align="center" dataIndex="IssueOver_Minute" />
                                    <Column title="เฉลี่ย (นาที)" align="center"
                                        render={(value, record, index) => {
                                            return (
                                                <>
                                                    <label className="table-column-text12">
                                                        {record.IssueOver_Minute === 0 ? 0 : parseFloat(record.IssueOver_Minute / record.IssueOver).toFixed(2)}
                                                    </label>
                                                </>
                                            )
                                        }}
                                    />
                                </ColumnGroup>
                            </ColumnGroup>

                        </Table>
                    </Card>
                    {/* </div> */}
                </Col>
            </Row>

        </MasterPage>
    )
}