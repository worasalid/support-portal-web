import React, { useState, useRef, useEffect, useContext } from 'react';
import { useHistory } from "react-router-dom";
import { Modal, DatePicker, Row, Col, Form, Button, Input } from 'antd';
import UploadFile from '../../UploadFile'
import { Editor } from '@tinymce/tinymce-react';
import Axios from 'axios';
import IssueContext from '../../../utility/issueContext';
import moment from 'moment';


export default function ModalDueDate({ visible = false, onOk, onCancel, details, ...props }) {
    const history = useHistory();
    const [form] = Form.useForm();
    const uploadRef = useRef(null);
    const [textValue, setTextValue] = useState("");
    const [duedate, setDuedate] = useState(null);
    const editorRef = useRef(null)
    const { state: userstate, dispatch: userdispatch } = useContext(IssueContext);

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
                    flowoutputid: details.flowoutput.FlowOutputId,
                    value: {
                        duedate: values.duedate,
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
                        window.location.reload(false)
                        // history.push({ pathname: "/internal/issue/inprogress" })
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
                    editorRef.current.editor.setContent("")
                    onOk();
                    history.push({ pathname: "/internal/issue/inprogress" })
                },
            });
        }
    }

    const SendIssue = async (values) => {
        try {
            const sendissue = await Axios({
                url: process.env.REACT_APP_API_URL + "/workflow/send-issue",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketid: details.ticketid,
                    mailboxid: details.mailboxid,
                    flowoutputid: details.flowoutput.FlowOutputId,
                    value: {
                        duedate: values.duedate,
                        comment_text: textValue
                    }

                }
            });

            if (sendissue.status === 200) {
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
                        editorRef.current.editor.setContent("")
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
                    editorRef.current.editor.setContent("")
                    onOk();
                    history.push({ pathname: "/internal/issue/inprogress" })
                },
            });
        }
    }

    const onFinish = async (values) => {
        //console.log("onFinish",values)
        if (details.flowoutput.Type === "Issue") {
            SendIssue(values)
        } else {
            SendFlow(values)
        }

    };


    useEffect(() => {

    }, [visible])



    return (
        <Modal
            visible={visible}
            okText="Save"
            onOk={() => { return (form.submit()) }}
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            onCancel={() => {
                return (form.resetFields(), onCancel(), editorRef.current.editor.setContent(""))
            }
            }
            {...props}
        >

            <Form form={form} style={{ padding: 0, width: "100%", backgroundColor: "white" }}
                name="logDueDate"
                className="login-form"
                onFinish={onFinish}
            >
                <Row>
                    <Col span={24}>
                        <label className="header-text">กำหนด DueDate :</label><br />
                        <Form.Item
                            name="duedate"
                            rules={[
                                {
                                    required: false,
                                    message: 'กรุณาระบุ DueDate',
                                },
                            ]}
                        >
                            <DatePicker
                                format="DD/MM/YYYY"
                                defaultValue={details.duedate === null ? "" : moment(details?.duedate, "DD/MM/YYYY")}
                                onChange={(date, datestring) => { form.setFieldsValue({ duedate: datestring }); setDuedate(datestring) }} /><br />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

            <label className="header-text">Remark</label>
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

        </Modal >
    )
}
