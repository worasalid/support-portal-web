import React, { useEffect, useState } from "react"
import { Row, Col, Card, Spin, Table, Select, DatePicker, Modal, Form, Input } from 'antd';
import { BarChartOutlined, SettingOutlined } from '@ant-design/icons';
import xlsx from 'xlsx';
import Axios from "axios";
import MasterPage from "../../MasterPage";
import moment from "moment"

const { Column, ColumnGroup } = Table;
const { RangePicker } = DatePicker;

export default function DashBoard_CMMI3() {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const [tableData, setTableData] = useState([]);
    const [company, setCompany] = useState([]);
    const [product, setProduct] = useState([]);
    const [priority, setPriority] = useState([]);
    const [serviceRate, setServiceRate] = useState(0);
    const [serviceQuantity, setServiceQuantity] = useState(null);

    // filter
    const [selectCompany, setSelectCompany] = useState(null);
    // const [selectRow, setSelectRow] = useState([]);
    const [selectProduct, setSelectProduct] = useState([]);
    const [selectPriority, setSelectPriority] = useState([]);
    const [selectDate, setSelectDate] = useState([]);

    const [modalSetting, setModalSetting] = useState(false);

    const getCompany = async () => {
        await Axios.get(process.env.REACT_APP_API_URL + "/master/company", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
        }).then((res) => {
            setCompany(res.data)
        }).catch((error) => {

        })
    }

    const getProduct = async () => {
        await Axios.get(process.env.REACT_APP_API_URL + "/master/customer-products", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                company_id: selectCompany
            }
        }).then((res) => {
            setProduct(res.data);

        }).catch((error) => {

        })
    }

    const getPriority = async () => {
        await Axios.get(process.env.REACT_APP_API_URL + "/master/priority", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
        }).then((res) => {
            setPriority(res.data);
        }).catch(() => {

        })
    }

    const getData = async () => {
        setLoading(true);
        await Axios.get(process.env.REACT_APP_API_URL + "/dashboard/cmmi/dashboard_cmmi3", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                companyId: selectCompany,
                productId: selectProduct,
                priorityId: selectPriority,
                startdate: (selectDate[0] === undefined || selectDate[0] === "") ? "" : moment(selectDate[0], "DD/MM/YYYY").format("YYYY-MM-DD"),
                enddate: (selectDate[1] === undefined || selectDate[1] === "") ? "" : moment(selectDate[1], "DD/MM/YYYY").format("YYYY-MM-DD"),

            }
        }).then((res) => {
            setLoading(false);
            getSetting();
            setTableData(res.data.tabledata.map((n, index) => {
                return {
                    key: index,
                    company_name: n.CompanyName,
                    product: n.Product,
                    priority: n.Priority,
                    sla: n.SLA,
                    service_rate: serviceRate,
                    service_quantity: serviceQuantity,
                    issue_cnt: n.IssueCnt,
                    issue_all_minute: n.IssueAllMinute,
                    issue_cnt: n.IssueCnt,
                    issue_not_over: n.IssueNotOver,
                    issue_not_over_minute: n.IssueNotOver_Minute,
                    issue_over: n.IssueOver,
                    issue_over_minute: n.IssueOver_Minute
                }
            }))


        }).catch((error) => {
            setLoading(false);
        })
    }

    const getSetting = async () => {
        await Axios.get(`${process.env.REACT_APP_API_URL}/dashboard/cmmi-setting`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            }
        }).then((res) => {
            setServiceRate(res.data.service_rate);
            setServiceQuantity(res.data.service_quantity);

            form.setFieldsValue({
                service_rate: res.data.service_rate,
                service_quantity: res.data.service_quantity
            })
        }).catch((error) => {

        });
    }

    const updateSetting = async (param) => {
        setLoading(true);
        await Axios({
            url: `${process.env.REACT_APP_API_URL}/dashboard/cmmi-setting`,
            method: "PATCH",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                service_rate: param.service_rate,
                service_quantity: param.service_quantity
            }
        }).then((res) => {
            setLoading(false);
            setModalSetting(false);
            getSetting();
            Modal.success({
                title: 'บันทึกข้อมูลสำเร็จ',
                content: (
                    <div>

                    </div>
                ),
                okText: "Close",
                onOk() {

                },
            })
        }).catch((error) => {
            setLoading(false);
            setModalSetting(false);
            Modal.error({
                title: 'บันทึกข้อมูล ไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.response.data}</p>
                    </div>
                ),
                okText: "Close",
                onOk() {
                },
            });
        })
    }

    const exportExcel = (json) => {
        if (json !== undefined) {
            let ws = xlsx.utils.json_to_sheet(json.map((n, index) => {
                return {
                    No: index + 1,
                    บริษัท: n.CompanyFullName,
                    GoLiveDate: "",
                    Product: n.Product,
                    Month1: n.Month1,
                    Month2: n.Month2,
                    Month3: n.Month3,
                    Month4: n.Month4,
                    Month5: n.Month5,
                    Month6: n.Month6,
                    Month7: n.Month7,
                    Month8: n.Month8,
                    Month9: n.Month9,
                    Month10: n.Month10,
                    Month11: n.Month11,
                    Month12: n.Month12,

                }
            }));

            let wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws, 'Issue_Company');
            xlsx.writeFile(wb, `DashBoard CMMI 1 - ${moment().format("YYMMDD_HHmm")}.xlsx`);
        }
    }

    const onFinish = async (value) => {
        updateSetting(value);
    }

    useEffect(() => {
        getCompany();
        getPriority();
        getSetting();

    }, [])

    useEffect(() => {

        if (selectCompany !== null && selectCompany.length !== 0) {
            getData();
            getProduct()
        }
    }, [selectCompany, selectProduct, selectPriority, selectDate, serviceRate, serviceQuantity])

    return (
        <MasterPage bgColor="#f0f2f5">
            <Row gutter={16} style={{ padding: "10px 24px 0px 24px" }}>
                <Col span={24}>
                    {/* <div > */}
                    <Card
                        title={
                            <>
                                <Row>
                                    <Col span={20}>
                                        <BarChartOutlined style={{ fontSize: 24, color: "#5BC726" }} /> DashBoard สรุปและวิเคราะห์บริการ แยกตาม Product และ Priority
                                    </Col>

                                </Row>
                                <Row style={{ marginTop: 24 }}>
                                    <Col span={4}>

                                    </Col>
                                    <Col span={8}>
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
                                            disabled={selectCompany === null ? true : false}
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
                                    <Col span={6}>
                                        <Select
                                            placeholder="Select Priority"
                                            mode='multiple'
                                            showSearch
                                            allowClear
                                            maxTagCount={2}
                                            style={{ width: "90%" }}
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            onChange={(value) => setSelectPriority(value)}
                                            options={priority && priority.map((n) => ({ value: n.Id, label: n.Name }))}
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
                                <Row>
                                    <Col span={24} style={{ textAlign: "right" }}>
                                        <SettingOutlined style={{ fontSize: 18, color: "#5BC726" }} />
                                        <label className="header-text text-hover"
                                            onClick={() => { setModalSetting(true); getSetting() }}
                                        > ตั้งค่าข้อมูล</label>

                                    </Col>
                                </Row>
                                <Row style={{ marginTop: 30 }}>
                                    <Col span={20}>
                                        <RangePicker format="DD/MM/YYYY" style={{ width: "90%" }}
                                            onChange={(date, dateString) => setSelectDate(dateString)}
                                        />
                                        {/* <Button type="link"
                                            onClick={() => exportExcel(tableData && tableData)}
                                            title="Excel Export"
                                        >
                                            <img
                                                style={{ height: "25px" }}
                                                src={`${process.env.PUBLIC_URL}/icons-excel.png`}
                                                alt="Excel Export"
                                            />
                                        </Button> */}
                                    </Col>

                                </Row>
                            </>
                        }
                    >
                        <Table dataSource={tableData} loading={loading} bordered size="small"
                            scroll={{ x: 2500 }}
                        >

                            <Column title="Company" key="key"
                                align="center"
                                width="10%"
                                fixed="left"
                                render={(record, row, index) => {
                                    return (
                                        <Row>
                                            <Col span={24} style={{ textAlign: "left" }}>
                                                <label className="table-column-text12" >
                                                    {record.company_name}
                                                </label>
                                            </Col>
                                        </Row>
                                    )
                                }}
                            />

                            <Column title="Product" key="key"
                                align="center"
                                width="8%"
                                fixed="left"
                                render={(record, row, index) => {
                                    return (
                                        <Row>
                                            <Col span={24} style={{ textAlign: "left" }}>
                                                <label className="table-column-text12" >
                                                    {record.product}
                                                </label>
                                            </Col>
                                        </Row>
                                    )
                                }}
                            />
                            <Column title="Priority" key="key"
                                align="center"
                                width="5%"
                                render={(record, row, index) => {
                                    return (
                                        <Row>
                                            <Col span={24} style={{ textAlign: "left" }}>
                                                <label className="table-column-text12" >
                                                    {record.priority}
                                                </label>
                                            </Col>
                                        </Row>
                                    )
                                }}
                            />
                            <ColumnGroup title="SLA" width="10%">
                                <Column title="นาที" align="center" key="key"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="table-column-text12">
                                                    {record.sla}
                                                </label>
                                            </>
                                        )
                                    }}
                                />
                                <Column title="ระดับ บริการ" align="center" key="key"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="table-column-text12">
                                                    {record.service_rate}
                                                </label>
                                            </>
                                        )
                                    }}
                                />
                            </ColumnGroup>
                            <ColumnGroup title="ประมาณการ" width="10%" key="key">
                                <Column title="จำนวน" key="key" align="center"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="table-column-text12">
                                                    {record.service_quantity}
                                                </label>
                                            </>
                                        )
                                    }}
                                />
                                <Column title="นาที" key="key" align="center"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="table-column-text12">
                                                    {record.sla * record.service_quantity}
                                                </label>
                                            </>
                                        )
                                    }}
                                />
                            </ColumnGroup>
                            <ColumnGroup title="เกิดขึ้นจริง" key="key" width="10%">
                                <Column title="จำนวน" key="key" align="center" dataIndex="issue_cnt"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="table-column-text12">
                                                    {record.issue_cnt}
                                                </label>
                                            </>
                                        )
                                    }}
                                />
                                <Column title="นาที" key="key" align="center" dataIndex="issue_all_minute"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="table-column-text12">
                                                    {record.issue_all_minute}
                                                </label>
                                            </>
                                        )
                                    }}
                                />
                                <Column title="เฉลี่ย (นาที)" key="key" align="center"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="table-column-text12">
                                                    {parseFloat(record.issue_all_minute / record.issue_cnt).toFixed(2)}
                                                </label>
                                            </>
                                        )
                                    }}
                                />
                            </ColumnGroup>
                            <ColumnGroup title="ผลต่าง" width="10%">
                                <Column title="จำนวน" key="key" align="center"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="table-column-text12">
                                                    {record.issue_cnt - record.service_quantity}
                                                </label>
                                            </>
                                        )
                                    }}
                                />
                                <Column title="นาที" key="key" align="center"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="table-column-text12">
                                                    {record.issue_all_minute - (record.sla * record.service_quantity)}
                                                </label>
                                            </>
                                        )
                                    }}
                                />
                                <Column title="% (นาที)" key="key" align="center"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="table-column-text12">
                                                    {parseFloat(((record.issue_all_minute - (record.sla * record.service_quantity)) * 100) / (record.sla * record.service_quantity)).toFixed(2)}
                                                </label>
                                            </>
                                        )
                                    }}
                                />
                            </ColumnGroup>

                            <ColumnGroup title="เปรียบเทียบกับSLA" width="20%">
                                <ColumnGroup title="ภายใน SLA" >
                                    <Column title="จำนวน" align="center" key="key" dataIndex="issue_not_over"
                                        render={(value, record, index) => {
                                            return (
                                                <>
                                                    <label className="table-column-text12">
                                                        {record.issue_not_over}
                                                    </label>
                                                </>
                                            )
                                        }}
                                    />
                                    <Column title="นาที" align="center" key="key"
                                        render={(value, record, index) => {
                                            return (
                                                <>
                                                    <label className="table-column-text12">
                                                        {record.issue_not_over_minute}
                                                    </label>
                                                </>
                                            )
                                        }}
                                    />
                                    <Column title="เฉลี่ย (นาที)" key="key" align="center"
                                        render={(value, record, index) => {
                                            return (
                                                <>
                                                    <label className="table-column-text12">
                                                        {parseFloat(record.issue_not_over_minute / record.issue_not_over).toFixed(2)}
                                                    </label>
                                                </>
                                            )
                                        }}
                                    />
                                </ColumnGroup>
                                <ColumnGroup title="เกิน SLA">
                                    <Column title="จำนวน" align="center" key="key" dataIndex="issue_over"
                                        render={(value, record, index) => {
                                            return (
                                                <>
                                                    <label className="table-column-text12">
                                                        {record.issue_over}
                                                    </label>
                                                </>
                                            )
                                        }}
                                    />
                                    <Column title="นาที" align="center" key="key" dataIndex="issue_over_minute"
                                        render={(value, record, index) => {
                                            return (
                                                <>
                                                    <label className="table-column-text12">
                                                        {record.issue_over_minute}
                                                    </label>
                                                </>
                                            )
                                        }}
                                    />
                                    <Column title="เฉลี่ย (นาที)" align="center" key="key"
                                        render={(value, record, index) => {
                                            return (
                                                <>
                                                    <label className="table-column-text12">
                                                        {record.issue_over_minute === 0 ? 0 : parseFloat(record.issue_over_minute / record.issue_over).toFixed(2)}
                                                    </label>
                                                </>
                                            )
                                        }}
                                    />
                                </ColumnGroup>
                                <ColumnGroup title="ระดับบริการ %" align="center"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="table-column-text12">
                                                    {parseFloat((record.issue_not_over * 100) / record.issue_cnt).toFixed(2)}
                                                </label>
                                            </>
                                        )
                                    }}
                                >

                                </ColumnGroup>
                            </ColumnGroup>

                        </Table>
                    </Card>
                    {/* </div> */}
                </Col>
            </Row>

            <Modal
                title="ตั้งค่าข้อมูล"
                visible={modalSetting}
                confirmLoading={loading}
                width={600}
                okText="Save"
                onOk={() => form.submit()}
                onCancel={() => { setModalSetting(false); form.resetFields() }}
            >
                <Form
                    name="setting"
                    form={form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="ระดับบริการ %"
                        name="service_rate"
                    >
                        <Input style={{ textAlign: "right" }} />
                    </Form.Item>
                    <Form.Item
                        label="จำนวนครั้ง (ประมาณการ)"
                        name="service_quantity"
                    >
                        <Input style={{ textAlign: "right" }} />
                    </Form.Item>

                </Form>
            </Modal>
        </MasterPage>
    )
}