import React, { useState, useRef } from 'react';
import { useHistory } from "react-router-dom";
import { Modal, Form, Spin } from 'antd';
import UploadFile from '../../../UploadFile'
import Axios from 'axios';
import TextEditor from '../../../TextEditor';
// const { TabPane } = Tabs;

export default function ModalSendIssue({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const uploadRef = useRef(null);
    const [form] = Form.useForm();
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const SaveComment = async () => {
        try {
            if (editorRef.current.getValue() !== "" && editorRef.current.getValue() !== null && editorRef.current.getValue() !== undefined) {
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
                        comment_type: details.flowoutput.Type === null ? "customer" : "internal",
                        files: uploadRef.current.getFiles().map((n) => n.response.id),
                    }
                });
            }
        } catch (error) {

        }
    }

    const SendFlow = async () => {
        setLoading(true);
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
                        comment_text: editorRef.current.getValue()
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
                            {/* <p>บันทึกข้อมูลสำเร็จ</p> */}
                        </div>
                    ),
                    okText: "Close",
                    onOk() {
                        editorRef.current.setvalue();
                        switch (details.flowoutput.value) {
                            case "ApproveCR":
                                window.location.reload(true);
                                break;
                            case "ConfirmPayment":
                                window.location.reload(true);
                                break;
                            case "Resolved":
                                history.push({ pathname: "/internal/issue/resolved" });
                                window.location.reload(true);
                                break;

                            default:
                                history.push({ pathname: "/internal/issue/inprogress" });
                                window.location.reload(true);
                                break;
                        }
                        // if (details.flowoutput.value === "ApproveCR" || details.flowoutput.value === "ConfirmPayment") {
                        //     window.location.reload(true);
                        // }
                        // if (details.flowoutput.value === "Resolved") {
                        //     history.push({ pathname: "/internal/issue/resolved" });
                        //     window.location.reload(true);
                        // } else {
                        //     history.push({ pathname: "/internal/issue/inprogress" });
                        //     window.location.reload(true);
                        // }

                    },
                });
            }
        } catch (error) {
            onOk();
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


                },
            });
        }
    }

    const onFinish = (values) => {
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

                    >
                        <TextEditor ref={editorRef} />
                        <br />
                     AttachFile : <UploadFile ref={uploadRef} />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    )
}
