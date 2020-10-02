import React, { useEffect, useState } from 'react'
import MasterPage from '../MasterPage'
import Axios from 'axios';
import { Button, Table, Modal, Tabs } from 'antd';
import MapCompany from './MapCompany';

const { Column } = Table;
const { TabPane } = Tabs;

export default function MapDeveloper() {

    const [visible, setVisible] = useState(false);
    const [product_visible, setProduct_visible] = useState(false);
    const [expandedRow, setExpandedRow] = useState(false);


    // data
    const [userid, setUserid] = useState(null);
    const [username, setUsername] = useState(null);
    const [developerlist, setDeveloperlist] = useState([]);
    const [productlist, setProductlist] = useState([]);
    const [devproduct, setDevproduct] = useState([]);
    const [devmodule, setDevmodule] = useState([]);
    const [selectproduct, setSelectproduct] = useState([]);

    const GetProduct = async () => {
        const products = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/developer_product",
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

    const getmodule = async () => {
        try {
            const module = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/modules",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                }
            });

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
                url: process.env.REACT_APP_API_URL + "/master/developer_module",
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

    const MappingProduct = async () => {
        try {
            const product = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/mapping_developer_product",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    userId: userid,
                    productId: selectproduct
                }
            });
        } catch (error) {

        }
    }

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
                                        <label>Delete</label>
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
                >Add Prduct</Button>
                <Table dataSource={devmodule}

                    expandable={{
                        expandedRowRender: record => {

                            return (
                                <Table dataSource={record.modules}>
                                    <Column title="Module" dataIndex="ModuleName" key="ModuleId"></Column>
                                </Table>
                            )
                        }

                    }}
                    onExpand={(visible, record) => {
                        return (
                            GetDeveloperModule(record.ProductId)

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
                onOk={() => { return (MappingProduct(), setProduct_visible(false)) }}
                okText="Add"
                onCancel={() => { return (setProduct_visible(false), console.log("userid", userid)) }}
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
        </MasterPage>
    )
}
