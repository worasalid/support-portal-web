import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Button, Table, Modal, Row, Col, Form, Input } from 'antd';
import Axios from 'axios';
import MasterPage from '../../MasterPage';
import { ArrowLeftOutlined, CheckOutlined, PlusOutlined, StopOutlined } from '@ant-design/icons';

const { Column } = Table;

export default function ConfigReOpenEmail() {
    const history = useHistory(null)
    const [form] = Form.useForm();

    const [dataReOpen, setDataReOpen] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [loading, setLoading] = useState(true)

    const getData = async () => {
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/load-config-data",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    groups: "ReOpenEmail"
                }
            });

            if (result.status === 200) {


                setTimeout(() => {
                    setLoading(false)
                    setDataReOpen(result.data)
                }, 1000)
            }
        } catch (error) {

        }
    }

    const updateStatus = async (param) => {
        setLoading(true)
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/update-config-data",
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    id: param.Id,
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
                url: process.env.REACT_APP_API_URL + "/master/add-config-data",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    description: param.description,
                    groups: "ReOpenEmail"
                }
            });

            if (result.status === 200) {
                setModalVisible(false);
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
            <Row style={{ marginBottom: 16, textAlign: "left" }} gutter={[16, 16]}>

                <Button type="primary" shape="circle" icon={<ArrowLeftOutlined />}
                    onClick={() => history.goBack()}
                />
                &nbsp; &nbsp;
                <h1>ตั้งค่า Email ที่ใช้ส่ง กรณี ReOpen</h1>
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
            <Table dataSource={dataReOpen} loading={loading}>
                <Column title="No" width="5%" dataIndex="Sequence" />
                <Column title="Email" dataIndex="Name" width="55%" />
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
                title="ตั้งค่า Email ในการ ReOpen"
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
                        label="Email"
                        name="description"
                        rules={[{ required: true, message: 'กรุณาระบุ Email' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </MasterPage>
    )
}