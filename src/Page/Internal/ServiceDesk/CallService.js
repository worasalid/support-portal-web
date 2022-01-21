import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Input, Select, DatePicker, Dropdown, TimePicker, Row, Col, Modal, Spin, Checkbox, Divider } from "antd";
import axios from 'axios';
//import { Icon } from '@iconify/react';
import MasterPage from '../ServiceDesk/MasterPage';
import { Editor } from '@tinymce/tinymce-react';
import moment from "moment"
import { useHistory } from 'react-router-dom';

export default function CallService() {
    const queryParams = new URLSearchParams(window.location.search);
    const tel = queryParams.get('tel');
    const [loading, setLoading] = useState(false);
    const editorRef = useRef(null);
    const history = useHistory(null);
    const [form] = Form.useForm();

    // data
    const [customer, setCustomer] = useState(null);
    const [company, setCompany] = useState([]);
    const [listCustomer, setListCustomer] = useState([]);
    const [product, setProduct] = useState([]);
    const cusScene = [
        {
            name: "None",
            value: "None"
        },
        {
            name: "Application",
            value: "Application"
        },
        {
            name: "Report",
            value: "Report"
        },
        {
            name: "Printform",
            value: "Printform"
        },
        {
            name: "Data",
            value: "Data"
        },
        {
            name: "API",
            value: "API"
        }
    ]

    // selecter
    const [selectCompany, setSelectCompany] = useState(null);
    const [checked, setChecked] = useState(false);
    const [description, setDescription] = useState(null);
    const [startTime, setStartTime] = useState(moment(moment(), "HH:mm"));
    const [endTime, setEndTime] = useState(null);


    /////////////// function ///////////////
    const getCustomer = async () => {
        setLoading(true);
        await axios.get(`${process.env.REACT_APP_API_URL}/callcenter`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                tel: tel
            }
        }).then((res) => {
            setCustomer(res.data);
            setSelectCompany(res.data.CompanyId)
            setLoading(false);

        }).catch((error) => {

        });
    }

    const getCompany = async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/master/company`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
        }).then((res) => {
            // console.log("com", res.data);
            setCompany(res.data);
        }).catch((error) => {

        })
    }

    const getListCustomer = async (param) => {
        await axios.get(`${process.env.REACT_APP_API_URL}/callcenter/customer`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                company_id: selectCompany || param
            }
        }).then((res) => {

            setListCustomer(res.data);
        }).catch((error) => {

        });
    }

    const getProduct = async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/master/customer-products`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                company_id: selectCompany
            }
        }).then((res) => {
            setProduct(res.data);

        }).catch((error) => {

        })
    }

    const saveData = async (param) => {
        setLoading(true);
        await axios({
            url: `${process.env.REACT_APP_API_URL}/callcenter/create-case`,
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                company_id: param.company,
                product_id: param.product,
                informerId: param.informerId,
                informer_name: param.informerName,
                telephone: tel,
                scene: param.scene,
                title: param.subject,
                description: description,
                call_start: moment(startTime).format("HH:mm"),
                call_end: endTime === null ? null : moment(endTime).format("HH:mm")
            }
        }).then((res) => {
            setLoading(false);
            Modal.success({
                title: 'บันทึกข้อมูล เรียบร้อยแล้ว',
                content: (
                    <div>
                        <p>Case เลขที่ : {res.data}</p>

                    </div>
                ),
                okText: "Close",
                onOk() {
                    history.push("/internal/callcenter/case");
                },
            });
        }).catch((error) => {

        })
    }

    const onFinish = (value) => {
        const result = {
            ...value, date: value.date === undefined ? "" : value.date.format("YYYY-MM-DD")
        };
        saveData(value);
    }

    useEffect(() => {
        getCustomer();
        getCompany();
        form.setFieldsValue({ date: moment(moment(), "DD/MM/YYYY") })
    }, [])

    useEffect(() => {
        getListCustomer();
        getProduct();
        //
    }, [selectCompany])

    useEffect(() => {
        if (customer !== null) {
            form.setFieldsValue({ company: customer?.CompanyId, informerId: customer?.CustomerId })
        }
    }, [customer])

    useEffect(() => {
        if (checked) {
            form.setFieldsValue({ informerId: null })
        } else {
            form.setFieldsValue({ informerName: null })
        }
    }, [checked])


    return (
        <MasterPage>
            <Spin spinning={loading}>
                <Form
                    form={form}
                    name="basic"
                    layout='vertical'
                    // labelCol={{ span: 4 }}
                    // wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    autoComplete="off"
                    onFinish={onFinish}
                >

                    <Form.Item
                        label="บริษัท"
                        name="company"
                        rules={[{ required: true, message: 'กรุณา ระบุ บริษัท!' }]}
                    >
                        <Select
                            showSearch
                            disabled={customer !== null && customer !== ""}
                            style={{ width: "100%" }}
                            placeholder="เลือก บริษัท"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={(value) => {
                                form.setFieldsValue({ informer: null });
                                setSelectCompany(value)
                            }}
                            options={company.map((n) => ({ value: n.Id, label: `(${n.Code})  -  ${n.FullNameTH}` }))}
                        >

                        </Select>
                    </Form.Item>

                    {
                        checked === true ?
                            <Form.Item
                                label={
                                    <>
                                        ผู้แจ้ง &nbsp;
                                        <span>
                                            <Divider type='vertical' />
                                            <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} >ระบุเอง</Checkbox>
                                        </span>
                                    </>
                                }
                                name="informerName"
                                rules={[{ required: true, message: 'กรุณา ระบุ ผู้แจ้ง!' }]}
                            >
                                <Input placeholder='ระบุชื่อ' />
                            </Form.Item>
                            :
                            <Form.Item
                                label={
                                    <>
                                        ผู้แจ้ง &nbsp;
                                        <span hidden={customer !== null && customer !== "" ? true : false}>
                                            <Divider type='vertical' />
                                            <Checkbox onChange={(e) => setChecked(e.target.checked)} >ระบุเอง</Checkbox>
                                        </span>
                                    </>

                                }
                                name="informerId"
                                rules={[{ required: true, message: 'กรุณา ระบุ ผู้แจ้ง!' }]}
                            >
                                <Select
                                    showSearch
                                    disabled={customer !== null && customer !== "" ? true : false}
                                    style={{ width: "100%" }}
                                    placeholder="เลือกชื่อ"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    onClick={() => getListCustomer(selectCompany)}
                                    options={listCustomer.map((n) => ({ value: n.CustomerId, label: n.Customer }))}
                                >

                                </Select>
                            </Form.Item>
                    }

                    <Form.Item
                        label="Product"
                        name="product"
                        rules={[{ required: true, message: 'กรุณา ระบุ Product!' }]}
                    >
                        <Select
                            showSearch
                            // disabled={selectCompany === null ? true : false}
                            style={{ width: "100%" }}
                            placeholder="ระบุ Product"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            options={product.map((n) => ({ value: n.ProductId, label: `${n.Name} - (${n.FullName})` }))}
                        >

                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Scene"
                        name="scene"
                    >
                        <Select
                            showSearch
                            defaultValue={"None"}
                            style={{ width: "100%" }}
                            placeholder="ระบุ Scene"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            options={cusScene.map((n) => ({ value: n.value, label: n.name }))}
                        >

                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="หัวข้อ"
                        name="subject"
                        rules={[
                            {
                                required: true,
                                message: "กรุณาระบุ หัวข้อ!",
                            },
                        ]}
                    >
                        <Input placeholder="หัวข้อ" />
                    </Form.Item>

                    <Form.Item
                        label="รายละเอียด"
                        name="description"

                        rules={[
                            {
                                required: true,
                                message: "กรุณาระบุ รายละเอียด!",
                            },
                        ]}
                    >
                        <Editor
                            ref={editorRef}
                            apiKey="e1qa6oigw8ldczyrv82f0q5t0lhopb5ndd6owc10cnl7eau5"
                            initialValue=""
                            init={{

                                height: 300,
                                menubar: false,
                                plugins: [
                                    'advlist autolink lists link image charmap print preview anchor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table paste code help wordcount'
                                ],
                                block_unsupported_drop: false,
                                paste_data_images: true,
                                // images_upload_handler: image_upload_handler,
                                toolbar1: 'undo redo | styleselect | bold italic underline forecolor fontsizeselect | link image',
                                toolbar2: 'alignleft aligncenter alignright alignjustify bullist numlist preview table openlink',
                            }}
                            onEditorChange={(content, editor) => setDescription(content)}

                        />
                    </Form.Item>
                    <Form.Item
                        label="วันที่"
                        name="date"
                    >
                        <DatePicker
                            disabled={true}
                            defaultValue={moment(moment(), "DD/MM/YYYY")} format="DD/MM/YYYY"
                            onChange={(date, datestring) => console.log("datestring", datestring)}
                        />
                        &nbsp;  &nbsp; &nbsp;
                        <TimePicker placeholder='StartTime' format={"HH:mm"} defaultValue={startTime} onChange={(value, time) => setStartTime(time)} /> &nbsp;
                        <TimePicker placeholder='EndTime' format={"HH:mm"} onChange={(value, time) => setEndTime(time)} />

                    </Form.Item>
                </Form>
                <Row>
                    <Col span={24}>
                        <Button
                            loading={loading}
                            style={{ width: 100 }}
                            type="primary"
                            htmlType="submit"
                            size="middle"
                            onClick={() => form.submit()}
                        >
                            บันทึก
                        </Button>
                    </Col>
                </Row>
            </Spin >

        </MasterPage >
    )
}