import React, { useState, useRef, useEffect, useContext } from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { Modal, Form, Input, Select, Button } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import IssueContext from '../../../utility/issueContext';


export default function ModalSupport({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const uploadRef = useRef(null);
    const [formRef, setFormRef] = useState(null);
    const [textValue, setTextValue] = useState("");
    const editorRef = useRef(null)
    const { state: userstate, dispatch: userdispatch } = useContext(IssueContext);

    //data
    const [counttask,setCounttask] = useState(null)

    const handleEditorChange = (content, editor) => {
        setTextValue(content);
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

    const GetTask = async () => {
        try {
            const task = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/load-task",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    ticketId: details.ticketId
                }
            });
            if (task.data.filter((x) => x.Status === "Waiting Progress")) {
                
            }
        } catch (error) {

        }
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
                    taskid: details.taskid,
                    mailboxid: details.mailboxid,
                    flowoutputid: details.flowoutputid,
                    value: {
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
                            <p>บันทึกข้อมูลสำเร็จ</p>
                        </div>
                    ),
                    onOk() {
                        editorRef.current.editor.setContent("");
                        formRef.resetFields();
                        if (details.flowoutput.value === "ResolvedTask") {
                            history.goBack();
                        } else {
                            history.push({ pathname: "/internal/issue/inprogress" });
                        }
                      
                    },
                });
            }
        } catch (error) {
            console.log("error", error.response)
            await Modal.info({
                title: 'บันทึกไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.message}</p>
                        <p>{error.response.data}</p>
                    </div>
                ),
                onOk() {
                    editorRef.current.editor.setContent("");
                    onOk();
                    formRef.resetFields();
                },
            });
        }
    }

    const onFinish = (values) => {
        SendFlow(values);
    };

    return (
        <Modal
            visible={visible}
            onOk={() => formRef.submit()}
            okText="Send"
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
                // initialValues={{
                //     issuetype: details.internaltype
                // }}
                onFinish={onFinish}
            >
                {/* IssueType
                <Form.Item
                    style={{ minWidth: 300, maxWidth: 300 }}
                    name="issuetype"
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
                </Form.Item> */}

                
                {/* <Form.Item
                    style={{ minWidth: 300, maxWidth: 300 }}
                    name="module"
                    label="Module"
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
                </Form.Item> */}
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
