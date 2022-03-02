import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Modal, Row, Col, Radio, Form, Input } from 'antd';
import UploadFile from '../../../UploadFile'
import axios from 'axios';
import TextEditor from '../../../TextEditor';

export default function ModalApprover({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const uploadRef = useRef(null);
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [form] = Form.useForm();

    const getData = async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/workflow/request-approve`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                ticketId: details.ticketid
            }
        }).then((res) => {
            setData(res.data)

        }).catch((error) => {
            console.log("error", error.response.data)
        })
    }

    const sendFlow = async (param) => {
        setLoading(true);
        try {
            const result = await axios({
                url: process.env.REACT_APP_API_URL + "/workflow/send-issue",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketid: details.ticketid,
                    mailboxid: details && details.mailboxid,
                    flowoutputid: details.flowoutput.FlowOutputId,
                    value: {
                        description: param.description,
                        approve_result: param.approve_result,
                        approve_reason: param.approve_reason,
                        comment_text: editorRef.current.getValue(),
                    }
                }
            });

            if (result.status === 200) {

                if (editorRef.current.getValue() !== "" && editorRef.current.getValue() !== null && editorRef.current.getValue() !== undefined) {
                    await axios({
                        url: process.env.REACT_APP_API_URL + "/workflow/create_comment",
                        method: "POST",
                        headers: {
                            "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                        },
                        data: {
                            ticketid: details && details.ticketid,
                            taskid: details.taskid,
                            comment_text: editorRef.current.getValue(),
                            comment_type: "internal_cr",
                            files: uploadRef.current.getFiles().map((n) => n.response),
                        }
                    });
                }

                onOk();
                setLoading(false);
                await Modal.success({
                    title: 'บันทึกข้อมูล สำเร็จ',
                    content: (
                        <>
                        </>
                    ),
                    okText: "Close",
                    onOk() {
                        setLoading(false);
                        editorRef.current.setvalue();
                        history.push({ pathname: "/internal/issue/inprogress" });
                        window.location.reload(true);
                    }
                })
            }


        } catch (error) {
            setLoading(false);
            await Modal.error({
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.response.data}</p>
                    </div>
                ),
                okText: "Close",
                onOk() {
                    editorRef.current.setvalue();
                },
            });
        }

    }

    const onFinish = async (value) => {
        sendFlow(value);
    }

    useEffect(() => {
        if (visible) {
            getData();
        }
    }, [visible])

    return (
        <>
            <Modal
                visible={visible}
                confirmLoading={loading}
                okText="Send"
                onOk={() => form.submit()}
                okButtonProps={{ type: "primary", htmlType: "submit" }}
                okType="dashed"
                onCancel={() => {
                    form.resetFields();
                    onCancel();
                }}
                {...props}
            >
                <Row>
                    <Col span={24}>
                        <label className='header-text' >จำนวน Manday ที่ประเมิน</label> : {`(${details.manday} Manday)`}
                    </Col>
                </Row>
                <br />

                <Row>
                    <Col span={2}>
                        <b><label>ประเภท :</label></b>
                    </Col>
                    <Col span={22}>
                        <label>{data?.approve_type === 1 ? "ขอฟรี" : "ขอลดราคา"}</label>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col span={24}>
                        <b><label>เหตุผลในการขอ ขอนุมัติ :</label></b>
                    </Col>
                    <Col span={24}>
                        <Input.TextArea disabled rows={5} value={data?.description} />
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col span={24}>
                        <Form form={form}
                            name="control-hooks" layout="vertical" onFinish={onFinish} >
                            <Form.Item name="approve_result" rules={[{ required: true, message: 'กรุณาระบุ ผลอนุมัติ' }]}>
                                <Radio.Group>
                                    <Radio value={1}>อนุมัติ</Radio>
                                    <Radio value={0}>ไม่อนุมัติ</Radio>
                                </Radio.Group>
                            </Form.Item>

                            <Form.Item name="approve_reason" label={<b><label>รายละเอียด การอนุมัติ :</label></b>}
                                rules={[{ required: true, message: 'กรุณาระบุ รายละเอียด' }]}>
                                <Input.TextArea rows={5} />
                            </Form.Item>


                        </Form>
                    </Col>
                </Row>
                <Row style={{ marginTop: 0 }}>
                    <Col span={24}>
                        <b><label>Remark :</label></b>
                    </Col>
                    <Col span={24} style={{ marginTop: 10 }}>
                        <TextEditor ref={editorRef} ticket_id={details.ticketid} />
                        <br />
                        AttachFile : <UploadFile ref={uploadRef} />
                    </Col>
                </Row>
            </Modal>
        </>
    )
}