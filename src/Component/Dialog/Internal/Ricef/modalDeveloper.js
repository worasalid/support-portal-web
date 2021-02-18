import React, { useState, useRef } from 'react';
import { Modal, Form } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { useHistory,useRouteMatch } from "react-router-dom";
import UploadFile from '../../../UploadFile'
import Axios from 'axios';
import TextArea from 'antd/lib/input/TextArea';

export default function ModalDeveloper({ visible = false, onOk, onCancel, details, ...props }) {
    const match = useRouteMatch();
    const history = useHistory();
    const uploadRef = useRef(null);
    const uploadRef_unittest = useRef(null);
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
                    url: process.env.REACT_APP_API_URL + "/ricef/create-comment",
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                    },
                    data: {
                        ricefid: match.params.ricefid,
                        comment_text: textValue,
                        files: uploadRef.current.getFiles().map((n) => n.response.id),
                    }
                });
            }
        } catch (error) {

        }
    }

    const SaveUnitTest = async (values) => {
        const unittest = await Axios({
            url: process.env.REACT_APP_API_URL + "/ricef/save-document",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                ricefid: details.ricefid,
                files: uploadRef_unittest.current.getFiles().map((n) => n.response.id),
                reftype: "Master_Ricef",
                grouptype: "unittest"
            }
        })
    }

    const SendFlow = async (values) => {
        try {
            const sendflow = await Axios({
                url: process.env.REACT_APP_API_URL + "/ricef/send-task",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ricefid: details.ricefid,
                    status: details.flowstatus
                }
            });

            if (sendflow.status === 200) {
                SaveComment();
                SaveUnitTest(values);
                onOk();

                await Modal.info({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>แก้ไขงานเสร็จ ส่งงานให้ Consult ตรวจสอบ</p>
                        </div>
                    ),
                    onOk() {
                        editorRef.current.editor.setContent("");
                        history.goBack();
                    },
                });
            }
        } catch (error) {
            await Modal.info({
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.response.data}</p>
                    </div>
                ),
                onOk() {
                    editorRef.current.editor.setContent("")
                    onOk();

                },
            });
        }
    }


    const onFinish = (values) => {
        console.log('Success:', values);
        SendFlow(values);
    
    };

    return (
        <Modal
            visible={visible}
            onOk={() => { return (form.submit()) }}
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            okText="Send"
            okType="dashed"
            onCancel={() => { return (form.resetFields(), onCancel()) }}

            {...props}

        >
            <Form form={form} style={{ padding: 0, maxWidth: "100%", backgroundColor: "white" }}
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    label="URL"
                    name="urltest"
                    rules={[
                        {
                            required: false,
                            message: 'กรุณาใส่ Url ที่ใช้ test ',
                        },
                    ]}
                >
                    <TextArea rows="2" style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    style={{ minWidth: 300, maxWidth: 300 }}
                    label="Unit Test"
                    name="unittest"
                    rules={[
                        {
                            required: false,
                            message: 'Please input your UnitTest!',
                        },
                    ]}
                >
                    <UploadFile ref={uploadRef_unittest} />
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
            <br />
                     AttachFile : <UploadFile ref={uploadRef} />
        </Modal>
    )
}
