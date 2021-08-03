import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Modal, Form, Spin, Select, DatePicker, Checkbox } from 'antd';
import UploadFile from '../../../UploadFile'
import Axios from 'axios';
import TextEditor from '../../../TextEditor';
// const { TabPane } = Tabs;

export default function ModalDevSendVersion({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const uploadRef = useRef(null);
    const [form] = Form.useForm();
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [version, setVersion] = useState([])

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
                        comment_type: "task",
                        files: uploadRef.current.getFiles().map((n) => n.response),
                    }
                });
            }
        } catch (error) {

        }
    }

    const SendFlow = async (param) => {
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
                        deploy_file: param.deploy_file,
                        patch_update: param.patch_update === undefined ? null : param.patch_update.format('DD/MM/YYYY'),
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
                            <p></p>
                        </div>
                    ),
                    okText: "Close",
                    onOk() {
                        editorRef.current.setvalue();
                        history.push({ pathname: "/internal/issue/inprogress" });
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

    const onFinish = (param) => {
        SendFlow(param);
        //console.log("xx", param.patch_update)
    };

    useEffect(() => {
        if (visible) {

        }

    }, [visible])

    return (
        <>
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
                            label="ตรวจสอบการวางไฟล์ Deploy (Update Patch Version)"
                            name="deploy_file"
                            valuePropName="checked"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please Select',
                                },
                            ]}
                        >
                            <Checkbox style={{ marginLeft: 20 }}>
                                Upload File แล้ว
                            </Checkbox>
                        </Form.Item>

                        <Form.Item
                            style={{ minWidth: 300, maxWidth: 300 }}
                            label="วันที่ Update Patch"
                            name="patch_update"
                            rules={[
                                {
                                    required: false,
                                    message: 'Please Select Date',
                                },
                            ]}
                        >
                            <DatePicker
                                style={{ marginLeft: 20 }}
                                format="DD/MM/YYYY"
                            // onChange={(date, datestring) => form.setFieldsValue({ patch_update: datestring })}
                            />
                        </Form.Item>

                        <Form.Item
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
        </>
    )
}