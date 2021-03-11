import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Button, Table, Modal, Row, Col, Form, Input, Select, message } from 'antd';
import Axios from 'axios';
import MasterPage from '../../MasterPage';
import { ArrowLeftOutlined, CheckOutlined, PlusOutlined, StopOutlined } from '@ant-design/icons';

const { Column } = Table;

export default function MasterModule() {
    const history = useHistory(null)
    const [form] = Form.useForm();

    // element
    const [modalVisible, setModalVisible] = useState(false);

    // data
    const [page, setPage] = useState(1)
    const [product, setProduct] = useState([])
    const [module, setModule] = useState([])
    const [selectProduct, setSelectProduct] = useState(null)

    const [loading, setLoading] = useState(false)

    const getProduct = async () => {
        try {
            const product = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/products",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
            });

            if (product.status === 200) {
                setProduct(product.data)
            }
        } catch (error) {
            Modal.error({
                title: 'โหลดข้อมูลไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.response.data}</p>
                    </div>
                ),
                okText: "Close",
                onOk() {
                    setLoading(false)
                },
            });
        }
    }

    const getModule = async (param) => {
        setLoading(true)
        try {
            const module = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/modules",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    productId: param
                }
            });

            if (module.status === 200) {
                setLoading(false)
                setModule(module.data)
            }
        } catch (error) {

        }
    }

    const updateStatus = async (param) => {
        setLoading(true)
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/modules",
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    id: param.Id,
                    is_active: param.IsActive
                }
            });

            if (result.status === 200) {
                setLoading(false);
                getModule(param.ProductId);
                message.success({
                    content: 'บันทึกข้อมูลสำเร็จ',
                    style: {
                        marginTop: '20vh',
                    },
                });
            }
        } catch (error) {

        }
    }

    const onFinish = async (param) => {
        console.log(param)
        setLoading(true)
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/modules",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    product_id: selectProduct?.value,
                    name: param.module_name
                }
            });

            if (result.status === 200) {
                setModalVisible(false);
                setLoading(false)
                form.resetFields();
                message.success({
                    content: 'บันทึกข้อมูลสำเร็จ',
                    style: {
                        marginTop: '20vh',
                    },
                });
                getModule(selectProduct?.value);
            }
        } catch (error) {
            setModalVisible(false);
            Modal.error({
                title: 'บันทึกข้อมูล ไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.response.data}</p>
                    </div>
                ),
                okText: "Close",
                onOk() {
                    setModalVisible(true);
                },
            });
            setLoading(false)
        }
    }

    useEffect(() => {
        getProduct()
    }, [])

    return (
        <MasterPage>
            <Row style={{ marginBottom: 16, textAlign: "left" }} gutter={[16, 16]}>

                <Button type="primary" shape="circle" icon={<ArrowLeftOutlined />}
                    onClick={() => history.goBack()}
                />
                &nbsp; &nbsp;
                <h1>ข้อมูล Module</h1>
            </Row>
            <Row style={{ marginBottom: 16, textAlign: "left" }} gutter={[16, 16]}>
                <Col span={12}>
                    <Select placeholder="Select Product" allowClear
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        style={{ width: "100%" }}
                        onChange={(value, option) => { getModule(value); setSelectProduct(option) }}
                        options={product.map((x) => ({
                            value: x.Id,
                            label: `${x.Name} (${x.FullName})`,
                            fullname: x.FullName
                        }))}
                    
                    />
                </Col>
                <Col span={12}>
                    <Button type="primary" icon={<PlusOutlined />}
                        style={{ backgroundColor: "#00CC00", display: selectProduct?.value === undefined ? "none" : "block" }}
                        onClick={() => setModalVisible(true)}
                    >
                        เพิ่มข้อมูล
                    </Button>
                </Col>
            </Row>
            <Table dataSource={module} loading={loading}
                onChange={(x) => setPage(x.current)}
            >
                <Column title="No" width="5%"
                    render={(value, record, index) => {
                        return (
                            <>
                                {page === 1 ? (index + 1) : ((page * 10) - 10) + (index + 1)}
                            </>
                        )
                    }}
                />
                <Column title="Module" dataIndex="Name" width="55%" />
                <Column title="สถานะ"
                    align="center"
                    width="15%"
                    render={(record) => {
                        return (
                            <>
                                <Button type="text"
                                    icon={record.IsActive === true ?
                                        <CheckOutlined style={{ color: "green" }} /> :
                                        <StopOutlined style={{ color: "red" }} />
                                    }
                                    onClick={() => updateStatus(record)}
                                />
                            </>
                        )
                    }
                    }
                />
            </Table>

            <Modal
                visible={modalVisible}
                title={`${selectProduct?.fullname} (${selectProduct?.label})`}
                width={500}
                onCancel={() => setModalVisible(false)}
                onOk={() => form.submit()}
                okText="Save"
            >
                <Form
                    form={form}
                    layout={"vertical"}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="ชื่อ Module"
                        name="module_name"
                        rules={[{ required: true, message: 'กรุณา ระบุรายละเอียด !' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </MasterPage>
    )
}