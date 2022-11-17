import React, { useState, useRef, useContext } from 'react';
import { useHistory, } from "react-router-dom";
import { Modal, Form, Tabs, Spin } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import TextEditor from '../../TextEditor';

import AuthenContext from "../../../utility/authenContext";

export default function ModalLeaderQC({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const { state, dispatch } = useContext(AuthenContext);
    const history = useHistory();
    const uploadRef = useRef(null);
    const [form] = Form.useForm();
    const [textValue, setTextValue] = useState("");
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const SaveComment = async () => {
        try {
            const comment = await Axios({
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
                onOk();
                setLoading(false);
                await Modal.success({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>ส่งงานให้ทีม QA ตรวจสอบ</p>
                        </div>
                    ),
                    okText: "Close",
                    onOk() {
                        editorRef.current.editor.setContent("")
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
                okText: "Close",
                onOk() {
                    editorRef.current.editor.setContent("")
                    onOk();
                    history.push({ pathname: "/internal/issue/inprogress" })
                },
            });
        }
    }

    const onFinish = (values) => {
        setLoading(true);
        SendFlow();
    };

    return (
        <Modal
            visible={visible}
            confirmLoading={loading}
            okText="Send"
            onOk={() => { return (form.submit()) }}
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            okType="dashed"
            onCancel={() => { return (form.resetFields(), onCancel()) }}
            {...props}
        >
            <Spin spinning={loading} size="large" tip="Loading...">
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
                        <TextEditor ref={editorRef} ticket_id={details.ticketid} />
                        <br />
                        AttachFile : <UploadFile ref={uploadRef} />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    )
}
