import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import UploadFile from '../../UploadFile'
import Axios from 'axios';

export default function ModalDeveloper({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const uploadRef_unittest = useRef(null);
    const uploadRef_filedeploy = useRef(null);
    const uploadRef_document = useRef(null);
    const [form] = Form.useForm();
    const [textValue, setTextValue] = useState("");
    const editorRef = useRef(null)

    const handleEditorChange = (content, editor) => {
        setTextValue(content);
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
                        ticketId: details && details.ticketId,
                        comment_text: textValue,
                        comment_type: "internal",
                        //files: uploadRef.current.getFiles().map((n) => n.response.id),
                    }
                });


            }
        } catch (error) {

        }
    }

    const SendFlow = async () => {
        try {
            const sendflow = await Axios({
                url: process.env.REACT_APP_API_URL + "/workflow/send",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    mailbox_id: details && details.mailboxId,
                    node_output_id: details && details.node_output_id,
                    to_node_id: details && details.to_node_id,
                    node_action_id: details && details.to_node_action_id,
                    product_id: details && details.productId,
                    module_id: details && details.moduleId,
                    flowstatus: details.flowstatus
                }
            });

            if (sendflow.status === 200) {
                await Modal.info({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>บันทึกข้อมูลสำเร็จ</p>
                        </div>
                    ),
                    onOk() {
                        editorRef.current.editor.setContent("")
                        onOk()
                    },
                });
            }
        } catch (error) {

        }
    }

    const SaveUnitTest = async () => {
        const unittest = await Axios({
            url: process.env.REACT_APP_API_URL + "/workflow/save_unittest",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                ticketId: details && details.ticketId,
                files: uploadRef_unittest.current.getFiles().map((n) => n.response.id),
            }
        })
    }

    const SaveFileDeploy = async () => {
        const filedeploy = await Axios({
            url: process.env.REACT_APP_API_URL + "/workflow/save_filedeploy",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                ticketId: details && details.ticketId,
                files: uploadRef_filedeploy.current.getFiles().map((n) => n.response.id),
            }
        })
    }

    const SaveDeployDocument = async () => {
        const document = await Axios({
            url: process.env.REACT_APP_API_URL + "/workflow/save_deploydocument",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                ticketId: details && details.ticketId,
                files: uploadRef_document.current.getFiles().map((n) => n.response.id),
            }
        })
    }

    const onFinish = (values) => {
        console.log('Success:', values);
        SaveUnitTest();
        SaveFileDeploy();
        SaveDeployDocument();
        SaveComment();
        SendFlow();
        onOk();
    };


    return (
        <Modal
            visible={visible}
            onOk={() => { return (form.submit()) }}
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            okText= "Send"
            okType="dashed"
            onCancel={() => { return (form.resetFields(), onCancel()) }}

            {...props}

        >
            <Form form={form} style={{ padding: 0, maxWidth: 450, backgroundColor: "white" }}
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                Unit Test: <UploadFile ref={uploadRef_unittest}/>
                <Form.Item
                    style={{ minWidth: 300, maxWidth: 300 }}
                    name="unittest"
                    rules={[
                        {
                            required: false,
                            message: 'Please input your UnitTest!',
                        },
                    ]}
                >

                </Form.Item>

                File Deploy: <UploadFile ref={uploadRef_filedeploy}/>
                <Form.Item
                    style={{ minWidth: 300, maxWidth: 300 }}
                    name="filedeploy"
                    rules={[
                        {
                            required: false,
                            message: 'Please input your UnitTest!',
                        },
                    ]}
                >

                </Form.Item>

                Deploy Document: <UploadFile ref={uploadRef_document}/>
                <Form.Item
                    style={{ minWidth: 300, maxWidth: 300 }}
                    name="document"
                    rules={[
                        {
                            required: false,
                            message: 'Please input your UnitTest!',
                        },
                    ]}
                >

                </Form.Item>
            </Form>
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
        </Modal>
    )
}
