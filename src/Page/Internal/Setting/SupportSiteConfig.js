import { ArrowLeftOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Table, Modal, Checkbox, message, Tabs, Row, Col, Select, Input } from 'antd';
import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom';
import MasterPage from '../MasterPage'

const { Column } = Table;
const { TabPane } = Tabs;

export default function SupportSiteConfig() {
    const match = useRouteMatch();
    const history = useHistory(null);

    // data
    const [user, setUser] = useState(null);
    const [configList, setConfigList] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [master_company, setMaster_company] = useState([])
    const [selectcompanylist, setSelectCompanylist] = useState([])
    const [configProduct, setConfigProduct] = useState([]);

    // Modal
    const [modalAddCompany, setModalAddCompany] = useState(false);

    //filter
    const [filterCompany, setFilterCompany] = useState(null);

    const rowSelection = {
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectCompanylist(selectedRowKeys);
            setSelectedRowKeys(selectedRowKeys)
        },
    };


    //////////////////////////////////// function ///////////////////////////////
    const GetUser = async () => {
        try {
            const user = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/profile",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    userid: match.params.id
                }
            });
            if (user.status === 200) {
                setUser(user.data.usersdata.users.display_name)
            }
        } catch (error) {

        }
    }
    // โหลดข้อมูล Master บริษัท
    const getCompany = async () => {
        const company = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/loadcompany_byuser",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                userId: match.params.id,
                keyword: filterCompany
            }
        });

        if (company.status === 200) {
            setMaster_company(company.data.map((data) => {
                return {
                    key: data.Id,
                    com_code: data.Code,
                    company_name: data.Name
                }
            }));
        }
    }


    // โหลด Config
    const loadSupport_Config = async () => {
        const config = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/support-companylist",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                userId: match.params.id

            }
        });

        if (config.status === 200) {
            setConfigList(config.data.map((data) => {
                return {
                    key: data.Id,
                    com_code: data.Code,
                    company_name: data.CompanyName,
                    isreceive: data.IsReceive,
                    isview: data.IsView,
                    display_name: data.DisplayName
                }
            }))
        }
    }

    const getProductConfig = async (param) => {
        try {
            const config_product = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/support-productlist",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    user_id: match.params.id,
                    company_id: param
                }
            });

            if (config_product.status === 200) {
                console.log("product", config_product.data)
                setConfigProduct(config_product.data)
            }
        } catch (error) {

        }
    }

    // เพิ่ม site ที่ดูแล
    const mapping_company = async () => {
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/mapping-company",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    userId: match.params.id,
                    companyId: selectcompanylist && selectcompanylist
                }
            });

            if (result.status === 200) {
                loadSupport_Config();
                Modal.info({
                    title: 'บันทึกข้อมูลเรียบร้อย',
                    content: (
                        <div>
                            <p></p>
                        </div>
                    ),
                    onOk() {
                        // setBinding(true)
                        setTimeout(() => {
                            // setBinding(false)
                        }, 1000)
                        setModalAddCompany(false)
                    },
                });
            }
        } catch (error) {

        }
    }
    // ลบ site ที่ดูแล
    const deleteCompanyConfig = async (value) => {
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/delete-mapping-company",
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    userId: match.params.id,
                    companyId: value
                }
            });
            if (result.status === 200) {
                // setBinding(true)
                //message.loading({ content: 'Loading...', duration: 0.5 });
                setTimeout(() => {

                    message.success({ content: 'Success!', duration: 0.5 });
                    loadSupport_Config();
                    getProductConfig(value);
                }, 1000);

            }

        } catch (error) {

        }
    }

    const updateConfig = async (value) => {
        try {
            const config = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/update-config-support",
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    userid: match.params.id,
                    companyid: value.companyId,
                    productid: value.productId,
                    isreceive: value.isreceive,
                    isview: value.isview
                }
            });

            if (config.status === 200) {
                message.loading({ content: 'Loading...', duration: 0.5 });
                setTimeout(() => {

                    message.success({ content: 'Success!', duration: 1 });
                    getProductConfig(value.companyId);
                }, 1000);

            }
        } catch (error) {

        }
    }


    useEffect(() => {
        GetUser();
        loadSupport_Config();
    }, [])

    useEffect(() => {
        if (modalAddCompany) {
            getCompany()
        }
    }, [modalAddCompany])

    return (
        <MasterPage>
            <Row style={{ marginBottom: 16, textAlign: "left" }} gutter={[16, 16]}>

                <Button type="primary" shape="circle" icon={<ArrowLeftOutlined />}
                    onClick={() => history.goBack()}
                />
                    &nbsp; &nbsp;
                  <h1>{user}</h1>
            </Row>

            <Row>
                <Col span={24}>
                    <Button type="primary" icon={<PlusOutlined />}
                        style={{ backgroundColor: "#00CC00" }}
                        onClick={() => {

                            setModalAddCompany(true)
                            // setLoadingCompany(true);
                        }}
                    >
                        เพิ่มข้อมูล
                    </Button>
                </Col>
            </Row>

            <Row style={{ marginTop: 20 }}>
                <Col span={10}>
                    <Table dataSource={configList}>
                        <Column title="Code"
                            width="10%"
                            render={(record) => {
                                return (
                                    <div onClick={() => getProductConfig(record.key)} style={{ cursor: "pointer" }}>
                                        <label className="value-text">
                                            {record.com_code}
                                        </label>
                                    </div>
                                )
                            }
                            }
                        />
                        <Column title="CompanyName"
                            render={(record) => {
                                return (
                                    <div onClick={() => getProductConfig(record.key)} style={{ cursor: "pointer" }}>
                                        <label className="value-text">
                                            {record.company_name}
                                        </label>
                                    </div>

                                )
                            }
                            }
                        />
                        <Column title=""
                            align="center"
                            width="15%"
                            render={(record) => {
                                return (
                                    <>
                                        <Button type="link"
                                            icon={<DeleteOutlined />}
                                            onClick={() => {
                                                return (

                                                    setTimeout(() => {
                                                        deleteCompanyConfig(record.key)
                                                    }, 1000)

                                                )
                                            }
                                            }
                                        >
                                        </Button>
                                    </>
                                )
                            }
                            }
                        />
                    </Table>
                </Col>
                <Col span={2}></Col>
                <Col span={12}>
                    <Table dataSource={configProduct} pagination={false}>
                        <Column title="Company" dataIndex="ComCode" width="20%" />
                        <Column title="Product" dataIndex="ProductCode" width="20%" />
                        <Column title="รับ Issue"
                            align="center"
                            width="15%"
                            render={(record) => {
                                return (
                                    <>
                                        <Checkbox
                                            checked={record.IsReceive}
                                            onChange={(e) => updateConfig({
                                                companyId: record.CompanyId,
                                                productId: record.ProductId,
                                                isreceive: e.target.checked,
                                                isview: record.IsView
                                            })
                                            }
                                        //defaultChecked={record.isreceive}
                                        // onChange={(e) => updateConfig({ id: record.key, isreceive: e.target.checked, isview: record.isview })}
                                        />
                                    </>
                                )
                            }

                            }
                        />
                        <Column title="View Issue"
                            align="center"
                            width="15%"
                            render={(record) => {
                                return (
                                    <>
                                        <Checkbox
                                            checked={record.IsView}
                                            //defaultChecked={record.isview}
                                            onChange={(e) => updateConfig({
                                                companyId: record.CompanyId,
                                                productId: record.ProductId,
                                                isreceive: record.IsReceive,
                                                isview: e.target.checked
                                            })
                                            }
                                        />
                                    </>
                                )
                            }

                            }
                        />
                    </Table>
                </Col>
            </Row>

            {/* Master บริษัท */}
            <Modal
                title="ข้อมูลบริษัท"
                width="700px"
                style={{ height: 500 }}
                visible={modalAddCompany}
                onCancel={() => {
                    // setModalConfig(false);
                    setModalAddCompany(false);
                    setSelectedRowKeys([]);
                }}
                onOk={() => {
                    mapping_company();
                    setSelectedRowKeys([]);
                }}
            >
                <Row style={{ marginBottom: 20 }}>
                    <Col span={8}>
                    </Col>
                    <Col span={12}>
                        <Input placeholder="ชื่อบริษัท" allowClear
                            onKeyDown={(x) => {
                                if (x.keyCode === 13) {
                                    getCompany()
                                }
                            }}
                            onChange={(x) => setFilterCompany(x.target.value)}
                        />
                    </Col>
                    <Col span={2}>
                        <Button type="primary" shape="round" icon={<SearchOutlined />}
                            style={{ backgroundColor: "#00CC00", marginLeft: 10 }}
                            onClick={() => getCompany()}
                        >
                            Search
                                 </Button>
                    </Col>
                </Row>
                <Table dataSource={master_company}
                    //loading={loadingCompany}
                    pagination={{ pageSize: 8, total: 100 }}
                    rowSelection={{
                        type: "checkbox",
                        ...rowSelection,
                    }}
                >
                    <Column title="Code" dataIndex="com_code"></Column>
                    <Column title="CompanyName" dataIndex="company_name"></Column>
                </Table>
            </Modal>

        </MasterPage>
    )
}