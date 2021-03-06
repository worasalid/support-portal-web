import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Select } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { useHistory } from "react-router-dom";
import UploadFile from '../../../UploadFile'
import Axios from 'axios';

export default function ModalRequestInfoDev({ visible = false, onOk, onCancel, details, ...props }) {
    const history = useHistory();
    const uploadRef = useRef(null);
    const [form] = Form.useForm();
    const [textValue, setTextValue] = useState("");
    const [select_assign, setSelect_assign] = useState(null);
    const editorRef = useRef(null)

    const [assignlist, setAssignlist] = useState([]);

    const handleEditorChange = (content, editor) => {
        setTextValue(content);
    }

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
            if (textValue !== "") {
                const comment = await Axios({
                    url: process.env.REACT_APP_API_URL + "/tickets/create_comment",
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                    },
                    data: {
                        ticketid: details && details.ticketid,
                        taskid: details.taskid,
                        comment_text: textValue,
                        comment_type: "internal",
                        files: uploadRef.current.getFiles().map((n) => n.response.id),
                    }
                });
            }
        } catch (error) {

        }
    }

    const SendFlow = async (value) => {
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
                        comment_text: textValue
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
                            <p>Assign งานให้ {select_assign}</p>
                        </div>
                    ),
                    onOk() {
                        editorRef.current.editor.setContent("");
                        
                        history.push({ pathname: "/internal/issue/inprogress" })
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
                    editorRef.current.editor.setContent("");
                    onOk();
                   
                },
            });
        }
    }

    const onFinish = (values, item) => {
        console.log('Success:', values, item);
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
                onOk={() => { return (form.submit()) }}
                okButtonProps={{ type: "primary", htmlType: "submit" }}
                okText="Send"
                okType="dashed"
                onCancel={() => { return (form.resetFields(), onCancel()) }}
                {...props}
            >

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
                <Editor
                    apiKey="e1qa6oigw8ldczyrv82f0q5t0lhopb5ndd6owc10cnl7eau5"
                    ref={editorRef}
                    initialValue=""
                    init={{
                        height: 300,
                        menubar: false,
                        plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code help wordcount'
                        ],
                        toolbar1: 'undo redo | styleselect | bold italic underline forecolor fontsizeselect | link image',
                        toolbar2: 'alignleft aligncenter alignright alignjustify bullist numlist preview table openlink',
                    }}
                    onEditorChange={handleEditorChange}
                />
                <br />
                     AttachFile : <UploadFile ref={uploadRef} />

            </Modal>
        </>
    )
}