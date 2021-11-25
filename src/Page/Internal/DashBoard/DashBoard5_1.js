// Dashboard แบบประเมินความพอใจของลูกค้า
import React, { useEffect, useState } from "react"
import { Row, Col, Card, Spin, Input, Table, Rate, Tooltip, Select, Button, DatePicker } from 'antd';
import { Column, Line } from '@ant-design/charts';
import { Icon } from '@iconify/react';
import { BarChartOutlined } from '@ant-design/icons';
import xlsx from 'xlsx';
import Axios from "axios";
import MasterPage from "../MasterPage";
import moment from "moment"
import { useRouteMatch, useHistory } from "react-router-dom";
import Slider from "react-slick";

const { ColumnGroup } = Table;
const { RangePicker } = DatePicker;

export default function DashBoard5_1() {
    const match = useRouteMatch();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [company, setCompany] = useState([]);
    const [product, setProduct] = useState([]);

    const [tableScore, setTableScore] = useState([]);
    const [tableSatisfaction, setTableSatisfaction] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [excelData, setExcelData] = useState([]);

    // filter
    const [selectDate, setSelectDate] = useState([]);
    const [selectProduct, setSelectProduct] = useState([]);
    const [filterTicket, setFilterTicket] = useState(null);


    const chartData_config = {
        isGroup: true,
        xField: 'month_name',
        yField: 'quantity',
        seriesField: 'product',
        label: {
            position: 'middle',
            content: function content(item) {
                return item.quantity.toFixed(0);
            },
            style: { fill: '#fff' },
        },
    };

    // const chartData_config2 = {
    //     isGroup: true,
    //     xField: 'month_name',
    //     yField: 'avg_totalscore',
    //     seriesField: 'product',
    //     label: {
    //         position: 'middle',
    //         content: function content(item) {
    //             return item.avg_totalscore.toFixed(2);
    //         },
    //         style: { fill: '#fff' },
    //     },
    // };

    const chartData_config2 = {
        xField: 'month_name',
        yField: 'avg_totalscore',
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
    };


    const searchTicket = (param) => {
        let result = tableSatisfaction.filter(o =>
            Object.keys(o).some(k =>
                String(o[k])
                    .toLowerCase()
                    .includes(param.toLowerCase())
            )
        );
        setFilterTicket(result);
    }

    const getCompany = async () => {
        await Axios.get(process.env.REACT_APP_API_URL + "/master/load-company", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                companyid: match.params.id
            }
        }).then((res) => {
            setCompany(res.data[0])
        }).catch(() => {

        })
    }

    const getProduct = async () => {
        await Axios.get(process.env.REACT_APP_API_URL + "/master/customer-products", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                company_id: match.params.id
            }
        }).then((res) => {
            setProduct(res.data);

        }).catch((error) => {

        });
    }

    const getData = async () => {
        setLoading(true);
        await Axios.get(process.env.REACT_APP_API_URL + "/dashboard/dashboard5_1", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                companyId: match.params.id,
                productId: selectProduct,
                startdate: (selectDate[0] === undefined || selectDate[0] === "") ? "" : moment(selectDate[0], "DD/MM/YYYY").format("YYYY-MM-DD"),
                enddate: (selectDate[1] === undefined || selectDate[1] === "") ? "" : moment(selectDate[1], "DD/MM/YYYY").format("YYYY-MM-DD"),
            }
        }).then((res) => {
            setTableScore(res.data.tabledata.map((n, index) => ({
                no: index + 1,
                company_name: n.CompanyName,
                company_fullname: n.CompanyFullName,
                product: n.Product,
                quantity1: n.Quantity1,
                quantity2: n.Quantity2,
                quantity3: n.Quantity3,
                quantity4: n.Quantity4,
                quantity5: n.Quantity5,
                quantity6: n.Quantity6,
                quantity7: n.Quantity7,
                quantity8: n.Quantity8,
                quantity9: n.Quantity9,
                quantity10: n.Quantity10,
                quantity11: n.Quantity11,
                quantity12: n.Quantity12,
                total_quantity: n.TotalQuantity,
                avg_score1: n.AVG_Score1,
                avg_score2: n.AVG_Score2,
                avg_score3: n.AVG_Score3,
                avg_score4: n.AVG_Score4,
                avg_score5: n.AVG_Score5,
                avg_score6: n.AVG_Score6,
                avg_score7: n.AVG_Score7,
                avg_score8: n.AVG_Score8,
                avg_score9: n.AVG_Score9,
                avg_score10: n.AVG_Score10,
                avg_score11: n.AVG_Score11,
                avg_score12: n.AVG_Score12,
                avg_totalscore: n.AVG_TotalScore
            })));

            setTableSatisfaction(res.data.exceldata.map((n, index) => {
                return {
                    no: index + 1,
                    company_name: n.CompanyName,
                    company_fullname: n.CompanyFullName,
                    ticket_id: n.TicketId,
                    ticket_number: n.TicketNumber,
                    product: n.Product,
                    score: n.Score,
                    score2: n.Score2,
                    score3: n.Score3,
                    score4: n.Score2,
                    score5: n.Score5,
                    suggestion: n.Suggestion,
                    username: n.UserName,
                    email: n.Email,
                    avg_totalscore: n.AVG_TotalScore
                }
            }));

            setChartData(res.data.chartdata.map((n, index) => {
                return {
                    product: n.Product,
                    quantity: n.Quantity,
                    month: n.Month.toString(),
                    month_name: n.MonthName,
                    avg_totalscore: n.AVG_TotalScore
                }
            }));

            setExcelData(res.data.exceldata);

            setLoading(false);

        }).catch(() => {
            setLoading(false);
        })
    }

    const exportExcel = (json) => {
        if (json !== undefined) {
            let ws = xlsx.utils.json_to_sheet(json.map((n, index) => {
                return {
                    No: index + 1,
                    Company: n.CompanyName,
                    CompanyName: n.CompanyFullName,
                    Product: n.Product,
                    Ticket: n.TicketNumber,
                    "แก้ไขปัญหาได้ถูกต้อง": n.Score,
                    "แก้ไขปัญหาได้ภายในเวลาที่กำหนด": n.Score2,
                    "ความสะดวกในการติดต่อประสานงาน": n.Score3,
                    "การให้บริการ (Service Mind)": n.Score4,
                    "คะแนนการบริการ โดยรวม": n.Score5,
                    "ค่าเฉลี่ย": n.AVG_TotalScore,
                    "คำแนะนำ/ติชม": n.Suggestion,
                    "วันที่ประเมิน": moment(n.CreateDate).format("DD/MM/YYYY")
                }
            }));

            let wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws, 'sheet1');
            xlsx.writeFile(wb, `DashBoard Satisfaction - ${moment().format("YYMMDD_HHmm")}.xlsx`);
        }
    }

    useEffect(() => {
        getCompany();
        getProduct();
    }, [])

    useEffect(() => {
        if (selectProduct !== null) {
            getData();
        }

    }, [selectProduct, selectDate])

    return (
        <MasterPage bgColor="#f0f2f5">
            <Row gutter={16} style={{ padding: "10px 24px 0px 24px" }}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Card
                        className="card-dashboard"
                        title={
                            <>
                                <Row >
                                    <Col span={24}>
                                        <BarChartOutlined style={{ fontSize: 24, color: "#5BC726" }} /> DashBoard สรุปคะแนนความพึงพอใจ
                                    </Col>
                                </Row >

                                <Row style={{ marginTop: 10 }}>
                                    <Col span={12}>
                                        <label>{`(${company.FullNameTH})`}</label>
                                    </Col>
                                    <Col span={6}>
                                        <Select
                                            placeholder="Select Product"
                                            mode='multiple'
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

                                    <Col span={6} style={{ textAlign: "right" }}>
                                        <RangePicker format="DD/MM/YYYY" style={{ width: "80%" }}
                                            defaultValue={[moment('01/01/YYYY', "DD/MM/YYYY"), moment()]}
                                            onChange={(date, dateString) => setSelectDate(dateString)}
                                        />
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
                                    </Col>

                                </Row>
                            </>
                        }

                    >
                        {/* Chart */}
                        <Row>
                            <Col span={24}>
                                <Spin spinning={loading}>
                                    <div style={{ padding: "0px 24px 0px 24px" }}>
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
                                            <div>
                                                <Row>
                                                    <Col span={24} style={{ textAlign: "right" }}>
                                                        <label style={{ color: "orange" }}>จำนวน Issue</label>
                                                    </Col>
                                                </Row>
                                                <Column {...chartData_config} loading={loading}
                                                    data={chartData && chartData}
                                                    height={300}
                                                />
                                            </div>
                                            <div>
                                                <Row>
                                                    <Col span={24} style={{ textAlign: "right" }}>
                                                        <label style={{ color: "orange" }}>ค่าเฉลี่ย คะแนน</label>
                                                    </Col>
                                                </Row>
                                                <Line {...chartData_config2} data={chartData && chartData} loading={loading}
                                                    style={{ height: 300 }}
                                                />
                                            </div>
                                        </Slider>
                                    </div>
                                </Spin>
                            </Col>
                        </Row>

                        {/* Table */}
                        <Row style={{ marginTop: 36 }}>
                            <Col span={12}>
                                <label style={{ color: "orange" }}>Qty = จำนวนเคส , Rate = ค่าเฉลี่ยของจำนวนเคส</label>
                            </Col>
                            <Col span={12}>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs={24} sm={24} md={8} lg={24} xl={24}>
                                <Table dataSource={tableScore} loading={loading} scroll={{ x: 2000 }} bordered size="small">
                                    <Column key="no" fixed="left" width="100px"

                                        title={
                                            <>
                                                <label className="table-column-text1212">Product</label>
                                            </>
                                        }
                                        render={(value, record, index) => {
                                            return (
                                                <>
                                                    <label className="table-column-text1212">{record.product}</label>
                                                </>
                                            )
                                        }}
                                    />
                                    <ColumnGroup title="Jan" >
                                        <Column align="center" key="no"
                                            title={
                                                <>
                                                    <label className="table-column-text12">Qty</label>
                                                </>
                                            }
                                            render={(value, record, index) => {
                                                return (
                                                    <>
                                                        <label className="table-column-text12">{record.quantity1}</label>
                                                    </>
                                                )
                                            }}
                                        />
                                        <Column align="center" key="no"
                                            title={
                                                <>
                                                    <label className="table-column-text12">Rate</label>
                                                </>
                                            }
                                            render={(value, record, index) => {
                                                return (
                                                    <>
                                                        <label className="table-column-text12">{parseFloat(record.avg_score1).toFixed(2)}</label>
                                                    </>
                                                )
                                            }}
                                        />
                                    </ColumnGroup>

                                    <ColumnGroup title="Feb">
                                        <Column align="center" key="no"
                                            title={
                                                <>
                                                    <label className="table-column-text12">Qty</label>
                                                </>
                                            }
                                            render={(value, record, index) => {
                                                return (
                                                    <>
                                                        <label className="table-column-text12">{record.quantity2}</label>
                                                    </>
                                                )
                                            }}
                                        />
                                        <Column align="center" key="no"
                                            title={
                                                <>
                                                    <label className="table-column-text12">Rate</label>
                                                </>
                                            }
                                            render={(value, record, index) => {
                                                return (
                                                    <>
                                                        <label className="table-column-text12">{parseFloat(record.avg_score2).toFixed(2)}</label>
                                                    </>
                                                )
                                            }}
                                        />
                                    </ColumnGroup>

                                    <ColumnGroup title="Mar">
                                        <Column align="center" key="no"
                                            title={
                                                <>
                                                    <label className="table-column-text12">Qty</label>
                                                </>
                                            }
                                            render={(value, record, index) => {
                                                return (
                                                    <>
                                                        <label className="table-column-text12">{record.quantity3}</label>
                                                    </>
                                                )
                                            }}
                                        />
                                        <Column align="center" key="no"
                                            title={
                                                <>
                                                    <label className="table-column-text12">Rate</label>
                                                </>
                                            }
                                            render={(value, record, index) => {
                                                return (
                                                    <>
                                                        <label className="table-column-text12">{parseFloat(record.avg_score3).toFixed(2)}</label>
                                                    </>
                                                )
                                            }}
                                        />
                                    </ColumnGroup>

                                    <ColumnGroup title="Apr">
                                        <Column align="center" key="no"
                                            title={
                                                <>
                                                    <label className="table-column-text12">Qty</label>
                                                </>
                                            }
                                            render={(value, record, index) => {
                                                return (
                                                    <>
                                                        <label className="table-column-text12">{record.quantity4}</label>
                                                    </>
                                                )
                                            }}
                                        />
                                        <Column align="center" key="no"
                                            title={
                                                <>
                                                    <label className="table-column-text12">Rate</label>
                                                </>
                                            }
                                            render={(value, record, index) => {
                                                return (
                                                    <>
                                                        <label className="table-column-text12">{parseFloat(record.avg_score4).toFixed(2)}</label>
                                                    </>
                                                )
                                            }}
                                        />
                                    </ColumnGroup>

                                    <ColumnGroup title="May">
                                        <Column align="center" key="no"
                                            title={
                                                <>
                                                    <label className="table-column-text12">Qty</label>
                                                </>
                                            }
                                            render={(value, record, index) => {
                                                return (
                                                    <>
                                                        <label className="table-column-text12">{record.quantity5}</label>
                                                    </>
                                                )
                                            }}
                                        />
                                        <Column align="center" key="no"
                                            title={
                                                <>
                                                    <label className="table-column-text12">Rate</label>
                                                </>
                                            }
                                            render={(value, record, index) => {
                                                return (
                                                    <>
                                                        <label className="table-column-text12">{parseFloat(record.avg_score5).toFixed(2)}</label>
                                                    </>
                                                )
                                            }}
                                        />
                                    </ColumnGroup>

                                    <ColumnGroup title="Jun">
                                        <Column align="center" key="no"
                                            title={
                                                <>
                                                    <label className="table-column-text12">Qty</label>
                                                </>
                                            }
                                            render={(value, record, index) => {
                                                return (
                                                    <>
                                                        <label className="table-column-text12">{record.quantity6}</label>
                                                    </>
                                                )
                                            }}
                                        />
                                        <Column align="center" key="no"
                                            title={
                                                <>
                                                    <label className="table-column-text12">Rate</label>
                                                </>
                                            }
                                            render={(value, record, index) => {
                                                return (
                                                    <>
                                                        <label className="table-column-text12">{parseFloat(record.avg_score6).toFixed(2)}</label>
                                                    </>
                                                )
                                            }}
                                        />
                                    </ColumnGroup>

                                    <ColumnGroup title="July">
                                        <Column align="center" key="no"
                                            title={
                                                <>
                                                    <label className="table-column-text12">Qty</label>
                                                </>
                                            }
                                            render={(value, record, index) => {
                                                return (
                                                    <>
                                                        <label className="table-column-text12">{record.quantity7}</label>
                                                    </>
                                                )
                                            }}
                                        />
                                        <Column align="center" key="no"
                                            title={
                                                <>
                                                    <label className="table-column-text12">Rate</label>
                                                </>
                                            }
                                            render={(value, record, index) => {
                                                return (
                                                    <>
                                                        <label className="table-column-text12">{parseFloat(record.avg_score7).toFixed(2)}</label>
                                                    </>
                                                )
                                            }}
                                        />
                                    </ColumnGroup>

                                    <ColumnGroup title="Aug">
                                        <Column align="center" key="no"
                                            title={
                                                <>
                                                    <label className="table-column-text12">Qty</label>
                                                </>
                                            }
                                            render={(value, record, index) => {
                                                return (
                                                    <>
                                                        <label className="table-column-text12">{record.quantity8}</label>
                                                    </>
                                                )
                                            }}
                                        />
                                        <Column align="center" key="no"
                                            title={
                                                <>
                                                    <label className="table-column-text12">Rate</label>
                                                </>
                                            }
                                            render={(value, record, index) => {
                                                return (
                                                    <>
                                                        <label className="table-column-text12">{parseFloat(record.avg_score8).toFixed(2)}</label>
                                                    </>
                                                )
                                            }}
                                        />
                                    </ColumnGroup>

                                    <ColumnGroup title="Sep">
                                        <Column align="center" key="no"
                                            title={
                                                <>
                                                    <label className="table-column-text12">Qty</label>
                                                </>
                                            }
                                            render={(value, record, index) => {
                                                return (
                                                    <>
                                                        <label className="table-column-text12">{record.quantity9}</label>
                                                    </>
                                                )
                                            }}
                                        />
                                        <Column align="center" key="no"
                                            title={
                                                <>
                                                    <label className="table-column-text12">Rate</label>
                                                </>
                                            }
                                            render={(value, record, index) => {
                                                return (
                                                    <>
                                                        <label className="table-column-text12">{parseFloat(record.avg_score9).toFixed(2)}</label>
                                                    </>
                                                )
                                            }}
                                        />
                                    </ColumnGroup>

                                    <ColumnGroup title="Oct">
                                        <Column align="center" key="no"
                                            title={
                                                <>
                                                    <label className="table-column-text12">Qty</label>
                                                </>
                                            }
                                            render={(value, record, index) => {
                                                return (
                                                    <>
                                                        <label className="table-column-text12">{record.quantity10}</label>
                                                    </>
                                                )
                                            }}
                                        />
                                        <Column align="center" key="no"
                                            title={
                                                <>
                                                    <label className="table-column-text12">Rate</label>
                                                </>
                                            }
                                            render={(value, record, index) => {
                                                return (
                                                    <>
                                                        <label className="table-column-text12">{parseFloat(record.avg_score10).toFixed(2)}</label>
                                                    </>
                                                )
                                            }}
                                        />
                                    </ColumnGroup>

                                    <ColumnGroup title="Nov">
                                        <Column align="center" key="no"
                                            title={
                                                <>
                                                    <label className="table-column-text12">Qty</label>
                                                </>
                                            }
                                            render={(value, record, index) => {
                                                return (
                                                    <>
                                                        <label className="table-column-text12">{record.quantity11}</label>
                                                    </>
                                                )
                                            }}
                                        />
                                        <Column align="center" key="no"
                                            title={
                                                <>
                                                    <label className="table-column-text12">Rate</label>
                                                </>
                                            }
                                            render={(value, record, index) => {
                                                return (
                                                    <>
                                                        <label className="table-column-text12">{parseFloat(record.avg_score11).toFixed(2)}</label>
                                                    </>
                                                )
                                            }}
                                        />
                                    </ColumnGroup>

                                    <ColumnGroup title="Dec">
                                        <Column align="center" key="no"
                                            title={
                                                <>
                                                    <label className="table-column-text12">Qty</label>
                                                </>
                                            }
                                            render={(value, record, index) => {
                                                return (
                                                    <>
                                                        <label className="table-column-text12">{record.quantity12}</label>
                                                    </>
                                                )
                                            }}
                                        />
                                        <Column align="center" key="no"
                                            title={
                                                <>
                                                    <label className="table-column-text12">Rate</label>
                                                </>
                                            }
                                            render={(value, record, index) => {
                                                return (
                                                    <>
                                                        <label className="table-column-text12">{parseFloat(record.avg_score12).toFixed(2)}</label>
                                                    </>
                                                )
                                            }}
                                        />
                                    </ColumnGroup>

                                    <ColumnGroup title="Total" fixed="right">
                                        <Column align="center" key="no" fixed="right"
                                            title={
                                                <>
                                                    <label className="table-column-text12">Qty</label>
                                                </>
                                            }
                                            render={(value, record, index) => {
                                                return (
                                                    <>
                                                        <label className="table-column-text12">{record.total_quantity}</label>
                                                    </>
                                                )
                                            }}
                                        />
                                        <Column align="center" key="no" fixed="right"
                                            width="150px"
                                            title={
                                                <>
                                                    <label className="table-column-text12">Rate</label>
                                                </>
                                            }
                                            render={(value, record, index) => {
                                                return (
                                                    <>
                                                        <Rate disabled allowHalf defaultValue={record.avg_totalscore} style={{ fontSize: 12 }} /><br />
                                                        <label className="table-column-text12">{`(${record.avg_totalscore})`}</label>
                                                    </>
                                                )
                                            }}
                                        />
                                    </ColumnGroup>

                                </Table>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>

                            </Col>
                        </Row>


                    </Card>
                </Col>
            </Row >

            <Row gutter={16} style={{ padding: "24px 24px 0px 24px" }}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Card
                        className="card-dashboard"
                        title={
                            <Row>
                                <Col span={12}>
                                    <label>ข้อเสนอแนะ / ความคิดเห็น</label>
                                </Col>
                                <Col span={12}>
                                    <Input.Search placeholder="เลข Ticket" allowClear
                                        enterButton
                                        onSearch={searchTicket}
                                    />
                                </Col>
                            </Row>
                        }
                    >
                        <Table dataSource={filterTicket === null ? tableSatisfaction : filterTicket} loading={loading}>

                            <Column key="no" align="center" width="3%"
                                title={
                                    <>
                                        <label className="table-column-text12">No</label>
                                    </>
                                }
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <label className="table-column-text12">{record.no}</label>
                                        </>
                                    )
                                }}
                            />

                            <Column key="no" align="center" width="5%"
                                title={
                                    <>
                                        <label className="table-column-text12">Product</label>
                                    </>
                                }
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <label className="table-column-text12">{record.product}</label>
                                        </>
                                    )
                                }}
                            />

                            <Column key="no" align="center" width="15%"
                                title={
                                    <>
                                        <label className="table-column-text12">เลข Ticket</label>
                                    </>
                                }
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <label
                                                className="table-column-text12 text-link"
                                                onClick={() => history.push({ pathname: "/internal/issue/subject/" + record.ticket_id })}
                                            >
                                                {record.ticket_number}
                                            </label>
                                        </>
                                    )
                                }}
                            />

                            <Column key="no"
                                align="center" width="10%"
                                title={
                                    <>
                                        <label className="table-column-text12">แก้ไขปัญหาได้ถูกต้อง</label>
                                    </>
                                }
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <label className="table-column-text12">{record.score}</label>
                                        </>
                                    )
                                }}
                            />

                            <Column key="no"
                                align="center" width="10%"
                                title={
                                    <>
                                        <label className="table-column-text12">แก้ไขปัญหาได้ภายในเวลาที่กำหนด</label>
                                    </>
                                }
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <label className="table-column-text12">{record.score2}</label>
                                        </>
                                    )
                                }}
                            />
                            <Column key="no"
                                align="center" width="10%"
                                title={
                                    <>
                                        <label className="table-column-text12">ความสะดวกในการติดต่อ ประสานงาน</label>
                                    </>
                                }
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <label className="table-column-text12">{record.score3}</label>
                                        </>
                                    )
                                }}
                            />
                            <Column key="no"
                                align="center" width="10%"
                                title={
                                    <>
                                        <label className="table-column-text12">การให้บริการ (Service Mind)</label>
                                    </>
                                }
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <label className="table-column-text12">{record.score4}</label>
                                        </>
                                    )
                                }}
                            />
                            <Column key="no"
                                align="center"
                                width="10%"
                                title={
                                    <>
                                        <label className="table-column-text12">คะแนนการบริการ โดยรวม</label>
                                    </>
                                }
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <label className="table-column-text12">{record.score5}</label>
                                        </>
                                    )
                                }}
                            />
                            <Column key="no" align="center" width="12%"
                                title={
                                    <>
                                        <label className="table-column-text12">Rate</label>
                                    </>
                                }
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <Rate disabled allowHalf value={record.avg_totalscore} style={{ fontSize: 12 }} />

                                        </>
                                    )
                                }}
                            />
                            <Column key="no" align="center" width="5%"
                                title={
                                    <>
                                        <label className="table-column-text12">Score</label>
                                    </>
                                }
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <label className="table-column-text12">{record.avg_totalscore}</label>
                                        </>
                                    )
                                }}
                            />
                            <Column key="no" align="center" width="10%"
                                title={
                                    <>
                                        <label className="table-column-text12">คำติชม</label>
                                    </>
                                }
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <Tooltip title={record.suggestion} key={record.no} >
                                                {
                                                    record.suggestion === "" ? "" :
                                                        <Icon icon="clarity:info-standard-line" fontSize="18" style={{ cursor: "pointer" }} />
                                                }
                                            </Tooltip>
                                        </>
                                    )
                                }}
                            />
                        </Table>
                    </Card>
                </Col>
            </Row>
        </MasterPage >
    )
}