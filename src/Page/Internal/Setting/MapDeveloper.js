import React, { useEffect, useState } from 'react'
import MasterPage from '../MasterPage'
import Axios from 'axios';
import { Button, Table, Modal, message } from 'antd';
//import MapCompany from './MapCompany';

const { Column } = Table;
//const { TabPane } = Tabs;

export default function MapDeveloper() {

    const [visible, setVisible] = useState(false);
    const [product_visible, setProduct_visible] = useState(false);
    const [module_visible, setModule_visible] = useState(false);
   // const [expandedRow, setExpandedRow] = useState(false);


    // data
    const [userid, setUserid] = useState(null);
    const [username, setUsername] = useState(null);
    const [developerlist, setDeveloperlist] = useState([]);
    const [productlist, setProductlist] = useState([]);
    const [modulelist, setModulelist] = useState([]);
    const [productid, setProductid] = useState(null);
    const [devmodule, setDevmodule] = useState([]);

    const [selectproduct, setSelectproduct] = useState([]);
    const [selectmodule, setSelectmodule] = useState([]);

    const GetProduct = async () => {
        const products = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/developer-product",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                userId: userid
            }
        });
        setProductlist(products.data)
    }

    const GetModule = async () => {
        try {
            const module = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/developer-module",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    userId: userid,
                    productId: productid
                }
            });
            setModulelist(module.data)

        } catch (error) {

        }
    }

    const GetDeveloper = async () => {
        try {
            const developer = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/developer-list",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                }
            });

            if (developer.status === 200) {
                setDeveloperlist(developer.data)

            }
        } catch (error) {

        }

    }

    const GetDeveloperModule = async (productId) => {
        try {
            const developermodule = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/developer-module-list",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    userId: userid,
                    productId: productId
                }
            });
            setDevmodule(developermodule.data)
        } catch (error) {

        }
    }

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectproduct(selectedRowKeys);
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);

        },
    };

    const rowModuleSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectmodule(selectedRowKeys);
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);

        },
    };

    const MappingProduct = async () => {
        try {
            const product = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/mapping-developer-product",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    userId: userid,
                    productId: selectproduct
                }
            });

            if (product.status === 200) {
                GetDeveloperModule();
                setProduct_visible(false);
                Success();

            }
        } catch (error) {

        }
    }

    const MappingModule = async () => {
        try {
            const product = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/mapping-developer-module",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    userId: userid,
                    productId: productid,
                    moduleId: selectmodule
                }
            });

            if (product.status === 200) {
                GetDeveloperModule();
                setModule_visible(false);
                Success();

            }
        } catch (error) {

        }
    }

    const DeleteModule = async (moduleId,productId) => {
        const result = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/delete-developer-module",
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                userId: userid,
                productId: productId,
                moduleId: moduleId
            }
        });

        if(result.status === 200){
            Success();
            GetDeveloperModule();
        }
    }

    const Success = () => {
        message.success({
            content: 'บันทึกข้อมูลสำเร็จ',
            className: 'custom-class',
            style: {
                marginTop: '5vh',
            },
        });
    };

    useEffect(() => {
        GetDeveloper();
    }, [])

    useEffect(() => {
        GetDeveloperModule()
        GetProduct();

    }, [userid])



    return (
        <MasterPage>
            <div >
                <Table dataSource={developerlist} loading={false}
                // expandable={{
                //     expandedRowRender: record => <p style={{ margin: 0 }}>{record.username}</p>,

                // }}
                >
                    <Column title="รหัสพนักงาน" width="10%" dataIndex="Code" />
                    <Column title="ชื่อพนักงาน" width="20%" dataIndex="UserName" />
                    <Column title="Module ที่ดูแล"
                        align="center"
                        width="15%"
                        render={(record) => {
                            return (
                                <>
                                    <Button type="link"
                                        onClick={() => {
                                            return (
                                                setVisible(true),
                                                setUserid(record.UserId),
                                                setUsername(record.UserName),
                                                GetDeveloperModule(record.UserId)
                                            )
                                        }
                                        }
                                    >
                                        <label>View</label>
                                    </Button>
                                </>
                            )
                        }
                        }
                    />

                </Table>
            </div>

            {/* Modal */}

            {/* Modal list module */}
            <Modal
                title={username}
                visible={visible}
                width={800}
                okButtonProps={{ hidden: true }}
                cancelText="Close"
                onCancel={() => { return (setVisible(false), setUserid(null)) }}
            >
                <Button type="primary"
                    onClick={() => setProduct_visible(true)}
                >Add Product</Button>
                <Table dataSource={devmodule}

                    expandable={{
                        expandedRowRender: record => {

                            return (
                                <>
                                    <Button type="primary"
                                        onClick={() => { return (setModule_visible(true), GetModule()) }}
                                    >Add Module</Button>
                                    <Table dataSource={record.modules} size="small">
                                        <Column title="" width="10%"></Column>
                                        <Column title="No"
                                            width="10%"
                                            render={(value, record, index) => {
                                                console.log(record)
                                                return (
                                                    <p>{index + 1}</p>

                                                )
                                            }}
                                        >

                                        </Column>
                                        <Column title="Module" dataIndex="ModuleName" key="ModuleId"></Column>
                                        <Column title=""
                                            width="10%"
                                            render={(value, record, index) => {
                                                return (
                                                   <Button type="link" 
                                                   onClick= {() => DeleteModule(record.ModuleId,record.ProductId) }
                                                   >Delete</Button>
                                                //    console.log("delete",userid,record.ModuleId,record.ProductId)
                                                )
                                            }}
                                        ></Column>
                                    </Table>
                                </>
                            )
                        }

                    }}
                    onExpand={(visible, record) => {
                        return (
                            GetDeveloperModule(record.ProductId),
                            console.log("ProductId", record.ProductId),
                            setProductid(record.ProductId)

                        )
                    }}
                    pagination={false}
                >
                    <Column title="" dataIndex="ProductName" key="key"></Column>
                    {/* <Column
                        render={() => {
                            return (
                                <Button type="primary">Add</Button>
                            )
                        }

                        }
                    /> */}


                </Table>
            </Modal>

            {/* Modal Add Product */}
            <Modal
                title="Product"
                visible={product_visible}
                width={800}
                onOk={() => { return (MappingProduct()) }}
                okText="Add"
                onCancel={() => { return (setProduct_visible(false)) }}
            >
                <Table dataSource={productlist}
                    rowSelection={{
                        type: "checkbox",
                        ...rowSelection,
                    }}
                >
                    <Column title="ProductName" dataIndex="Name" key="key"></Column>
                    <Column title="ProductFullName" dataIndex="FullName" key="key"></Column>
                </Table>
            </Modal>


            {/* Modal Add Module */}
            <Modal
                title="Module"
                visible={module_visible}
                width={800}
                onOk={() => { return (MappingModule()) }}
                okText="Add"
                onCancel={() => { return (setModule_visible(false)) }}
            >
                <Table dataSource={modulelist} size="small"
                    rowSelection={{
                        type: "checkbox",
                        ...rowModuleSelection,
                    }}
                >
                    <Column title="ModuleName" dataIndex="Name" key="key"></Column>
                </Table>
            </Modal>
        </MasterPage>
    )
}
