import React, { useState, useRef, useEffect, useContext } from 'react';
import { Modal, DatePicker, Row, Col, Form, Button, Input } from 'antd';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import IssueContext from '../../../utility/issueContext';


export default function ModalDueDate({ visible = false, onOk, onCancel, details, ...props }) {
    const [formRef, setFormRef] = useState(null);
    const [form] = Form.useForm();
    const textAreaRef = useRef(null);
    const [duedate, setDuedate] = useState(null);
    const { state: userstate, dispatch: userdispatch } = useContext(IssueContext);

    const onFinish = async (values) => {
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/save_duedate",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketId: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
                    ticket_number: userstate.issuedata.details[0] && userstate.issuedata.details[0].Number,
                    duedate: duedate,
                    description: values.description
                }
            });
            if (result.status === 200) {
                await Modal.info({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>กำหนด Due Date วันที่ {duedate} </p>
                        </div>
                    ),
                    onOk() {
                        onOk();
                        formRef.resetFields();
                    },
                });
            }
        } catch (error) {

        }

    };
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);

    };

    useEffect(() => {

    }, [])

    useEffect(() => {
        console.log(formRef)
        if (textAreaRef.current) {
            textAreaRef.current.focus();

        }
    }, [visible, textAreaRef.current])

    return (
        <Modal
            visible={visible}
            onOk={() => { return (form.submit()) }}
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            onCancel={() => { return (form.resetFields(), onCancel()) }}
            {...props}
        >

            <Form ref={setFormRef} form={form} style={{ padding: 0, width: "100%", backgroundColor: "white" }}
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
                            <DatePicker format="DD/MM/YYYY" onChange={(date,datestring) => { form.setFieldsValue({ duedate: datestring }); setDuedate(datestring) }} /><br />
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
                                    required: true,
                                    message: 'กรุณาระบุ รายละเอียดในการเปลี่ยน DueDate',
                                },
                            ]}
                        >
                            <Input.TextArea rows={5} ref={textAreaRef} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal >
    )
}
