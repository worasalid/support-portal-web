import React, { useEffect, useRef, useState } from 'react'
import { Row, Col, Card, Spin, Table, Button, DatePicker, Select, Checkbox } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import axios from 'axios';
import MasterPage from '../MasterPage';
import moment from "moment";
import xlsx from "xlsx"

export default function DashBoard6() {
    const { RangePicker } = DatePicker;
    const { Column } = Table;
    const [loading, setLoading] = useState(false);

    //data
    const [product, setProduct] = useState(null);
    const [company, setCompany] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [excelData, setExcelData] = useState([]);

    //filter
    const [selectProduct, setSelectProduct] = useState([]);
    const [selectCompany, setSelectCompany] = useState([]);
    const [selectDate, setSelectDate] = useState([]);
    const [isOverDue, setIsOverdue] = useState(false)

    // function
    const getCompany = async () => {
        await axios.get(process.env.REACT_APP_API_URL + "/master/company", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
        }).then((res) => {
            setCompany(res.data)
        }).catch((error) => {

        })
    }

    const getProduct = async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/master/products`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
        }).then((res) => {
            setProduct(res.data);
        }).catch((error) => {

        });
    }

    const getData = async () => {
        setLoading(true);
        await axios.get(`${process.env.REACT_APP_API_URL}/dashboard/dashboard6`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                companyId: selectCompany,
                startdate: (selectDate[0] === undefined || selectDate[0] === "") ? "" : moment(selectDate[0], "DD/MM/YYYY").format("YYYY-MM-DD"),
                enddate: (selectDate[1] === undefined || selectDate[1] === "") ? "" : moment(selectDate[1], "DD/MM/YYYY").format("YYYY-MM-DD"),
                isOverDue: isOverDue
            }

        }).then((res) => {
            setTableData(res.data.tableData.map((n, index) => {
                return {
                    com_code: n.ComCode,
                    company: n.CompanyName,
                    product: n.Product,
                    cr_cnt: n.CR_Cnt,
                    memo_cnt: n.Memo_Cnt
                }
            }));

            setExcelData(res.data.excelData);
            setLoading(false);
        }).catch((error) => {

        })
    }

    const exportExcel = (json) => {
        if (json !== undefined) {
            let ws = xlsx.utils.json_to_sheet(json.map((n, index) => {
                return {
                    No: index + 1,
                    CompanyCode: n.ComCode,
                    CompanyName: n.CompanyName,
                    Ticket: n.Number,
                    IssueType: n.IssueType,
                    Priority: n.Priority,
                    Product: n.Product,
                    Module: n.Module,
                    Title: n.Title,
                    "วันที่ส่งประเมิน": moment(n.RequestEstimate).format("DD/MM/YYYY"),
                    "วันที่ประเมิน": moment(n.EstimateDate).format("DD/MM/YYYY"),
                    "ระยะเวลา ในการประเมิน": n.DateDiffEstimate,
                    "ผู้ประเมิน": n.EstimateName,
                    "จำนวน Manday ที่ประเมิน": n.Manday,
                    AssignIconDate: moment(n.AssignIconDate).format("DD/MM/YYYY"),
                    "H.Dev": n.LeaderName,
                    "DueDate แล้วเสร็จ": moment(n.Dev_DueDate).format("DD/MM/YYYY"),
                    Developer: n.DevName,
                    "จำนวนวันที่แก้ไข": n.DateDiffDevelop,
                    "วันที่ส่ง QA Test": moment(n.RequestQA).format("DD/MM/YYYY"),
                    "จำนวนวันที่ รอ QA ทดสอบ": n.DateDiffQA,
                    "QA ผู้ทดสอบ": n.QAName,
                    FlowStatus: n.FlowStatus
                }
            }));

            let wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws, 'Issue (CR,Memo)');
            xlsx.writeFile(wb, `DashBoard CR CENTER - ${moment().format("YYMMDD_HHmm")}.xlsx`);
        }
    }

    useEffect(() => {
        getCompany();
        getProduct();
    }, [])

    useEffect(() => {
        getData()
    }, [selectCompany, selectDate && selectDate[0], isOverDue])


    return (
        <MasterPage bgColor="#f0f2f5">
            <Spin spinning={loading}>
                <Row gutter={16} style={{ padding: "10px 24px 0px 24px" }}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Card
                            title={
                                <>
                                    <Row>
                                        <Col span={10}>
                                            <BarChartOutlined style={{ fontSize: 24, color: "#5BC726" }} /> รายงาน รายละเอียดข้อมูล CR , Memo
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={10}></Col>
                                        <Col span={8}>
                                            <Select
                                                placeholder="Select Company"
                                                mode='multiple'
                                                maxTagCount={2}
                                                showSearch
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
                                            <RangePicker format="DD/MM/YYYY" style={{ width: "90%" }}
                                                // disabled={selectProduct.length === 0 ? true : false}
                                                onChange={(date, dateString) => setSelectDate(dateString)}
                                            />
                                        </Col>
                                    </Row>
                                </>
                            }
                            bordered={true}
                            style={{ width: "100%" }} className="card-dashboard"
                            extra={
                                <>
                                    <div style={{ marginTop: 20 }}>
                                        {/* <Checkbox onChange={(value) => setIsStack(value.target.checked)}
                                        disabled={selectProduct.length === 0 ? true : false}
                                    >
                                        Is Stack
                                    </Checkbox> */}
                                        <Checkbox onChange={(value) => setIsOverdue(value.target.checked)}>

                                            OverDue
                                        </Checkbox>
                                        <Button type="link"
                                            onClick={() => exportExcel(excelData && excelData)}
                                            title="Excel Export"
                                        >
                                            <img
                                                style={{ height: "25px" }}
                                                src={`${process.env.PUBLIC_URL}/icons-excel.png`}
                                                alt="Excel Export"
                                            />
                                        </Button>
                                    </div>
                                </>
                            }
                        >

                            <Table dataSource={tableData}>
                                <Column title="CompanyCode" dataIndex="com_code" />
                                <Column title="CompanyName" dataIndex="company" />
                                <Column title="Product" dataIndex="product" />
                                <Column title="จำนวน CR" align='center' dataIndex="cr_cnt" />
                                <Column title="จำนวน Memo" align='center' dataIndex="memo_cnt" />
                            </Table>
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </MasterPage>
    )
}