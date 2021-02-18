import React, { useRef } from 'react';
import { useHistory } from "react-router-dom";
import { Button, Modal, Form, Tabs } from 'antd';
// import { Editor } from '@tinymce/tinymce-react';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import TextEditor from '../../TextEditor';

const { TabPane } = Tabs;

export default function ModalSendTask({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const uploadRef = useRef(null);
    const [form] = Form.useForm();
    const editorRef = useRef(null)

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
                        comment_text: editorRef.current.getValue()
                    }

                }
            });

            if (sendflow.status === 200) {
                SaveComment();
                onOk();

                await Modal.info({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>บันทึกข้อมูลสำเร็จ</p>
                        </div>
                    ),
                    onOk() {
                        editorRef.current.setvalue();
                        if (details.flowoutput.value === "SendTask" || details.flowoutput.value === "ResolvedTask") {
                            history.goBack();
                        }
                        else {
                            history.push({ pathname: "/internal/issue/inprogress" });
                        }



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
                    editorRef.current.setvalue();
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
// console.log("modalsendtask")
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

                >
                    <TextEditor ref={editorRef} />
                    <br />
                     AttachFile : <UploadFile ref={uploadRef} />
                </Form.Item>
            </Form>

        </Modal>
    )
}
