import { DeleteOutlined, LeftCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Table, Modal, Checkbox, message, Tabs, Row, Col, Input, Spin } from 'antd';
import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom';
import MasterPage from '../MasterPage'
import _ from 'lodash'

const { Column } = Table;
const { TabPane } = Tabs;

export default function SupportSiteConfig() {
    const match = useRouteMatch();
    const history = useHistory(null);

    //loading
    const [loadingPage, setLoadingPage] = useState(true);
    const [loadingCompany, setLoadingCompany] = useState(false)

    // data
    const [user, setUser] = useState(null);
    const [configList, setConfigList] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [master_company, setMaster_company] = useState([])
    const [filterTable, setFilterTable] = useState(null)
    const [selectcompanylist, setSelectCompanylist] = useState([])
    const [configProduct, setConfigProduct] = useState([]);
    const [selectCompanyRow, setSelectCompanyRow] = useState([]);

    // Modal
    const [modalAddCompany, setModalAddCompany] = useState(false);

    //filter
    const [filterCompany, setFilterCompany] = useState(null);

    const rowSelection = {
        selectedRowKeys: [...selectedRowKeys],

        // onChange: (RowKeys, selectedRows) => {

        //     setSelectCompanylist(selectedRowKeys);

        // },
        onSelect: (record, selected) => {
            let newKeys = [...selectedRowKeys]
            if (selected) {
                newKeys.push(record.key)
            } else {
                newKeys = _.filter(newKeys, n => n !== record.key)
            }
            setSelectedRowKeys(newKeys)
            setSelectCompanylist(newKeys)
        },

    };

    const search = (param) => {
        let result = master_company.filter(o =>
            Object.keys(o).some(k =>
                String(o[k])
                    .toLowerCase()
                    .includes(param.toLowerCase())
            )
        );
        setFilterTable(result);
        setSelectedRowKeys([...selectedRowKeys])
    }

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
                    user_id: match.params.id
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
        setLoadingCompany(true);
        setSelectedRowKeys([...selectedRowKeys])
        try {
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
                setLoadingCompany(false);
                setMaster_company(company.data.map((data) => {
                    return {
                        key: data.Id,
                        com_code: data.Code,
                        company_name: data.Name
                    }
                }));
            }
        } catch (error) {

        }

    }


    // โหลด Config
    const loadSupport_Config = async () => {
        try {
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
                setLoadingPage(false);
                setConfigList(config.data);
            }
        } catch (error) {

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
                setConfigProduct(config_product.data)
            }
        } catch (error) {

        }
    }

    // เพิ่ม site ที่ดูแล
    const mapping_company = async () => {
        try {
            setLoadingPage(true);
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
                message.success({
                    content: 'บันทึกข้อมูลสำเร็จ',
                    style: {
                        marginTop: '10vh',
                    },
                });
                setSelectedRowKeys([]);

            }
        } catch (error) {
            setModalAddCompany(false);
            Modal.error({
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.response.data}</p>
                    </div>
                ),
                okText: "Close",
                onOk() {
                    setModalAddCompany(true);
                },
            });

        }
    }
    // ลบ site ที่ดูแล
    const deleteCompanyConfig = async (value) => {
        try {
            setLoadingPage(true);
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
                message.success({
                    content: 'ลบข้อมูลสำเร็จ',
                    style: {
                        marginTop: '10vh',
                    },
                });

                loadSupport_Config();
                getProductConfig(value);
                setSelectCompanyRow([]);
            }

        } catch (error) {
            setLoadingPage(false);

            message.error({
                content: 'บันทึกข้อมูลไม่สำเร็จ',
                style: {
                    marginTop: '10vh',
                },
            });
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
            <div style={{padding : "24px 24px 24px 24px"}}>
                <Spin spinning={loadingPage} tip="Loading...">
                    <Row style={{ marginBottom: 16, textAlign: "left" }} gutter={[16, 16]}>
                        <Button type="link"
                            icon={<LeftCircleOutlined />}
                            style={{ fontSize: 18, padding: 0 }}
                            onClick={() => history.goBack()}
                        >
                            Back
                      </Button>
                    &nbsp; &nbsp;

                </Row>
                    <Row>
                        <h1>{user}</h1>
                    </Row>
                    <Row>
                        <Col span={14} style={{ textAlign: "right" }}>
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
                        <Col span={14}>
                            <Table dataSource={configList}>
                                <Column title="Code"
                                    width="10%"
                                    render={(record) => {
                                        return (
                                            <div
                                                style={{ cursor: "pointer" }}
                                                onClick={() => {
                                                    setSelectCompanyRow(record);
                                                    getProductConfig(record.Id);
                                                }}
                                            >
                                                <label className="value-text" style={{ cursor: "pointer" }}>
                                                    {record.Code}
                                                </label>
                                            </div>
                                        )
                                    }
                                    }
                                />
                                <Column title="Name"
                                    render={(record) => {
                                        return (
                                            <div
                                                style={{ cursor: "pointer" }}
                                                onClick={() => {
                                                    setSelectCompanyRow(record);
                                                    getProductConfig(record.Id);
                                                }}
                                            >
                                                <label className="value-text" style={{ cursor: "pointer" }}>
                                                    {record.CompanyName}
                                                </label>
                                            </div>

                                        )
                                    }
                                    }
                                />
                                <Column title="FullName"
                                    render={(record) => {
                                        return (
                                            <div
                                                style={{ cursor: "pointer" }}
                                                onClick={() => {
                                                    setSelectCompanyRow(record);
                                                    getProductConfig(record.Id);
                                                }}
                                            >
                                                <label className="value-text" style={{ cursor: "pointer" }}>
                                                    {record.CompanyFullName}
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
                                                    onClick={() => deleteCompanyConfig(record.Id)}
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
                        <Col span={8}>
                            <Table dataSource={configProduct} pagination={false}
                                title={(record) => {
                                    return (
                                        <>
                                            <Row>
                                                <Col span={24}>
                                                    <label style={{ display: selectCompanyRow.length === 0 ? "none" : "block" }}>
                                                        {`${selectCompanyRow?.Code} - ${selectCompanyRow?.CompanyFullName}`}
                                                    </label>

                                                </Col>
                                            </Row>
                                        </>
                                    )
                                }}
                            >
                                <Column title="Product" dataIndex="ProductCode" width="20%" />
                                <Column title="รับ Issue"
                                    align="center"
                                    width="15%"
                                    render={(record) => {
                                        return (
                                            <>
                                                <Checkbox
                                                    checked={record.IsReceive}
                                                    //onChange={(e) => console.log(e.target.checked)}
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
                        //style={{ height: 500 }}
                        visible={modalAddCompany}
                        onCancel={() => {
                            // setModalConfig(false);
                            setModalAddCompany(false);
                            setSelectedRowKeys([]);
                        }}
                        okButtonProps={{ style: { backgroundColor: "#00CC00" } }}
                        okText="Save"
                        onOk={() => {
                            setModalAddCompany(false);
                            mapping_company();
                        }}
                    >
                        <Row style={{ marginBottom: 20 }}>
                            <Col span={12}>
                            </Col>
                            <Col span={12}>
                                <Input.Search placeholder="Code / ชื่อบริษัท" allowClear
                                    enterButton
                                    onSearch={search}
                                />
                            </Col>
                        </Row>
                        <Table
                            dataSource={filterTable == null ? master_company : filterTable}
                            //dataSource={master_company}
                            loading={loadingCompany}
                            pagination={{ pageSize: 6 }}

                            rowSelection={{
                                type: "checkbox",
                                ...rowSelection

                            }}
                        >
                            <Column title="Code"
                                render={(record) => {
                                    return (
                                        <>
                                            <label className="value-text">
                                                {record.com_code}
                                            </label>
                                        </>
                                    )
                                }}
                            />
                            <Column title="CompanyName"
                                render={(record) => {
                                    return (
                                        <>
                                            <label className="value-text">
                                                {record.company_name}
                                            </label>
                                        </>
                                    )
                                }}
                            />
                        </Table>
                    </Modal>

                </Spin>
            </div>
        </MasterPage>
    )
}