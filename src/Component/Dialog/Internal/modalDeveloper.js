import React, { useState, useRef, useEffect, useContext } from 'react';
import { Modal, Form, Spin, Checkbox } from 'antd';
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
    const uploadRef_filedeploy = useRef(null);
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
            if ((editorRef.current.getValue() !== null) || (editorRef.current.getValue() === null && uploadRef.current.getFiles().length > 0)) {
                await Axios({
                    url: process.env.REACT_APP_API_URL + "/workflow/create_comment",
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                    },
                    data: {
                        ticketid: details && details.ticketid,
                        taskid: details.taskid,
                        comment_text: editorRef.current.getValue(),
                        comment_type: "task",
                        files: uploadRef.current.getFiles().map((n) => n.response),
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
                //files: uploadRef_unittest.current.getFiles().map((n) => n.response.id),
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
                //files: uploadRef_document.current.getFiles().map((n) => n.response.id),
                url: values.document_url,
                grouptype: "deploy_document"
            }
        })
    }

    const saveFile_Deploy = async (values) => {
        await Axios({
            url: process.env.REACT_APP_API_URL + "/workflow/save_filedeploy",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                ticket_id: details && details.ticketid,
                task_id: details.taskid,
                files: uploadRef_filedeploy.current.getFiles().map((n) => n.response.id),
                grouptype: "file_deploy"
            }
        })
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
                        sql_script: values.sql_script,
                        comment_text: textValue
                    }
                }
            });

            if (sendflow.status === 200) {
                SaveComment();
                SaveUnitTest(values);

                if (values.document_url !== undefined) {
                    SaveDocumentDeploy(values);
                }
                if (values.file_deploy !== undefined) {
                    saveFile_Deploy(values);
                }

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
                            window.location.reload(true);
                        } else {
                            history.push({ pathname: "/internal/issue/inprogress" });
                            window.location.reload(true);
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
                        <label style={{ color: "red" }}>*** กรุณา แจ้งทีม QA เพื่อตั้งค่าในการรับ Issue</label>
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
        // console.log(values)
        SendFlow(values);
    };


    return (

        <Modal
            visible={visible}
            confirmLoading={loading}
            onOk={() => form.submit()}
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            okText="Send"
            okType="dashed"
            onCancel={() => { form.resetFields(); onCancel() }}

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
                        wrapperCol={6}
                        label="UnitTest (URL)"
                        name="unit_test_url"
                        rules={[
                            {
                                required: true,
                                message: 'กรุณาใส่ Url ที่ใช้ test',
                            },
                        ]}
                    >
                        <TextArea rows="2" style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={6}
                        label="Excel Deploy"
                        name="document_url"
                        rules={[
                            {
                                required: false,
                                message: 'กรุณาใส่ Url Excel Deploy!',
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

                    {/* <Form.Item
                         style={{ minWidth: 300, maxWidth: 300 }}
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
                    </Form.Item> */}

                    <Form.Item
                        wrapperCol={6}
                        label="File Deploy"
                        name="file_deploy"
                        rules={[
                            {
                                required: false,
                                message: 'Please input File Deploy!',
                            },
                        ]}
                    >
                        <UploadFile ref={uploadRef_filedeploy} />
                    </Form.Item>

                    <Form.Item
                        label="SQL Script"
                        name="sql_script"
                        valuePropName="checked"
                        rules={[
                            {
                                required: false,
                                message: '!!!',
                            },
                        ]}
                    >
                        <Checkbox />
                    </Form.Item>

                </Form>
                <TextEditor ref={editorRef} ticket_id={details.ticketid} />
                <br />
                AttachFile : <UploadFile ref={uploadRef} />
            </Spin>
        </Modal>
    )
}
