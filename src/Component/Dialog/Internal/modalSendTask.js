import React, { useState, useRef, useEffect } from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { Spin, Modal, Form, Tabs } from 'antd';
// import { Editor } from '@tinymce/tinymce-react';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import TextEditor from '../../TextEditor';

const { TabPane } = Tabs;

export default function ModalSendTask({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const match = useRouteMatch();
    const uploadRef = useRef(null);
    const [form] = Form.useForm();
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(false);

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
                        comment_text: editorRef.current.getValue()
                    }

                }
            });

            if (sendflow.status === 200) {
                SaveComment();
                onOk();
                setLoading(false);

                Modal.success({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            {/* <p>บันทึกข้อมูลสำเร็จ</p> */}
                        </div>
                    ),
                    okText: "Close",
                    onOk() {
                        editorRef.current.setvalue();

                        if (details.flowoutput.value === "SendTask" || details.flowoutput.value === "ResolvedTask" || details.flowoutput.value === "SendToDev") {
                            history.push({ pathname: "/internal/issue/subject/" + match.params.id });
                            window.location.reload(true); 
                        }
                        else if (details.flowoutput.value === "SendToDeploy") {
                            history.push({ pathname: "/internal/issue/resolved" });
                            window.location.reload(true);
                           
                        }
                        else {
                            history.push({ pathname: "/internal/issue/inprogress" });
                            window.location.reload(true);
                        }
                    },
                });
            }
        } catch (error) {
            onCancel();
            setLoading(false);
            await Modal.error({
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.response.data}</p>
                    </div>
                ),
                okText: "Close",
                okButtonProps: { hidden: true },
                okCancel() {

                    editorRef.current.setvalue();
                    window.location.reload(true);
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
            onOk={() => form.submit()}
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            okType="dashed"
            onCancel={() => { form.resetFields(); onCancel() }}
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
