import React, { useState, useEffect } from 'react';
import { Column, Pie } from '@ant-design/charts';
import MasterPage from '../MasterPage'
import { Row, Col, Card, Spin, Table, Select, DatePicker, Checkbox } from 'antd';
import moment from "moment"
import Axios from "axios";
import { BarChartOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;


export default function Dashboard1() {
    const [loading, setLoading] = useState(true);

    //data
    const [chartData, setChartData] = useState([]);
    const [pieData, setPieData] = useState([]);

    // filter
    const [selectDate, setSelectDate] = useState([]);
    const [isStack, setIsStack] = useState(false)

    const chartData_config = {
        xField: 'CompanyName',
        yField: 'Value',
        seriesField: 'ProductName',
        //isPercent: true,
        isStack: isStack,
        isGroup: !isStack,
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
                return item.Value.toFixed(0);
            },
            style: { fill: '#fff' },
        },
        legend: {
            layout: 'horizontal',
            position: 'bottom'
        },
        // color: function color(x) {
        //     // if (x.developer === "InProgress") { return "#5B8FF9" } // สีฟ้า
        //     //if (x.GroupStatus === "InProgress") { return "#52C41A" } // เขียว
        //    // if (x.GroupStatus === "ReOpen") { return "#FF5500" } // สีส้ม
        //     //if (x.status === "ReOpen") { return "#CD201F" }//สีแดง
        // },


    };

    const piechart_config = {
        appendPadding: 10,
        angleField: 'Value',
        colorField: 'CompanyName',
        radius: 0.75,
        label: {
            type: 'spider',
            labelHeight: 28,
            content: '{name} ({value})'
            //content: '{name}\n{percentage}',
        },
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    };


    const getData = async () => {
        setLoading(true);
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/dashboard/dashboard1",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    startdate: (selectDate[0] === undefined || selectDate[0] === "") ? "" : moment(selectDate[0], "DD/MM/YYYY").format("YYYY-MM-DD"),
                    enddate: (selectDate[1] === undefined || selectDate[1] === "") ? "" : moment(selectDate[1], "DD/MM/YYYY").format("YYYY-MM-DD"),
                }
            });

            if (result.status === 200) {
                setChartData(result.data.chartdata);
                setPieData(result.data.piedata)
                setLoading(false);
            }

        } catch (error) {
            setLoading(false);
        }


    }

    useEffect(() => {
        getData();
    }, [])

    useEffect(() => {
        getData();
    }, [selectDate[0], isStack]);

    // useEffect(() => {

    //     if (selectDate[0] !== undefined || selectDate[0] !== "") {
    //         setInterval(() => {
    //             getData();
    //         }, 60000)
    //     }
    // }, [selectDate[0]]);


    return (
        <MasterPage bgColor="#f0f2f5">
            <Spin spinning={loading}>
                <Row gutter={16} style={{ marginTop: "0px", padding: "10px 24px 0px 0px" }}>
                    <Col span={24} style={{ textAlign: "right" }}>
                        <label
                            style={{ fontSize: 10 }}

                        >ข้อมูลล่าสุดเมื่อ : {moment().format("DD/MM/YYYY HH:mm:ss")}</label>
                    </Col>
                </Row>

                <Row gutter={16} style={{ padding: "10px 24px 0px 24px" }}>
                    <Col span={24}>
                        <Card
                            title={
                                <Row>
                                    <Col span={10}>
                                        <BarChartOutlined style={{ fontSize: 24, color: "#5BC726" }} /> DashBoard New Issue
                                    </Col>
                                    <Col span={8}>

                                    </Col>
                                    <Col span={6}>
                                        <RangePicker format="DD/MM/YYYY" style={{ width: "90%" }}

                                            onChange={(date, dateString) => { setSelectDate(dateString); console.log("dateString", dateString) }}
                                        />
                                    </Col>
                                </Row>
                            }
                            bordered={true}
                            style={{ width: "100%" }} className="card-dashboard"
                            extra={
                                <Checkbox onChange={(value) => setIsStack(value.target.checked)}

                                >
                                    Is Stack
                                </Checkbox>
                            }
                        >
                            <Column {...chartData_config}
                                data={chartData && chartData}
                                height={300}
                                xAxis={{ position: "bottom" }}
                            />
                        </Card>
                    </Col>

                </Row>
                <Row gutter={16} style={{ marginTop: "10px", padding: "10px 24px 24px 24px" }}>
                    <Col span={24}>
                        <Card title="Issue Total" bordered={true} style={{ width: "100%" }} loading={loading} className="card-dashboard">
                            <Pie {...piechart_config}
                                data={pieData}
                                height={300}
                            />
                        </Card>
                    </Col>
                </Row>
            </Spin>
        </MasterPage>
    )
}
