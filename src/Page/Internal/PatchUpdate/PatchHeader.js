import React, { useEffect, useState, useReducer, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Col, Row, Table, Input, Form, Modal, Select, message } from "antd";
import Column from "antd/lib/table/Column";
import moment from "moment";
import Axios from "axios";
import MasterPage from "../MasterPage";
import AuthenContext from "../../../utility/authenContext";
import { Icon } from '@iconify/react';


export default function PatchHeader() {
    const history = useHistory();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const [modalPatch, setModalPatch] = useState(false);

    //data
    const [product, setProduct] = useState([]);
    const [filterProduct, setFilterProduct] = useState(4);
    const [patchHeader, setPatchHeader] = useState(null);
    const [description, setDescription] = useState(null);
    const [rowData, setRowData] = useState([]);

    const [pageCurrent, setPageCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [pageTotal, setPageTotal] = useState(0);

    const getProduct = async () => {
        await Axios.get(process.env.REACT_APP_API_URL + "/master/products", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
        }).then((res) => {
            setProduct(res.data);
        }).catch((error) => {

        })
    }

    const getPatch = async (param) => {
        setLoading(true);
        await Axios.get(process.env.REACT_APP_API_URL + "/patch/header", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                productId: filterProduct
            }
        }).then((result) => {
            setLoading(false);
            setPatchHeader(result.data.map((n, index) => {
                return {
                    key: index,
                    productId: n.ProductId,
                    version: n.Version,
                    patch: n.Patch,
                    description: n.Description,
                    cut_off_date: n.CutOffDate,
                    patch_folder: n.PatchFolder,
                    application_path: n.ApplicationPath,
                    sql_path: n.SQLPath,
                    issue: n.Issue
                }
            }));
        }).catch(() => {

        })
    }

    const cutOffPatch = async () => {
        setLoading(true);
        await Axios({
            url: process.env.REACT_APP_API_URL + "/patch/cutOffPatch",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                productId: rowData.productId,
                version: rowData.version,
                patch: rowData.patch,
                description: description
            }
        }).then((res) => {
            setLoading(false);
            setModal(false);
            getPatch();
        }).catch((error) => {

        })
    }

    const editPatchURL = async (param) => {
        console.log("param", param)
        setLoading(true);
        await Axios({
            url: process.env.REACT_APP_API_URL + "/patch/path-url",
            method: "PATCH",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                patch: rowData.patch,
                application_url: param.application,
                sql_url: param.sql
            }
        }).then((res) => {
            setLoading(false);
            form.resetFields();
            setModalPatch(false);

            message.success({
                content: 'บันทึกข้อมูลสำเร็จ',
                className: 'custom-class',
                style: {
                    marginTop: '20vh',
                },
            });
            getPatch();

        }).catch((error) => {
            setLoading(false);
            setModalPatch(false);

            Modal.error({
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                content: `${error.response.data}`,
            });
        })
    }

    const onFinish = (values) => {
        editPatchURL(values);
    };

    useEffect(() => {
        getProduct();
        getPatch();
    }, [])

    useEffect(() => {
        getPatch();
    }, [filterProduct])

    return (
        <MasterPage>
            <Row style={{ padding: "24px 24px 24px 24px", textAlign: "left" }}>
                <Col span={24}>
                    <label style={{ fontSize: 20, verticalAlign: "top" }}>รายการ Patch Version</label>
                </Col>
            </Row>

            <Row style={{ padding: "24px 24px 24px 24px", textAlign: "left" }}>
                <Col span={24}>
                    <Select
                        showSearch
                        style={{ width: 500 }}
                        placeholder="Select Product"
                        optionFilterProp="children"
                        defaultValue={4}
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        options={product.map((n) => ({ value: n.Id, label: `${n.Name} - (${n.FullName})` }))}
                        //onChange={(value) => getPatch(value)}
                        onChange={(value) => setFilterProduct(value)}
                    >

                    </Select>
                </Col>
            </Row>

            <Row style={{ padding: "24px 24px 24px 24px", textAlign: "left" }}>
                <Col span={24}>
                    <Table dataSource={patchHeader} loading={loading} className="header-sticky">
                        <Column title="Version" width="5%"
                            key="key"
                            render={(value, record, index) => {
                                return (
                                    <>
                                        <label>
                                            {record.version}
                                        </label>

                                    </>
                                )
                            }}
                        />
                        <Column title="Patch" width="5%"
                            key="key"
                            render={(value, record, index) => {
                                return (
                                    <>
                                        <label>
                                            {record.patch}
                                        </label>

                                    </>
                                )
                            }}
                        />
                        <Column title="Description" width="30%"
                            key="key"
                            render={(value, record, index) => {
                                return (
                                    <>
                                        <label>
                                            {record.description}
                                        </label>

                                    </>
                                )
                            }}
                        />
                        <Column title="Path URL" width="30%"
                            key="key"
                            render={(value, record, index) => {

                                return (
                                    <>
                                        <Row>
                                            <Col>
                                                <label>Application :   {record.application_path === null ? "-" : ""}</label> <br />
                                                <label className="text-link"
                                                    onClick={() => window.open(record.application_path, "_blank")}
                                                >
                                                    {record.application_path}
                                                </label>
                                            </Col>
                                        </Row>
                                  
                                        <Row style={{marginTop:8}}>
                                            <Col>
                                                <label>SQL Script :  {record.sql_path === null ? "-" : ""}</label> <br />
                                                <label className="text-link"
                                                    onClick={() => window.open(record.sql_path, "_blank")}
                                                >
                                                    {record.sql_path}
                                                </label>
                                            </Col>
                                        </Row>

                                    </>
                                )

                            }}
                        />
                        <Column width="5%"
                            key="key"
                            render={(value, record, index) => {
                                return (
                                    <>
                                        <Icon icon="ant-design:edit-outlined" width="25" height="25"
                                            className="icon-hover"
                                            onClick={() => {
                                                setModalPatch(true);
                                                setRowData(record);
                                                form.setFieldsValue({
                                                    application: record.application_path,
                                                    sql: record.sql_path
                                                })
                                            }}
                                        />
                                    </>
                                )

                            }}
                        />
                        <Column title="Cut off Date" width="10%" align="center"
                            key="key"
                            render={(value, record, index) => {
                                return (
                                    <>
                                        {
                                            record.cut_off_date === null ?
                                                <Icon icon="clarity:update-line" color="green" width="36" height="36"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => {
                                                        return (
                                                            <>
                                                                {
                                                                    record.issue === 0
                                                                        ? Modal.warning({
                                                                            title: `ไม่มี Issue ใน Patch ${record.patch}`,
                                                                            content: 'กรุณาเลือก Issue',
                                                                            okText: "Close"
                                                                        })
                                                                        : setModal(true), setRowData(record)
                                                                }
                                                            </>
                                                        )
                                                    }}
                                                />
                                                :
                                                <label>
                                                    {moment(record.cut_off_date).format("DD/MM/YYYY")}<br/>
                                                    {moment(record.cut_off_date).format("HH:mm")}
                                                </label>
                                        }
                                    </>
                                )
                            }}
                        />
                        <Column title="จำนวน Issue" width="10%"
                            key="key"
                            align="center"
                            render={(value, record, index) => {
                                return (
                                    <>
                                        {/* <Icon icon="carbon:view" color="#1890ff" width="24" height="24"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => history.push({ pathname: "/internal/patch/details/patch-" + record.patch })}
                                        /> */}
                                        <label className="text-link" style={{ fontSize: 16 }}
                                            onClick={() => history.push({ pathname: "/internal/patch/details/patch-" + record.patch })}
                                        > {`(${record.issue})`}</label>

                                    </>
                                )
                            }}
                        />
                    </Table>
                </Col>

            </Row>

            {/* Modal */}
            <Modal
                visible={modal}
                title="Cut Off Patch"
                width={800}
                okText="Save"
                onOk={() => {
                    cutOffPatch();
                }}
                onCancel={() => {
                    setModal(false);
                    setDescription(null);
                }}
            >
                <label>Description</label><br />
                <Input.TextArea rows={4} onChange={(e) => setDescription(e.target.value)} />
            </Modal>

            <Modal
                visible={modalPatch}
                confirmLoading={loading}
                title="Path URL"
                width={900}
                okText="Save"
                onOk={() => {
                    form.submit();
                }}
                onCancel={() => {
                    form.resetFields();
                    setModalPatch(false);
                }}
            >
                <Form form={form} name="control-hooks" onFinish={onFinish}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                >
                    <Form.Item name="application" label="Application URL"
                        rules={[{ required: false, message: 'กรุณาระบุ Link URL!' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="sql" label="SQL Script URL"
                        rules={[{ required: false, message: 'กรุณาระบุ Link URL!' }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </MasterPage>
    )
}