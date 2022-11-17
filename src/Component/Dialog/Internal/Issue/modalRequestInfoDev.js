import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Select, Spin } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { useHistory } from "react-router-dom";
import UploadFile from '../../../UploadFile'
import TextEditor from '../../../TextEditor';
import Axios from 'axios';

export default function ModalRequestInfoDev({ visible = false, onOk, onCancel, details, ...props }) {
    const history = useHistory();
    const uploadRef = useRef(null);
    const [form] = Form.useForm();
    const editorRef = useRef(null)

    const [assignlist, setAssignlist] = useState([]);
    const [loading, setLoading] = useState(false);

    const GetAssign = async () => {
        try {
            const assign = await Axios({
                url: process.env.REACT_APP_API_URL + "/workflow/assign-developer",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    taskid: details.taskid
                }
            });
            setAssignlist(assign.data)

        } catch (error) {

        }

    }

    const SaveComment = async () => {
        try {
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
        } catch (error) {

        }
    }

    const SendFlow = async (value) => {
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
                        assigneeid: value,
                        comment_text: editorRef.current.getValue()
                    }

                }
            });

            if (sendflow.status === 200) {
                SaveComment();
                setLoading(false);
                onCancel();
                Modal.success({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>สอบถามข้อมูลกับทาง Developer</p>
                        </div>
                    ),
                    okText: "Close",
                    onOk() {
                        editorRef.current.setvalue("");
                        history.push({ pathname: "/internal/issue/inprogress" })
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
                onOk() {
                    editorRef.current.setvalue("");
                    onOk();

                },
            });
        }
    }

    const onFinish = (values, item) => {
        SendFlow(values.assignto);
    };

    useEffect(() => {
        if (visible) {
            GetAssign();
        }

    }, [visible])

    return (
        <>
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
                    <Form form={form} style={{ padding: 0, maxWidth: "100%", backgroundColor: "white" }}
                        layout="vertical"
                        name="assigndev"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            style={{ minWidth: 300, maxWidth: 300 }}
                            label="AssignTo"
                            name="assignto"
                            rules={[
                                {
                                    required: true,
                                    message: 'กรุณาเลือก Developer',
                                },
                            ]}
                        >
                            {/* <label>Assign To </label> */}
                            <Select style={{ width: '100%' }} placeholder="None"
                                showSearch
                                filterOption={(input, option) =>
                                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                onClick={(value, item) => assignlist.length === 0 ? alert("ไม่มีผู้ดูแล Module") : ""}
                                options={
                                    assignlist && assignlist.map((item) => ({
                                        value: item.UserId,
                                        label: item.UserName
                                    }))
                                }
                            >
                            </Select>
                        </Form.Item>

                    </Form>

                    {/* Remark : */}
                    <TextEditor ref={editorRef} />
                    <br />
                    AttachFile : <UploadFile ref={uploadRef} />
                </Spin>
            </Modal>
        </>
    )
}