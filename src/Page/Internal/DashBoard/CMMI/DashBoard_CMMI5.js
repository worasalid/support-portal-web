import React, { useEffect, useState } from "react"
import { Row, Col, Card, Table, Select, DatePicker, Button } from 'antd';
import { Column, Pie } from '@ant-design/charts';
import { BarChartOutlined } from '@ant-design/icons';
import { Icon } from '@iconify/react';
import xlsx from 'xlsx';
import axios from "axios";
import MasterPage from "../../MasterPage";
import moment from "moment"
import { useHistory } from "react-router-dom";

const { Option } = Select;

export default function DashBoard_CMMI5() {
    const history = useHistory(null);
    const [loading, setLoading] = useState(false);
    const [company, setCompany] = useState([]);

    // data
    const [chartDataMonthly, setChartDataMonthly] = useState([]);
    const [chartDataDaily, setChartDataDaily] = useState([]);

    const [tableDataMonthly, setTableDataMonthly] = useState([]);
    const [tableDataDaily, setTableDataDaily] = useState([]);
    const [excelDataMonthly, setExcelDataMonthly] = useState([]);
    const [excelDataDaily, setExcelDataDaily] = useState([]);

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
            setExcelDataMonthly(res.data.tableData);

            setChartDataDaily(res.data.chartData);
            setTableDataDaily(res.data.tableData);
            setExcelDataDaily(res.data.tableData);


            setLoading(false);
        }).catch((error) => {

        });
    }

    const exportExcelDaily = (json) => {
        if (json !== undefined) {
            let ws = xlsx.utils.json_to_sheet(json.map((n, index) => {
                return {
                    No: index + 1,
                    Company: n.Code,
                    DAY1: n.DAY1,
                    DAY2: n.DAY2,
                    DAY3: n.DAY3,
                    DAY4: n.DAY4,
                    DAY5: n.DAY5,
                    DAY6: n.DAY6,
                    DAY7: n.DAY7,
                    DAY8: n.DAY8,
                    DAY9: n.DAY9,
                    DAY10: n.DAY10,
                    DAY11: n.DAY11,
                    DAY12: n.DAY12,
                    DAY13: n.DAY13,
                    DAY14: n.DAY14,
                    DAY15: n.DAY15,
                    DAY16: n.DAY16,
                    DAY17: n.DAY17,
                    DAY18: n.DAY18,
                    DAY19: n.DAY19,
                    DAY20: n.DAY20,
                    DAY21: n.DAY21,
                    DAY22: n.DAY22,
                    DAY23: n.DAY23,
                    DAY24: n.DAY24,
                    DAY25: n.DAY25,
                    DAY26: n.DAY26,
                    DAY27: n.DAY27,
                    DAY28: n.DAY28,
                    DAY29: n.DAY29,
                    DAY30: n.DAY30,
                    DAY31: n.DAY31,
                }
            }));

            let wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws, 'sheet1');
            xlsx.writeFile(wb, `DashBoard CMMI 5 (Daily) - ${moment().format("YYMMDD_HHmm")}.xlsx`);
        }
    }

    const exportExcelMonthly = (json) => {
        if (json !== undefined) {
            let ws = xlsx.utils.json_to_sheet(json.map((n, index) => {
                return {
                    No: index + 1,
                    Company: n.Code,
                    Jan: n.Jan,
                    Feb: n.Feb,
                    Mar: n.Mar,
                    Apr: n.Apr,
                    May: n.May,
                    Jun: n.Jun,
                    Jul: n.Jul,
                    Aug: n.Aug,
                    Sep: n.Sep,
                    Oct: n.Oct,
                    Nov: n.Nov,
                    Dec: n.Dec
                }
            }));

            let wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws, 'sheet1');
            xlsx.writeFile(wb, `DashBoard CMMI 5 (Monthly) - ${moment().format("YYMMDD_HHmm")}.xlsx`);
        }
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
                                    <Col span={8}>
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
                                    <Col span={3}>
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
                                            onClick={() => selectType === 1 ?
                                                exportExcelMonthly(excelDataMonthly && excelDataMonthly) :
                                                exportExcelDaily(excelDataDaily && excelDataDaily)
                                            }
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
                                <Column title=""
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <Button type="text"
                                                    onClick={() => history.push({ pathname: "/internal/dashboard/cmmi/dashboard_cmmi5_1/id=" + record.CompanyId + "/year=" + selectYear })}
                                                    icon={<Icon icon="ion:ellipsis-horizontal-sharp" fontSize={24} style={{ cursor: "pointer" }} />}
                                                />
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