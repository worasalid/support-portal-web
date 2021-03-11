import { ArrowLeftOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Table, Modal, message, Tabs, Row, Col, Spin, Input } from 'antd';
import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom';
import MasterPage from '../MasterPage'

const { Column } = Table;
const { TabPane } = Tabs;

export default function ConfigDeveloper() {
    const match = useRouteMatch();
    const history = useHistory(null);
    const [loading, setLoading] = useState(false)

    // modal
    const [divModule, setDivModule] = useState("none")
    const [modalProduct, setModalProduct] = useState(false);
    const [modalModule, setModalModule] = useState(false);

    // filter
    const [filterProduct, setFilterProduct] = useState(null);
    const [filterModule, setFilterModule] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    // data
    const [user, setUser] = useState(null);
    const [masterProduct, setMasterProduct] = useState([]);
    const [productOwner, setProductOwner] = useState([]);
    const [selectProduct, setSelectProduct] = useState([]);
    const [selectProductRow, setSelectProductRow] = useState([]);

    const [masterModule, setMasterModule] = useState([]);
    const [moduleOwner, setModuleOwner] = useState([]);
    const [selectModule, setSelectModule] = useState([]);


    const rowProductSelection = {
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectProduct(selectedRowKeys);
            setSelectedRowKeys(selectedRowKeys);

        },
    };

    const rowModuleSelection = {
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectModule(selectedRowKeys);
            setSelectedRowKeys(selectedRowKeys);

        },
    };

    //////////////////////////////////// function ///////////////////////////////
    const getUser = async () => {
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

    const getProduct = async () => {
        const products = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/developer-product",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                userId: match.params.id,
                keyword: filterProduct
            }
        });
        setMasterProduct(products.data)
    }

    const getProductOwner = async () => {
        const products = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/setting/dev/product-owner",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                user_id: match.params.id
            }
        });
        setProductOwner(products.data)
    }

    const addProductOwner = async () => {
        try {
            const products = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/setting/dev/product-owner",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    user_id: match.params.id,
                    product_id: selectProduct && selectProduct
                }
            });

            if (products.status === 200) {
                setModalProduct(false);
                getProductOwner();
                // Modal.success({
                //     title: 'บันทึกข้อมูลเรียบร้อย',
                //     content: (
                //         <div>
                //             <p></p>
                //         </div>
                //     ),
                //     onOk() {
                //         // setBinding(true)
                //         setTimeout(() => {
                //             // setBinding(false)
                //         }, 1000)
                //         setModalProduct(false)
                //     },
                // });
                message.success({
                    content: 'บันทึกข้อมูลสำเร็จ',
                    style: {
                        marginTop: '10vh',
                    },
                });
            }
        } catch (error) {

        }

    }

    const deleteProductOwner = async (param) => {
        try {
            const products = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/setting/dev/product-owner",
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    user_id: match.params.id,
                    product_id: param
                }
            });

            if (products.status === 200) {
                getProductOwner();
                getModuleOwner(param);
                setDivModule("none");
                // Modal.success({
                //     title: 'ลบข้อมูลเรียบร้อย',
                //     content: (
                //         <div>
                //             <p></p>
                //         </div>
                //     ),
                //     onOk() {

                //     },
                // });
                message.success({
                    content: 'ลบข้อมูลสำเร็จ',
                    style: {
                        marginTop: '10vh',
                    },
                });
            }
        } catch (error) {

        }

    }

    const getModule = async () => {
        const module = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/setting/dev/module",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                user_id: match.params.id,
                product_id: selectProductRow?.ProductId,
                keyword: filterModule
            }
        });
        setMasterModule(module.data)
    }

    const getModuleOwner = async (param) => {
        try {
            const module_owner = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/setting/dev/module-owner",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    user_id: match.params.id,
                    product_id: param
                }
            });
            if (module_owner.status === 200) {
                setModuleOwner(module_owner.data)
            }
        } catch (error) {

        }
    }

    const addModuleOwner = async () => {
        try {
            const products = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/setting/dev/module-owner",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    user_id: match.params.id,
                    product_id: selectProductRow?.ProductId,
                    module_id: selectModule && selectModule
                }
            });

            if (products.status === 200) {
                setModalModule(false);
                getModuleOwner(selectProductRow?.ProductId);
                // Modal.success({
                //     title: 'บันทึกข้อมูลเรียบร้อย',
                //     content: (
                //         <div>
                //             <p></p>
                //         </div>
                //     ),
                //     onOk() {
                //         // setBinding(true)
                //         setTimeout(() => {
                //             // setBinding(false)
                //         }, 1000)
                //         setModalModule(false)
                //     },
                // });
                message.success({
                    content: 'บันทึกข้อมูลสำเร็จ',
                    style: {
                        marginTop: '10vh',
                    },
                });
            }
        } catch (error) {

        }

    }

    const deleteModuleOwner = async (param) => {
        setLoading(true)
        try {
            const products = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/setting/dev/module-owner",
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    user_id: param.UserId,
                    product_id: param.ProductId,
                    module_id: param.ModuleId
                }
            });

            if (products.status === 200) {
                setTimeout(() => {
                    setLoading(false)
                },500) 
                
                getModuleOwner(param.ProductId);
                // Modal.success({
                //     title: 'ลบข้อมูลเรียบร้อย',
                //     content: (
                //         <div>
                //             <p></p>
                //         </div>
                //     ),
                //     onOk() {
                //         // setBinding(true)
                //         setTimeout(() => {
                //             // setBinding(false)
                //         }, 1000)
                //     },
                // });
                message.success({
                    content: 'ลบข้อมูลสำเร็จ',
                    style: {
                        marginTop: '10vh',
                    },
                });
            }
        } catch (error) {

        }

    }


    useEffect(() => {
        getUser();
        getProductOwner();
    }, [])


    return (
        <MasterPage>
             <Spin spinning={loading}  tip="Loading...">
            {/* ชื่อ */}
            <Row style={{ marginBottom: 16, textAlign: "left" }} gutter={[16, 16]}>

                <Button type="primary" shape="circle" icon={<ArrowLeftOutlined />}
                    onClick={() => history.goBack()}
                />
                    &nbsp; &nbsp;
                  <h1>{user}</h1>
            </Row>

            {/* Add */}
            <Row>
                <Col span={24}>
                    <Button type="primary" icon={<PlusOutlined />}
                        style={{ backgroundColor: "#00CC00" }}
                        onClick={() => {
                            setModalProduct(true);
                            getProduct();
                        }}
                    >
                        Add Product
                    </Button>
                </Col>
            </Row>

            <Row style={{ marginTop: 20 }}>
                <Col span={10}>
                    <Table dataSource={productOwner} pagination={false}
                        onRow={(record, rowIndex) => {
                            return {
                                onClick: event => {
                                    setSelectProductRow(record);
                                    getModuleOwner(record.ProductId);
                                    setDivModule("block");
                                }, // click row
                            };
                        }}
                    >
                        <Column title="Product"
                            width="10%"
                            render={(record) => {
                                return (
                                    <div style={{ cursor: "pointer" }}>
                                        <label className="value-text">
                                            {record.ProductName}
                                        </label>
                                    </div>
                                )
                            }
                            }
                        />
                        <Column title="FullName"
                            width="10%"
                            render={(record) => {
                                return (
                                    <div style={{ cursor: "pointer" }}>
                                        <label className="value-text">
                                            {record.ProductFullName}
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
                                                        deleteProductOwner(record.ProductId)
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
                <Col span={12} style={{ display: divModule }}>
                    <Table dataSource={moduleOwner} bordered
                        pagination={false}
                        //scroll={{ y: 500 }}
                        title={() => {
                            return (
                                <>
                                    <Row>
                                        <Col span={12}>
                                            {selectProductRow.ProductFullName}
                                        </Col>
                                        <Col span={12} style={{ textAlign: "right" }}>
                                            <Button type="primary" icon={<PlusOutlined />}
                                                style={{ backgroundColor: "#00CC00" }}
                                                onClick={() => {
                                                    getModule();
                                                    setModalModule(true);
                                                }}
                                            >
                                                Add Module
                                       </Button>
                                        </Col>
                                    </Row>

                                </>
                            )
                        }}>
                        <Column title="Module" dataIndex="ModuleName" />
                        <Column title=""
                            align="center"
                            width="10%"
                            render={(record) => {
                                return (
                                    <>
                                        <Button type="link"
                                            icon={<DeleteOutlined />}
                                            onClick={() => {
                                                return (
                                                    setTimeout(() => {
                                                        deleteModuleOwner(record)
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
            </Row>


            {/* Modal Add Product */}
            <Modal
                title="Product"
                visible={modalProduct}
                width={800}
                onOk={() => {
                    setModalProduct(false);
                    addProductOwner();
                    setSelectedRowKeys([]);

                }}
                okText="Add"
                onCancel={() => {
                    setModalProduct(false)
                    setSelectedRowKeys([]);
                }}
            >
                <Row style={{ marginBottom: 20 }}>
                    <Col span={8}>
                    </Col>
                    <Col span={12}>
                        <Input placeholder="Product" allowClear
                            onKeyDown={(x) => {
                                if (x.keyCode === 13) {
                                    getProduct()
                                }
                            }}
                            onChange={(x) => setFilterProduct(x.target.value)}
                        />
                    </Col>
                    <Col span={2}>
                        <Button type="primary" shape="round" icon={<SearchOutlined />}
                            style={{ backgroundColor: "#00CC00", marginLeft: 10 }}
                        //onClick={() => getCompany()}
                        >
                            Search
                                 </Button>
                    </Col>
                </Row>

                <Table dataSource={masterProduct}
                    rowSelection={{
                        type: "checkbox",
                        ...rowProductSelection,
                    }}
                >
                    <Column title="ProductName" dataIndex="Name" key="key"></Column>
                    <Column title="ProductFullName" dataIndex="FullName" key="key"></Column>
                </Table>
            </Modal>

            {/* Modal Add Module */}
            <Modal
                title="Module"
                visible={modalModule}
                width={800}
                onOk={() => {
                    addModuleOwner();
                    setSelectedRowKeys([]);

                }}
                okText="Add"
                onCancel={() => {
                    setModalModule(false)
                    setSelectedRowKeys([]);
                }}
            >
                <Row style={{ marginBottom: 20 }}>
                    <Col span={8}>
                    </Col>
                    <Col span={12}>
                        <Input placeholder="module" allowClear
                            onKeyDown={(x) => {
                                if (x.keyCode === 13) {
                                    getModule()
                                }
                            }}
                            onChange={(x) => setFilterModule(x.target.value)}
                        />
                    </Col>
                    <Col span={2}>
                        <Button type="primary" shape="round" icon={<SearchOutlined />}
                            style={{ backgroundColor: "#00CC00", marginLeft: 10 }}
                            onClick={() => getModule()}
                        >
                            Search
                                 </Button>
                    </Col>
                </Row>

                <Table dataSource={masterModule}
                    rowSelection={{
                        type: "checkbox",
                        ...rowModuleSelection,
                    }}
                >
                    <Column title="Module Name" dataIndex="Name" key="Id" ></Column>

                </Table>
            </Modal>
            </Spin>
        </MasterPage>
    )
}