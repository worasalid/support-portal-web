import React, { useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom';
import MasterPage from '../MasterPage'
import { Button, Table, Modal, Checkbox, message, Tabs, Row, Col, Input, Spin } from 'antd';
import { LeftCircleOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import Axios from 'axios';
import _ from 'lodash'

const { Column } = Table;

export default function CompanySiteConfig() {
    const match = useRouteMatch();
    const history = useHistory(null);
    const [loadingPage, setLoadingPage] = useState(true);
    const [loadingUser, setLoadingUser] = useState(false);

    // Modal
    const [modalAddUser, setModalAddUser] = useState(false);

    // data
    const [company, setCompany] = useState([]);
    const [supportSiteOwner, setSupportSiteOwner] = useState([]);
    const [userList, setUserList] = useState([]);
    const [filterUser, setFilteruser] = useState(null);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectUser, setSelectUser] = useState([]);
    const [selectUserRow, setSelectUserRow] = useState([]);
    const [productConfig, setProductConfig] = useState([]);

    const rowSelection = {
        selectedRowKeys: [...selectedRowKeys],


        onSelect: (record, selected) => {
            let newKeys = [...selectedRowKeys]
            if (selected) {
                newKeys.push(record.key)
            } else {
                newKeys = _.filter(newKeys, n => n !== record.key)
            }
            setSelectedRowKeys(newKeys)
            setSelectUser(newKeys)
        },

    };

    const getCompany = async (param) => {
        try {
            const company = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/company",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    id: match.params.id
                }
            });

            if (company.status === 200) {
                setCompany(company.data)
            }
        } catch (error) {

        }
    }

    const getSupportSiteOwner = async (param) => {
        try {
            const support = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/setting/support/site/users-owner",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    company_id: match.params.id
                }
            });

            if (support.status === 200) {
                setLoadingPage(false);
                setSupportSiteOwner(support.data);
            }
        } catch (error) {

        }
    }

    const getUsers = async () => {
        try {
            const user = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/users",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    //user_id: 83,
                    organize: "support",

                }
            });
            if (user.status === 200) {
                setLoadingUser(false);
                // setUserList(user.data.filter((n) => !supportSiteOwner.find(item => item.UserId === n.UserId)))
                setUserList(user.data.filter((n) => !supportSiteOwner.find(item => item.UserId === n.UserId)).map((value) => {
                    return {
                        key: value.UserId,
                        user_code: value.UserCode,
                        user_name: value.UserName,
                        nickname: value.NickName
                    }
                }))

            }
        } catch (error) {

        }
    }

    const addUser = async () => {
        try {
            setLoadingPage(true);
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/setting/support/site/users-owner",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    company_id: match.params.id,
                    user_id: selectUser
                }
            });

            if (result.status === 200) {
                getSupportSiteOwner();
                message.success({
                    content: 'บันทึกข้อมูลสำเร็จ',
                    style: {
                        marginTop: '10vh',
                    },
                });
                setSelectedRowKeys([]);

            }
        } catch (error) {
            setModalAddUser(false);
            Modal.error({
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.response.data}</p>
                    </div>
                ),
                okText: "Close",
                onOk() {
                    setModalAddUser(true);
                    setLoadingPage(false);
                },
            });

        }
    }

    const deleteUser = async (param) => {
        console.log(param);
        try {
            setLoadingPage(true);
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/setting/support/site/product-config",
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    company_id: match.params.id,
                    user_id: param
                }
            });

            if (result.status === 200) {
                getSupportSiteOwner();
                message.success({
                    content: 'ลบข้อมูลสำเร็จ',
                    style: {
                        marginTop: '10vh',
                    },
                });
            }
        } catch (error) {
            Modal.error({
                title: 'ลบข้อมูลไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.response.data}</p>
                    </div>
                ),
                okText: "Close",
                onOk() {

                },
            });
        }
    }


    const searchUser = (param) => {
        let result = userList.filter(o =>
            Object.keys(o).some(k =>
                String(o[k])
                    .toLowerCase()
                    .includes(param.toLowerCase())
            )
        );
        setFilteruser(result);

    }

    const getProductConfig = async (param) => {
        try {
            const productConfig = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/setting/support/site/product-config",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    company_id: match.params.id,
                    user_id: param.user_id

                }
            });

            if (productConfig.status === 200) {
                setProductConfig(productConfig.data);
            }
        } catch (error) {

        }
    }

    const updateConfig = async (param) => {
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/setting/support/site/product-config",
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    company_id: match.params.id,
                    user_id: param.user_id,
                    product_id: param.product_id,
                    isreceive: param.isreceive,
                    isview: param.isview

                }
            });

            if (result.status === 200) {
                message.loading({ content: 'Loading...', duration: 0.5 });
                setTimeout(() => {

                    message.success({ content: 'Success!', duration: 1 });
                    getProductConfig({ user_id: param.user_id });
                }, 1000);
                getSupportSiteOwner();
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        getCompany();
        getSupportSiteOwner();
    }, [])

    return (
        <MasterPage>
            <div style={{ padding: "24px 24px 24px 24px" }}>
                <Spin spinning={loadingPage} tip="Loading...">
                    {/* บริษัท */}
                    <Row style={{ marginBottom: 16, textAlign: "left" }} gutter={[16, 16]}>

                        <Button type="link"
                            icon={<LeftCircleOutlined />}
                            style={{ fontSize: 18, padding: 0 }}
                            onClick={() => history.goBack()}
                        >
                            Back
                      </Button>
                    </Row>
                    <Row>
                        <h1>{company[0]?.FullNameTH}</h1>
                    </Row>
                    {/* Add User */}
                    <Row>
                        <Col span={14} style={{ textAlign: "right" }}>
                            <Button type="primary" icon={<PlusOutlined />}
                                style={{ backgroundColor: "#00CC00" }}
                                onClick={() => {
                                    setModalAddUser(true);
                                    getUsers();
                                    setLoadingUser(true);
                                }}
                            >
                                เพิ่มข้อมูล
                    </Button>
                        </Col>
                    </Row>

                    <Row style={{ marginTop: 20 }}>
                        <Col span={14}>
                            <Table dataSource={supportSiteOwner}>
                                <Column title="ผู้ดูแล Site"
                                    render={(record) => {
                                        return (
                                            <>
                                                <div style={{ cursor: "pointer" }}
                                                    onClick={() => {
                                                        setSelectUserRow(record);
                                                        getProductConfig({
                                                            user_id: record.UserId
                                                        });
                                                    }}
                                                >
                                                    <label className="value-text" style={{ cursor: "pointer" }}>
                                                        {record.DisplayName}
                                                    </label>
                                                </div>

                                            </>

                                        )
                                    }
                                    }
                                />
                                <Column title="Product ที่ดูแล"
                                    render={(record) => {
                                        return (
                                            <>
                                                <div style={{ cursor: "pointer" }}
                                                    onClick={() => {
                                                        setSelectUserRow(record)
                                                        getProductConfig({
                                                            user_id: record.UserId
                                                        });
                                                    }}
                                                >
                                                    <label className="value-text" style={{ cursor: "pointer" }}>
                                                        {record.ProductName}
                                                    </label>
                                                </div>
                                            </>

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
                                                    onClick={() => deleteUser(record.UserId)}
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
                            <Table dataSource={productConfig} pagination={false}
                                title={(record) => {
                                    return (
                                        <>
                                            <Row>
                                                <Col span={24}>
                                                    <label style={{ display: selectUserRow.length === 0 ? "none" : "block" }}>
                                                        {`${selectUserRow?.DisplayName}`}
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
                                                    // onChange={(e) => console.log(e.target.checked)}
                                                    onChange={(e) => updateConfig({
                                                        user_id: record.UserId,
                                                        product_id: record.ProductId,
                                                        isreceive: e.target.checked,
                                                        isview: record.IsView
                                                    })
                                                    }

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
                                                    onChange={(e) => updateConfig({
                                                        user_id: record.UserId,
                                                        product_id: record.ProductId,
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

                    {/* Modal */}
                    <Modal
                        title="ข้อมูล User"
                        width="700px"
                        //style={{ height: 500 }}
                        visible={modalAddUser}
                        onCancel={() => {
                            setModalAddUser(false);
                        }}
                        okButtonProps={{ style: { backgroundColor: "#00CC00" } }}
                        okText="Save"
                        onOk={() => {
                            setModalAddUser(false);
                            addUser();
                        }}
                    >
                        <Row style={{ marginBottom: 20 }}>
                            <Col span={12}>
                            </Col>
                            <Col span={12}>
                                <Input.Search placeholder="Code / ชื่อ-นามสกุล" allowClear
                                    enterButton
                                    onSearch={searchUser}
                                />
                            </Col>
                        </Row>
                        <Table
                            dataSource={filterUser == null ? userList : filterUser}
                            loading={loadingUser}
                            pagination={{ pageSize: 6 }}

                            rowSelection={{
                                type: "checkbox",
                                ...rowSelection

                            }}
                        >
                            <Column title="Code" key="UserId"
                                render={(record) => {
                                    return (
                                        <>
                                            <label className="value-text">
                                                {record.user_code}
                                            </label>
                                        </>
                                    )
                                }}
                            />
                            <Column title="ชื่อ - นามสกุล" key="UserId"
                                render={(record) => {
                                    return (
                                        <>
                                            <label className="value-text">
                                                {record.user_name}
                                            </label>
                                        </>
                                    )
                                }}
                            />
                            <Column title="ชื่อเล่น" key="UserId"
                                render={(record) => {
                                    return (
                                        <>
                                            <label className="value-text">
                                                {record.nickname}
                                            </label>
                                        </>
                                    )
                                }}
                            />
                        </Table>
                    </Modal>
                </Spin>
            </div>
        </MasterPage >
    )
}