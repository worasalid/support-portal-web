import React, { useState, useRef } from 'react';
import { Modal, Form, Spin } from 'antd';
import { useHistory, useRouteMatch } from "react-router-dom";
import Axios from 'axios';
import TextArea from 'antd/lib/input/TextArea';

export default function ModalComplete({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const uploadRef_unittest = useRef(null);
    // const uploadRef_filedeploy = useRef(null);
    const uploadRef_document = useRef(null);
    const [form] = Form.useForm();
    const [textValue, setTextValue] = useState("");
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const handleEditorChange = (content, editor) => {
        setTextValue(content);
    }

    const CompleteFlow = async (values) => {
        try {
            const completeflow = await Axios({
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
                        deploy_url: values.url,
                        deploy_description: values.description
                    }

                }
            });

            if (completeflow.status === 200) {
                onOk();
                setLoading(false);
                await Modal.success({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>บันทึกข้อมูลสำเร็จ</p>
                        </div>
                    ),
                    okText: "Close",
                    onOk() {

                        history.push({ pathname: "/internal/issue/resolved" })
                    },
                });
            }
        } catch (error) {
            setLoading(false);
            await Modal.error({
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.message}</p>
                    </div>
                ),
                okText: "Close",
                onOk() {

                },
            });
        }
    }

    const onFinish = (values) => {
        setLoading(true);
        CompleteFlow(values);
        // SaveUnitTest(values);
        // SaveFileDeploy();
        // SendFlow(values);
        // onOk();
    };

    return (
        <Modal
            visible={visible}
            confirmLoading={loading}
            onOk={() => { return (form.submit()) }}
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            okText="Send"
            onCancel={() => { return (form.resetFields(), onCancel()) }}

            {...props}

        >
            <Spin spinning={loading} size="large" tip="Loading...">
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
            </Spin>
        </Modal>
    )
}
