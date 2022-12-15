import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Button, Table, Modal, Row, Col, Form, Input } from 'antd';
import Axios from 'axios';
import MasterPage from '../../MasterPage';
import { LeftCircleOutlined, CheckOutlined, PlusOutlined, StopOutlined } from '@ant-design/icons';

const { Column } = Table;

export default function ConfigComplainType() {
    const history = useHistory(null)
    const [form] = Form.useForm();

    const [dataComplain, setDataComplain] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [loading, setLoading] = useState(true)

    const getData = async () => {
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/config-data",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    groups: "CustomerComplain"
                }
            });

            if (result.status === 200) {
                setTimeout(() => {
                    setLoading(false)
                    setDataComplain(result.data)
                }, 1000)
            }
        } catch (error) {

        }
    }

    const updateStatus = async (param) => {
        setLoading(true)
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/config-data",
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    id: param.Id,
                    description: param.Name,
                    value: param.Value,
                    groups: param.Groups,
                    is_active: param.IsActive
                }
            });

            if (result.status === 200) {
                getData()
            }
        } catch (error) {

        }
    }

    const onFinish = async (param) => {
        setLoading(true)
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/config-data",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    description: param.description,
                    groups: "CustomerComplain"
                }
            });

            if (result.status === 200) {
                setModalVisible(false);
                form.resetFields();
                getData();
            }
        } catch (error) {
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
                        <h1> ตั้งค่าหัวข้อการ Complaint</h1>
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
                <Table dataSource={dataComplain} loading={loading}>
                    <Column title="No" width="5%" dataIndex="Sequence" />
                    <Column title="รายละเอียด" dataIndex="Name" width="55%" />
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
            </div>
            <Modal
                visible={modalVisible}
                title="หัวข้อการ Complaint"
                width={500}
                onCancel={() => {
                    setModalVisible(false);
                    form.resetFields();
                }}
                onOk={() => form.submit()}
                okText="Save"
            >
                <Form
                    form={form}
                    layout={"vertical"}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="หัวข้อการ Complaint"
                        name="description"
                        rules={[{ required: true, message: 'กรุณาระบุรายละเอียด' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </MasterPage>
    )
}