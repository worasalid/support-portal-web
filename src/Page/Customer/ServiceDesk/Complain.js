import React, { useContext, useReducer, useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

// component
import MasterPage from "./MasterPage"

// antd
import { Button, Form, Input, Select, Row, Col, Modal, Spin } from "antd";
import { HomeOutlined } from '@ant-design/icons'

// utility
import Axios from 'axios';
import AuthenContext from '../../../utility/authenContext';
import { customerReducer, customerState } from '../../../utility/issueContext';

const { TextArea } = Input;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 24 },
};
const tailLayout = {
    wrapperCol: { offset: 20, span: 24 },
};

export default function CustomerComplain() {
    const { state, dispatch } = useContext(AuthenContext);
    const [customerstate, customerdispatch] = useReducer(customerReducer, customerState)
    const history = useHistory();

    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [complainType, setComplainType] = useState([]);
    const [selectType, setSelectType] = useState(null);

    const configData = async () => {
        await Axios({
            url: process.env.REACT_APP_API_URL + "/master/config-data",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                groups: "CustomerComplain"
            }
        }).then((res) => {
            setComplainType(res.data.filter(f => f.IsActive).map((item) => {
                return {
                    key: item.key,
                    value: item.Value,
                    label: item.Name
                }
            }));
        })
    }

    const getproducts = async () => {
        await Axios({
            url: process.env.REACT_APP_API_URL + "/master/customer-products",
            method: "get",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                company_id: state?.usersdata?.users?.company_id
            }
        }).then((result) => {
            customerdispatch({ type: "LOAD_PRODUCT", payload: result.data })
        }).catch((error) => {

        })
    }

    const onFinish = async (values) => {
        console.log("onFinish", values)
        setLoading(true);
        await Axios({
            url: process.env.REACT_APP_API_URL + "/complain/create",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                companyId: state?.usersdata?.users?.company_id,
                complain_type: values.complain_type,
                product_id: values.product,
                user: values.user,
                user: values.user,
                department: values.department,
                description: values.description

            }
        }).then((res) => {
            setLoading(false);
            Modal.success({
                title: 'บันทึกข้อมูลสำเร็จ',
                content: (
                    <div>

                    </div>
                ),
                okText: "Close",
                onOk() {
                    history.push("/customer/servicedesk");
                },
            });
        }).catch((error) => {

        });
    }

    const onFinishFailed = () => {

    }

    useEffect(() => {
        getproducts();
        configData();
    }, [])

    return (
        <MasterPage>
            <div style={{ padding: 24 }}>
                <Spin spinning={loading}>
                    <div className="sd-page-header">
                        <Row>
                            <Col span={18}>
                                <h3>แจ้งข้อร้องเรียน / ข้อคิดเห็น / ข้อเสนอแนะ</h3>
                            </Col>
                            <Col span={6} style={{ textAlign: "right" }}>
                                <Button
                                    type="link"
                                    onClick={() => history.push({ pathname: "/customer/servicedesk" })}
                                >
                                    <HomeOutlined style={{ fontSize: 20 }} /> กลับสู่เมนูหลัก
                                </Button>
                            </Col>
                        </Row>
                        <hr />
                    </div>

                    <Form
                        form={form}
                        style={{ marginTop: "80px" }}
                        {...layout}

                        name="complaint"
                        initialValues={{
                        }}
                        layout="vertical"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}

                    >
                        <Form.Item label="หัวข้อในการร้องเรียน" name="complain_type"
                            rules={[
                                {
                                    required: true,
                                    message: "กรุณาระบุ ประเภท!",
                                },
                            ]}
                        >
                            <Select
                                placeholder="==เลือกหัวข้อ=="
                                showSearch
                                allowClear
                                filterOption={(input, option) =>
                                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                options={complainType.map(o => ({ value: o.value, label: o.label }))}
                                onChange={(value, item) => {
                                    setSelectType(value);
                                    if (value == 2 || value == 4) {
                                        form.setFieldsValue({ product: null })
                                    }
                                }}
                            >

                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="ผลิตภัณฑ์ (Product)"
                            name="product"
                            hidden={(selectType != 1 && selectType != 3) ? true : false}
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: selectType == 1 ? true : false,
                                    message: "กรุณาระบุ ผลิตภัณฑ์!",
                                },
                            ]}
                        >
                            <Select
                                allowClear
                                placeholder="==เลือกผลิตภัณฑ์=="
                                onChange={(value) => customerdispatch({ type: "SELECT_PRODUCT", payload: value })}
                                options={customerstate && customerstate.masterdata.productState.map((x) => ({ value: x.ProductId, label: `${x.Name} - (${x.FullName})` }))}
                            />
                        </Form.Item>

                        <Form.Item
                            label="ชื่อพนักงาน"
                            name="user"
                            hidden={(selectType != 2) ? true : false}
                            style={{ width: "100%" }}

                        >
                            <Input placeholder='กรุณา ระบุชื่อพนักงาน' />
                        </Form.Item>

                        <Form.Item
                            label="แผนก"
                            name="department"
                            hidden={(selectType != 2) ? true : false}
                            style={{ width: "100%" }}

                        >
                            <Select
                                allowClear
                                placeholder="==เลือกแผนก=="
                                options={[
                                    {
                                        value: "Application Support",
                                        label: "Application Support"
                                    },
                                    {
                                        value: "Development",
                                        label: "Development"
                                    },
                                    {
                                        value: "Information Technology (IT)",
                                        label: "Information Technology (IT)"
                                    },
                                    {
                                        value: "System Analyst (SA)",
                                        label: "System Analyst (SA)"
                                    },
                                    {
                                        value: "Business Analyst (BA)",
                                        label: "Business Analyst (BA)"
                                    },
                                    {
                                        value: "Project Implementation",
                                        label: "Project Implementation"
                                    },
                                    {
                                        value: "Sales",
                                        label: "Sales"
                                    },
                                    {
                                        value: "Marketing",
                                        label: "Marketing"
                                    },
                                    {
                                        value: "Finance & Accounting",
                                        label: "Finance & Accounting"
                                    }
                                ]}
                            />
                        </Form.Item>

                        <Form.Item label="รายละเอียด" name="description"
                            rules={[
                                {
                                    required: true,
                                    message: "กรุณาระบุ รายละเอียด!",
                                },
                            ]}
                        >
                            <TextArea rows={6} />
                        </Form.Item>

                        <Form.Item {...tailLayout}>
                            <Button
                                loading={loading}
                                style={{ width: 100 }}
                                type="primary"
                                htmlType="submit"
                                size="middle"
                            >
                                บันทึก
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </div>
        </MasterPage>
    )
}
