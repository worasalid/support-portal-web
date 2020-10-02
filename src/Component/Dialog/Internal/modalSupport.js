import React, { useState, useRef, useEffect, useContext } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import IssueContext from '../../../utility/issueContext';


export default function ModalSupport({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const uploadRef = useRef(null);
    const [formRef, setFormRef] = useState(null);
    const [textValue, setTextValue] = useState("");
    const editorRef = useRef(null)
    const { state: userstate, dispatch: userdispatch } = useContext(IssueContext);
    // page.loaddata.IssueType = page.data.IssueTypeData.map(x => ({ name: x.name, value: x.id }))
    // page.loaddata.Module = page.data.ModuleData.map(x => ({ name: x.text, value: x.value }))

    const handleEditorChange = (content, editor) => {
        setTextValue(content);
    }

    const LoadModule = async () => {
        try {
            const module = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/modules",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    productId: details.productId
                }
            });
            userdispatch({ type: "LOAD_MODULE", payload: module.data })
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
                        editorRef.current.editor.setContent("");
                        onOk();
                        formRef.resetFields();
                    },
                });
            }
        } catch (error) {

        }
    }

    const onFinish = (values) => {
        SaveComment();
        SendFlow();
    };
    useEffect(() => {
        LoadModule();
    }, [])

    return (
        <Modal
            visible={visible}
            onOk={() => formRef.submit()}
            okText="Save"
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            onCancel={() => {
                return (formRef.resetFields(), onCancel(), editorRef.current.editor.setContent(""))
            }
            }
            {...props}

        >
            <Form ref={setFormRef} style={{ padding: 0, maxWidth: 450, backgroundColor: "white" }}
                name="normal_login"
                className="login-form"
                onFinish={onFinish}
            >
                IssueType
                <Form.Item
                    style={{ minWidth: 300, maxWidth: 300 }}
                    name="IssueType"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your IssueType!',
                        },
                    ]}
                >
                    <Select style={{ width: '100%' }} placeholder="None"
                        showSearch
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        options={
                            userstate.masterdata && userstate.masterdata.issueTypeState.map((item) => ({
                                value: item.Id,
                                label: item.Name
                            }))
                        }
                    >
                    </Select>
                </Form.Item>

                Module
                <Form.Item
                    style={{ minWidth: 300, maxWidth: 300 }}
                    name="module"
                    rules={[
                        {
                            required: true,
                            message: 'Please Select module!',
                        },
                    ]}
                >
                    <Select style={{ width: '100%' }} placeholder="None"
                        showSearch
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        options={
                            userstate.masterdata.moduleState && userstate.masterdata.moduleState.map((item) => ({
                                value: item.Id,
                                label: item.Name
                            }))
                        }
                    >
                    </Select>
                </Form.Item>
            </Form>
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
        </Modal>
    );
}
