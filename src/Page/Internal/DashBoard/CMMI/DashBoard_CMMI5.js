import React, { useEffect, useState } from "react"
import { Row, Col, Card, Table, Select, DatePicker, Button } from 'antd';
import { Column, Pie } from '@ant-design/charts';
import { BarChartOutlined, SettingOutlined } from '@ant-design/icons';
import xlsx from 'xlsx';
import axios from "axios";
import MasterPage from "../../MasterPage";
import moment from "moment"


const { Option } = Select;


export default function DashBoard_CMMI5() {
    const [loading, setLoading] = useState(false);
    const [company, setCompany] = useState([]);

    // data
    const [chartDataMonthly, setChartDataMonthly] = useState([]);
    const [chartDataDaily, setChartDataDaily] = useState([]);

    const [tableDataMonthly, setTableDataMonthly] = useState([]);
    const [tableDataDaily, setTableDataDaily] = useState([]);

    //filter
    const [selectCompany, setSelectCompany] = useState([]);
    const [selectYear, setSelectYear] = useState(moment().format("YYYY"));
    const [selectMonth, setSelectMonth] = useState(moment().format("MM"));
    const [selectType, setSelectType] = useState(1)

    const monthNameThai = [
        {
            name: "มกราคม", value: "01"
        },
        {
            name: "กุมภาพันธ์", value: "02"
        },
        {
            name: "มีนาคม", value: "03"
        },
        {
            name: "เมษายน", value: "04"
        },
        {
            name: "พฤษภาคม", value: "05"
        },
        {
            name: "มิถุนายน", value: "06"
        },
        {
            name: "กรกฎาคม", value: "07"
        },
        {
            name: "สิงหาคม", value: "08"
        },
        {
            name: "กันยายน", value: "09"
        },
        {
            name: "ตุลาคม", value: "10"
        },
        {
            name: "พฤศจิกายน", value: "11"
        },
        {
            name: "ธันวาคม", value: "12"
        },
    ]

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
        setLoading(true);
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
            setChartDataMonthly(res.data.chartData);
            setTableDataMonthly(res.data.tableData);

            setChartDataDaily(res.data.chartData);
            setTableDataDaily(res.data.tableData);

            setLoading(false);
        }).catch((error) => {

        });
    }

    useEffect(() => {
        getCompany();
    }, [])

    useEffect(() => {
        getData();
    }, [selectCompany, selectYear, selectMonth, selectType])

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
                                    <Col span={10}>
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
                                    <Col span={2}>
                                        <Select
                                            defaultValue={selectType}
                                            style={{ width: "90%" }}
                                            onChange={(value) => setSelectType(value)}
                                        >
                                            <Option value={1}>รายเดือน</Option>
                                            <Option value={2}>รายวัน</Option>
                                        </Select>
                                    </Col>
                                    <Col span={4}>
                                        <DatePicker
                                            defaultValue={moment()}
                                            picker="year" onChange={(date, dateString) => setSelectYear(dateString)}
                                        />&nbsp;
                                        <Select
                                            defaultValue={moment().format("MM")}
                                            style={{ width: 120, display: selectType === 1 ? "none" : "inline-block" }}
                                            onChange={(value) => { console.log("xxx", value + "x"); setSelectMonth(value) }}
                                            options={monthNameThai.map((n) => ({ value: n.value, label: n.name }))}
                                        />
                                        <Button type="link"
                                            //onClick={() => exportExcel(tableData && tableData)}
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
                        {
                            selectType === 1 ?
                                <Column
                                    data={chartDataMonthly && chartDataMonthly.filter((n) => n.Value !== 0)}
                                    height={300}
                                    xField="Code"
                                    yField="Value"
                                    seriesField="Code"
                                    xAxis={{ position: "bottom" }}
                                    columnWidthRatio={0.3}
                                    legend={{
                                        layout: "horizontal",
                                        position: "bottom"
                                    }}
                                    label={{
                                        position: "middle",
                                        style: { fill: '#fff' },
                                        content: (item) => {
                                            return item?.Value?.toFixed(0);
                                        }
                                    }}
                                    color="#87D068"
                                />
                                : <Column
                                    data={chartDataDaily && chartDataDaily.filter((n) => n.Value !== 0)}
                                    height={300}
                                    xField="Code"
                                    yField="Value"
                                    seriesField="Code"
                                    xAxis={{ position: "bottom" }}
                                    columnWidthRatio={0.3}
                                    legend={{
                                        layout: "horizontal",
                                        position: "bottom"
                                    }}
                                    label={{
                                        position: "middle",
                                        style: { fill: '#fff' },
                                        content: (item) => {
                                            return item?.Value?.toFixed(0);
                                        }
                                    }}
                                    color="#87D068"
                                />
                        }

                    </Card>
                </Col>
            </Row>

            {
                selectType === 1 ?
                    <Row gutter={16} style={{ padding: "10px 24px 0px 24px" }}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Table dataSource={tableDataMonthly && tableDataMonthly} loading={loading}
                                size="small"
                                pagination={{ pageSize: 10 }}
                            >

                                <Column title="Company" dataIndex="Code" />
                                <Column title="Jan" align="center" dataIndex="Jan" />
                                <Column title="Feb" align="center" dataIndex="Feb" />
                                <Column title="Mar" align="center" dataIndex="Mar" />
                                <Column title="Apr" align="center" dataIndex="Apr" />
                                <Column title="May" align="center" dataIndex="May" />
                                <Column title="Jun" align="center" dataIndex="Jun" />
                                <Column title="Jul" align="center" dataIndex="Jul" />
                                <Column title="Aug" align="center" dataIndex="Aug" />
                                <Column title="Sep" align="center" dataIndex="Sep" />
                                <Column title="Oct" align="center" dataIndex="Oct" />
                                <Column title="Nov" align="center" dataIndex="Nov" />
                                <Column title="Dec" align="center" dataIndex="Dec" />
                                <Column title=""
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="header-text">
                                                    {
                                                        record.Jan + record.Feb + record.Mar + record.Apr + record.May + record.Jun +
                                                        record.Jul + record.Aug + record.Sep + record.Oct + record.Nov + record.Dec
                                                    }
                                                </label>
                                            </>
                                        )
                                    }} />
                            </Table>
                        </Col>
                    </Row>
                    : <Row gutter={16} style={{ padding: "10px 24px 0px 24px" }}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <Table dataSource={tableDataDaily && tableDataDaily} loading={loading}
                                scroll={{ x: 3500 }}
                                size="small"
                                pagination={{ pageSize: 10 }}
                            >

                                <Column title="Company" fixed="left" width="200px" dataIndex="Code" />
                                <Column title="DAY1" align="center" dataIndex="DAY1" />
                                <Column title="DAY2" align="center" dataIndex="DAY2" />
                                <Column title="DAY3" align="center" dataIndex="DAY3" />
                                <Column title="DAY4" align="center" dataIndex="DAY4" />
                                <Column title="DAY5" align="center" dataIndex="DAY5" />
                                <Column title="DAY6" align="center" dataIndex="DAY6" />
                                <Column title="DAY7" align="center" dataIndex="DAY7" />
                                <Column title="DAY8" align="center" dataIndex="DAY8" />
                                <Column title="DAY9" align="center" dataIndex="DAY9" />
                                <Column title="DAY10" align="center" dataIndex="DAY10" />
                                <Column title="DAY11" align="center" dataIndex="DAY11" />
                                <Column title="DAY12" align="center" dataIndex="DAY12" />
                                <Column title="DAY13" align="center" dataIndex="DAY13" />
                                <Column title="DAY14" align="center" dataIndex="DAY14" />
                                <Column title="DAY15" align="center" dataIndex="DAY15" />
                                <Column title="DAY16" align="center" dataIndex="DAY16" />
                                <Column title="DAY17" align="center" dataIndex="DAY17" />
                                <Column title="DAY18" align="center" dataIndex="DAY18" />
                                <Column title="DAY19" align="center" dataIndex="DAY19" />
                                <Column title="DAY20" align="center" dataIndex="DAY20" />
                                <Column title="DAY21" align="center" dataIndex="DAY21" />
                                <Column title="DAY22" align="center" dataIndex="DAY22" />
                                <Column title="DAY23" align="center" dataIndex="DAY23" />
                                <Column title="DAY24" align="center" dataIndex="DAY24" />
                                <Column title="DAY25" align="center" dataIndex="DAY25" />
                                <Column title="DAY26" align="center" dataIndex="DAY26" />
                                <Column title="DAY27" align="center" dataIndex="DAY27" />
                                <Column title="DAY28" align="center" dataIndex="DAY28" />
                                {
                                    selectMonth === "2" ? "" :
                                        <Column title="Day29" align="center" dataIndex="DAY29" />
                                }

                                {
                                    selectMonth === "2" ? "" :
                                        <Column title="Day30" align="center" dataIndex="DAY30" />
                                }

                                {
                                    parseInt(selectMonth) % 2 === 0 ? "" :
                                        <Column title="Day31" align="center" dataIndex="DAY31" />
                                }
                            </Table>
                        </Col>
                    </Row>


            }

        </MasterPage >
    )
}