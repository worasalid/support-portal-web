import React, { useState, useRef, useEffect, useContext } from 'react';
import { Modal, Form, Spin } from 'antd';
import { useHistory, useRouteMatch } from "react-router-dom";
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import TextArea from 'antd/lib/input/TextArea';
import TextEditor from '../../TextEditor';
import AuthenContext from "../../../utility/authenContext";

export default function ModalDeveloper({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const { state, dispatch } = useContext(AuthenContext);

    const history = useHistory();
    const uploadRef = useRef(null);
    const uploadRef_unittest = useRef(null);
    // const uploadRef_filedeploy = useRef(null);
    const uploadRef_document = useRef(null);
    const [form] = Form.useForm();
    const [textValue, setTextValue] = useState("");
    const editorRef = useRef(null)
    const [loading, setLoading] = useState(false);

    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    }

    const handleEditorChange = (content, editor) => {
        setTextValue(content);
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
                        comment_type: "internal",
                        files: uploadRef.current.getFiles().map((n) => n.response.id),
                    }
                });
            }
        } catch (error) {

        }
    }

    const SaveUnitTest = async (values) => {
        await Axios({
            url: process.env.REACT_APP_API_URL + "/workflow/save_unittest",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                ticketid: details && details.ticketid,
                taskid: details.taskid,
                files: uploadRef_unittest.current.getFiles().map((n) => n.response.id),
                unit_test_url: values.unit_test_url,
                grouptype: "unittest"
            }
        })
    }

    const SaveDocumentDeploy = async (values) => {
        await Axios({
            url: process.env.REACT_APP_API_URL + "/workflow/save_deploydocument",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                ticketid: details && details.ticketid,
                taskid: details.taskid,
                files: uploadRef_document.current.getFiles().map((n) => n.response.id),
                url: values.urltest,
                grouptype: "document_deploy"
            }
        })
    }

    const SendFlow = async (values) => {
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
                SaveDocumentDeploy(values);
                onOk();
                setLoading(false);

                await Modal.success({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>แก้ไขงานเสร็จ และส่ง UnitTest เรียบร้อยแล้ว</p>
                        </div>
                    ),
                    okText: "Close",
                    onOk() {
                        editorRef.current.setvalue();
                        if (state?.usersdata?.organize?.PositionLevel === 0) {
                            // ถ้า H.Dev แก้ไขงานเอง ให้ refresh หน้าจอ แล้วทำงานต่อ ไม่ต้องเปลียน page
                            window.location.reload();
                        } else {
                            history.push({ pathname: "/internal/issue/inprogress" })
                        }

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
                okText:"Close",
                onOk() {
                    editorRef.current.setvalue();
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
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            okText="Send"
            okType="dashed"
            onCancel={() => { return (form.resetFields(), onCancel()) }}

            {...props}

        >
            <Spin spinning={loading} size="large" tip="Loading...">
                <Form {...formItemLayout} form={form} style={{ padding: 0, maxWidth: "100%", backgroundColor: "white" }}
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="UnitTest (URL)"
                        name="unit_test_url"
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
                        // style={{ minWidth: 300, maxWidth: 300 }}
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

                    <Form.Item
                        // style={{ minWidth: 300, maxWidth: 300 }}
                        label="Deploy Document"
                        name="document"
                        rules={[
                            {
                                required: false,
                                message: 'Please input Deploy Document!',
                            },
                        ]}
                    >
                        <UploadFile ref={uploadRef_document} />
                    </Form.Item>
                </Form>
                <TextEditor ref={editorRef} />
                <br />
                     AttachFile : <UploadFile ref={uploadRef} />
            </Spin>
        </Modal>
    )
}
