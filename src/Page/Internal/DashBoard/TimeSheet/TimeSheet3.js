import React, { useEffect, useState } from "react";
import MasterPage from '../../MasterPage'
import { Row, Col, Card, Space, Table, Select, DatePicker, Radio, Button, Tooltip } from 'antd';
import { BarChartOutlined, SettingOutlined } from '@ant-design/icons';
import moment from "moment";
import axios from "axios";
import xlsx from 'xlsx';

const { ColumnGroup, Column } = Table;

export default function TimeSheet1() {
    const [loading, setLoading] = useState(false);
    const [company, setCompany] = useState();
    const [owner, setOwner] = useState();
    const [product, setProduct] = useState([]);
    const [issueType, setIssueType] = useState([]);
    const [tableData, setTableData] = useState([]);

    const [selectYear, setSelectYear] = useState(moment().format("YYYY"));
    const [selectMonth, setSelectMonth] = useState(moment().format("MM"));
    const [selectCompany, setSelectCompany] = useState(null);
    const [selectProduct, setSelectProduct] = useState(null);
    const [selectType, setSelectType] = useState(null);
    const [selectOwner, setSelectOwner] = useState([]);
    const [mandayType, setMandayType] = useState(1)

    const monthNameThai = [
        {
            name: "มกราคม", value: "01"
        },
        {
            name: "กุมภาพันธ์", value: "2"
        },
        {
            name: "มีนาคม", value: "3"
        },
        {
            name: "เมษายน", value: "4"
        },
        {
            name: "พฤษภาคม", value: "5"
        },
        {
            name: "มิถุนายน", value: "6"
        },
        {
            name: "กรกฎาคม", value: "7"
        },
        {
            name: "สิงหาคม", value: "8"
        },
        {
            name: "กันยายน", value: "9"
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
        await axios.get(`${process.env.REACT_APP_API_URL}/master/company`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
        }).then((res) => {
            setCompany(res.data)
        }).catch((error) => {

        })
    }

    const getDeveloper = async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/master/organize/user`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                organize_id: 2
            }
        }).then((res) => {
            setOwner(res.data);

        }).catch((error) => {

        })
    }

    const getProduct = async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/master/products`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            }
        }).then((res) => {
            setProduct(res.data);

        }).catch((error) => {

        })
    }

    const getIssueType = async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/master/issue-types`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            }
        }).then((res) => {
            setIssueType(res.data)
        }).catch((error) => {

        })
    }

    const getData = async () => {
        setLoading(true);
        await axios.get(`${process.env.REACT_APP_API_URL}/dashboard/timesheet/timesheet3`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                year: selectYear,
                month: selectMonth,
                type: selectType,
                companyId: selectCompany,
                productId: selectProduct,
                ownerId: selectOwner
            }
        }).then((res) => {
            setTableData(res.data.map((n, index) => {
                return {
                    owner: n.Owner,
                    company_code: n.CompanyCode,
                    company_name: n.CompanyName,
                    product: n.Product,
                    issue_type: n.IssueType,
                    day01: mandayType === 1 ? n.DAY01 : convertTime(n.DAY01),
                    day02: mandayType === 1 ? n.DAY02 : convertTime(n.DAY02),
                    day03: mandayType === 1 ? n.DAY03 : convertTime(n.DAY03),
                    day04: mandayType === 1 ? n.DAY04 : convertTime(n.DAY04),
                    day05: mandayType === 1 ? n.DAY05 : convertTime(n.DAY05),
                    day06: mandayType === 1 ? n.DAY06 : convertTime(n.DAY06),
                    day07: mandayType === 1 ? n.DAY07 : convertTime(n.DAY07),
                    day08: mandayType === 1 ? n.DAY08 : convertTime(n.DAY08),
                    day09: mandayType === 1 ? n.DAY09 : convertTime(n.DAY09),
                    day10: mandayType === 1 ? n.DAY10 : convertTime(n.DAY10),
                    day11: mandayType === 1 ? n.DAY11 : convertTime(n.DAY11),
                    day12: mandayType === 1 ? n.DAY12 : convertTime(n.DAY12),
                    day13: mandayType === 1 ? n.DAY13 : convertTime(n.DAY13),
                    day14: mandayType === 1 ? n.DAY14 : convertTime(n.DAY14),
                    day15: mandayType === 1 ? n.DAY15 : convertTime(n.DAY15),
                    day16: mandayType === 1 ? n.DAY16 : convertTime(n.DAY16),
                    day17: mandayType === 1 ? n.DAY17 : convertTime(n.DAY17),
                    day18: mandayType === 1 ? n.DAY18 : convertTime(n.DAY18),
                    day19: mandayType === 1 ? n.DAY19 : convertTime(n.DAY19),
                    day20: mandayType === 1 ? n.DAY20 : convertTime(n.DAY20),
                    day21: mandayType === 1 ? n.DAY21 : convertTime(n.DAY21),
                    day22: mandayType === 1 ? n.DAY22 : convertTime(n.DAY22),
                    day23: mandayType === 1 ? n.DAY23 : convertTime(n.DAY23),
                    day24: mandayType === 1 ? n.DAY24 : convertTime(n.DAY24),
                    day25: mandayType === 1 ? n.DAY25 : convertTime(n.DAY25),
                    day26: mandayType === 1 ? n.DAY26 : convertTime(n.DAY26),
                    day27: mandayType === 1 ? n.DAY27 : convertTime(n.DAY27),
                    day28: mandayType === 1 ? n.DAY28 : convertTime(n.DAY28),
                    day29: mandayType === 1 ? n.DAY29 : convertTime(n.DAY29),
                    day30: mandayType === 1 ? n.DAY30 : convertTime(n.DAY30),
                    day31: mandayType === 1 ? n.DAY31 : convertTime(n.DAY31),
                }
            }));
            setLoading(false);
        }).catch((error) => {

        })
    }

    const convertTime = (time) => {
        return `${moment.duration(time, 'minute')._data.hours}.${moment.duration(time, 'minute')._data.minutes}`
    }

    const exportExcel = (json) => {
        if (json !== undefined) {
            let ws = xlsx.utils.json_to_sheet(json.map((n, index) => {
                return {
                    No: index + 1,
                    "บริษัท": n.company_name,
                    Product: n.product,
                    IssueType: n.issue_type,
                    Owner: n.owner,
                    DAY01: n.day01,
                    DAY02: n.day02,
                    DAY03: n.day03,
                    DAY04: n.day04,
                    DAY05: n.day05,
                    DAY06: n.day06,
                    DAY07: n.day07,
                    DAY08: n.day08,
                    DAY09: n.day09,
                    DAY10: n.day10,
                    DAY11: n.day11,
                    DAY12: n.day12,
                    DAY13: n.day13,
                    DAY14: n.day14,
                    DAY15: n.day15,
                    DAY16: n.day16,
                    DAY17: n.day17,
                    DAY18: n.day18,
                    DAY19: n.day19,
                    DAY20: n.day20,
                    DAY21: n.day21,
                    DAY22: n.day22,
                    DAY23: n.day23,
                    DAY24: n.day24,
                    DAY25: n.day25,
                    DAY26: n.day26,
                    DAY27: n.day27,
                    DAY28: n.day28,
                    DAY29: n.day29,
                    DAY30: n.day30,
                    DAY31: n.day31
                }
            }));

            let wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws, `TimeSheet ${selectYear}`);
            xlsx.writeFile(wb, `DashBoard TimeSheet 3 - ${selectYear}-${selectMonth}.xlsx`);
        }
    }

    useEffect(() => {
        getCompany();
        getDeveloper();
        getProduct();
        getIssueType();
    }, [])

    useEffect(() => {
        getData();
    }, [selectYear, selectMonth, selectProduct, selectCompany, selectOwner, mandayType])

    return (
        <MasterPage>
            <Row gutter={16} style={{ padding: "10px 24px 0px 24px" }}>
                <Col span={24}>
                    <Card
                        title={
                            <>
                                <Row>
                                    <Col span={20}>
                                        <BarChartOutlined style={{ fontSize: 24, color: "#5BC726" }} /> รายงานสรุป จำนวนเวลาที่ใช้พัฒนา ของทีม Developer (รายวัน)
                                    </Col>

                                </Row>
                                <Row style={{ marginTop: 24 }}>
                                    <Col span={6} style={{ textAlign: "right", marginRight: 24 }}>
                                        <DatePicker defaultValue={moment()} picker="year" onChange={(date, dateString) => setSelectYear(dateString)} />&nbsp;
                                        <Select defaultValue={moment().format("MM")} style={{ width: 120 }} onChange={(value) => { console.log("xxx", value); setSelectMonth(value) }}
                                            options={monthNameThai.map((n) => ({ value: n.value, label: n.name }))}
                                        />
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

                                    <Col span={6}>
                                        <Select
                                            placeholder="Select Product"
                                            mode='multiple'
                                            //disabled={selectCompany === null ? true : false}
                                            showSearch
                                            allowClear
                                            maxTagCount={2}
                                            style={{ width: "90%" }}
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            onChange={(value) => setSelectProduct(value)}
                                            options={product && product.map((n) => ({ value: n.Id, label: n.Name }))}
                                        >
                                        </Select>
                                    </Col>

                                    <Col span={4}>
                                        <Radio.Group value={mandayType} onChange={(e) => setMandayType(e.target.value)}>
                                            <Space direction="vertical">
                                                <Radio value={1}>นาที</Radio>
                                                <Radio value={2}>ชม.</Radio>
                                            </Space>

                                        </Radio.Group>
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

                                <Row>
                                    <Col span={6} style={{ marginRight: 24 }}></Col>

                                    <Col span={6}>
                                        <Select
                                            placeholder="Issue Type"
                                            mode='multiple'
                                            showSearch
                                            allowClear
                                            maxTagCount={2}
                                            style={{ width: "90%" }}
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            onChange={(value) => setSelectType(value)}
                                            options={issueType && issueType.map((n) => ({ value: n.Id, label: n.Name }))}
                                        >
                                        </Select>
                                    </Col>

                                    <Col span={6}>
                                        <Select
                                            placeholder="Owner"
                                            mode='multiple'
                                            showSearch
                                            allowClear
                                            maxTagCount={1}
                                            style={{ width: "90%" }}
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            onChange={(value) => setSelectOwner(value)}
                                            options={owner && owner.map((n) => ({ value: n.UserId, label: n.DisplayName }))}
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
                                <Row style={{ marginTop: 30 }}>
                                    <Col span={20}>

                                    </Col>
                                </Row>
                            </>
                        }
                    >

                        <Table dataSource={tableData} loading={loading} scroll={{ x: 3500 }}>
                            <Column
                                title={
                                    <label style={{ textAlign: "center" }}>Owner</label>
                                }
                                align="center"
                                fixed="left" width="200px"
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <Row>
                                                <Col span={24} style={{ textAlign: "left" }}>
                                                    <label className="table-column-text12" >
                                                        {record.owner}
                                                    </label>
                                                </Col>
                                            </Row>
                                        </>
                                    )
                                }}
                            />
                            <Column title="Company" fixed="left"
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <Tooltip title={record.company_name}>
                                                <label>{record.company_code}</label>
                                            </Tooltip>
                                        </>
                                    )
                                }}
                            />
                            <Column title="Product" fixed="left" dataIndex="product" />
                            <Column title="IssueType" fixed="left" dataIndex="issue_type" />
                            <Column title="Day1" align="center" dataIndex="day01" />
                            <Column title="Day2" align="center" dataIndex="day02" />
                            <Column title="Day3" align="center" dataIndex="day03" />
                            <Column title="Day4" align="center" dataIndex="day04" />
                            <Column title="Day5" align="center" dataIndex="day05" />
                            <Column title="Day6" align="center" dataIndex="day06" />
                            <Column title="Day7" align="center" dataIndex="day07" />
                            <Column title="Day8" align="center" dataIndex="day08" />
                            <Column title="Day9" align="center" dataIndex="day09" />
                            <Column title="Day10" align="center" dataIndex="day10" />
                            <Column title="Day11" align="center" dataIndex="day11" />
                            <Column title="Day12" align="center" dataIndex="day12" />
                            <Column title="Day13" align="center" dataIndex="day13" />
                            <Column title="Day14" align="center" dataIndex="day14" />
                            <Column title="Day15" align="center" dataIndex="day15" />
                            <Column title="Day16" align="center" dataIndex="day16" />
                            <Column title="Day17" align="center" dataIndex="day17" />
                            <Column title="Day18" align="center" dataIndex="day18" />
                            <Column title="Day19" align="center" dataIndex="day19" />
                            <Column title="Day20" align="center" dataIndex="day20" />
                            <Column title="Day21" align="center" dataIndex="day21" />
                            <Column title="Day22" align="center" dataIndex="day22" />
                            <Column title="Day23" align="center" dataIndex="day23" />
                            <Column title="Day24" align="center" dataIndex="day24" />
                            <Column title="Day25" align="center" dataIndex="day25" />
                            <Column title="Day26" align="center" dataIndex="day26" />
                            <Column title="Day27" align="center" dataIndex="day27" />
                            <Column title="Day28" align="center" dataIndex="day28" />
                            {
                                parseInt(selectMonth) === 2 ? "" :
                                    <Column title="Day29" align="center" dataIndex="day29" />
                            }

                            {
                                parseInt(selectMonth) === 2 ? "" :
                                    <Column title="Day30" align="center" dataIndex="day30" />
                            }

                            {
                                parseInt(selectMonth) / 2 === 0 || parseInt(selectMonth) === 2 ? "" :
                                    <Column title="Day31" align="center" dataIndex="day31" />
                            }

                        </Table>
                    </Card>
                </Col>
            </Row>
        </MasterPage>
    )
}