import { PlusOutlined, SearchOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Table, Modal, Checkbox, message, Tabs, Row, Col, Select, Input } from 'antd';
import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router';
//import { useHistory } from 'react-router-dom';
import MasterPage from '../MasterPage'

const { Column } = Table;
const { TabPane } = Tabs;

export default function MapCompany() {
    const history = useHistory(null);
    const [binding, setBinding] = useState(true)
    const [tabKey, setTabKey] = useState("1")
    const [loadingSupport, setLoaddingSupport] = useState(false)
    const [loadingConsult, setLoaddingConsult] = useState(false)
    const [loadingCompany, setLoaddingCompany] = useState(false)

    //data
    const [supportlist, setSupportlist] = useState([])
    const [consultList, setConsultList] = useState([])
    const [companyList, setCompanyList] = useState([]);


    // filter
    const [filterSupport, setFilterSupport] = useState(null);
    const [filterConsult, setFilterConsult] = useState(null);
    const [filterCompany, setFilterCompany] = useState(null);


    const loadSupport = async () => {
        try {
            setLoaddingSupport(true);
            const company_support = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/support-company",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    organize_code: "support",
                    keyword: filterSupport
                }
            });

            if (company_support.status === 200) {
                setLoaddingSupport(false);
                setSupportlist(company_support.data.map((data) => {
                    return {
                        key: data.UserId,
                        userId: data.UserId,
                        code: data.Code,
                        username: data.UserName,
                        nickname: data.NickName,
                        cnt_company: data.CntCompany
                    }
                }))
            }
        } catch (error) {

        }

    }

    const loadConsult = async () => {
        try {
            setLoaddingConsult(true);
            const consult = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/support-company",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    organize_code: "consult",
                    keyword: filterConsult
                }
            });

            if (consult.status === 200) {
                setLoaddingConsult(false);
                setConsultList(consult.data.map((data) => {
                    return {
                        key: data.UserId,
                        userId: data.UserId,
                        code: data.Code,
                        username: data.UserName,
                        nickname: data.NickName,
                        cnt_company: data.CntCompany
                    }
                }))
            }
        } catch (error) {

        }

    }

    const getCompanySite = async (value) => {
        try {
            setLoaddingCompany(true);
            const company_all = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/setting/support/site-support",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    keyword: filterCompany && filterCompany
                }
            });
            if (company_all.status === 200) {
                setLoaddingCompany(false);
                setCompanyList(company_all.data)
            }

        } catch (error) {

        }
    }

    const searchSupport = (param) => {
        let result = supportlist.filter(o =>
            Object.keys(o).some(k =>
                String(o[k])
                    .toLowerCase()
                    .includes(param.toLowerCase())
            )
        );
        setFilterSupport(result);
    }

    const searchConsult = (param) => {
        let result = consultList.filter(o =>
            Object.keys(o).some(k =>
                String(o[k])
                    .toLowerCase()
                    .includes(param.toLowerCase())
            )
        );
        setFilterConsult(result);
    }

    const searchCompany = (param) => {
        let result = companyList.filter(o =>
            Object.keys(o).some(k =>
                String(o[k])
                    .toLowerCase()
                    .includes(param.toLowerCase())
            )
        );
        setFilterCompany(result);
    }

    useEffect(() => {
        // ถ้ามีข้อมูลแล้ว จะไม่โหลดข้อมูลซ้ำ
        if (tabKey === "1" && supportlist.length === 0) {
            loadSupport()
        }
        if (tabKey === "2" && consultList.length === 0) {
            loadConsult()
        }
        if (tabKey === "3" && companyList.length === 0) {
            getCompanySite()
        }

    }, [tabKey, supportlist.length, consultList.length, companyList.length])

    return (
        <MasterPage>
            <>
                <Tabs defaultActiveKey="1" type="card"
                    onChange={(key) => setTabKey(key)}
                >
                    <TabPane tab="By Support Team" key="1" >
                        <Row gutter={[16, 16]}>
                            <Col span={16}>
                            </Col>
                            <Col span={8}>
                                <Input.Search placeholder="รหัส / ชื่อ-นามสกุล / ชื่อเล่น" allowClear
                                    enterButton
                                    onSearch={searchSupport}
                                />
                            </Col>

                        </Row>
                        <Table
                            dataSource={filterSupport == null ? supportlist : filterSupport}
                            loading={loadingSupport}
                            pagination={{ pageSize: 6 }}
                        >
                            <Column title="รหัสพนักงาน" dataIndex="code" width="10%" />
                            <Column title="ชื่อพนักงาน" dataIndex="username" />
                            <Column title="ชื่อเล่น" dataIndex="nickname" width="10%" />
                            <Column title="จำนวน Site ที่ดูแล"
                                align="center"
                                width="15%"
                                render={(record) => {
                                    return (
                                        <>
                                            <label className="table-column-text"
                                            >
                                                <Button type="link"
                                                    onClick={() => {
                                                        history.push({ pathname: "/internal/setting/support_site_config/userid-" + record.userId });

                                                    }
                                                    }
                                                >
                                                    {record.cnt_company}
                                                </Button>
                                            </label>
                                        </>
                                    )
                                }

                                }
                            />
                        </Table>
                    </TabPane>
                    <TabPane tab="By Consult Team" key="2">
                        <Row gutter={[16, 16]}>
                            <Col span={16}>
                            </Col>
                            <Col span={8}>
                                <Input.Search placeholder="รหัส / ชื่อ-นามสกุล / ชื่อเล่น" allowClear
                                    enterButton
                                    onSearch={searchConsult}
                                />
                            </Col>
                        </Row>
                        <Table
                            dataSource={filterConsult === null ? consultList : filterConsult}
                            loading={loadingConsult}
                            pagination={{ pageSize: 6 }}
                        >
                            <Column title="รหัสพนักงาน" dataIndex="code" width="10%" />
                            <Column title="ชื่อพนักงาน" dataIndex="username" />
                            <Column title="ชื่อเล่น" dataIndex="nickname" width="10%" />
                            <Column title="จำนวน Site ที่ดูแล"
                                align="center"
                                width="15%"
                                render={(record) => {
                                    return (
                                        <>
                                            <label className="table-column-text"
                                            >
                                                <Button type="link"
                                                    onClick={() => {
                                                        history.push({ pathname: "/internal/setting/support_site_config/userid-" + record.userId });

                                                    }
                                                    }
                                                >
                                                    {record.cnt_company}
                                                </Button>
                                            </label>
                                        </>
                                    )
                                }

                                }
                            />

                        </Table>
                    </TabPane>
                    <TabPane tab="By Site" key="3">
                        <Row gutter={[16, 16]}>
                            <Col span={16}>
                            </Col>
                            <Col span={8}>
                                <Input.Search placeholder="code / Name / FullName" allowClear
                                    enterButton
                                    onSearch={searchCompany}
                                />
                            </Col>
                        </Row>
                        <Table
                            dataSource={filterCompany === null ? companyList : filterCompany}
                            loading={loadingCompany}
                            pagination={{ pageSize: 6 }}
                        >
                            <Column title="Code" width="10%" dataIndex="Code" />
                            <Column title="CompanyName" width="20%" dataIndex="Name" />
                            <Column title="FullName" width="60%" dataIndex="FullNameTH" />
                            <Column title="จำนวน ผู้ดูแล"
                                align="center"
                                width="15%"
                                render={(record) => {
                                    return (
                                        <>
                                            <label className="table-column-text"
                                            >
                                                <Button type="link"
                                                    onClick={() => {
                                                        history.push({ pathname: "/internal/setting/company_site_config/comid-" + record.Id });

                                                    }
                                                    }
                                                >
                                                    {record.cntSupport}
                                                </Button>
                                            </label>
                                        </>
                                    )
                                }

                                }
                            />
                        </Table>
                    </TabPane>
                </Tabs>



            </>
        </MasterPage >
    )
}
