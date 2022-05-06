import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useHistory } from 'react-router-dom';
import MasterPage from "../MasterPage";
import { Button, Row, Col, Card, Checkbox, Table, Modal, message, Skeleton, Form, Input, Result } from 'antd';
import { LeftCircleOutlined } from '@ant-design/icons';
import { Icon } from '@iconify/react';
import AuthenContext from "../../../utility/authenContext";

export default function IssueFlow() {
    const { state, dispatch } = useContext(AuthenContext);
    return (
        <>
            {
                state?.usersdata?.permission?.menu?.setting === true ?
                    <PageSetting /> :
                    <MasterPage>
                        <Result
                            status="403"
                            title="403"
                            subTitle="Sorry, you are not authorized to access this page."
                        />
                    </MasterPage>
            }
        </>
    )
}

export function PageSetting() {
    const { Column } = Table;
    const history = useHistory(null);

    const [formMail] = Form.useForm();
    const [formCCMail] = Form.useForm();
    const [pageLoad, setPageLoad] = useState(true);
    const [loadingMail, setLoadingMail] = useState(false);
    const [loadingCCMail, setLoadingCCMail] = useState(false);
    const [modalMail, setModalMail] = useState(false);
    const [modalCCMail, setModalCCMail] = useState(false);


    //data
    const [isAdmin, setIsAdmin] = useState(false);
    const [isUser, setIsUser] = useState(false);
    const [email, setEmail] = useState([]);
    const [ccEmail, setCCEmail] = useState([]);

    const validateMessages = {
        required: 'กรุณาระบุ ${label}',
        types: {
            email: 'ระบุ ${label} ไม่ถูกต้อง !',
        },

    };

    const getFlowAssign = async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/config/customer/setting/issue-flow`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                companyId: 0
            }
        }).then((res) => {
            setIsAdmin(res.data[0].IsAdmin);
            setIsUser(res.data[0].IsUser);
        }).catch((error) => {
            console.log(error)
        })
    }

    const updateFlowAssign = async (params) => {
        await axios({
            url: `${process.env.REACT_APP_API_URL}/config/customer/setting/issue-flow`,
            method: "PATCH",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                is_admin: params.is_admin,
                is_user: params.is_user
            }
        }).then((res) => {
            message.success({
                content: "บันทึกข้อมูลสำเร็จ",
                style: {
                    marginTop: '10vh',
                },
            });
        }).catch((error) => {
            message.error({
                content: "บันทึกข้อมูล ไม่สำเร็จ",
                style: {
                    marginTop: '10vh',
                },
            });
        });
    }

    const getEmail = async () => {
        setLoadingMail(true);
        await axios.get(`${process.env.REACT_APP_API_URL}/config/customer/setting/email`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                type: "create"
            }
        }).then((res) => {
            setEmail(res.data.map((n, index) => {
                return {
                    no: index + 1,
                    item_id: n.item_id,
                    email: n.email,
                    is_visible: n.is_visible,
                    type: n.type
                }
            }));
            setLoadingMail(false);
            setPageLoad(false);
        }).catch((error) => {
            setLoadingMail(false);
            setPageLoad(false);
        })
    }

    const getCCEmail = async () => {
        setLoadingCCMail(true);
        await axios.get(`${process.env.REACT_APP_API_URL}/config/customer/setting/email`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                type: "cc"
            }
        }).then((res) => {
            setCCEmail(res.data.map((n, index) => {
                return {
                    no: index + 1,
                    item_id: n.item_id,
                    email: n.email,
                    is_visible: n.is_visible
                }
            }));
            setLoadingCCMail(false);
            setPageLoad(false);
        }).catch((error) => {
            setLoadingCCMail(false);
            setPageLoad(false);
        })
    }

    const updateEmail = async (params) => {
        if (params.type === "create") {
            setLoadingMail(true);
        } else {
            setLoadingCCMail(true);
        }

        await axios({
            url: `${process.env.REACT_APP_API_URL}/config/customer/setting/email`,
            method: "PATCH",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                item_id: params.item_id,
                is_visible: !params.is_visible
            }
        }).then((res) => {
            if (params.type === "create") {
                setLoadingMail(false);
                getEmail();
            } else {
                setLoadingCCMail(false);
                getCCEmail();
            }
            message.success({
                content: "บันทึกข้อมูลสำเร็จ",
                style: {
                    marginTop: '10vh',
                },
            });

        }).catch((error) => {
            setLoadingMail(false);
            setLoadingCCMail(false);
            message.error({
                content: "บันทึกข้อมูล ไม่สำเร็จ",
                style: {
                    marginTop: '10vh',
                },
            });
        })
    }

    const addEmail = async (params) => {
        if (params.type === "create") {
            setLoadingMail(true);
        } else {
            setLoadingCCMail(true);
        }

        await axios({
            url: `${process.env.REACT_APP_API_URL}/config/customer/setting/email`,
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                email: params.email,
                type: params.type
            }
        }).then((res) => {
            setModalMail(false);
            setModalCCMail(false);

            Modal.success({
                title: "บันทึกข้อมูล สำเร็จ",
                okText: "Close",
                okButtonProps: { type: "default" },
                onOk: () => {
                    if (params.type === "create") {
                        setLoadingMail(false);
                        formMail.resetFields();
                        getEmail();
                    } else {
                        setLoadingCCMail(false);
                        formCCMail.resetFields();
                        getCCEmail();
                    }
                },
            });

        }).catch((error) => {
            console.log("error", error.response)
            setModalMail(false);
            setModalCCMail(false);
            Modal.error({
                title: "บันทึกข้อมูล ไม่สำเร็จ",
                content: `${error.response.data}`,
                okText: "Close",
                onOk: () => {
                    if (params.type === "create") {
                        setLoadingMail(false);
                        setModalMail(true);
                    } else {
                        setLoadingCCMail(false);
                        setModalCCMail(true);
                    }
                }
            });
        });
    }

    const deleteEmail = async (params) => {
        if (params.type === "create") {
            setLoadingMail(true);
        } else {
            setLoadingCCMail(true);
        }

        await axios({
            url: `${process.env.REACT_APP_API_URL}/config/customer/setting/email`,
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                item_id: params.itemId
            }
        }).then((res) => {

            Modal.success({
                title: "ลบข้อมูล สำเร็จ",
                okText: "Close",
                okButtonProps: { type: "default" },
                onOk: () => {
                    if (params.type === "create") {
                        setLoadingMail(false);
                        getEmail();
                    } else {
                        setLoadingCCMail(false);
                        getCCEmail();
                    }
                },
            });
        }).catch((error) => {
            Modal.success({
                title: "ลบข้อมูล ไม่สำเร็จ",
                okText: "Close",
                okButtonProps: { type: "default" },
                onOk: () => {
                    if (params.type === "create") {
                        setLoadingMail(false);
                        getEmail();
                    } else {
                        setLoadingCCMail(false);
                        getCCEmail();
                    }
                },
            });
        });
    }

    const onFinishForm = async (params) => {
        const value = {
            type: params.type,
            email: params.formValue.email
        }
        addEmail(value);
    }

    useEffect(() => {
        getFlowAssign();
        getEmail();
        getCCEmail();
    }, [])



    return (
        <MasterPage>
            <div style={{ padding: "24px 24px 24px 24px" }}>
                <Row style={{ marginBottom: 16, textAlign: "left" }} gutter={[16, 16]}>
                    <Col span={4}>
                        <Button
                            type="link"
                            icon={<LeftCircleOutlined />}
                            style={{ fontSize: 18, padding: 0 }}
                            onClick={() => history.goBack()}
                        >
                            Back
                        </Button>
                        &nbsp;   &nbsp; ตั้งค่าการแจ้ง Issue
                    </Col>

                </Row>

                <Card>
                    <label className="header-text">Assign to ICON</label> &nbsp;&nbsp;
                    <Checkbox checked={isAdmin && isAdmin}
                        onChange={(e) => { setIsAdmin(e.target.checked); updateFlowAssign({ is_admin: e.target.checked, is_user: isUser }) }}
                    >
                        Admin
                    </Checkbox>
                    <Checkbox checked={isUser && isUser}
                        onChange={(e) => { setIsUser(e.target.checked); updateFlowAssign({ is_admin: isAdmin, is_user: e.target.checked }) }}
                    >
                        User
                    </Checkbox>
                </Card>
                <br />
                <br />
                <Row gutter={[32, 32]}>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Skeleton loading={pageLoad}>
                            <Card title="แจ้งเตือน Email ตอนสร้าง Issue"
                                extra={
                                    <Button type="default" icon={<Icon icon="akar-icons:plus" />}
                                        onClick={() => setModalMail(true)}
                                    >
                                        เพิ่มข้อมูล
                                    </Button>
                                }
                            >
                                <Table dataSource={email} loading={loadingMail} rowKey={(record) => record.item_id}
                                    pagination={{ pageSize: 5 }}
                                >
                                    <Column title="No" width="5%" dataIndex="no" />
                                    <Column title="Email" width="95%" dataIndex="email" />
                                    <Column title="สถานะ"
                                        render={(value, record) => {
                                            return (
                                                <>
                                                    {
                                                        record.is_visible ?
                                                            <Icon icon="akar-icons:check" color="green" width="18" height="18"
                                                                className="icon-link-hover"
                                                                onClick={() => updateEmail(record)}
                                                            /> :
                                                            <Icon icon="fe:disabled" color="red" width="18" height="18"
                                                                className="icon-link-hover"
                                                                onClick={() => updateEmail(record)}
                                                            />
                                                    }
                                                </>
                                            )
                                        }}
                                    />
                                    <Column dataIndex="item_id"
                                        render={(value) => {
                                            return (
                                                <>
                                                    <Icon className="icon-link-delete" icon="fluent:delete-28-regular" width="18" height="18"
                                                        onClick={() => deleteEmail({ itemId: value, type: "create" })}
                                                    />
                                                </>
                                            )
                                        }}
                                    />
                                </Table>
                            </Card>
                        </Skeleton>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
                        <Skeleton loading={pageLoad}>
                            <Card title="แจ้งเตือน CC Email (ส่ง Issue)"
                                extra={
                                    <Button type="default" icon={<Icon icon="akar-icons:plus" />}
                                        onClick={() => setModalCCMail(true)}
                                    >
                                        เพิ่มข้อมูล
                                    </Button>
                                }
                            >

                                <Table dataSource={ccEmail} loading={loadingCCMail} rowKey={(record) => record.item_id}
                                    pagination={{ pageSize: 5 }}
                                >
                                    <Column title="No" width="5%" dataIndex="no" />
                                    <Column title="Email" width="95%" dataIndex="email" />
                                    <Column title="สถานะ"
                                        render={(value, record) => {
                                            return (
                                                <>
                                                    {
                                                        record.is_visible ?
                                                            <Icon icon="akar-icons:check" color="green" width="18" height="18"
                                                                className="icon-link-hover"
                                                                onClick={() => updateEmail(record)}
                                                            /> :
                                                            <Icon icon="fe:disabled" color="red" width="18" height="18"
                                                                className="icon-link-hover"
                                                                onClick={() => updateEmail(record)}
                                                            />
                                                    }
                                                </>
                                            )
                                        }}
                                    />
                                    <Column dataIndex="item_id"
                                        render={(value) => {
                                            return (
                                                <>
                                                    <Icon className="icon-link-delete" icon="fluent:delete-28-regular" width="18" height="18"
                                                        onClick={() => deleteEmail({ itemId: value, type: "cc" })}
                                                    />
                                                </>
                                            )
                                        }}
                                    />
                                </Table>
                            </Card>
                        </Skeleton>
                    </Col>

                </Row>
            </div>

            <Modal
                visible={modalMail}
                title="แจ้งเตือน Email ตอนสร้าง Issue"
                width={600}
                okText="Save"
                onOk={() => formMail.submit()}
                onCancel={() => {
                    setModalMail(false);
                    formMail.resetFields();
                }}
            >
                <Form form={formMail} name="addmail" validateMessages={validateMessages}
                    onFinish={(value) => onFinishForm({ type: "create", formValue: value })}
                >
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                visible={modalCCMail}
                title="แจ้งเตือน CC Email"
                width={600}
                okText="Save"
                onOk={() => formCCMail.submit()}
                onCancel={() => {
                    setModalCCMail(false);
                    formCCMail.resetFields();
                }}
            >
                <Form form={formCCMail} name="addCCmail" validateMessages={validateMessages}
                    onFinish={(value) => onFinishForm({ type: "cc", formValue: value })}
                >
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </MasterPage >
    )
}