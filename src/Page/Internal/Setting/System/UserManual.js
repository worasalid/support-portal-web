import React, { useEffect, useRef, useState } from 'react'
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Button, Table, Modal, Row, Col, Tabs, Form, Input, message, Divider } from 'antd';
import { LeftCircleOutlined, PlusOutlined } from '@ant-design/icons';
import moment from "moment"
import { Icon } from '@iconify/react';

import MasterPage from '../../MasterPage';
import Uploadfile from "../../../../Component/UploadFile"

const { Column } = Table;
const { TabPane } = Tabs;
const { TextArea } = Input;

export default function UserManual() {
    const history = useHistory(null);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [form3] = Form.useForm();

    const [formEdit] = Form.useForm();
    const [formEdit2] = Form.useForm();
    const [formEdit3] = Form.useForm();

    const uploadRef = useRef();
    const uploadRef2 = useRef();
    const uploadRef3 = useRef();

    const [loading, setLoading] = useState(false);

    // Modal
    const [modalCloud, setModalCloud] = useState(false);
    const [modalOnPremis, setModalOnPremis] = useState(false);
    const [modalInternal, setModalInternal] = useState(false);
    const [modalCloudEdit, setModalCloudEdit] = useState(false);
    const [modalOnPremisEdit, setModalOnPremisEdit] = useState(false);
    const [modalInternalEdit, setModalInternalEdit] = useState(false);

    // data
    const [cloudDocument, setCloudDocument] = useState([]);
    const [onPremisDocument, setOnPremisDocument] = useState([]);
    const [internaldocument, setInternalDocument] = useState([]);
    const [selectRowId, setSelectaRowId] = useState(null);


    // GetData
    const getCloudDocument = async () => {
        await Axios({
            url: process.env.REACT_APP_API_URL + "/master/config-data",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                groups: "Manual_CloudCustomer",
            }
        }).then((result) => {
            setCloudDocument(result.data)
        }).catch((error) => {

        })
    }

    const getOnPremisDocument = async () => {
        await Axios({
            url: process.env.REACT_APP_API_URL + "/master/config-data",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                groups: "Manual_onPremisCustomer",
            }
        }).then((result) => {
            setOnPremisDocument(result.data)
        }).catch((error) => {

        })
    }

    const getInternalDocument = async () => {
        await Axios({
            url: process.env.REACT_APP_API_URL + "/master/config-data",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                groups: "Manual_Internal",
            }
        }).then((result) => {
            setInternalDocument(result.data);
        }).catch((error) => {

        });
    }

    // Add
    const onFormSubmit = async (param) => {
        setLoading(true)
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/config-data/usermanual",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    docname: param.docname,
                    groups: "Manual_CloudCustomer",
                    files: uploadRef.current.getFiles().map((n) => n.response),
                }
            });

            if (result.status === 200) {
                setModalCloud(false);
                setLoading(false);
                getCloudDocument();
                message.success({
                    content: 'บันทึกข้อมูลสำเร็จ',
                    style: {
                        marginTop: '10vh',
                    },
                });
            }

        } catch (error) {
            setLoading(false);
            setModalCloud(false);
            message.error({
                content: 'บันทึกข้อมูลไม่สำเร็จ',
                style: {
                    marginTop: '10vh',
                },
            });
        }
    }

    const onForm2Submit = async (param) => {
        setLoading(true)
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/config-data/usermanual",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    docname: param.docname,
                    groups: "Manual_onPremisCustomer",
                    files: uploadRef2.current.getFiles().map((n) => n.response),
                }
            });

            if (result.status === 200) {
                setModalOnPremis(false);
                setLoading(false);
                getOnPremisDocument();
                message.success({
                    content: 'บันทึกข้อมูลสำเร็จ',
                    style: {
                        marginTop: '10vh',
                    },
                });
            }

        } catch (error) {
            setLoading(false);
            setModalOnPremis(false);
            message.error({
                content: 'บันทึกข้อมูลไม่สำเร็จ',
                style: {
                    marginTop: '10vh',
                },
            });
        }
    }

    const onForm3Submit = async (param) => {
        setLoading(true)
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/config-data/usermanual",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    docname: param.docname,
                    groups: "Manual_Internal",
                    files: uploadRef3.current.getFiles().map((n) => n.response),
                }
            });

            if (result.status === 200) {
                setModalInternal(false);
                setLoading(false);
                getInternalDocument();
                message.success({
                    content: 'บันทึกข้อมูลสำเร็จ',
                    style: {
                        marginTop: '10vh',
                    },
                });
            }

        } catch (error) {
            setLoading(false);
            setModalInternal(false);
            message.error({
                content: 'บันทึกข้อมูลไม่สำเร็จ',
                style: {
                    marginTop: '10vh',
                },
            });
        }
    }

    // Edit
    const onFormEdit = async (param) => {
        console.log("onFormEdit", param, "RowId", selectRowId)
        setLoading(true)
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/config-data",
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    id: selectRowId,
                    description: param.docname,
                    groups: "UserManual_Customer"
                }
            });

            if (result.status === 200) {
                modalCloudEdit(false);
                getCloudDocument();
                setLoading(false);
                message.success({
                    content: 'บันทึกข้อมูลสำเร็จ',
                    style: {
                        marginTop: '10vh',
                    },
                });
            }

        } catch (error) {
            setLoading(false);
            message.error({
                content: 'บันทึกข้อมูลไม่สำเร็จ',
                style: {
                    marginTop: '10vh',
                },
            });
        }
    }

    const onFormEdit2 = async (param) => {
        console.log("onFormEdit", param, "RowId", selectRowId)
        setLoading(true)
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/config-data",
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    id: selectRowId,
                    description: param.docname,
                    groups: "UserManual_Customer"
                }
            });

            if (result.status === 200) {
                setModalOnPremisEdit(false);
                getOnPremisDocument();
                setLoading(false);
                message.success({
                    content: 'บันทึกข้อมูลสำเร็จ',
                    style: {
                        marginTop: '10vh',
                    },
                });
            }

        } catch (error) {
            setLoading(false);
            message.error({
                content: 'บันทึกข้อมูลไม่สำเร็จ',
                style: {
                    marginTop: '10vh',
                },
            });
        }
    }

    const onFormEdit3 = async (param) => {
        setLoading(true)
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/config-data",
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    id: selectRowId,
                    description: param.docname,
                    groups: "Manual_Internal",
                }
            });

            if (result.status === 200) {
                setModalInternalEdit(false);
                getInternalDocument();
                setLoading(false);
                message.success({
                    content: 'บันทึกข้อมูลสำเร็จ',
                    style: {
                        marginTop: '10vh',
                    },
                });
            }

        } catch (error) {
            setLoading(false);
            message.error({
                content: 'บันทึกข้อมูลไม่สำเร็จ',
                style: {
                    marginTop: '10vh',
                },
            });
        }
    }

    //Delete
    const deleteFile = async (Id) => {
        setLoading(true);
        await Axios({
            url: process.env.REACT_APP_API_URL + "/master/config-data/usermanual",
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                id: Id,
                ref_type: "Master_ConfigData"
            }
        }).then(() => {
            setLoading(false);
            getCloudDocument();
            getOnPremisDocument();
            getInternalDocument();
            message.success({
                content: 'ลบข้อมูลสำเร็จ',
                style: {
                    marginTop: '10vh',
                },
            });
        }).catch(() => {
            setLoading(false);
            message.error({
                content: 'ลบข้อมูล ไม่สำเร็จ',
                style: {
                    marginTop: '10vh',
                },
            });
        });
    }

    useEffect(() => {
        getCloudDocument();
        getOnPremisDocument();
        getInternalDocument();
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
                        <h1>ข้อมูล คู่มือการใช้งาน</h1>
                    </Col>
                </Row>

                <Tabs defaultActiveKey="1" type="card">
                    <TabPane tab="ลูกค้า Cloud" key="1">
                        <Row style={{ marginBottom: 16, textAlign: "right" }} gutter={[16, 16]}>
                            <Col span={24}>
                                <Button type="primary" icon={<PlusOutlined />}
                                    style={{ backgroundColor: "#00CC00" }}
                                    onClick={() => setModalCloud(true)}
                                >
                                    เพิ่มข้อมูล
                                </Button>
                            </Col>
                        </Row>

                        <Table dataSource={cloudDocument} loading={loading}>
                            <Column title="No" width="5%"
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <label>{index + 1}</label>
                                        </>
                                    )
                                }}
                            />
                            <Column title="Document Name" width="65%"
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <label>{record.Name}</label>
                                        </>
                                    )
                                }}
                            />
                            <Column title="Upload Date" width="20%"
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <label>{moment(record.CreateDate).format("DD/MM/YYYY HH:mm")}</label>
                                        </>
                                    )
                                }}
                            />
                            <Column title="" width="10%"
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <Button type="link" icon={<Icon icon="eva:edit-2-outline" fontSize="18" />}
                                                onClick={() => {
                                                    formEdit.setFieldsValue({ docname: record.Name });
                                                    setSelectaRowId(record.Id);
                                                    setModalCloudEdit(true);
                                                }}
                                            /> &nbsp;
                                            <Divider type="vertical" />
                                            <Button type="link" icon={<Icon icon="fluent:delete-20-regular" fontSize="18" />}
                                                onClick={() => deleteFile(record.Id)}
                                            />
                                        </>
                                    )
                                }}
                            />

                        </Table>
                    </TabPane>
                    <TabPane tab="ลูกค้า onPremis" key="2">
                        <Row style={{ marginBottom: 16, textAlign: "right" }} gutter={[16, 16]}>
                            <Col span={24}>
                                <Button type="primary" icon={<PlusOutlined />}
                                    style={{ backgroundColor: "#00CC00" }}
                                    onClick={() => setModalOnPremis(true)}
                                >
                                    เพิ่มข้อมูล
                                </Button>
                            </Col>
                        </Row>

                        <Table dataSource={onPremisDocument} loading={loading}>
                            <Column title="No" width="5%"
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <label>{index + 1}</label>
                                        </>
                                    )
                                }}
                            />
                            <Column title="Document Name" width="65%"
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <label>{record.Name}</label>
                                        </>
                                    )
                                }}
                            />
                            <Column title="Upload Date" width="20%"
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <label>{moment(record.CreateDate).format("DD/MM/YYYY HH:mm")}</label>
                                        </>
                                    )
                                }}
                            />
                            <Column title="" width="10%"
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <Button type="link" icon={<Icon icon="eva:edit-2-outline" fontSize="18" />}
                                                onClick={() => {
                                                    formEdit2.setFieldsValue({ docname: record.Name });
                                                    setSelectaRowId(record.Id);
                                                    setModalOnPremisEdit(true);
                                                }}
                                            /> &nbsp;
                                            <Divider type="vertical" />
                                            <Button type="link" icon={<Icon icon="fluent:delete-20-regular" fontSize="18" />}
                                                onClick={() => deleteFile(record.Id)}
                                            />
                                        </>
                                    )
                                }}
                            />

                        </Table>
                    </TabPane>
                    <TabPane tab="Internal" key="3">
                        <Row style={{ marginBottom: 16, textAlign: "right" }} gutter={[16, 16]}>
                            <Col span={24}>
                                <Button type="primary" icon={<PlusOutlined />}
                                    style={{ backgroundColor: "#00CC00" }}
                                    onClick={() => setModalInternal(true)}
                                >
                                    เพิ่มข้อมูล
                                </Button>
                            </Col>
                        </Row>

                        <Table dataSource={internaldocument} loading={loading}>
                            <Column title="No" width="5%"
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <label>{index + 1}</label>
                                        </>
                                    )
                                }}
                            />
                            <Column title="Document Name" width="65%"
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <label>{record.Name}</label>
                                        </>
                                    )
                                }}
                            />
                            <Column title="Upload Date" width="20%"
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <label>{moment(record.CreateDate).format("DD/MM/YYYY HH:mm")}</label>
                                        </>
                                    )
                                }}
                            />
                            <Column width="10%"
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <Button type="link" icon={<Icon icon="eva:edit-2-outline" fontSize="18" />}
                                                onClick={() => {
                                                    formEdit3.setFieldsValue({ docname: record.Name })
                                                    setSelectaRowId(record.Id);
                                                    setModalInternalEdit(true);
                                                }}
                                            /> &nbsp;
                                            <Divider type="vertical" />
                                            <Button type="link" icon={<Icon icon="fluent:delete-20-regular" fontSize="18" />}
                                                onClick={() => deleteFile(record.Id)}
                                            />
                                        </>
                                    )
                                }}
                            />

                        </Table>
                    </TabPane>
                </Tabs>
            </div>

            {/* Modal Add Customer (Cloud) */}
            <Modal
                title="เพิ่มรายการ คู่มือการใช้งาน (ลูกค้า Cloud)"
                visible={modalCloud}
                confirmLoading={loading}
                width={800}
                okText="Save"
                cancelText="Close"
                onOk={() => form.submit()}
                onCancel={() => {
                    setModalCloud(false);
                    form.resetFields();
                }}
            >
                <Form form={form} layout="vertical" onFinish={onFormSubmit}>
                    <Form.Item name="docname" label="Document Name" rules={[{ required: true, message: "ระบุชื่อ เอกสาร" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="file" label="Upload File" rules={[{ required: true, message: "กรุณาเลือกไฟล์" }]}>
                        <Uploadfile ref={uploadRef} />
                    </Form.Item>

                </Form>

            </Modal>

            {/* Modal Add Customer (onPremis) */}
            <Modal
                title="เพิ่มรายการ คู่มือการใช้งาน (ลูกค้า onPremis)"
                visible={modalOnPremis}
                confirmLoading={loading}
                width={800}
                okText="Save"
                cancelText="Close"
                onOk={() => form2.submit()}
                onCancel={() => {
                    setModalOnPremis(false);
                    form2.resetFields();
                }}
            >
                <Form form={form2} layout="vertical" onFinish={onForm2Submit}>
                    <Form.Item name="docname" label="Document Name" rules={[{ required: true, message: "ระบุชื่อ เอกสาร" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="file" label="Upload File" rules={[{ required: true, message: "กรุณาเลือกไฟล์" }]}>
                        <Uploadfile ref={uploadRef2} />
                    </Form.Item>

                </Form>

            </Modal>

            {/* Modal Add (ICON) */}
            <Modal
                title="เพิ่มรายการ คู่มือการใช้งาน (ICON)"
                confirmLoading={loading}
                visible={modalInternal}
                width={500}
                okText="Save"
                cancelText="Close"
                onOk={() => form3.submit()}
                onCancel={() => {
                    setModalInternal(false);
                    form3.resetFields();
                }}
            >
                <Form form={form3} layout="vertical" onFinish={onForm3Submit}>
                    <Form.Item name="docname" label="Document Name" rules={[{ required: true, message: "ระบุชื่อ เอกสาร" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="file" label="Upload File" rules={[{ required: true, message: "กรุณาเลือกไฟล์" }]}>
                        <Uploadfile ref={uploadRef3} />
                    </Form.Item>

                </Form>
            </Modal>

            {/* Modal Edit Customer (Cloud)*/}
            <Modal
                title="แก้ไขรายการ คู่มือการใช้งาน (ลูกค้า Cloud)"
                confirmLoading={loading}
                visible={modalCloudEdit}
                width={800}
                okText="Save"
                cancelText="Close"
                onOk={() => formEdit.submit()}
                onCancel={() => {
                    setModalCloudEdit(false);
                    formEdit.resetFields();
                }}
            >
                <Form form={formEdit} layout="vertical" onFinish={onFormEdit}>
                    <Form.Item name="docname" label="Document Name" rules={[{ required: true, message: "ระบุชื่อ เอกสาร" }]}>
                        <TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal Edit Customer (onPremis)*/}
            <Modal
                title="แก้ไขรายการ คู่มือการใช้งาน (ลูกค้า onPremis)"
                confirmLoading={loading}
                visible={modalOnPremisEdit}
                width={800}
                okText="Save"
                cancelText="Close"
                onOk={() => formEdit2.submit()}
                onCancel={() => {
                    setModalOnPremisEdit(false);
                    formEdit2.resetFields();
                }}
            >
                <Form form={formEdit2} layout="vertical" onFinish={onFormEdit2}>
                    <Form.Item name="docname" label="Document Name" rules={[{ required: true, message: "ระบุชื่อ เอกสาร" }]}>
                        <TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal Edit ICON*/}
            <Modal
                title="แก้ไขรายการ คู่มือการใช้งาน (ICON)"
                confirmLoading={loading}
                visible={modalInternalEdit}
                width={800}
                okText="Save"
                cancelText="Close"
                onOk={() => formEdit3.submit()}
                onCancel={() => {
                    setModalInternalEdit(false);
                    formEdit3.resetFields();
                }}
            >
                <Form form={formEdit3} layout="vertical" onFinish={onFormEdit3}>
                    <Form.Item name="docname" label="Document Name" rules={[{ required: true, message: "ระบุชื่อ เอกสาร" }]}>
                        <TextArea rows={3} />
                    </Form.Item>
                </Form>
            </Modal>
        </MasterPage>
    )
}