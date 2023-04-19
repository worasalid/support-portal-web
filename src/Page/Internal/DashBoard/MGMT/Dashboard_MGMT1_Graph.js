import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

// layout component
import MasterPage from '../../MasterPage';

// antd
import { Row, Col, Card, Table, Modal, Spin, Form, Input } from 'antd';
import { Column as ColumnChart, Pie } from '@ant-design/charts';
import { BarChartOutlined, SettingOutlined } from '@ant-design/icons';

// utility
import axios from "axios";
import moment from "moment";
import _ from "lodash";
import Slider from "react-slick";
import { Icon } from '@iconify/react';

const configHeader = {
    headers: {
        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
    },
}

// chart config
const chartData_config = {
    xField: 'developerName',
    yField: 'value',
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
    columnWidthRatio: 0.8,
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
    color: function color(item) {
        if (item.issueType === "ChangeRequest") { return "#5B8FF9" } // สีฟ้า
        if (item.issueType === "Bug") { return "#CD201F" }//สีแดง
        //if (item.issueType === "Memo") { return "#FF5500" } // สีส้ม
        if (item.issueType === "Memo") { return "#52C41A" } // เขียว

    },
    onclick: function onclick() {
        alert()
    },

};

const piechart_config = {
    appendPadding: 10,
    angleField: 'value',
    colorField: 'product',
    radius: 0.75,
    label: {
        type: 'spider',
        labelHeight: 28,
        content: '{name} ({value})'
        //content: '{name}\n{percentage}',
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
};

export default function DashBoard_MGMT_1_Graph() {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [modalSetting, setModalSetting] = useState(false);

    const [chartData, setChartData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);
    const [slickCount, setSlickCount] = useState(0);
    const [autoPlay, setAutoPlay] = useState(10);
    const [refreshData, setRefreshData] = useState(15);

    const getDashBoardData = async () => {
        setLoading(true);
        await axios.get(`${process.env.REACT_APP_API_URL}/dashboard/mgmt/dashboard_mgmt_1`, configHeader)
            .then((res) => {
                setLoading(false);

                setSlickCount(Math.ceil(res.data.columnChartData.length / 10));

                setChartData(res.data.columnChartData.map((item, index) => {
                    return {
                        no: index + 1,
                        developerName: item.DeveloperName,
                        issueType: item.IssueType,
                        value: item.Value
                    }
                }));

                setPieChartData(res.data.pieChartData.map((item) => {
                    return {
                        product: item.Product,
                        issueType: item.IssueType,
                        value: item.Value
                    }
                }))
            }).catch((error) => {
                console.log(error.response);
            });
    };

    const onFinish = async (value) => {
        form.setFieldsValue({
            autoPlay: Number(value.autoPlay),
            refresh: Number(value.refresh)
        });

        setAutoPlay(Number(value.autoPlay));
        setRefreshData(Number(value.refresh));
        setModalSetting(false);
    }

    useEffect(() => {
        getDashBoardData();

        const interval = setInterval(() => {
            getDashBoardData();
        }, refreshData * 60 * 1000);

        return () => clearInterval(interval);
    }, [refreshData])

    return (
        <>
            <MasterPage bgColor="#f0f2f5">
                <Row gutter={16} style={{ padding: "10px 24px 0px 24px" }}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Card
                            className="card-dashboard"
                            style={{ padding: "10px 24px 0px 24px" }}
                            title={
                                <>
                                    <BarChartOutlined style={{ fontSize: 24, color: "#5BC726" }} />
                                    DashBoard สรุป Issue OverDue
                                </>
                            }
                            extra={
                                <Row>
                                    <Col span={24} style={{ textAlign: "right" }}>
                                        <Icon icon="mdi:graph-bar" width="36" height="36"
                                            onClick={() => history.push({ pathname: "/internal/dashboard/mgmt/dashboard_mgmt1/graph" })}
                                        />
                                        <Icon icon="material-symbols:table" width="36" height="36"
                                            onClick={() => history.push({ pathname: "/internal/dashboard/mgmt/dashboard_mgmt1/table" })}
                                        />

                                        <SettingOutlined
                                            style={{ fontSize: 36, color: "#5BC726", margin: '10px' }}
                                            onClick={() => {
                                                form.setFieldsValue({ autoPlay: autoPlay, refresh: refreshData })
                                                setModalSetting(true);
                                            }}
                                        />
                                        <label style={{ marginLeft: "24px" }}>
                                            {`Last Update : ${moment().format("DD/MM/YYYY : HH:mm")}`}
                                        </label>
                                    </Col>
                                </Row>
                            }
                        >
                            <Row style={{ marginTop: 0 }}>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <div style={{ padding: "0px 24px 0px 24px" }}>
                                        <Slider
                                            dots={true}
                                            infinite={true}
                                            speed={1000}
                                            slidesToShow={1}
                                            slidesToScroll={1}
                                            swipeToSlide={true}
                                            autoplay={true}
                                            autoplaySpeed={autoPlay * 1000}
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
                                                                        <label style={{ color: "orange" }}>จำนวน Issue</label>
                                                                    </Col>
                                                                </Row>
                                                                <ColumnChart {...chartData_config}
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

                            {/* pie chart */}
                            <Row gutter={16} style={{ marginTop: 24 }}>
                                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                    <Card title="Bug" bordered={true} style={{ width: "100%" }} loading={loading} className="card-dashboard">
                                        <Pie {...piechart_config}
                                            width={300}
                                            style={{ height: "100%" }}
                                            data={_.filter(pieChartData, { issueType: "Bug" })}
                                            height={300}
                                        />
                                    </Card>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                    <Card title="CR / Memo" bordered={true} style={{ width: "100%", margin: "5px" }} loading={loading} className="card-dashboard">
                                        <Pie {...piechart_config}
                                            width={300}
                                            style={{ height: "100%" }}
                                            data={_.filter(pieChartData, obj => (obj.issueType === "ChangeRequest" || obj.issueType === "Memo"))}
                                            height={300}
                                        />
                                    </Card>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </MasterPage >

            <Modal
                title="ตั้งค่า"
                visible={modalSetting}
                confirmLoading={loading}
                width={600}
                okText="Save"
                onOk={() => form.submit()}
                onCancel={() => {
                    setModalSetting(false);
                }}
            >
                <Form
                    name="setting"
                    form={form}
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 14 }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Auto Play (วินาที)"
                        name="autoPlay"
                    >
                        <Input min={10} style={{ textAlign: "right", width: "100%" }}
                            onKeyPress={(event) => {
                                console.log('event?.key', event?.key)
                                if (isNaN(event?.key) && event?.key != '.') {
                                    event.preventDefault();
                                }
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Refresh ข้อมูล (นาที)"
                        name="refresh"
                    >
                        <Input style={{ textAlign: "right", width: "100%" }}
                            onKeyPress={(event) => {
                                if (isNaN(event?.key) && event?.key != '.') {
                                    event.preventDefault();
                                }
                            }}
                        />
                    </Form.Item>

                </Form>
            </Modal>
        </>
    )
};