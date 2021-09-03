import React, { useState, useRef } from 'react';
import { useHistory } from "react-router-dom";
import { Modal, Form, Spin } from 'antd';
import TextEditor from '../../TextEditor';
import UploadFile from '../../UploadFile'
import Axios from 'axios';

export default function ModalPO({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const uploadRef = useRef(null);
    const upload_PO = useRef(null);
    const [form] = Form.useForm();
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const SavePO = async (values) => {
        try {
            await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/save-document",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketid: details && details.ticketid,
                    taskid: details.taskid,
                    files: upload_PO.current.getFiles().map((n) => n.response),
                    reftype: "Master_Ticket",
                    grouptype: "PO_Document"
                }
            });

        } catch (error) {

        }

    }

    const SaveComment = async () => {
        try {
            if (editorRef.current.getValue() !== "" && editorRef.current.getValue() !== null && editorRef.current.getValue() !== undefined) {
                const comment = await Axios({
                    url: process.env.REACT_APP_API_URL + "/tickets/create_comment",
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                    },
                    data: {
                        ticketid: details && details.ticketid,
                        taskid: details.taskid,
                        comment_text: editorRef.current.getValue(),
                        comment_type: "customer",
                        files: uploadRef.current.getFiles().map((n) => n.response.id),
                    }
                });
            }
        } catch (error) {

        }
    }

    const SendFlow = async (values) => {
        setLoading(true);
        try {
            const sendflow = await Axios({
                url: process.env.REACT_APP_API_URL + "/workflow/customer-send",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketid: details.ticketid,
                    mailboxid: details && details.mailboxid,
                    flowoutputid: details.flowoutputid,
                    value: {
                        comment_text: editorRef.current.getValue()
                    }
                }
            });

            if (sendflow.status === 200) {
                SaveComment();
                SavePO();
                setLoading(false);
                onCancel();

                Modal.success({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>ส่งใบ PO</p>
                        </div>
                    ),
                    okText: "Close",
                    onOk() {
                        editorRef.current.setvalue();
                        history.push({ pathname: "/customer/issue/inprogress" });
                        window.location.reload(true);
                    },
                });
            }
        } catch (error) {
            setLoading(false);
            await Modal.error({
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.message}</p>
                        <p>{error.response.data}</p>
                    </div>
                ),
                okText: "Close",
                onOk() {
                    editorRef.current.setvalue();
                    window.location.reload(true);
                },
            });
        }
    }

    const onFinish = (values) => {
        SendFlow(values);
    };


    return (
        <Modal
            visible={visible}
            confirmLoading={loading}
            onOk={() => form.submit()}
            okText="Send"
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            okType="dashed"
            onCancel={() => { form.resetFields(); onCancel() }}
            {...props}
        >

            <Spin spinning={loading}>
                <Form form={form} style={{ padding: 0, maxWidth: "100%", backgroundColor: "white", marginTop: 0 }}
                    name="form-po"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >

                    <Form.Item
                        style={{ minWidth: 300, maxWidth: 300 }}
                        label="เอกสาร PO"
                        name="po"
                        rules={[
                            {
                                required: false,
                                message: 'กรุณาแนบเอกสาร PO',
                            },
                        ]}
                    >
                        <UploadFile ref={upload_PO} />
                    </Form.Item>
                </Form>
                Remark :
                <TextEditor ref={editorRef} />
                <br />
                AttachFile : <UploadFile ref={uploadRef} />
            </Spin>
        </Modal>
    )
}
