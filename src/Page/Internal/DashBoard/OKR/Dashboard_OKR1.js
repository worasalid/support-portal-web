import React, { useEffect, useState } from "react";

// antd
import { Row, Col, Card, Table, DatePicker, Spin, Button, Select } from 'antd';
import { Column } from '@ant-design/charts';

// layout component
import MasterPage from "../../MasterPage";

// utility
import axios from "axios";
import moment from "moment";
import Slider from "react-slick";
import { Icon } from '@iconify/react';
import xlsx from 'xlsx';

export default function DashBoard_OKR1() {
    const { RangePicker } = DatePicker;
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [chartData2, setChartData2] = useState([]);
    const [tableDetails, setTableDetails] = useState([]);
    const [slickCount, setSlickCount] = useState(0);
    const [excelData, setExcelData] = useState([])

    // filter
    const [selectUser, setSelectUser] = useState([]);
    const [selectDate, setSelectDate] = useState([]);

    // chart config
    const chartData_config = {
        xField: 'userName',
        yField: 'score',
        //seriesField: 'GroupStatus',
        //isPercent: true,
        // isStack: isStack,
        // isGroup: !isStack,
        //scrollbar: { type: 'horizontal' },
        slider: {
            start: 0,
            end: 1,
            maxLimit: 100,
        },
        columnWidthRatio: 0.4,
        label: {
            position: 'middle',
            content: function content(item) {
                return item.score.toFixed(3);
            },
            style: { fill: '#fff' },
        },
        legend: {
            layout: 'horizontal',
            position: 'bottom'
        },
        color: function color(x) {
            // if (x.developer === "InProgress") { return "#5B8FF9" } // สีฟ้า
            // if (x.GroupStatus === "InProgress") { return "#52C41A" } // เขียว
            // if (x.GroupStatus === "ReOpen") { return "#FF5500" } // สีส้ม
            //if (x.status === "ReOpen") { return "#CD201F" }//สีแดง
        },
        onclick: function onclick() {
            alert()
        },

    };

    const chartData2_config = {
        xField: 'userName',
        yField: 'score',
        seriesField: 'issueType',
        //isPercent: true,
        // isStack: isStack,
        isGroup: true,
        //scrollbar: { type: 'horizontal' },
        slider: {
            start: 0,
            end: 1,
            maxLimit: 100,
        },
        columnWidthRatio: 0.4,
        label: {
            position: 'middle',
            content: function content(item) {
                return item.score.toFixed(3);
            },
            style: { fill: '#fff' },
        },
        legend: {
            layout: 'horizontal',
            position: 'bottom'
        },
        color: function color(x) {
            if (x.issueType === "Use") { return "#5B8FF9" } // สีฟ้า
            if (x.issueType === "Bug") { return "#52C41A" } // เขียว
            // if (x.GroupStatus === "ReOpen") { return "#FF5500" } // สีส้ม
            //if (x.status === "ReOpen") { return "#CD201F" }//สีแดง
        },
        onclick: function onclick() {
            alert()
        },

    };

    const getDeveloper = async () => {
        await axios.get(process.env.REACT_APP_API_URL + "/master/organize/user", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                organize_id: 2
            }
        }).then((res) => {
            setUser(res.data);
        })
    }

    const getData = async () => {
        setLoading(true);
        await axios.get(process.env.REACT_APP_API_URL + "/dashboard/okr/dashboard_okr_1", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                userId: selectUser && selectUser,
                startdate: (selectDate[0] === undefined || selectDate[0] === "") ? "" : moment(selectDate[0], "DD/MM/YYYY").format("YYYY-MM-DD"),
                enddate: (selectDate[1] === undefined || selectDate[1] === "") ? "" : moment(selectDate[1], "DD/MM/YYYY").format("YYYY-MM-DD"),
            }
        }).then((res) => {
            setSlickCount(Math.ceil(res.data.chartData.length / 10));

            setChartData(res.data.chartData.map((item, index) => {
                return {
                    no: index + 1,
                    userName: item.UserName,
                    score: item.AVG_TotalScore,
                    value: item.cnt
                }
            }));

            setChartData2(res.data.tableScore.map((item, index) => {
                return {
                    no: index + 1,
                    userName: item.UserName,
                    score: item.AVG_TotalScore,
                    issueType: item.IssueType,
                    value: item.cnt
                }
            }));

            setTableDetails(res.data.tableDetails.map((item, index) => {
                return {
                    no: index + 1,
                    comapnyTh: item.CompanyTh,
                    comapnyEn: item.CompanyEn,
                    issueType: item.IssueType,
                    ticket: item.Number,
                    score: item.Score,
                    score2: item.Score2,
                    score3: item.Score3,
                    score4: item.Score4,
                    score5: item.Score5,
                    avgScore: item.AVG_Score,
                    userName: item.UserName,
                    completeDate: item.CompleteDate
                }
            }));

            setLoading(false);
        }).catch(() => {
            setLoading(false);
        })
    }

    const exportExcel = () => {
        let ws = xlsx.utils.json_to_sheet(chartData.map((item, index) => {
            return {
                No: index + 1,
                UserName: item.userName,
                'จำนวนเคส': item.value,
                AVG_TotalScore: item.score
            }
        }));

        let ws2 = xlsx.utils.json_to_sheet(chartData2.map((item, index) => {
            return {
                No: index + 1,
                UserName: item.userName,
                IssueType: item.issueType,
                'จำนวนเคส': item.value,
                AVG_Score: item.score
            }
        }));

        let ws3 = xlsx.utils.json_to_sheet(tableDetails.map((item, index) => {
            return {
                No: index + 1,
                CompanyEn: item.comapnyEn,
                CompanyTh: item.comapnyTh,
                IssueType: item.issueType,
                Ticket: item.ticket,
                'แก้ไขปัญหาได้ถูกต้อง': item.score,
                'แก้ไขปัญหาได้ภายในเวลาที่กำหนด': item.score2,
                'ความสะดวกในการติดต่อ ประสานงาน': item.score3,
                'การให้บริการ (Service Mind)': item.score4,
                'คะแนนการบริการ โดยรวม': item.score5,
                'คะแนนรวม': item.avgScore,
                UserName: item.userName,
                CompleteDate: item.completeDate
            }
        }));

        let wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, 'By User');
        xlsx.utils.book_append_sheet(wb, ws2, 'By User & IssueType');
        xlsx.utils.book_append_sheet(wb, ws3, 'Details');
        xlsx.writeFile(wb, `DashBoard OKR-Satisfication - ${moment().format("YYMMDD_HHmm")}.xlsx`);

        setLoading(false);
    }

    useEffect(() => {
        getDeveloper();
        getData();
    }, [])

    useEffect(() => {
        console.log(selectUser);
        getData();
    }, [selectUser.length, selectDate && selectDate[0]])

    return (
        <MasterPage>
            <Row gutter={16} style={{ padding: "10px 24px 0px 24px" }}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Card
                        className="card-dashboard"
                        title={
                            <>
                                <Row>
                                    <Col span={8}>
                                        <label>OKR Satisfication</label>
                                    </Col>
                                    <Col span={8}>
                                        <Select
                                            placeholder="Select User"
                                            mode='multiple'
                                            showSearch
                                            allowClear
                                            maxTagCount={2}
                                            style={{ width: "90%" }}
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            onChange={(value, item) => setSelectUser(value)}
                                            options={user && user.map((x) => ({ value: x.UserId, label: x.DisplayName }))}
                                        >
                                        </Select>
                                    </Col>
                                    <Col span={8}>
                                        <RangePicker format="DD/MM/YYYY" style={{ width: "90%" }}
                                            onChange={(date, dateString) => setSelectDate(dateString)}
                                        />
                                    </Col>
                                </Row>
                            </>
                        }
                        extra={
                            <>
                                <Button type="link"
                                    //hidden={selectUser.length === 0 ? true : false}
                                    onClick={() => exportExcel()}
                                    title="Excel Export"
                                >
                                    <img
                                        style={{ height: "36px", marginTop: "-10px" }}
                                        src={`${process.env.PUBLIC_URL}/icons-excel.png`}
                                        alt="Excel Export"
                                    />
                                </Button>
                            </>
                        }
                    >
                        <Row style={{ marginTop: 24 }}>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div style={{ padding: "24px 24px 0px 24px" }}>
                                    <Slider
                                        dots={true}
                                        infinite={true}
                                        speed={500}
                                        slidesToShow={1}
                                        slidesToScroll={1}
                                        swipeToSlide={true}
                                        prevArrow={
                                            <Icon icon="dashicons:arrow-left-alt2" color="gray" />
                                        }
                                        nextArrow={
                                            <Icon icon="dashicons:arrow-right-alt2" color="gray" />
                                        }
                                    >
                                        {
                                            Array.from(Array(slickCount), (e, index) => {
                                                return (
                                                    <div>
                                                        <Spin spinning={loading}>
                                                            <Row>
                                                                <Col span={24} style={{ textAlign: "left" }}>
                                                                    <label style={{ color: "orange" }}>จำนวน ค่าเฉลี่ย</label>
                                                                </Col>
                                                            </Row>
                                                            <Column {...chartData_config}
                                                                data={
                                                                    chartData.filter((o) => (o.no > (index) * 10) && (o.no <= (index + 1) * 10))
                                                                }
                                                                height={300}
                                                                xAxis={{ position: "bottom" }}
                                                            />
                                                        </Spin>
                                                    </div>
                                                )
                                            })
                                        }
                                    </Slider>
                                </div>
                            </Col>
                        </Row>

                        {/* <Row style={{ marginTop: 24 }}>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div style={{ padding: "24px 24px 0px 24px" }}>
                                    <Slider
                                        dots={true}
                                        infinite={true}
                                        speed={500}
                                        slidesToShow={1}
                                        slidesToScroll={1}
                                        swipeToSlide={true}
                                        prevArrow={
                                            <Icon icon="dashicons:arrow-left-alt2" color="gray" />
                                        }
                                        nextArrow={
                                            <Icon icon="dashicons:arrow-right-alt2" color="gray" />
                                        }
                                    >
                                        {
                                            Array.from(Array(slickCount), (e, index) => {
                                                return (
                                                    <div>
                                                        <Column {...chartData2_config}
                                                            data={
                                                                chartData2.filter((o) => (o.no > (index) * 3) && (o.no <= (index + 1) * 3))
                                                            }
                                                            height={300}
                                                            xAxis={{ position: "bottom" }}
                                                        />
                                                    </div>
                                                )
                                            })
                                        }
                                    </Slider>
                                </div>
                            </Col>
                        </Row> */}

                        <Row style={{ marginTop: 24 }}>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <Table dataSource={tableDetails} loading={loading}>
                                    <Column title="No" align="center"
                                        width="5%"
                                        render={(record, row, index) => {
                                            return (
                                                <label className="table-column-text12">
                                                    {record.no}
                                                </label>
                                            )
                                        }}
                                    />

                                    {/* <Column title="Company"
                                        align="left"
                                        width="20%"
                                        render={(record, row, index) => {
                                            return (
                                                <label className="table-column-text12">
                                                    {record.comapny}
                                                </label>
                                            )
                                        }}
                                    /> */}
                                    <Column title="IssueType"
                                        align="center"
                                        width="5%"
                                        render={(record, row, index) => {
                                            return (
                                                <label className="table-column-text12">
                                                    {record.issueType}
                                                </label>
                                            )
                                        }}
                                    />
                                    <Column title="Ticket"
                                        align="center"
                                        width="10%"
                                        render={(record, row, index) => {
                                            return (
                                                <label className="table-column-text12">
                                                    {record.ticket}
                                                </label>
                                            )
                                        }}
                                    />
                                    <Column title="แก้ไขปัญหาได้ถูกต้อง"
                                        align="center"
                                        width="10%"
                                        render={(record, row, index) => {
                                            return (
                                                <label className="table-column-text12">
                                                    {record.score}
                                                </label>
                                            )
                                        }}
                                    />
                                    <Column title="แก้ไขปัญหาได้ภายในเวลาที่กำหนด"
                                        align="center"
                                        width="10%"
                                        render={(record, row, index) => {
                                            return (
                                                <label className="table-column-text12">
                                                    {record.score2}
                                                </label>
                                            )
                                        }}
                                    />
                                    <Column title="ความสะดวกในการติดต่อ ประสานงาน"
                                        align="center"
                                        width="10%"
                                        render={(record, row, index) => {
                                            return (
                                                <label className="table-column-text12">
                                                    {record.score3}
                                                </label>
                                            )
                                        }}
                                    />
                                    <Column title="การให้บริการ (Service Mind)"
                                        align="center"
                                        width="10%"
                                        render={(record, row, index) => {
                                            return (
                                                <label className="table-column-text12">
                                                    {record.score4}
                                                </label>
                                            )
                                        }}
                                    />
                                    <Column title="คะแนนการบริการ โดยรวม"
                                        align="center"
                                        width="10%"
                                        render={(record, row, index) => {
                                            return (
                                                <label className="table-column-text12">
                                                    {record.score5}
                                                </label>
                                            )
                                        }}
                                    />
                                    <Column title="User"
                                        align="center"
                                        width="10%"
                                        render={(record, row, index) => {
                                            return (
                                                <label className="table-column-text12">
                                                    {record.userName}
                                                </label>
                                            )
                                        }}
                                    />
                                    <Column title="วันที่"
                                        align="center"
                                        width="10%"
                                        render={(record, row, index) => {
                                            return (
                                                <label className="table-column-text12">
                                                    {record.completeDate}
                                                </label>
                                            )
                                        }}
                                    />
                                </Table>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </MasterPage>
    )
}