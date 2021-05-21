import React, { useState, useRef } from 'react';
import { useHistory } from "react-router-dom";
import { Modal, Form, Spin, Tabs } from 'antd';
// import { Editor } from '@tinymce/tinymce-react';
import TextEditor from '../../TextEditor';
import UploadFile from '../../UploadFile'
import Axios from 'axios';

//const { TabPane } = Tabs;


export default function ModalQuotation({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const uploadRef = useRef(null);
    const upload_quotation = useRef(null);
    const [form] = Form.useForm();
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(false);

    //data

    const SaveQuotation = async (values) => {
        await Axios({
            url: process.env.REACT_APP_API_URL + "/tickets/save-document",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                ticketid: details && details.ticketid,
                taskid: details.taskid,
                files: upload_quotation.current.getFiles().map((n) => n.response.id),
                reftype: "Master_Ticket",
                grouptype: "quotation"
            }
        });
    }

    const SaveComment = async () => {
        try {
            if (editorRef.current.getValue() !== "" && editorRef.current.getValue() !== null && editorRef.current.getValue() !== undefined) {
                await Axios({
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
                    }
                }
            });

            if (sendflow.status === 200) {
                SaveComment();
                SaveQuotation();
                onOk();
                setLoading(false);

                await Modal.success({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>ส่งใบเสนอราคา</p>
                        </div>
                    ),
                    okText: "Close",
                    onOk() {
                        editorRef.current.setvalue("");
                        history.push({ pathname: "/internal/issue/inprogress" })
                    },
                });
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
                    editorRef.current.setvalue("");
                    onOk();
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
            <Spin spinning={loading} size="large" tip="Loading...">
                <Form form={form} style={{ padding: 0, maxWidth: "100%", backgroundColor: "white", marginTop: 0 }}
                    name="form-quotation"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    layout="vertical"
                    onFinish={onFinish}
                >


                    <Form.Item
                        style={{ minWidth: 300, maxWidth: 300 }}
                        label="ใบเสนอราคา"
                        name="quotation"
                        rules={[
                            {
                                required: false,
                                message: 'กรุณาระบุ ใบเสนอราคา',
                            },
                        ]}
                    >
                        <UploadFile ref={upload_quotation} />
                    </Form.Item>
                    <Form.Item
                        // style={{ minWidth: 300, maxWidth: 300 }}
                        name="remark"
                        label="Remark :"

                    >
                        <TextEditor ref={editorRef} />
                        <br />
                     AttachFile : <UploadFile ref={uploadRef} />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    )
}
