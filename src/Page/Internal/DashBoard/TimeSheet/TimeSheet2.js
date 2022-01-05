import React, { useEffect, useState } from "react";
import MasterPage from '../../MasterPage'
import { Row, Col, Card, Space, Table, Select, Input, Radio, Button, Tooltip } from 'antd';
import { BarChartOutlined, SettingOutlined } from '@ant-design/icons';
import moment from "moment";
import axios from "axios";
import xlsx from 'xlsx';

const { ColumnGroup, Column } = Table;

export default function TimeSheet2() {
    const [loading, setLoading] = useState(false);
    const [company, setCompany] = useState();
    const [owner, setOwner] = useState();
    const [product, setProduct] = useState([]);
    const [issueType, setIssueType] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [filterTableData, setFilterTableData] = useState(null);

    const [selectCompany, setSelectCompany] = useState(null);
    const [selectProduct, setSelectProduct] = useState(null);
    const [selectType, setSelectType] = useState(null);
    const [selectOwner, setSelectOwner] = useState([]);
    const [mandayType, setMandayType] = useState(1)
    const [keyword, setKeyWord] = useState();

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

    const getData = async () => {
        setLoading(true);
        await axios.get(`${process.env.REACT_APP_API_URL}/dashboard/timesheet/timesheet2`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                type: selectType,
                companyId: selectCompany,
                productId: selectProduct,
                ownerId: selectOwner,
                start_date: "",
                end_date: "",
                keyword: ""
            }
        }).then((res) => {
            setTableData(res.data.map((n, index) => {
                return {
                    key: index,
                    code: n.Code,
                    company: n.Company,
                    product: n.Product,
                    issue_type: n.IssueType,
                    owner: n.OwnerName,
                    ticket: n.Number,
                    total: mandayType === 1 ? n.TotalTime : convertTime(n.TotalTime)
                }
            }));
            setLoading(false);
        }).catch((error) => {
            setLoading(false);
        })
    }

    const searchTicket = (param) => {
        let result = tableData.filter(o =>
            Object.keys(o).some(k =>
                String(o[k])
                    .toLowerCase()
                    .includes(param.toLowerCase())
            )
        );
        setFilterTableData(result);
    }

    const exportExcel = (json) => {
        if (json !== undefined) {
            let ws = xlsx.utils.json_to_sheet(json.map((n, index) => {
                return {
                    No: index + 1,
                    "บริษัท": n.company,
                    Product: n.product,
                    "ประเภท": n.issue_type,
                    "เลข Ticket": n.ticket,
                    Owner: n.owner,
                    "จำนวน": n.total

                }
            }));

            let wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws, `detail`);
            xlsx.writeFile(wb, `DashBoard TimeSheet 2 - ${moment().format("YYMMDD_HHmm")}.xlsx`);
        }
    }

    useEffect(() => {
        getCompany();
        getProduct();
        getIssueType();
        getDeveloper();
    }, [])

    useEffect(() => {
        getData();
    }, [selectCompany, selectType, selectProduct, selectOwner, mandayType, keyword])


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
                                        <BarChartOutlined style={{ fontSize: 24, color: "#5BC726" }} /> รายงานสรุป รายละเอียด เวลาที่ใช้พัฒนา ของทีม Developer
                                    </Col>

                                </Row>
                                <Row style={{ marginTop: 24 }}>
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

                                    <Col span={4}>
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
                                        <Input.Search placeholder="เลข Ticket" allowClear
                                            style={{ width: "90%" }}
                                            enterButton
                                            onSearch={searchTicket}
                                        />
                                    </Col>

                                    <Col span={4}>
                                        <Radio.Group value={mandayType} onChange={(e) => setMandayType(e.target.value)}>
                                            <Space direction="vertical">
                                                <Radio value={1}>นาที</Radio>
                                                <Radio value={2}>ชม. </Radio>
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
                        <Table dataSource={filterTableData === null ? tableData : filterTableData} loading={loading} bordered className="text-size">
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

                            <Column title="Ticket" key="key"
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <label className="table-column-text12">{record.ticket}</label>
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
                            <Column title="Total" key="key"
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <label className="table-column-text12">{record.total}</label>
                                        </>
                                    )
                                }}
                            />



                        </Table>
                    </Card>
                    {/* </div> */}
                </Col>
            </Row>

        </MasterPage>
    )
}