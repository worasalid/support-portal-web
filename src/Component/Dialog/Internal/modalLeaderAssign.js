import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import UploadFile from '../../UploadFile'
import Axios from 'axios';

export default function ModalLeaderAssign({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const uploadRef = useRef(null);
    const [form] = Form.useForm();
    const [textValue, setTextValue] = useState("");
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
                    productId: details.productId,
                    moduleId: details.moduleId
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
                        ticketId: details && details.ticketId,
                        comment_text: textValue,
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
                    mailbox_id: details && details.mailboxId,
                    output_id: details && details.nodeoutput_id
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
                        onOk()
                    },
                });
            }
        } catch (error) {

        }
    }

    const onFinish = (values) => {
        console.log('Success:', values);
        SaveComment();
        SendFlow();
        onOk();
    };

    useEffect(() => {
        GetAssign();

    },[visible])

    console.log("assignlist", assignlist);
    return (
        <Modal
            visible={visible}
            onOk={() => { return (form.submit()) }}
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            okType="dashed"
            onCancel={() => { return (form.resetFields(), onCancel()) }}
            {...props}
        >
            <Form form={form} style={{ padding: 0, maxWidth: "100%", backgroundColor: "white" }}
                name="qa-test"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                 <Form.Item
                    style={{ minWidth: 300, maxWidth: 300 }}
                    name="UnitTest"
                    rules={[
                        {
                            required: false,
                            message: 'Please Select Assign',
                        },
                    ]}
                >
                    <label>Assign To </label>
                   <Select style={{ width: '100%' }} placeholder="None"
                        showSearch
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        options={
                            assignlist && assignlist.map((item) => ({
                                value: item.UserId,
                                label: item.UserName
                            }))
                        }
                    >
                    </Select>
                </Form.Item>
                <Form.Item
                    // style={{ minWidth: 300, maxWidth: 300 }}
                    name="UnitTest"
                    rules={[
                        {
                            required: false,
                            message: 'Please input your UnitTest!',
                        },
                    ]}
                >
                    Remark :
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
                </Form.Item>
            </Form>

        </Modal>
    )
}
