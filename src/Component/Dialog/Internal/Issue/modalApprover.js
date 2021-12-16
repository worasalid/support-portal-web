import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Modal, Row, Col, Select, Form } from 'antd';
import UploadFile from '../../../UploadFile'
import axios from 'axios';
import TextEditor from '../../../TextEditor';

export default function ModalApprover({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const uploadRef = useRef(null);
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [approver, setApprover] = useState([]);
    const [selectApprover, setSelectApprover] = useState(null);
    const [form] = Form.useForm();

    const getApprover = async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/master/organize/user`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                organize_id: 10
            }
        }).then((res) => {
            setApprover(res.data);

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
                        comment_text: editorRef.current.getValue(),
                        approverId: param.approver
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
            getApprover();
            console.log("ff",details)
        }
    }, [visible])

    return (
        <>
            <Modal
                visible={visible}
                confirmLoading={loading}
                okText="Send"
                onOk={() => (details?.flowoutput?.NodeName === "approver" ? sendFlow(0) : form.submit())}
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
                        <Form form={form} hidden={details.flowoutput.NodeName === "approver" ? true : false}
                            name="control-hooks" layout="vertical" onFinish={onFinish} >
                            <Form.Item name="approver" label="ผู้อนุมัติ" rules={[{ required: true, message: 'กรุณาเลือกผู้อนุมัติ' }]}>
                                <Select style={{ width: '100%' }} placeholder="None"
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                    onChange={(value, item) => setSelectApprover(item.value)}
                                    options={
                                        approver?.map((item) => ({
                                            value: item.UserId,
                                            label: item.DisplayName
                                        }))
                                    }
                                >
                                </Select>
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