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
    const [selectCompany, setSelectCompany] = useState(null);
    const [selectProduct, setSelectProduct] = useState(null);
    const [selectType, setSelectType] = useState(null);
    const [selectOwner, setSelectOwner] = useState([]);
    const [mandayType, setMandayType] = useState(1)

    const convertTime = (time) => {
        return `${moment.duration(time, 'minute')._data.hours}.${moment.duration(time, 'minute')._data.minutes}`
    }

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

    const getDeveloper = async () => {
        await axios.get(process.env.REACT_APP_API_URL + "/master/organize/user", {
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
        await axios.get(process.env.REACT_APP_API_URL + "/master/products", {
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
        await axios.get(`${process.env.REACT_APP_API_URL}/dashboard/timesheet/timesheet1`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                year: selectYear,
                type: selectType,
                companyId: selectCompany,
                productId: selectProduct,
                ownerId: selectOwner
            }
        }).then((res) => {
            setTableData(res.data.map((n, index) => {
                return {
                    key: index,
                    code: n.CompanyCode,
                    company: n.CompanyName,
                    product: n.Product,
                    issue_type: n.IssueType,
                    owner: n.DisplayName,
                    month01: mandayType === 1 ? n.Jan : convertTime(n.Jan),
                    month02: mandayType === 1 ? n.Feb : convertTime(n.Feb),
                    month03: mandayType === 1 ? n.Mar : convertTime(n.Mar),
                    month04: mandayType === 1 ? n.Apr : convertTime(n.Apr),
                    month05: mandayType === 1 ? n.Mar : convertTime(n.Mar),
                    month06: mandayType === 1 ? n.Jun : convertTime(n.Jun),
                    month07: mandayType === 1 ? n.Jul : convertTime(n.Jul),
                    month08: mandayType === 1 ? n.Aug : convertTime(n.Aug),
                    month09: mandayType === 1 ? n.Sep : convertTime(n.Sep),
                    month10: mandayType === 1 ? n.Oct : convertTime(n.Oct),
                    month11: mandayType === 1 ? n.Nov : convertTime(n.Nov),
                    month12: mandayType === 1 ? n.Dec : convertTime(n.Dec),
                    total: mandayType === 1 ? n.TotalMinute : convertTime(n.TotalMinute)

                }
            }));
            setLoading(false);
        }).catch((error) => {
            setLoading(false);
        })
    }

    const exportExcel = (json) => {
        if (json !== undefined) {
            let ws = xlsx.utils.json_to_sheet(json.map((n, index) => {
                return {
                    No: index + 1,
                    code: n.code,
                    "บริษัท": n.company,
                    Product: n.product,
                    IssueType: n.issue_type,
                    Owner: n.owner,
                    Jan: n.month01,
                    Feb: n.month02,
                    Mar: n.month03,
                    Apr: n.month04,
                    Mar: n.month05,
                    Jun: n.month06,
                    Jul: n.month07,
                    Aug: n.month08,
                    Sep: n.month09,
                    Oct: n.month10,
                    Nov: n.month11,
                    Dec: n.month12,
                    Total: n.total

                }
            }));

            let wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws, `TimeSheet ${selectYear}`);
            xlsx.writeFile(wb, `DashBoard TimeSheet 1 - ${moment().format("YYMMDD_HHmm")}.xlsx`);
        }
    }


    useEffect(() => {
        getCompany();
        getProduct();
        getDeveloper();
        getIssueType();
    }, [])

    useEffect(() => {
        getData();
    }, [selectYear, selectCompany, selectProduct, selectType, selectOwner, mandayType])

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
                                        <BarChartOutlined style={{ fontSize: 24, color: "#5BC726" }} /> รายงานสรุปจำนวนวัน ที่ใช้แก้ไข และ พัฒนา ของทีม Developer
                                    </Col>

                                </Row>
                                <Row style={{ marginTop: 24 }}>
                                    <Col span={2}>
                                        <DatePicker defaultValue={moment()} picker="year" onChange={(date, dateString) =>setSelectYear(dateString)} />
                                    </Col>
                                    <Col span={4}>
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
                                    <Col span={4}>
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
                        <Table dataSource={tableData} loading={loading} bordered className="text-size">
                            <Column title="Code" key="key"
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <Tooltip title={record.company}>
                                                <label className="table-column-text12">{record.code}</label>
                                            </Tooltip>

                                        </>
                                    )
                                }}
                            />

                            <Column title="Product" key="key"
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <label className="table-column-text12">{record.product}</label>
                                        </>
                                    )
                                }}
                            />
                            <Column title="IssueType" key="key"
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <label className="table-column-text12">{record.issue_type}</label>
                                        </>
                                    )
                                }}
                            />
                            <Column title="Owner" key="key"
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <label className="table-column-text12">{record.owner}</label>
                                        </>
                                    )
                                }}
                            />
                            <ColumnGroup title={`ปี ${selectYear}`} >
                                <Column title="Jan" key="key" dataIndex="month01" align="center" />
                                <Column title="Feb" key="key" dataIndex="month02" align="center" />
                                <Column title="Mar" key="key" dataIndex="month03" align="center" />
                                <Column title="Apr" key="key" dataIndex="month04" align="center" />
                                <Column title="May" key="key" dataIndex="month05" align="center" />
                                <Column title="Jun" key="key" dataIndex="month06" align="center" />
                                <Column title="Jul" key="key" dataIndex="month07" align="center" />
                                <Column title="Aug" key="key" dataIndex="month08" align="center" />
                                <Column title="Sep" key="key" dataIndex="month09" align="center" />
                                <Column title="Oct" key="key" dataIndex="month10" align="center" />
                                <Column title="Nov" key="key" dataIndex="month11" align="center" />
                                <Column title="Dec" key="key" dataIndex="month12" align="center" />
                                <Column title="Total" key="key" dataIndex="total" align="center" />
                            </ColumnGroup>
                        </Table>
                    </Card>
                    {/* </div> */}
                </Col>
            </Row>

        </MasterPage>
    )
}