import React, { useState, useRef, useEffect } from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { Button, Modal, Form, Table, Tabs } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import { DownloadOutlined } from '@ant-design/icons';
import Column from 'antd/lib/table/Column';

const { TabPane } = Tabs;

export default function ModalLeaderQC({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const uploadRef = useRef(null);
    const [form] = Form.useForm();
    const [textValue, setTextValue] = useState("");
    const editorRef = useRef(null)

    const [listunittest, setListunittest] = useState([]);
    const [listfiledeploy, setFiledeploy] = useState([]);
    const [listdocument, setDocument] = useState([]);


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

    const SendFlow = async () => {
        try {
            const sendflow = await Axios({
                url: process.env.REACT_APP_API_URL + "/workflow/send",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    taskid: details.taskid,
                    mailboxid: details.mailboxid,
                    flowoutputid: details.flowoutputid,
                    value: {
                        comment_text: textValue
                    }
                  
                }
            });

            if (sendflow.status === 200) {
                SaveComment();
                await Modal.info({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>บันทึกข้อมูลสำเร็จ</p>
                        </div>
                    ),
                    onOk() {
                        editorRef.current.editor.setContent("")
                        onOk();
                        history.push({ pathname: "/internal/issue/inprogress" })
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
                    history.push({ pathname: "/internal/issue/inprogress" })
                },
            });
        }
    }

    const onFinish = (values) => {
        console.log('Success:', values);
        SendFlow();
    };


    return (
        <Modal
            visible={visible}
            okText="Send"
            onOk={() => { return (form.submit()) }}
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            okType="dashed"
            onCancel={() => { return (form.resetFields(), onCancel()) }}
            {...props}
        >
  
            <Form form={form} style={{ padding: 0, maxWidth: "100%", backgroundColor: "white" }}
                name="qa-test"
                layout="vertical"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    // style={{ minWidth: 300, maxWidth: 300 }}
                    name="remark"
                    label="Remark :"
                    rules={[
                        {
                            required: false,
                            message: 'Please input your UnitTest!',
                        },
                    ]}
                >
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
                </Form.Item>
            </Form>

        </Modal>
    )
}
