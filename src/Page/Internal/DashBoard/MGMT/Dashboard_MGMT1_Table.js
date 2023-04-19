import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

// layout component
import MasterPage from '../../MasterPage';

// antd
import { Row, Col, Card, Table, Modal, Spin, Button, Form, Input } from 'antd';
import { BarChartOutlined, SettingOutlined } from '@ant-design/icons';

// utility
import axios from "axios";
import moment from "moment";
import _ from "lodash";
import { Icon } from '@iconify/react';

const configHeader = {
    headers: {
        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
    },
}

export default function DashBoard_MGMT_1_Table() {
    const { Column } = Table;
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [modalSetting, setModalSetting] = useState(false);

    const [tableData, setTableData] = useState([]);
    const [filterCompany, setFilterCompany] = useState([]);
    const [filterIssueType, setFilterIssueType] = useState([]);
    const [filterLeaderName, setFilterLeaderName] = useState([]);
    const [autoPlay, setAutoPlay] = useState(10);
    const [refreshData, setRefreshData] = useState(15);

    const getDashBoardData = async () => {
        setLoading(true);
        await axios.get(`${process.env.REACT_APP_API_URL}/dashboard/mgmt/dashboard_mgmt_1`, configHeader)
            .then((res) => {
                setLoading(false);

                setTableData(res.data.tableDetails.map((item) => {
                    return {
                        issueNo: item.TicketNumber,
                        companyCode: item.CompanyCode,
                        product: item.Product,
                        issueType: item.IssueType,
                        title: item.Title,
                        leaderName: item.LeaderName,
                        developerName: item.DeveloperName,
                        overDue: item.IssueOverDue,
                        noEstimate: item.NoEstimate,
                        devOverDue1: item.DueDate_Dev1 !== null ? moment(item.DueDate_Dev1).format("DD/MM/YYYY") : "",
                        devOverDue2: item.DueDate_Dev2 !== null ? moment(item.DueDate_Dev2).format("DD/MM/YYYY") : "",
                        devOverDue3: item.DueDate_Dev3 !== null ? moment(item.DueDate_Dev3).format("DD/MM/YYYY") : ""
                    }
                }));

                setFilterCompany(_.uniqBy(res.data.tableDetails, 'CompanyCode').map((item) => {
                    return {
                        text: item.CompanyCode,
                        value: item.CompanyCode
                    }
                }));

                setFilterIssueType(_.uniqBy(res.data.tableDetails, 'IssueType').map((item) => {
                    return {
                        text: item.IssueType,
                        value: item.IssueType
                    }
                }));

                setFilterLeaderName(_.uniqBy(res.data.tableDetails, 'LeaderName').map((item) => {
                    return {
                        text: item.LeaderName,
                        value: item.LeaderName
                    }
                }));
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
                                            style={{ cursor: "pointer" }}
                                            onClick={() => history.push({ pathname: "/internal/dashboard/mgmt/dashboard_mgmt1/graph" })}
                                        />
                                        <Icon icon="material-symbols:table" width="36" height="36"
                                            style={{ cursor: "pointer" }}
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
                            <Row style={{ marginTop: 24 }}>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                    <Table rowKey={(item) => item.issueNo} dataSource={tableData} className="header-sticky">
                                        <Column title="Issue No."
                                            align="center"
                                            width="15%"
                                            filters={filterCompany}
                                            onFilter={(value, record) => {
                                                return record.companyCode.toLowerCase().includes(value.toLowerCase())
                                            }}
                                            render={(record) => {
                                                return (
                                                    <>
                                                        <Row style={{ borderBottom: "1px dotted" }}>
                                                            <Col span={8}>
                                                                <label className="table-column-text" style={{ color: "#808080" }}>
                                                                    No :
                                                                </label>
                                                            </Col>
                                                            <Col span={14}>
                                                                <label style={{ color: "orange", fontSize: "11px" }}>
                                                                    {record.issueNo}
                                                                </label>
                                                            </Col>
                                                        </Row>
                                                        <Row style={{ borderBottom: "1px dotted" }}>
                                                            <Col span={8}>
                                                                <label className="table-column-text" style={{ color: "#808080" }}>
                                                                    Site :
                                                                </label>
                                                            </Col>
                                                            <Col span={14}>
                                                                <label style={{ color: "#808080", fontSize: "12px" }}>
                                                                    {record.companyCode}
                                                                </label>
                                                            </Col>
                                                        </Row>
                                                    </>
                                                )
                                            }}
                                        />

                                        <Column title="Type"
                                            align="center"
                                            width="5%"
                                            filters={filterIssueType}
                                            onFilter={(value, record) => {
                                                return record.issueType.toLowerCase().includes(value.toLowerCase())
                                            }}
                                            render={(record) => {
                                                return (
                                                    <label className="table-column-text12">
                                                        {record.issueType}
                                                    </label>
                                                )
                                            }}
                                        />

                                        <Column
                                            title={
                                                <label className="table-column-text11"
                                                    style={{ textAlign: "center" }}
                                                >
                                                    Title
                                                </label>
                                            }
                                            align="center"
                                            width="30%"
                                            render={(record) => {
                                                return (
                                                    <Row style={{ textAlign: "left" }}>
                                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                                            <label className="table-column-text12">
                                                                {record.title}
                                                            </label>
                                                        </Col>
                                                    </Row>

                                                )
                                            }}
                                        />

                                        <Column title="Developer"
                                            align="center"
                                            width="15%"
                                            filters={filterLeaderName}
                                            onFilter={(value, record) => {
                                                return record.leaderName.toLowerCase().includes(value.toLowerCase())
                                            }}
                                            render={(value, record) => {
                                                return (
                                                    <>
                                                        <Row style={{ borderBottom: "1px dotted" }}>
                                                            <Col span={8}>
                                                                <label className="table-column-text" style={{ color: "#808080" }}>
                                                                    Leader :
                                                                </label>
                                                            </Col>
                                                            <Col span={14}>
                                                                <label style={{ color: "#808080", fontSize: "10px" }}>
                                                                    {record.leaderName}
                                                                </label>
                                                            </Col>
                                                        </Row>
                                                        <Row style={{ borderBottom: "1px dotted" }}>
                                                            <Col span={8}>
                                                                <label className="table-column-text" style={{ color: "#808080" }}>
                                                                    Owner :
                                                                </label>
                                                            </Col>
                                                            <Col span={14}>
                                                                <label style={{ color: "#808080", fontSize: "10px" }}>
                                                                    {record.developerName}
                                                                </label>
                                                            </Col>
                                                        </Row>
                                                    </>
                                                )
                                            }}
                                        />

                                        <Column title="Over Due (วัน)"
                                            align="center"
                                            width="8%"
                                            render={(record) => {
                                                return (
                                                    <label className="table-column-text12">
                                                        {record.overDue}
                                                    </label>
                                                )
                                            }}
                                        />

                                        <Column title="No Estimate (วัน)"
                                            align="center"
                                            width="10%"
                                            render={(record) => {
                                                return (
                                                    <label className="table-column-text12">
                                                        {record.noEstimate}
                                                    </label>
                                                )
                                            }}
                                        />

                                        <Column title="Due Date"
                                            align="center"
                                            width="15%"
                                            render={(record) => {
                                                return (
                                                    <>
                                                        <Row style={{ borderBottom: "1px dotted" }}>
                                                            <Col span={8}>
                                                                <label className="table-column-text" style={{ color: "#808080" }}>
                                                                    ครั้งที่ 1 :
                                                                </label>
                                                            </Col>
                                                            <Col span={14}>
                                                                <label style={{ color: "#808080", fontSize: "10px" }}>
                                                                    {record.devOverDue1}
                                                                </label>
                                                            </Col>
                                                        </Row>
                                                        <Row style={{ borderBottom: "1px dotted" }}>
                                                            <Col span={8}>
                                                                <label className="table-column-text" style={{ color: "#808080" }}>
                                                                    ครั้งที่ 2 :
                                                                </label>
                                                            </Col>
                                                            <Col span={14}>
                                                                <label style={{ color: "#808080", fontSize: "10px" }}>
                                                                    {record.devOverDue2}
                                                                </label>
                                                            </Col>
                                                        </Row>
                                                        <Row style={{ borderBottom: "1px dotted" }}>
                                                            <Col span={8}>
                                                                <label className="table-column-text" style={{ color: "#808080" }}>
                                                                    ครั้งที่ 3 :
                                                                </label>
                                                            </Col>
                                                            <Col span={14}>
                                                                <label style={{ color: "#808080", fontSize: "10px" }}>
                                                                    {record.devOverDue3}
                                                                </label>
                                                            </Col>
                                                        </Row>
                                                    </>
                                                )
                                            }}
                                        />
                                        {/* 
                                        <Column title="Due Date (ครั้งที่ 2)"
                                            align="center"
                                            width="10%"
                                            render={(record) => {
                                                return (
                                                    <label className="table-column-text12">
                                                        {record.devOverDue2}
                                                    </label>
                                                )
                                            }}
                                        />

                                        <Column title="Due Date (ครั้งที่ 3)"
                                            align="center"
                                            width="10%"
                                            render={(record) => {
                                                return (
                                                    <label className="table-column-text12">
                                                        {record.devOverDue3}
                                                    </label>
                                                )
                                            }}
                                        /> */}
                                    </Table>
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