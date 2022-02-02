import React, { useEffect, useState } from "react"
import { Row, Col, Card, Spin, Table, Select, DatePicker, Button } from 'antd';
import { BarChartOutlined, SettingOutlined } from '@ant-design/icons';
import xlsx from 'xlsx';
import axios from "axios";
import MasterPage from "../../MasterPage";
import moment from "moment"
import { useRouteMatch } from "react-router-dom";

const { Column } = Table;
const { RangePicker } = DatePicker;

export default function DashBoard_CMMI5_1() {
    const match = useRouteMatch();
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectDate, setSelectDate] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [excelData, setExcelData] = useState([]);

    const getData = async () => {
        setLoading(true);
        await axios.get(`${process.env.REACT_APP_API_URL}/dashboard/cmmi/dashboard_cmmi5_1`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                companyId: `${match.params.id}`.toString(),
                year: `${match.params.year}`.toString(),
                startdate: (selectDate[0] === undefined || selectDate[0] === "") ? "" : moment(selectDate[0], "DD/MM/YYYY").format("YYYY-MM-DD"),
                enddate: (selectDate[1] === undefined || selectDate[1] === "") ? "" : moment(selectDate[1], "DD/MM/YYYY").format("YYYY-MM-DD"),
            }
        }).then((res) => {
            setTableData(res.data.tableData);
            setExcelData(res.data.tableData);

            setLoading(false);
        }).catch((error) => {

        });
    }

    const exportExcel = (json) => {
        if (json !== undefined) {
            let ws = xlsx.utils.json_to_sheet(json.map((n, index) => {
                return {
                    No: index + 1,
                    CompanyName: n.CompanyName,
                    CompanyFullName: n.CompanyFullName,
                    UserName: n.DisPlayName,
                    "วันที่ Login": n.LoginDate
                }
            }));

            let wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws, 'sheet1');
            xlsx.writeFile(wb, `DashBoard CMMI 5_1 - ${moment().format("YYMMDD_HHmm")}.xlsx`);
        }
    }

    useEffect(() => {
        getData()
    }, [selectDate])

    return (
        <MasterPage bgColor="#f0f2f5">
            <Row gutter={16} style={{ padding: "10px 24px 0px 24px" }}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Card
                        style={{ width: "100%" }} className="card-dashboard"
                        bordered={true}
                        title={
                            <>
                                <Row>
                                    <Col span={24}>
                                        <BarChartOutlined style={{ fontSize: 24, color: "#5BC726" }} /> รายงานสรุปจำนวนการ Login เข้าใช้งานระบบ (Summary)
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={20} style={{ textAlign: "right" }}>
                                        <RangePicker format="DD/MM/YYYY" onChange={(date, datestring) => setSelectDate(datestring)} />
                                    </Col>

                                    <Col span={4}>
                                        <Button type="link"
                                            onClick={() => exportExcel(excelData)}
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
                        <Table dataSource={tableData} loading={loading}

                            pagination={{ pageSize: 10 }}
                        >
                             <Column title="Code" dataIndex="CompanyName" />
                            <Column title="Company" dataIndex="CompanyFullName" />
                            <Column title="UserName" align="center" dataIndex="DisPlayName" />
                            <Column title="วันที่ Login" align="center" dataIndex="LoginDate" />
                        </Table>

                    </Card>
                </Col>
            </Row>
        </MasterPage>
    )
}