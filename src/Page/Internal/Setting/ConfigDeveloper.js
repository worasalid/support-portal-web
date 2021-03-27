import { LeftCircleOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
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
    const [loadingProduct, setLoadingProduct] = useState(false)
    const [loadingModule, setLoadingModule] = useState(false)

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

    const getProductOwner = async () => {
        try {
            const productsOwner = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/setting/dev/product-owner",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    user_id: match.params.id
                }
            });
            if (productsOwner.status === 200) {
                setProductOwner(productsOwner.data);
                setLoading(false);

            }

        } catch (error) {

        }

    }

    const getProduct = async () => {
        try {
            const products = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/setting/dev/product",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    userId: match.params.id
                    // keyword: filterProduct
                }
            });
            if (products.status === 200) {
                setLoadingProduct(false);
                setMasterProduct(products.data);
            }
        } catch (error) {

        }
    }

    const addProductOwner = async () => {
        try {
            setLoading(true)
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
            setLoading(true);
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
        try {
            setLoadingModule(true);
            const module = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/setting/dev/module",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    user_id: match.params.id,
                    product_id: selectProductRow?.ProductId
                    //keyword: filterModule
                }
            });
            if (module.status === 200) {
                setMasterModule(module.data);
                setLoadingModule(false);
            }

        } catch (error) {

        }

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
                setLoadingModule(false);
                setModuleOwner(module_owner.data)
                setLoading(false);
            }
        } catch (error) {
            setLoadingModule(false);
            setLoading(false);
        }
    }

    const addModuleOwner = async () => {
        try {
            setLoadingModule(true);
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

                message.success({
                    content: 'บันทึกข้อมูลสำเร็จ',
                    style: {
                        marginTop: '10vh',
                    },
                });
            }
        } catch (error) {
            setModalModule(false);
            message.error({
                content: 'บันทึกข้อมูลไม่สำเร็จ',
                style: {
                    marginTop: '10vh',
                },
            });
        }

    }

    const deleteModuleOwner = async (param) => {
        setLoadingModule(true);
        setLoading(true);
        try {
            const moduleOwner = await Axios({
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

            if (moduleOwner.status === 200) {
                setLoading(false)

                getModuleOwner(param.ProductId);

                message.success({
                    content: 'ลบข้อมูลสำเร็จ',
                    style: {
                        marginTop: '10vh',
                    },
                });
            }
        } catch (error) {
            setLoadingModule(false);
            setLoading(false);
            message.error({
                content: 'ลบข้อมูลไม่สำเร็จ',
                style: {
                    marginTop: '10vh',
                },
            });
        }

    }

    const searchProduct = (param) => {
        let result = masterProduct.filter(o =>
            Object.keys(o).some(k =>
                String(o[k])
                    .toLowerCase()
                    .includes(param.toLowerCase())
            )
        );
        setFilterProduct(result);
    }

    const searchModule = (param) => {
        let result = masterModule.filter(o =>
            Object.keys(o).some(k =>
                String(o[k])
                    .toLowerCase()
                    .includes(param.toLowerCase())
            )
        );
        setFilterModule(result);
    }


    useEffect(() => {
        setLoading(true);
        if (productOwner.length === 0) {
            getUser();
            getProductOwner();
        }
    }, [productOwner.length])

    return (
        <MasterPage>
            <Spin spinning={loading} tip="Loading...">
                {/* ชื่อ */}
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
                    <h1>{user}</h1>
                </Row>
                {/* Add */}
                <Row>
                    <Col span={4}>
                        <label style={{ fontSize: 10, color: "red" }}>
                            *** คลิก รายการ Product เพื่อตั้งค่า Module
                        </label>

                    </Col>
                    <Col span={6} style={{ textAlign: "right" }}>
                        <Button type="primary" icon={<PlusOutlined />}
                            style={{ backgroundColor: "#00CC00" }}
                            onClick={() => {
                                setModalProduct(true);
                                setLoadingProduct(true);
                                getProduct();
                            }}
                        >
                            Add Product
                    </Button>
                    </Col>
                </Row>

                {/* table */}
                <Row style={{ marginTop: 20 }}>
                    <Col span={10}>
                        <Table dataSource={productOwner} pagination={true}
                        // onRow={(record, rowIndex) => {
                        //     return {
                        //         onClick: event => {
                        //             setSelectProductRow(record);
                        //             getModuleOwner(record.ProductId);
                        //             setDivModule("block");
                        //         }, // click row
                        //     };
                        // }}
                        >
                            <Column title="Product"
                                width="10%"
                                render={(record) => {
                                    return (
                                        <div style={{ cursor: "pointer" }}
                                            onClick={() => {
                                                setSelectProductRow(record);
                                                getModuleOwner(record.ProductId);
                                                setDivModule("block");
                                                setLoadingModule(true);
                                            }}
                                        >
                                            <label className="value-text"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => {
                                                    setSelectProductRow(record);
                                                    getModuleOwner(record.ProductId);
                                                    setDivModule("block");
                                                    setLoadingModule(true);
                                                }}
                                            >
                                                {record.ProductName}
                                            </label>
                                        </div>
                                    )
                                }
                                }
                            />
                            <Column title="FullName"
                                width="80%"
                                render={(record) => {
                                    return (
                                        <div style={{ cursor: "pointer" }}
                                            onClick={() => {
                                                setSelectProductRow(record);
                                                getModuleOwner(record.ProductId);
                                                setDivModule("block");
                                                setLoadingModule(true);
                                            }}
                                        >
                                            <label className="value-text"
                                                onClick={() => {
                                                    setSelectProductRow(record);
                                                    getModuleOwner(record.ProductId);
                                                    setDivModule("block");
                                                    setLoadingModule(true);
                                                }}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {record.ProductFullName}
                                            </label>
                                        </div>
                                    )
                                }
                                }
                            />
                            <Column title=""
                                align="center"
                                width="10%"
                                render={(record) => {
                                    return (
                                        <>
                                            <Button type="link"
                                                icon={<DeleteOutlined />}
                                                onClick={() => deleteProductOwner(record.ProductId)}
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
                            loading={loadingModule}
                            pagination={{ pageSize: 5 }}
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
                                                onClick={() => deleteModuleOwner(record)}
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
                        <Col span={16}>
                        </Col>
                        <Col span={8}>
                            <Input.Search placeholder="Code / Product" allowClear
                                enterButton
                                onSearch={searchProduct}
                            />
                        </Col>
                    </Row>

                    <Table
                        dataSource={filterProduct === null ? masterProduct : filterProduct}
                        loading={loadingProduct}
                        pagination={{ pageSize: 5 }}
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
                        <Col span={16}>
                        </Col>
                        <Col span={8}>
                            <Input.Search placeholder="Module" allowClear
                                enterButton
                                onSearch={searchModule}
                            />
                        </Col>
                    </Row>

                    <Table
                        dataSource={filterModule === null ? masterModule : filterModule}
                        loading={loadingModule}
                        pagination={{ pageSize: 6 }}
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