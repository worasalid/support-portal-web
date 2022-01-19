import React, { useEffect, useState } from "react"
import { Row, Col, Card, Spin, Table, Select, DatePicker, Modal, Form, Input } from 'antd';
import { Column, Pie } from '@ant-design/charts';
import { BarChartOutlined, SettingOutlined } from '@ant-design/icons';
import xlsx from 'xlsx';
import axios from "axios";
import MasterPage from "../../MasterPage";
import moment from "moment"

export default function DashBoard_CMMI5() {
    const [loading, setLoading] = useState(false);
    const [company, setCompany] = useState([]);
    const [chartData, setChartData] = useState([]);

    //filter
    const [selectCompany, setSelectCompany] = useState([]);
    const [selectYear, setSelectYear] = useState(moment().format("YYYY"));
    const [selectMonth, setSelectMonth] = useState(moment().format("MM"));
    const [selectType, setSelectType] = useState(1)

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

    const getData = async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/dashboard/cmmi/dashboard_cmmi5`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                companyId: selectCompany,
                year: selectYear,
                month: selectMonth,
                type: selectType
            }
        }).then((res) => {

        }).catch((error) => {

        });
    }

    useEffect(() => {
        getCompany();
        getData();
    }, [])

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
                                    <Col span={6}>
                                        <BarChartOutlined style={{ fontSize: 24, color: "#5BC726" }} /> รายงานสรุปจำนวนการ Login (Summary)
                                    </Col>

                                    <Col span={6}>
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
                                </Row>
                            </>
                        }
                    >

                    </Card>
                </Col>
            </Row>

            <Row gutter={16} style={{ padding: "10px 24px 0px 24px" }}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Table loading={loading} size="small"
                        pagination={{ pageSize: 5 }}
                    >
                    </Table>
                </Col>
            </Row>
        </MasterPage >
    )
}