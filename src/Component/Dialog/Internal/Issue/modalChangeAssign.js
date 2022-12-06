import React, { useState, useRef } from 'react';
import { Modal, Form } from 'antd';
import UploadFile from '../../../UploadFile'
import TextEditor from '../../../TextEditor';
import Axios from 'axios';
import { SwapRightOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';

export default function ModalChangeAssign({ visible = false, onOk, onCancel, details, ...props }) {
    const uploadRef = useRef(null);
    const editorRef = useRef(null)
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const history = useHistory(null);

    const saveComment = async () => {
        if ((editorRef.current.getValue() !== null) || (editorRef.current.getValue() === null && uploadRef.current.getFiles().length > 0)) {
            await Axios({
                url: process.env.REACT_APP_API_URL + "/workflow/create_comment",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketid: details.ticketId,
                    taskid: details.taskId,
                    comment_text: editorRef.current.getValue(),
                    comment_type: "task",
                    files: uploadRef.current.getFiles().map((n) => n.response),
                }
            }).then((res) => {

            }).catch((error) => {

            });
        }
    }

    const changeAssign = async () => {
        setLoading(true);
        try {
            if (editorRef.current.getValue() === "" || editorRef.current.getValue() === null || editorRef.current.getValue() === undefined) {
                throw ("กรุณาระบุ Comment!")
            }

            await Axios({
                url: `${process.env.REACT_APP_API_URL}/workflow/changeAssign`,
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketId: details.ticketId,
                    taskId: details.taskId,
                    moduleId: details?.newModule?.value,
                    mailboxId: details.mailboxId,
                    history: {
                        value: details.oldModule,
                        value2: details?.newModule?.label
                    },
                    comment_text: editorRef.current.getValue()
                }
            }).then((res) => {
                saveComment();
                setLoading(false);
                history.push({ pathname: "/internal/issue/mytask" });
                onOk();

            }).catch((error) => {
                setLoading(false);
            });
        } catch (error) {
            setLoading(false);
            await Modal.error({
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                content: (
                    <div>
                        <p>กรุณาระบุ Comment!</p>
                    </div>
                ),
                okText: "Close",
                onOk() {
                }
            });
        }
    }

    const onFinish = async (value) => {
        changeAssign();
    }

    return (
        <Modal
            title={
                <>
                    <label>เปลียน Module</label>&nbsp;&nbsp;
                    <label style={{ color: "orange" }}>{details.oldModule}</label> < SwapRightOutlined />
                    <label style={{ color: "orange" }}>{details?.newModule?.label}</label>
                </>
            }
            visible={visible}
            confirmLoading={loading}
            onOk={() => form.submit()}
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            okText="Send"
            okType="dashed"
            onCancel={() => { form.resetFields(); onCancel() }}
            {...props}
        >
            <Form form={form} style={{ padding: 0, maxWidth: "100%", backgroundColor: "white" }}
                name="comment"
                layout="vertical"

                onFinish={onFinish}
            >
                <Form.Item
                    name="remark"
                    label={
                        <>
                            <label style={{ color: "red" }}>*</label>&nbsp;
                            <label>Remark</label>
                        </>
                    }
                >
                    <TextEditor ref={editorRef} ticket_id={details.ticketId} />
                </Form.Item>
            </Form>

            <br />
            AttachFile : <UploadFile ref={uploadRef} />

        </Modal>
    )
}