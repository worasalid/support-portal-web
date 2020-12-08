import React, { useState, useRef, useEffect } from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { Button, Modal, Form, Table, Tabs, Row, Col, Upload } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import Column from 'antd/lib/table/Column';

const { TabPane } = Tabs;

export default function ModalResolved({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const uploadRef = useRef(null);
    const uploadRef_testresult = useRef(null);
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
                        ticketId: details && details.ticketId,
                        comment_text: textValue,
                        comment_type: "internal",
                        files: uploadRef.current.getFiles().map((n) => n.response.id),
                    }
                });
            }
        } catch (error) {

        }
    }

    const SaveTestResult = async () => {
        try {
            const comment = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/save-document",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketid: details && details.ticketid,
                    files: uploadRef_testresult.current.getFiles().map((n) => n.response.id),
                    reftype: "Master_Ticket",
                    grouptype: "testResult"
                }
            });
        } catch (error) {

        }
    }

    const SendFlow = async () => {
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
                    flowoutputid: details.flowoutputid
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
                        onOk();
                        history.push({ pathname: "/internal/issue/resolved" })
                    },
                });
            }
        } catch (error) {

        }
    }

  
    const onFinish = (values) => {
        console.log('onFinish:', values);
        // SaveComment();
        SaveTestResult();
        SendFlow();
        onOk();
    };

    useEffect(() => {
        if (visible) {
        }

    }, [visible])

    console.log("detail",details)

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
                layout="vertical"
                name="form-resolved"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
            >

                <Form.Item
                    style={{ minWidth: 300, maxWidth: 800 }}
                    // valuePropName="fileList"
                    // getValueFromEvent={uploadRef_testresult.current}
                    label="Test Result (ใบส่งมอบงาน)"
                    name="uploadresult"
                    rules={[
                        {
                            required: false,
                            message: 'กรุณาแนบ (ใบส่งมอบงาน)'
                        },
                    ]}
                >
                    <UploadFile ref={uploadRef_testresult} />

                </Form.Item>
            </Form>



          
            <label className="header-text">Remark</label>
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
