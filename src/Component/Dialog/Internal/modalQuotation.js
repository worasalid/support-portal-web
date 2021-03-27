import React, { useState, useRef } from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { Modal, Form, Spin, Tabs } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import UploadFile from '../../UploadFile'
import Axios from 'axios';

const { TabPane } = Tabs;


export default function ModalQuotation({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const uploadRef = useRef(null);
    const upload_quotation = useRef(null);
    const [form] = Form.useForm();
    const [textValue, setTextValue] = useState("");
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(false);

    //data

    const handleEditorChange = (content, editor) => {
        setTextValue(content);
    }
    const SaveQuotation = async (values) => {
        const quotation = await Axios({
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
        })
    }

    const SaveComment = async () => {
        try {
            if (textValue !== "") {
                const comment = await Axios({
                    url: process.env.REACT_APP_API_URL + "/tickets/create_comment",
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                    },
                    data: {
                        ticketid: details && details.ticketid,
                        taskid: details.taskid,
                        comment_text: textValue,
                        comment_type: "internal",
                        files: uploadRef.current.getFiles().map((n) => n.response.id),
                    }
                });
            }
        } catch (error) {

        }
    }

    const SendFlow = async (values) => {
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
                        comment_text: textValue
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
                        editorRef.current.editor.setContent("");
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
                    editorRef.current.editor.setContent("");
                    onOk();
                },
            });
        }
    }

    const onFinish = (values) => {
        setLoading(true);
        SendFlow(values);

    };


    return (
        <Modal
            visible={visible}
            confirmLoading={loading}
            onOk={() => { return (form.submit()) }}
            okText="Send"
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            okType="dashed"
            onCancel={() => { return (form.resetFields(), onCancel()) }}
            {...props}
        >
            <Spin spinning={loading} size="large" tip="Loading...">
                <Form form={form} style={{ padding: 0, maxWidth: "100%", backgroundColor: "white", marginTop: 0 }}
                    name="form-quotation"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
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
                </Form>
                 Remark :
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
            </Spin>
        </Modal>
    )
}
