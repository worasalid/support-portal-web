import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Modal, Form, Spin, Select, Input } from 'antd';
import UploadFile from '../../../UploadFile'
import Axios from 'axios';
import TextEditor from '../../../TextEditor';

const { TextArea } = Input;

export default function ModalCancel({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const uploadRef = useRef(null);
    const [form] = Form.useForm();
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [cancelData, setCancelData] = useState(null);
    const [formHidden, setFormHidden] = useState(true);

    const configData = async () => {
        try {
            const configData = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/config-data",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    groups: "ResonCancel"
                }

            });

            if (configData.status === 200) {
                setCancelData(configData.data)
            }

        } catch (error) {

        }
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
                        comment_type: details.flowoutput.Type === null ? "customer" : "internal",
                        files: uploadRef.current.getFiles().map((n) => n.response),
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
                url: process.env.REACT_APP_API_URL + "/workflow/user-cancel",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketid: details.ticketid,
                    mailboxid: details && details.mailboxid,
                    flowoutputid: details.flowoutput.FlowOutputId,
                    cancel_reason: values.reason,
                    cancel_description: values.description,
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
                            <p> {`ยกเลิก Issue เลขที่ : ${details.ticket_number}`}</p>
                        </div>
                    ),
                    okText: "Close",
                    onOk() {
                        editorRef.current.setvalue();
                        history.push({ pathname: "/internal/issue/cancel" });
                        window.location.reload(true);
                       
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

    const onChange = (value, item) => {
        if (item.label === "อื่นๆ โปรดระบุ") {
            setFormHidden(false);

        } else {
            setFormHidden(true);
            form.setFieldsValue({ description: undefined })
        }
    }

    const onFinish = (values) => {
        SendFlow(values);
    };

    useEffect(() => {
        if (visible) {
            configData();
        }
    }, [visible])


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
                        label="เหตุผลในการยกเลิก"
                        name="reason"
                        rules={[{ required: true, message: 'กรุณาระบุเหตุผลในการยกเลิก' }]}
                    >
                        <Select placeholder="เหตุผลการ ยกเลิก" style={{ width: "100%" }}
                            allowClear
                            maxTagCount={1}
                            onChange={(value, item) => onChange(value, item)}
                            options={cancelData && cancelData.map((x) => ({ value: x.Id, label: x.Name }))}

                        />

                    </Form.Item>
                    <Form.Item
                        hidden={formHidden}
                        label="รายละเอียด"
                        name="description"
                        rules={[{ required: false, message: 'กรุณาระบุ รายละเอียด' }]}
                    >

                        <TextArea rows={5} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        name="remark"
                        label="Remark :"

                    >
                        <TextEditor ref={editorRef} ticket_id={details.ticketid}/>
                        <br />
                     AttachFile : <UploadFile ref={uploadRef} />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    )
}
