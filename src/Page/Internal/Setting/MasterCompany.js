import { EditOutlined, SearchOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Table, Input, InputNumber, Form, Modal, Row, Col, Select, Radio, Spin } from 'antd';

import Column from 'antd/lib/table/Column';
import Axios from 'axios'
import React, { createRef, useEffect, useState } from 'react'
import MasterPage from '../MasterPage'
import Draggable from 'react-draggable';

export default function MasterCompany() {
    const [formAdd] = Form.useForm();
    const [form] = Form.useForm();

    //modal
    const [visible, setVisible] = useState(false);
    const [modalAdd, setModalAdd] = useState(false);
    const [modalProduct, setModalProduct] = useState(false);

    //data
    const [masterCompany, setMasterCompany] = useState([]);
    const [filterCompany, setFilterCompany] = useState(null);
    const [listcompany, setListcompany] = useState([]);

    const [selectcompany, setSelectcompany] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([])

    //product
    const [cusProduct, setCusProduct] = useState([]);
    const [listProduct, setListProduct] = useState([]);
    const [selectProduct, setSelectProduct] = useState([]);

    const [search, setSearch] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingEdit, setLoadingEdit] = useState(false);

    const searchCompany = (param) => {
        let result = listcompany.filter(o =>
            Object.keys(o).some(k =>
                String(o[k])
                    .toLowerCase()
                    .includes(param.toLowerCase())
            )
        );
        setFilterCompany(result);
    }
    // Company
    const GetMasterCompany = async (value) => {
        const mastercompany = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/company",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
        });
        if (mastercompany.status === 200) {
            setMasterCompany(mastercompany.data)
        }
    }

    const GetCompany = async (value) => {
        try {
            const company_all = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/company",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    id: filterCompany && filterCompany
                }
            });
            if (company_all.status === 200) {
                setTimeout(() => {
                    setLoading(false);
                    setSearch(false)
                }, 1000)
                setListcompany(company_all.data)
            }

        } catch (error) {

        }
    }

    const GetCompanyById = async (param) => {
        try {
            const companyby_id = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/company",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    id: param
                }
            });

            if (companyby_id.status === 200) {

                setSelectcompany(companyby_id.data)
            }

        } catch (error) {

        }
    }

    // product
    const getCustomerProduct = async (param) => {
        try {
            const cusproduct = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/customer-products",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    company_id: param
                }
            });

            if (cusproduct.status === 200) {
                setCusProduct([...cusproduct.data])
            }
        } catch (error) {

        }
    }

    const getMasterProduct = async () => {
        try {
            const product = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/products",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                }
            });
            if (product.status === 200) {
                setListProduct(product.data.filter((n) => !cusProduct.find((item) => item.ProductId === n.Id )).map((x) => {
                    return {
                        key: x.Id,
                        Name: x.Name,
                        FullName: x.FullName
                    }
                }));
            }
        } catch (error) {

        }
    }

    const deleteProduct = async (param) => {
        try {
            const cusproduct = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/delete-customer-products",
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    company_id: param.CompanyId,
                    product_id: param.ProductId
                }
            });

            if (cusproduct === 200) {
                getCustomerProduct(param.CompanyId);
            }


        } catch (error) {

        }
    }

    // Save
    const onFinishAdd = async (param) => {
        try {
            const addcompany = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/add-company",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    code: param.code,
                    name: param.name,
                    fullname_th: param.fullname_th,
                    fullname_en: param.fullname_en,
                    tel: param.tel,
                    address: param.address,
                    cost: param.cost,
                    is_cloud: param.is_cloud
                }
            });
            await Axios({
                url: process.env.REACT_APP_API_URL + "/master/add-customer-products",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    company_code: param.code,
                    product: cusProduct && cusProduct
                }
            });

            if (addcompany.status === 200) {
                setModalAdd(false);
                Modal.info({
                    title: 'บันทึกข้อมูลเรียบร้อย',
                    content: (
                        <div>
                            <p></p>
                        </div>
                    ),
                    okText: "Close",
                    onOk() {
                        setLoading(true);
                        formAdd.resetFields();
                    },
                });
            }

        } catch (error) {
            // console.log("error", error.response)
            setModalAdd(false);
            Modal.error({
                title: 'บันทึกข้อมูล ไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.response.data}</p>
                    </div>
                ),
                okText: "Close",
                onOk() {
                    formAdd.resetFields();
                },
            });
        }
    };

    const onFinish = async (values) => {
        try {
            const updatecompany = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/company-update",
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    id: selectcompany[0]?.Id,
                    name: values.name,
                    full_name_th: values.fullname_th,
                    full_name_en: values.fullname_en,
                    cost: values.cost,
                    is_cloud: values.is_cloud
                }
            });

            await Axios({
                url: process.env.REACT_APP_API_URL + "/master/add-customer-products",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    company_code: values.code,
                    product: selectProduct && selectProduct
                }
            });

            if (updatecompany.status === 200) {
                setLoadingEdit(false);
                setVisible(false);
                Modal.success({
                    title: 'บันทึกข้อมูลเรียบร้อย',
                    content: (
                        <div>
                            <p></p>
                        </div>
                    ),
                    okText: "Close",
                    onOk() {
                        setVisible(false);
                        setLoading(true);
                        window.location.reload(true);
                    },
                });
            }

        } catch (error) {
            setLoadingEdit(false);
            setVisible(false);
            Modal.error({
                title: 'บันทึกข้อมูล ไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.response.data}</p>
                    </div>
                ),
                okText: "Close",
                onOk() {

                    setLoading(true);
                },
            });
        }
    };

    const rowSelection = {
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectProduct(selectedRows.map((x) => {
                return {
                    Id: x.key,
                    Name: x.Name,
                    FullName: x.FullName
                }
            }));
            console.log(selectedRows)
            setSelectedRowKeys(selectedRowKeys)

        },
    };

    useEffect(() => {
        GetMasterCompany();

    }, [])

    useEffect(() => {
        GetCompany()
    }, [loading, search])



    return (
        <MasterPage>
            <div style={{ padding: "24px 24px 24px 24px" }}>
                <Row style={{ marginBottom: 16, textAlign: "left" }} gutter={[16, 16]}>
                    <Col span={16}>
                    </Col>
                    <Col span={8}>
                        <Input.Search placeholder="code / Name / FullName" allowClear
                            enterButton
                            onSearch={searchCompany}
                        />
                    </Col>
                </Row>
                <Row style={{ marginBottom: 16, textAlign: "left" }} gutter={[16, 16]}>
                    <Col span={24}>
                        <Button type="primary" icon={<PlusOutlined />}
                            style={{ backgroundColor: "#00CC00" }}
                            onClick={() => {
                                setModalAdd(true)
                                setSelectedRowKeys([])
                            }}
                        >
                            เพิ่มข้อมูล
                    </Button>
                    </Col>
                </Row>
                <Table
                    dataSource={filterCompany === null ? listcompany : filterCompany}
                    loading={loading}>
                    <Column title="Code" width="10%" dataIndex="Code" />
                    <Column title="CompanyName" width="20%" dataIndex="Name" />
                    <Column title="FullName" width="60%" dataIndex="FullNameTH" />
                    <Column title=""
                        align="center"
                        width="10%"
                        render={(record) => {
                            return (
                                <>
                                    <Button type="link"
                                        icon={<EditOutlined />}
                                        onClick={() => {
                                            return (
                                                GetCompanyById(record.Id),
                                                getCustomerProduct(record.Id),
                                                form.setFieldsValue({
                                                    code: record.Code,
                                                    name: record.Name,
                                                    fullname_th: record.FullNameTH,
                                                    fullname_en: record.FullNameEN,
                                                    cost: record.CostManday,
                                                    is_cloud: record.IsCloudSite

                                                }),
                                                setVisible(true)
                                            )
                                        }
                                        }
                                    >
                                        Edit
                                    </Button>
                                </>
                            )
                        }
                        }
                    />
                </Table>
            </div>
            {/* Add ข้อมูลบริษัท */}
            <Modal
                visible={modalAdd}
                title="ข้อมูลบริษัท"
                width={800}
                onCancel={() => {
                    setModalAdd(false);
                    setSelectcompany(null);
                    formAdd.resetFields();
                }}
                okText="Save"
                onOk={() => {
                    formAdd.submit();
                    setModalAdd(false);
                }
                }
            >
                <Form form={formAdd}
                    layout="horizontal"
                    name="form-companyAdd"
                    onFinish={onFinishAdd}

                >
                    <Form.Item name="code" label="Code"
                        rules={[
                            {
                                required: true,
                                message: 'กรุณา ระบุ Company Code',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="name" label="Name"
                        rules={[
                            {
                                required: true,
                                message: 'กรุณา ระบุ ชื่อย่อ',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item name="fullname_th" label="FullName TH">
                        <Input />
                    </Form.Item>
                    <Form.Item name="fullname_en" label="FullName EN">
                        <Input />
                    </Form.Item>
                    <Form.Item name="tel" label="Tel">
                        <Input />
                    </Form.Item>
                    <Form.Item name="address" label="Address">
                        <Input />
                    </Form.Item>
                    <Form.Item name="cost" label="Cost manday">
                        <Input />
                    </Form.Item>
                    <Form.Item name="is_cloud" label="ประเภท Site"
                        rules={[
                            {
                                required: true,
                                message: 'กรุณา ระบุ ประเภท Site',
                            },
                        ]}
                    >
                        <Radio.Group>
                            <Radio value={1}>Cloud</Radio>
                            <Radio value={0}>onPremise</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
                <Row>
                    <Col span={24}>
                        <Button type="primary" icon={<PlusOutlined />}
                            style={{ backgroundColor: "#00CC00" }}
                            onClick={() => { return (setModalProduct(true), getMasterProduct()) }}
                        >
                            Add Product
                    </Button>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Table dataSource={[...cusProduct]}>
                            <Column title="No" width="10%" />
                            <Column title="Product Code" width="20%" dataIndex="Name" />
                            <Column title="Product Name" width="60%" dataIndex="FullName" />
                        </Table>
                    </Col>
                </Row>
            </Modal>

            {/* Edit ข้อมูลบริษัท */}
            <Modal
                title={`${selectcompany && selectcompany[0]?.FullNameTH}`}
                visible={visible}
                confirmLoading={loadingEdit}
                width={800}
                onOk={() => { form.submit(); setLoadingEdit(true) }}
                okButtonProps={{ type: "primary", htmlType: "submit" }}
                okText="Save"
                onCancel={() => { setVisible(false); form.resetFields(); setSelectcompany(null) }}
            >
                <Spin spinning={loadingEdit}>
                    <Form form={form}
                        layout="horizontal"
                        name="form-editcompany"
                        onFinish={onFinish}

                    >

                        <Form.Item name="code" label="Code">
                            <Input disabled={true} />
                        </Form.Item>

                        <Form.Item name="name" label="Name">
                            <Input />
                        </Form.Item>
                        <Form.Item name="fullname_th" label="FullName TH">
                            <Input />
                        </Form.Item>
                        <Form.Item name="fullname_en" label="FullName EN">
                            <Input />
                        </Form.Item>
                        <Form.Item name="cost" label="Cost manday">
                            <InputNumber
                                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            />
                        </Form.Item>
                        <Form.Item name="is_cloud" label="ประเภท Site"
                        >
                            <Radio.Group name="is_cloud" >
                                <Radio value={true}>Cloud</Radio>
                                <Radio value={false}>onPremise</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form>

                    <Row>
                        <Col span={24}>
                            <Button type="primary" icon={<PlusOutlined />}
                                style={{ backgroundColor: "#00CC00" }}
                                onClick={() => { return (setModalProduct(true), getMasterProduct()) }}
                            >
                                Add Product
                    </Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Table dataSource={[...cusProduct]}>
                                <Column title="No" width="10%" dataIndex="Row" />
                                <Column title="Product Code" width="20%" dataIndex="Name" />
                                <Column title="Product Name" width="60%" dataIndex="FullName" />
                                <Column title=""
                                    align="center"
                                    width="10%"
                                    render={(record) => {
                                        return (
                                            <>
                                                <Button type="link"
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => deleteProduct(record)}
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
                </Spin>
            </Modal>

            {/* Add Product */}
            <Modal
                visible={modalProduct}
                title="ข้อมูล Product"
                width={800}
                onCancel={() => {
                    setModalProduct(false)
                    setSelectedRowKeys([])
                }}
                onOk={() => {
                    return (
                        setCusProduct([...cusProduct, ...selectProduct]),
                        setModalProduct(false)
                    )
                }}
                okText="Add"
            >
                <Table dataSource={listProduct}
                    pagination={{ pageSize: 5 }}
                    rowSelection={{
                        type: "checkbox",
                        ...rowSelection,
                    }}
                >
                    <Column title="No" width="10%" />
                    <Column title="Product Code" width="20%" dataIndex="Name" />
                    <Column title="Product Name" width="60%" dataIndex="FullName" />
                </Table>
            </Modal>
        </MasterPage >

    )
}