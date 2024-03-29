import React, { useState, useRef, useEffect, useContext } from 'react';
import { Modal, DatePicker, Row, Col, Form, Input, Spin } from 'antd';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';
import IssueContext from '../../../utility/issueContext';
import moment from 'moment';


export default function ModalChangeDueDate({ visible = false, onOk, onCancel, details, ...props }) {
    const { state: userstate, dispatch: userdispatch } = useContext(IssueContext);
    const uploadRef = useRef(null);
    const [form] = Form.useForm();
    const [textValue, setTextValue] = useState("");
    const textAreaRef = useRef(null);
    const [duedate, setDuedate] = useState(null);
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const handleEditorChange = (content, editor) => {
        setTextValue(content);
    }

    const SaveComment = async () => {
        try {
            if ((textValue !== null) || (textValue === null && uploadRef.current.getFiles().length > 0)) {
                await Axios({
                    url: process.env.REACT_APP_API_URL + "/tickets/create_comment",
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                    },
                    data: {
                        ticketid: details && details.ticketid,
                        comment_text: textValue,
                        comment_type: "customer",
                        files: uploadRef.current.getFiles().map((n) => n.response.id),
                    }
                });
            }
        } catch (error) {

        }
    }

    const SaveDueDate = async (values) => {
        setLoading(true);
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/update-duedate",
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketid: details && details.ticketid,
                    duedate: values.duedate,
                    description: values.description
                }
            });

            if (result.status === 200) {
                setLoading(false);
                SaveComment();
                onCancel();
                await Modal.success({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>กำหนด Due Date วันที่ {duedate} </p>
                        </div>
                    ),
                    okText: "Close",
                    onOk() {
                        onCancel();
                        form.resetFields();
                    },
                });
            }
        } catch (error) {
            setLoading(false);
            onCancel();
            await Modal.error({
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                content: (
                    <div>
                        {error.response.data}
                    </div>
                ),
                okText: "Close",
                onOk() {
                    onCancel();
                    form.resetFields();
                },
            });
        }
    }

    const onFinish = async (values) => {
        SaveDueDate(values);
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);

    };

    useEffect(() => {

    }, [])

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.focus();
        }
    }, [visible, textAreaRef.current])

    return (
        <Modal
            visible={visible}
            confirmLoading={loading}
            okText="Save"
            onOk={() => { return (form.submit()) }}
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            onCancel={() => { return (form.resetFields(), onCancel()) }}
            {...props}
        >

            <Spin spinning={loading}>
                <Form form={form} style={{ padding: 0, width: "100%", backgroundColor: "white" }}
                    name="logDueDate"
                    className="login-form"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Row>
                        <Col span={24}>
                            <label className="header-text">กำหนด DueDate :</label><br />
                            <Form.Item
                                name="duedate"
                                rules={[
                                    {
                                        required: true,
                                        message: 'กรุณาระบุ DueDate',

                                    },
                                ]}
                            >
                                <DatePicker format="DD/MM/YYYY HH:mm" showTime

                                    // defaultValue={moment("02/04/2021 13:23", "DD/MM/YYYY HH:mm")}
                                    defaultValue={moment(moment(details.duedate).format("DD/MM/YYYY HH:mm"), "DD/MM/YYYY HH:mm")}
                                    disabledDate={(current) => current < moment(moment(details.duedate).format("DD/MM/YYYY HH:mm"), "DD/MM/YYYY HH:mm")}
                                    onChange={(date, datestring) => { form.setFieldsValue({ duedate: datestring }); setDuedate(datestring) }} /><br />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: 30 }}>
                        <Col span={24}>
                            <label className="header-text">รายละเอียด :</label><br />
                            <Form.Item
                                name="description"
                                rules={[
                                    {
                                        required: false,
                                        message: 'กรุณาระบุ รายละเอียดในการเปลี่ยน DueDate',
                                    },
                                ]}
                            >
                                <Input.TextArea rows={5} ref={textAreaRef} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={24}>
                            <label className="header-text">Remark</label>
                            <Editor
                                apiKey="e1qa6oigw8ldczyrv82f0q5t0lhopb5ndd6owc10cnl7eau5"
                                ref={editorRef}
                                initialValue=""
                                init={{
                                    height: 300,
                                    menubar: false,
                                    plugins: [
                                        'advlist autolink lists link image charmap print preview anchor',
                                        'searchreplace visualblocks code fullscreen',
                                        'insertdatetime media table paste code help wordcount'
                                    ],
                                    toolbar1: 'undo redo | styleselect | bold italic underline forecolor fontsizeselect | link image',
                                    toolbar2: 'alignleft aligncenter alignright alignjustify bullist numlist preview table openlink',
                                }}
                                onEditorChange={handleEditorChange}
                            />
                            <br />
                            AttachFile : <UploadFile ref={uploadRef} />
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </Modal >
    )
}
