import React, { useState, useRef, useEffect } from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { Modal, Form, Input, Select, Table, Button, Tabs } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import Column from 'antd/lib/table/Column';
import { DownloadOutlined } from '@ant-design/icons';
import TextArea from 'antd/lib/input/TextArea';

const { TabPane } = Tabs;


export default function ModalQA({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const uploadRef = useRef(null);
    const uploadRef_unittest = useRef(null);
    const [form] = Form.useForm();
    const [textValue, setTextValue] = useState("");
    const editorRef = useRef(null)

    //data
    const [listunittest, setListunittest] = useState([]);
    const [listfiledeploy, setFiledeploy] = useState([]);
    const [listdocument, setDocument] = useState([]);
    const [historyvalue, setHistoryvalue] = useState(null);

    const handleEditorChange = (content, editor) => {
        setTextValue(content);
    }
    const SaveUnitTest = async (values) => {
        const unittest = await Axios({
            url: process.env.REACT_APP_API_URL + "/workflow/save_unittest",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                ticketId: details && details.ticketid,
                taskid: details.taskid,
                files: uploadRef_unittest.current.getFiles().map((n) => n.response.id),
                url: values.linkurl,
                grouptype: "test_result_QA"
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
                        editorRef.current.editor.setContent("");
                        onOk();
                        history.push({ pathname: "/internal/issue/inprogress" })
                    },
                });
            }
        } catch (error) {

        }
    }

    const onFinish = (values) => {
        console.log('Success:', values);
        SaveUnitTest(values);
        SaveComment();
        SendFlow();
        onOk();
    };

  
    return (
        <Modal
            visible={visible}
            onOk={() => { return (form.submit()) }}
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            okType="dashed"
            onCancel={() => { return (form.resetFields(), onCancel()) }}
            {...props}
        >

            <Form form={form} style={{ padding: 0, maxWidth: "100%", backgroundColor: "white" ,marginTop: 40 }}
                name="qa-test"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    // style={{ minWidth: 300, maxWidth: 300 }}
                    name="linkurl"
                    label= "URL"
                    rules={[
                        {
                            required: false,
                            message: 'Please input your UnitTest!',
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
                            required: true,
                            message: 'Please input your UnitTest!',
                        },
                    ]}
                >
                    <UploadFile ref={uploadRef_unittest} />
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

        </Modal>
    )
}
