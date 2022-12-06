import React, { useEffect, useState } from "react"
import { Row, Col, Card, Table, Rate, DatePicker, Input, Button, InputNumber } from 'antd';
import { Line } from '@ant-design/charts';
import { BarChartOutlined } from '@ant-design/icons';
import { Icon } from '@iconify/react';
import xlsx from 'xlsx';
import axios from "axios";
import MasterPage from "../../MasterPage";
import moment from "moment"
import { useHistory } from "react-router-dom";

export default function DashBoard_CMMI6() {
    const { Column } = Table;
    const history = useHistory(null);
    const [loading, setLoading] = useState(false);
    const [selectYear, setSelectYear] = useState(moment().format("YYYY"))
    const [selectMonth, setSelectMonth] = useState(null);

    const [chartData, setChartData] = useState([]);
    const [maxScore, setMaxScore] = useState([]);
    const [minScore, setMinScore] = useState([]);
    const [allScore, setAllScore] = useState([]);
    const [filterCompany, setFilterCompany] = useState(null);
    const [minRate, setMinRate] = useState(null);
    const [maxRate, setMaxRate] = useState(null);

    const chartData_config = {
        xField: 'monthName',
        yField: 'score',
        height: 500,
        point: {
            size: 5,
            shape: 'diamond',
            style: {
                fill: 'white',
                stroke: '#5B8FF9',
                lineWidth: 2,
            },
        },
        tooltip: {
            showMarkers: true,
        },
        interactions: [
            {
                type: 'marker-active',
            },
        ],
        // yAxis: {
        //     label: {
        //         formatter: function formatter(v) {
        //             return ''.concat(v).replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
        //                 return ''.concat(s, ',');
        //             });
        //         },
        //     },
        // },
    };

    const searchCompany = (param) => {
        let result = allScore.filter(o =>
            Object.keys(o).some(k =>
                String(o[k])
                    .toLowerCase()
                    .includes(param.toLowerCase())
            )
        );
        setFilterCompany(result);
    }

    const validateNumber = (value, element) => {
        console.log(value, element)
        const isDecimal = /^\d*\.?\d*$/;
        if (value === '' || value === '.' || isDecimal.test(value)) {
            if (element === "minRate") {
                value === "" ? setMinRate(null) : setMinRate(value)
            }
            else {
                value === "" ? setMaxRate(null) : setMaxRate(value)
            }
            // element === "minRate" ? setMinRate(value) : setMaxRate(value)
        }
    }

    const getReport = async () => {
        setLoading(true);
        await axios.get(process.env.REACT_APP_API_URL + "/dashboard/cmmi/dashboard_cmmi6", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                year: selectYear,
                month: selectMonth
            }
        }).then((res) => {
            setChartData(res.data.chartData.map((item) => {
                return {
                    monthName: item.MonthName,
                    score: item.AVG_TotalScore
                }
            }));

            setMaxScore(res.data.tableData_maxScore.map((item) => {
                return {
                    companyId: item.CompanyId,
                    companyName: item.CompanyName,
                    companyFullName: item.CompanyFullName,
                    score: item.AVG_TotalScore.toFixed(2)
                }
            }));

            setMinScore(res.data.tableData_minScore.map((item) => {
                return {
                    companyId: item.CompanyId,
                    companyName: item.CompanyName,
                    companyFullName: item.CompanyFullName,
                    score: item.AVG_TotalScore.toFixed(2)
                }
            }));

            setLoading(false);
        }).catch((error) => {
            console.log(error.message)
        })
    }

    const getReport2 = async () => {
        setLoading(true);
        await axios.get(process.env.REACT_APP_API_URL + "/dashboard/cmmi/dashboard_cmmi6_1", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                year: selectYear,
                month: selectMonth,
                minRate: minRate === null ? 0 : minRate,
                maxRate: maxRate === null ? 0 : maxRate
            }
        }).then((res) => {
            setAllScore(res.data.map((item) => {
                return {
                    companyId: item.CompanyId,
                    companyName: item.CompanyName,
                    companyFullName: item.CompanyFullName,
                    quantity: item.Quantity,
                    score: item.AVG_TotalScore.toFixed(2)
                }
            }));

            setLoading(false);
        }).catch((error) => {
            setLoading(false);
            console.log(error.message)
        })
    }

    useEffect(() => {
        getReport();
        getReport2();
    }, [selectYear, selectMonth])

    return (
        <MasterPage bgColor="#f0f2f5">
            <Row gutter={16} style={{ padding: "10px 24px 0px 24px" }}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Card
                        className="card-dashboard"
                        title={
                            <>
                                <Row>
                                    <Col span={24}>
                                        <label>สรุปคะแนนความพึงพอใจ</label>
                                    </Col>
                                </Row>
                            </>
                        }
                        extra={
                            <>
                                <label>ปี</label>&nbsp;&nbsp;
                                <DatePicker onChange={(date, datestring) => setSelectYear(datestring)} defaultValue={moment()} picker="year" />
                            </>
                        }
                    >
                        <Row>
                            <Col span={24}>
                                <Line {...chartData_config} data={chartData && chartData} loading={loading}
                                    style={{ height: 300 }}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} style={{ padding: "10px 24px 0px 24px" }}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} style={{ textAlign: "right" }}>
                    <label>เดือน</label>&nbsp;&nbsp;
                    <DatePicker onChange={(date) => date === null ? setSelectMonth(null) : setSelectMonth(date.month() + 1)} picker="month" format="MMMM" />
                </Col>

            </Row>

            {/* max score , min score */}
            <Row gutter={16} style={{ padding: "10px 24px 0px 24px" }}>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Card
                        className="card-dashboard"
                        title={
                            <>
                                <Row>
                                    <Col span={24}>
                                        <label style={{ color: "green" }}>ค่าเฉลี่ยสูงสุด 10 อันดับ </label>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <Table dataSource={maxScore} loading={loading} size="middle" pagination={false}>
                                            <Column title="No" align="center"
                                                render={(value, record, index) => {
                                                    return (
                                                        <>
                                                            <label className="table-column-text12">{index + 1}</label>
                                                        </>
                                                    )
                                                }}
                                            />
                                            <Column title="Company" style={{ fontSize: 10, padding: 8 }}
                                                render={(value, record) => {
                                                    return (
                                                        <label className="table-column-text12">{record.companyName}</label>
                                                    )
                                                }}
                                            />
                                            <Column
                                                render={(value, record) => {
                                                    return (
                                                        <label className="table-column-text12">{record.companyFullName}</label>
                                                    )
                                                }}
                                            />
                                            <Column title="Score" align="center"
                                                render={(value, record) => {
                                                    return (
                                                        <>
                                                            <label className="table-column-text12">{record.score}</label>
                                                        </>
                                                    )
                                                }}
                                            />
                                            <Column
                                                render={(value, record) => {
                                                    return (
                                                        <>
                                                            <Button type="text"
                                                                onClick={() => history.push({ pathname: "/internal/dashboard/cmmi/dashboard_cmmi6_1/id=" + record.companyId })}
                                                                icon={<Icon icon="ion:ellipsis-horizontal-sharp" fontSize={24} style={{ cursor: "pointer" }} />}
                                                            />
                                                        </>
                                                    )
                                                }}
                                            />
                                        </Table>
                                    </Col>
                                </Row>
                            </>
                        }
                    >
                    </Card>

                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Card
                        className="card-dashboard"
                        title={
                            <>
                                <Row>
                                    <Col span={24}>
                                        <label style={{ color: "red" }}>ค่าเฉลี่ยต่ำสุด 10 อันดับ </label>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <Table dataSource={minScore} loading={loading} size="middle" pagination={false}>
                                            <Column title="No" align="center"
                                                render={(value, record, index) => {
                                                    return (
                                                        <>
                                                            <label className="table-column-text12">{index + 1}</label>
                                                        </>
                                                    )
                                                }}
                                            />
                                            <Column title="Company" style={{ fontSize: 10, padding: 8 }}
                                                render={(value, record) => {
                                                    return (
                                                        <label className="table-column-text12">{record.companyName}</label>
                                                    )
                                                }}
                                            />
                                            <Column
                                                render={(value, record) => {
                                                    return (
                                                        <label className="table-column-text12">{record.companyFullName}</label>
                                                    )
                                                }}
                                            />
                                            <Column title="Score" align="center"
                                                render={(value, record) => {
                                                    return (
                                                        <>
                                                            <label className="table-column-text12">{record.score}</label>
                                                        </>
                                                    )
                                                }}
                                            />
                                            <Column
                                                render={(value, record) => {
                                                    return (
                                                        <>
                                                            <Button type="text"
                                                                onClick={() => history.push({ pathname: "/internal/dashboard/cmmi/dashboard_cmmi6_1/id=" + record.companyId })}
                                                                icon={<Icon icon="ion:ellipsis-horizontal-sharp" fontSize={24} style={{ cursor: "pointer" }} />}
                                                            />
                                                        </>
                                                    )
                                                }}
                                            />
                                        </Table>
                                    </Col>
                                </Row>
                            </>
                        }
                    >
                    </Card>

                </Col>
            </Row>

            {/* all score */}
            <Row gutter={16} style={{ padding: "10px 24px 0px 24px" }}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Card
                        className="card-dashboard"
                        title={
                            <Row>
                                <Col span={12} style={{ textAlign: "right" }}>
                                    <Input.Group compact>
                                        <Input
                                            allowClear
                                            value={minRate}
                                            style={{
                                                width: 120,
                                                textAlign: 'center',
                                            }}
                                            placeholder="Min Rate"
                                            onChange={(e) => validateNumber(e.target.value, "minRate")}
                                        />
                                        <Input
                                            className="site-input-split"
                                            style={{
                                                width: 30,
                                                borderLeft: 0,
                                                borderRight: 0,
                                                pointerEvents: 'none',
                                            }}
                                            placeholder="-"
                                            disabled
                                        />
                                        <Input.Search
                                            allowClear
                                            value={maxRate}
                                            className="site-input-right"
                                            style={{
                                                width: 180,
                                                textAlign: 'center',
                                                marginRight: "40px"
                                            }}
                                            placeholder="Max Rate"
                                            enterButton
                                            onChange={(e) => validateNumber(e.target.value, "maxRate")}
                                            onSearch={getReport2}
                                        />
                                    </Input.Group>
                                </Col>
                                <Col span={12}>
                                    <Input.Search placeholder="ชื่อบริษัท" allowClear
                                        enterButton
                                        onSearch={searchCompany}
                                    />
                                </Col>
                            </Row>
                        }
                    >
                        <Table dataSource={filterCompany === null ? allScore : filterCompany} loading={loading} size="small"
                            pagination={{ pageSize: 10 }}
                        >
                            <Column title="No" align="center"
                                width="5%"
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <label className="table-column-text12">{index + 1}</label>
                                        </>
                                    )
                                }}
                            />
                            <Column title="Company" style={{ fontSize: 10, padding: 8 }}
                                width="10%"
                                render={(value, record) => {
                                    return (
                                        <label className="table-column-text12">{record.companyName}</label>
                                    )
                                }}
                            />
                            <Column
                                width="35%"
                                render={(value, record) => {
                                    return (
                                        <label className="table-column-text12">{record.companyFullName}</label>
                                    )
                                }}
                            />
                            <Column title="Quantity (จำนวนเคส)" align="center"
                                render={(value, record) => {
                                    return (
                                        <>
                                            <label className="table-column-text12">{record.quantity}</label>
                                        </>
                                    )
                                }}
                            />
                            <Column title="Rate" align="center"
                                render={(value, record) => {
                                    return (
                                        <>
                                            <Rate disabled allowHalf value={record.score} />
                                        </>
                                    )
                                }}
                            />
                            <Column title="Score" align="center"
                                sorter={(a, b) => a.score - b.score}
                                render={(value, record) => {
                                    return (
                                        <>
                                            <label className="table-column-text12">{record.score}</label>
                                        </>
                                    )
                                }}
                            />
                            <Column
                                render={(value, record) => {
                                    return (
                                        <>
                                            <Button type="text"
                                                onClick={() => history.push({ pathname: "/internal/dashboard/cmmi/dashboard_cmmi6_1/id=" + record.companyId })}
                                                icon={<Icon icon="ion:ellipsis-horizontal-sharp" fontSize={24} style={{ cursor: "pointer" }} />}
                                            />
                                        </>
                                    )
                                }}
                            />
                        </Table>
                    </Card>
                </Col>
            </Row>
        </MasterPage>
    )
}