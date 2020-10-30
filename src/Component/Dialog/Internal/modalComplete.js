import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Row, Col } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import TextArea from 'antd/lib/input/TextArea';

export default function ModalComplete({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const uploadRef_unittest = useRef(null);
    // const uploadRef_filedeploy = useRef(null);
    const uploadRef_document = useRef(null);
    const [form] = Form.useForm();
    const [textValue, setTextValue] = useState("");
    const editorRef = useRef(null)

    const handleEditorChange = (content, editor) => {
        setTextValue(content);
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
                    ticketId: details && details.ticketId,
                    mailbox_id: details && details.mailboxId,
                    node_output_id: details && details.node_output_id,
                    to_node_id: details && details.to_node_id,
                    node_action_id: details && details.to_node_action_id,
                    product_id: details && details.productId,
                    module_id: details && details.moduleId,
                    flowstatus: details.flowstatus,
                    groupstatus: details.groupstatus,
                    url: values.urltest,
                    history: {
                        historytype: "Internal",
                        description: details.flowaction,
                        value: "",
                        value2: ""
                    }
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
                        history.push({ pathname: "/internal/issue/inprogress" })
                    },
                });
            }
        } catch (error) {

        }
    }

    
    const CompleteFlow = async (values) => {
        try {
            const completeflow = await Axios({
                url: process.env.REACT_APP_API_URL + "/workflow/complete",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketId: details && details.ticketId,
                    url: values.url,
                    description: values.description,
                    node_output_id: details && details.node_output_id,
                    history: {
                        historytype: "Customer",
                        description: details.flowaction
                    }
                }
            });

            if (completeflow.status === 200) {
                await Modal.info({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>บันทึกข้อมูลสำเร็จ</p>
                        </div>
                    ),
                    onOk() {
                        onOk();
                        history.push({ pathname: "/internal/issue/complete" })
                    },
                });
            }
        } catch (error) {
            await Modal.info({
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.message}</p>
                    </div>
                ),
                onOk() {
                   
                },
            });
        }
    }





    const onFinish = (values) => {
        console.log('Success:', values);
        CompleteFlow();
        // SaveUnitTest(values);
        // SaveFileDeploy();
        // SendFlow(values);
        // onOk();
    };

    return (
        <Modal
            visible={visible}
            onOk={() => { return (form.submit()) }}
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            okText="Send"
            onCancel={() => { return (form.resetFields(), onCancel()) }}

            {...props}

        >
            <Form form={form} style={{ padding: 0, maxWidth: "100%", backgroundColor: "white" }}
                name="form-complete"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="VDO Upload URL"
                    name="url"
                    rules={[
                        {
                            required: true,
                            message: 'กรุณาใส่ Url VDO Upload ',
                        },
                    ]}
                >
                
                    <TextArea rows="2" style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                >
                
                    <TextArea rows="5" style={{ width: "100%" }} />
                </Form.Item>
            </Form>

        </Modal>
    )
}
