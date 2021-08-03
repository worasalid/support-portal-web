import React, { useState, useRef, useEffect, useContext } from 'react';
import { Modal, DatePicker, Row, Col, Form, Input, Spin } from 'antd';
import UploadFile from '../../../UploadFile'
import Axios from 'axios';
import TextEditor from '../../../TextEditor';
import IssueContext from '../../../../utility/issueContext';


export default function ModalSaveDueDate({ visible = false, onOk, onCancel, details, ...props }) {
    const { state: userstate, dispatch: userdispatch } = useContext(IssueContext);
    const uploadRef = useRef(null);
    const [form] = Form.useForm();
    const [textValue, setTextValue] = useState("");
    const textAreaRef = useRef(null);
    const [duedate, setDuedate] = useState(null);
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(false);


    const SaveComment = async () => {
        try {
            if (editorRef.current.getValue() !== "" && editorRef.current.getValue() !== null && editorRef.current.getValue() !== undefined) {
                const comment = await Axios({
                    url: process.env.REACT_APP_API_URL + "/workflow/create_comment",
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                    },
                    data: {
                        ticketid: details && details.ticketid,
                        comment_text: editorRef.current.getValue(),
                        comment_type: details.node_name === "cr_center" ? "internal" : "customer",
                        files: uploadRef.current.getFiles().map((n) => n.response),
                    }
                });
            }
        } catch (error) {

        }
    }

    const SaveDueDate = async (values) => {
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/save-duedate",
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketid: details && details.ticketid,
                    duedate: values.duedate,
                    type: details.type
                }
            });

            if (result.status === 200) {
                setLoading(false);
                onOk();
                await Modal.success({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>กำหนด Due Date วันที่ {duedate} </p>
                        </div>
                    ),
                    okText: "Close",
                    onOk() {
                        form.resetFields();
                        window.location.reload(false)

                    },
                });
            }
        } catch (error) {
            setLoading(false);
            await Modal.error({
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                content: (
                    <div>
                        <p> {error.response.data}</p>
                    </div>
                ),
                okText: "Close",
                onOk() {
                    form.resetFields();
                    // window.location.reload(false)

                },
            });
        }
    }

    const onFinish = async (values) => {
        setLoading(true);
        SaveDueDate(values);
        SaveComment();
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);

    };

    useEffect(() => {
        if (visible) {
            console.log(details.node_name)
        }
    }, [visible])

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
                                    onChange={(date, datestring) => { form.setFieldsValue({ duedate: datestring }); setDuedate(datestring) }} /><br />
                            </Form.Item>
                        </Col>
                    </Row>


                    <Row>
                        <Col span={24}>
                            <label className="header-text">Remark</label>
                            <TextEditor ref={editorRef} ticket_id={details.ticketid} />
                            <br />
                            AttachFile : <UploadFile ref={uploadRef} />
                        </Col>
                    </Row>
                </Form>
            </Spin>
        </Modal >
    )
}
