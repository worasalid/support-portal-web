import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Button, Table, Modal, Row, Col, Form, Input, message } from 'antd';
import Axios from 'axios';
import MasterPage from '../../MasterPage';
import { LeftCircleOutlined, CheckOutlined, PlusOutlined, StopOutlined } from '@ant-design/icons';

const { Column } = Table;

export default function MasterProduct() {
    const history = useHistory(null)
    const [form] = Form.useForm();

    const [product, setProduct] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)

    const getData = async () => {
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/products",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                // params: {
                //     keyword: ""
                // }
            });

            if (result.status === 200) {
                setTimeout(() => {
                    setLoading(false)
                    setProduct(result.data)
                }, 1000)
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

    const updateStatus = async (param) => {
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/products",
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
                setLoading(false)
                getData();

                message.success({
                    content: 'บันทึกข้อมูลสำเร็จ',
                    style: {
                        marginTop: '20vh',
                    },
                });
            }
        } catch (error) {
            Modal.error({
                title: 'บันทึกข้อมูล ไม่สำเร็จ',
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

    const onFinish = async (param) => {
        setLoading(true)
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/products",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    code: param.code,
                    name: param.name
                }
            });

            if (result.status === 200) {
                setModalVisible(false);
                form.resetFields();
                message.success({
                    content: 'บันทึกข้อมูลสำเร็จ',
                    style: {
                        marginTop: '20vh',
                    },
                });
                getData();
                setLoading(false)

            }
        } catch (error) {
            setModalVisible(false);
            Modal.error({
                title: 'บันทึกข้อมูลไม่สำเร็จ',
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
        getData()
    }, [])

    return (
        <MasterPage>
            <div style={{ padding: "24px 24px 24px 24px" }}>

                <Row style={{ marginBottom: 16, textAlign: "left" }} gutter={[16, 16]}>
                    <Col>
                        <Button
                            type="link"
                            icon={<LeftCircleOutlined />}
                            style={{ fontSize: 18, padding: 0 }}
                            onClick={() => history.goBack()}
                        >
                            Back
                               </Button>
                    </Col>
                   &nbsp; &nbsp;

                    </Row>
                <Row>
                    <Col>
                        <h1>ข้อมูล Product</h1>
                    </Col>
                </Row>

                <Row style={{ marginBottom: 16, textAlign: "right" }} gutter={[16, 16]}>
                    <Col span={24}>
                        <Button type="primary" icon={<PlusOutlined />}
                            style={{ backgroundColor: "#00CC00" }}
                            onClick={() => setModalVisible(true)}
                        >
                            เพิ่มข้อมูล
                    </Button>
                    </Col>
                </Row>
                <Table dataSource={product} loading={loading}
                    onChange={(x) => setPage(x.current)}
                    pagination={{ pageSize: 6 }}
                >
                    <Column title="No" width="5%"
                        render={(value, record, index) => {
                            return (
                                <>
                                    {
                                        page === 1 ? (index + 1) : ((page * 10) - 10) + (index + 1)
                                    }
                                </>
                            )
                        }}
                    />
                    <Column title="Product Code" dataIndex="Name" width="15%" />
                    <Column title="Product Name" dataIndex="FullName" width="55%" />
                    <Column title="สถานะ"
                        align="center"
                        width="15%"
                        render={(value, record, index) => {
                            return (
                                <>
                                    <Button type="text"
                                        icon={record.IsActive === true ?
                                            <CheckOutlined style={{ color: "green" }} /> :
                                            <StopOutlined style={{ color: "red" }} />
                                        }
                                        onClick={() => { updateStatus(record); setLoading(true) }}
                                    />
                                </>
                            )
                        }

                        }
                    />
                </Table>
            </div>
            <Modal
                visible={modalVisible}
                title="ข้อมูล Product "
                width={500}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                }}
                onOk={() => {
                    form.submit();

                }}
                okText="Save"
            >
                <Form
                    form={form}
                    layout={"horizontal"}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Code"
                        name="code"
                        rules={[{ required: true, message: 'กรุณา ระบุรายละเอียด' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'กรุณา ระบุรายละเอียด' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </MasterPage>
    )
}