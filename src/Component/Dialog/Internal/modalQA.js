import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Modal, Form, Tabs, Spin } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import TextArea from 'antd/lib/input/TextArea';
import TextEditor from '../../TextEditor';

const { TabPane } = Tabs;


export default function ModalQA({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const uploadRef = useRef(null);
    const uploadRef_unittest = useRef(null);
    const [form] = Form.useForm();
    const [textValue, setTextValue] = useState("");
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(false);

    //data
    // const [listunittest, setListunittest] = useState([]);
    // const [listfiledeploy, setFiledeploy] = useState([]);
    // const [listdocument, setDocument] = useState([]);
    // const [historyvalue, setHistoryvalue] = useState(null);

    // const handleEditorChange = (content, editor) => {
    //     setTextValue(content);
    // }
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
                //files: uploadRef_unittest.current.getFiles().map((n) => n.response.id),
                unit_test_url: values.unit_test_url,
                grouptype: "test_result_QA"
            }
        })
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
                        comment_type: "task",
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
                SaveUnitTest(values);
                onOk();
                setLoading(false);

                await Modal.success({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>ตรวจสอบผ่าน</p>
                        </div>
                    ),
                    okText: "Close",
                    onOk() {
                        editorRef.current.setvalue();
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
                    editorRef.current.setvalue();
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
            onCancel={() => {form.resetFields(); onCancel() }}
            {...props}
        >
            <Spin spinning={loading} size="large" tip="Loading...">
                <Form form={form} style={{ padding: 0, maxWidth: "100%", backgroundColor: "white", marginTop: 0 }}
                    name="qa-test"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        // style={{ minWidth: 300, maxWidth: 300 }}
                        name="unit_test_url"
                        label="Test Result URL"
                        rules={[
                            {
                                required: true,
                                message: 'กรุณาแนบ url ผลทดสอบ!',
                            },
                        ]}
                    >
                        <TextArea rows="2" style={{ width: "100%" }} />
                    </Form.Item>

                    {/* <Form.Item
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
                    </Form.Item> */}
                </Form>
                 Remark :
            <TextEditor ref={editorRef} />
                <br />
                     AttachFile : <UploadFile ref={uploadRef} />
            </Spin>

        </Modal>
    )
}
