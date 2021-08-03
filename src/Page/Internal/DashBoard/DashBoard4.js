import React, { useState, useEffect } from 'react';
import { Column } from '@ant-design/charts';
import MasterPage from '../MasterPage'
import { Row, Col, Card, Spin, Table } from 'antd';
import { FileOutlined } from '@ant-design/icons';
import Axios from "axios";

const { Meta } = Card;


export default function Dashboard4() {
    const [loading, setLoading] = useState(false)

    const chartData_config = {
        xField: 'module',
        yField: 'value',
        seriesField: 'developer',
        //isPercent: true,
        isStack: true,

        // slider: {
        //     start: 0,
        //     end: 2,
        //     maxLimit: 100,
        // },
        columnWidthRatio: 0.1,
        label: {
            position: 'middle',
            content: function content(item) {
                return item.value.toFixed(0);
            },
            style: { fill: '#fff' },
        },
        legend: {
            layout: 'horizontal',
            position: 'bottom'
        },
        // color: function color(x) {
        //     if (x.developer === "Finance") { return "#5B8FF9" }
        //     if (x.developer === "SaleOrder") { return "#FF5500" }
        //     if (x.developer === "CRM") { return "#CD201F" }
        //     if (x.developer === "Report") { return "#gray" }


        // },

    };

    const tableData = [
        {
            module: "Finance",
            value: 3
        },
        {
            module: "SaleOrder",
            value: 10
        },
        {
            module: "CRM",
            value: 4
        },
        {
            module: "Report",
            developer: "สมประสงค์",
            value: 7
        },
        {
            module: "PrintForm",
            developer: "สมประสงค์",
            value: 6
        },
    ]

    const chartData = [
        {
            module: "Finance",
            developer: "อภิรักษ์",
            value: 3
        },
        {
            module: "SaleOrder",
            developer: "ธนากร",
            value: 10
        },
        {
            module: "CRM",
            developer: "ภาสกร",
            value: 4
        },
        {
            module: "Report",
            developer: "สมประสงค์",
            value: 4
        },
        {
            module: "Report",
            developer: "วศิน",
            value: 3
        },
        {
            module: "PrintForm",
            developer: "สมประสงค์",
            value: 3
        },
        {
            module: "PrintForm",
            developer: "P.หนิง",
            value: 3
        }
    ]

    useEffect(() => {

    }, [])

    return (
        <MasterPage bgColor="#f0f2f5">
            <Spin spinning={loading}>

                <Row gutter={16} style={{ marginTop: "30px", padding: "24px 24px 24px 24px" }}>
                    <Col span={24}>
                        <div >
                            <Card title="REM Product" bordered={true} style={{ width: "100%" }}>
                                <Column {...chartData_config}
                                    data={chartData}
                                    height={200}
                                    //scrollbar="true"
                                    xAxis={{ position: "bottom" }}
                                />

                            </Card>
                        </div>
                    </Col>

                </Row>
                <Row gutter={16} style={{ marginTop: "30px", padding: "24px 24px 24px 24px" }}>
                    <Col span={12}>
                        <Table dataSource={tableData}>
                            <Column title="No" align="center"
                                width="10%"
                                render={(record, row, index) => {
                                    return (
                                        <>
                                            {index + 1}
                                        </>
                                    )
                                }

                                }
                            />
                            <Column title="Module"
                                align="center"
                                width="55%"
                                render={(record, row, index) => {
                                    return (
                                        <>
                                            {record.module}
                                            {console.log("row", row)}
                                            {console.log("index", index)}
                                        </>
                                    )
                                }

                                }
                            />
                            <Column title="จำนวน" width="10%" dataIndex="value" />

                        </Table>
                    </Col>
                </Row>
            </Spin>
        </MasterPage>
    )
}
