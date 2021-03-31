import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Button, Table, Modal, Row, Col, Form, Input, message, Select } from 'antd';
import Axios from 'axios';
import MasterPage from '../../MasterPage';
import { LeftCircleOutlined, CheckOutlined, PlusOutlined, StopOutlined } from '@ant-design/icons';

const { Column } = Table;

export default function ConfigVersion() {
    const history = useHistory(null)
    const [form] = Form.useForm();

    const [product, setProduct] = useState([]);
    const [disable, setDisable] = useState(true);
    const [dataVersion, setDataVersion] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [loading, setLoading] = useState(true);
    const [selectProduct, setSelectProduct] = useState([]);
    const [buttonHidden, setButtonHidden] = useState(true)


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
                setProduct(product.data);
                setDisable(false);
                setLoading(false);
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
                    setLoading(false);
                },
            });
        }
    }

    const getData = async (param) => {
        setLoading(true);
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/config-data",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    groups: param
                }
            });

            if (result.status === 200) {
                setLoading(false);
                setDataVersion(result.data);
            }
        } catch (error) {

        }
    }

    const updateStatus = async (param) => {
        console.log("param", param.Groups)
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
                    value: param.Value,
                    groups: param.Groups,
                    is_active: param.IsActive
                }
            });

            if (result.status === 200) {
                getData(param.Groups);
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

    const onFinish = async (param) => {
        setLoading(true);
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/config-data",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    description: param.description,
                    groups: selectProduct.name + "_Version"
                }
            });

            if (result.status === 200) {
                setModalVisible(false);

                message.success({
                    content: 'บันทึกข้อมูลสำเร็จ',
                    style: {
                        marginTop: '10vh',
                    },
                });
                getData(selectProduct.name + "_Version");
            }
        } catch (error) {
            setLoading(false);
        }
    }

    useEffect(() => {
        getProduct()
        //getData()
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
                        <h1>ตั้งค่า Version</h1>
                    </Col>
                </Row>
                <Row style={{ marginBottom: 16, textAlign: "left" }} gutter={[16, 16]}>
                    <Col span={8}>
                        <Select placeholder="Select Product" allowClear
                            disabled={disable}
                            filterOption={(input, option) =>
                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            style={{ width: "100%" }}
                            onChange={(value, option) => {

                                getData(option.name + "_Version");
                                setSelectProduct(option);
                                setButtonHidden(false);


                            }}
                            options={product.map((x) => ({
                                value: x.Id,
                                label: `${x.Name} (${x.FullName})`,
                                name: x.Name,
                                fullname: x.FullName
                            }))}

                        />
                    </Col>
                    <Col span={12}>

                    </Col>
                    <Col span={4} style={{ textAlign: "right" }}>
                        <Button type="primary" icon={<PlusOutlined />}
                            style={{ backgroundColor: "#00CC00" }}
                            onClick={() => setModalVisible(true)}
                            hidden={buttonHidden}
                        >
                            เพิ่มข้อมูล
                    </Button>
                    </Col>
                </Row>
                <Table dataSource={dataVersion} loading={loading}>
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
                title="Version "
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
                        label="Version"
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