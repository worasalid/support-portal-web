import React, { useEffect, useState, useRef } from "react";
import { Modal, Spin, Form, Row, Col, Input, DatePicker } from "antd";
import moment from "moment";
import axios from "axios";

export default function ModalChangeDueDateDev({ visible = false, onOk, onCancel, details, ...props }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [duedate, setDuedate] = useState(null);
    const textAreaRef = useRef(null);

    const changeDueDate = async (params) => {
        setLoading(true);
        await axios({
            url: `${process.env.REACT_APP_API_URL}/tickets/task-duedate`,
            method: "PATCH",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                task_id: details.task_id,
                duedate: params.duedate,
                description: params.description
            }
        }).then((res) => {
            setLoading(false);
            onOk();

            Modal.success({
                title: 'บันทึกข้อมูลสำเร็จ',
                content: (
                    <div>
                        <p>กำหนด Due Date วันที่ {duedate} </p>
                    </div>
                ),
                okText: "Close",
                onOk() {
                    window.location.reload(false)
                },
            });

        }).catch((error) => {
            setLoading(false);
        })
    }

    const onFinish = (value) => {
        console.log("value", value)
        console.log("duedate", value.duedate)
        changeDueDate(value);
    }

    useEffect(() => {
        if (visible) {
            console.log("details", details)
        }

    }, [visible])

    return (
        <Modal
            title="กำหนด DueDate"
            visible={visible}
            okText="Save"
            onOk={() => form.submit()}
            onCancel={() => { onCancel(); form.resetFields() }}
        >
            <Spin spinning={loading}>
                <Form form={form} style={{ padding: 0, width: "100%", backgroundColor: "white" }}
                    name="logDueDate"
                    className="login-form"
                    onFinish={onFinish}
                >
                    <Row>
                        <Col span={24}>
                            <label className="header-text">กำหนด DueDate :</label><br />
                            <Form.Item
                                name="duedate"
                                rules={[
                                    {
                                        required: true,
                                        message: 'กรุณาระบุ หรือ เปลียน DueDate',

                                    },
                                ]}
                            >
                                <DatePicker format="DD/MM/YYYY HH:mm" showTime
                                    defaultValue={details.duedate === null ? null : moment(moment(details.duedate).format("DD/MM/YYYY HH:mm"), "DD/MM/YYYY HH:mm")}
                                    //disabledDate={(current) => current < moment(moment(details.duedate).format("DD/MM/YYYY HH:mm"), "DD/MM/YYYY HH:mm")}
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


                </Form>
            </Spin>
        </Modal>
    )
}