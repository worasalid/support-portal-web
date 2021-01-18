import React, { useState, useRef, useContext } from 'react';
import { Modal, Form, Row, Col, Select } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { useHistory, useRouteMatch } from "react-router-dom";
import UploadFile from '../../../UploadFile'
import RicefContext, { ricefReducer, ricefState } from "../../../../utility/ricefContext";
import Axios from 'axios';


export default function ModalConsult({ visible = false, onOk, onCancel, details, ...props }) {
    const match = useRouteMatch();
    const history = useHistory();
    const { state: ricefstate, dispatch: ricefdispatch } = useContext(RicefContext);

    const uploadRef = useRef(null);
    const uploadRef_unittest = useRef(null);
    const [form] = Form.useForm();

    const [assignee, setAssignee] = useState(null);
    const [textValue, setTextValue] = useState("");
    const editorRef = useRef(null)

    const handleEditorChange = (content, editor) => {
        setTextValue(content);
    }

    const GetDeveloper = async () => {
        try {
            const module = await Axios({
                url: process.env.REACT_APP_API_URL + "/ricef/assign-developer",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    ricefid: match.params.ricefid
                }
            });
            ricefdispatch({ type: "LOAD_ASSIGNEE", payload: module.data })
        } catch (error) {

        }
    }

    const SaveComment = async () => {
        try {
            if (textValue !== "") {
                const comment = await Axios({
                    url: process.env.REACT_APP_API_URL + "/ricef/create-comment",
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                    },
                    data: {
                        ricefid: match.params.ricefid,
                        comment_text: textValue,
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
                url: process.env.REACT_APP_API_URL + "/ricef/send-task",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ricefid: details.ricefid,
                    status: details.flowstatus,
                    value: {
                        assigneeid: assignee
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
                            <p>ส่งงานให้ Developer แก้ไข</p>
                        </div>
                    ),
                    onOk() {
                        editorRef.current.editor.setContent("");
                        history.goBack();
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

                },
            });
        }
    }

    const onFinish = (values) => {
        console.log('Success:', values);
        SendFlow(values);
    };


    return (
        <Modal
            visible={visible}
            onOk={() => form.submit()}
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            okText="Send"
            okType="dashed"
            onCancel={() => { return (form.resetFields(), onCancel(), editorRef.current.editor.setContent("")) }}

            {...props}

        >

            <Form form={form} style={{ padding: 0, maxWidth: "100%", backgroundColor: "white" }}
                layout="vertical"
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >

                <Form.Item
                    style={{ display: details.status === "Open" ? "block" : "none" }}
                    label="Assign Developer"
                    name="assign"
                    rules={[
                        {
                            required:  details.status === "Open" ? true : false,
                            message: 'กรุณาระบุชื่อ Developer ',
                        },
                    ]}
                >
                    <Select
                        style={{ width: '50%' }}
                        allowClear
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onClick={() => GetDeveloper()}

                        options={ricefstate.assignee?.map((x) => ({ value: x.UserId, label: x.UserName, type: "module" }))}
                        onChange={(value, item) => setAssignee(value)}
                        defaultValue="None"
                    />
                </Form.Item>
                <Form.Item
                    label="Remark"
                    name="remark"
                    rules={[
                        {
                            required: false,
                            message: 'กรุณาระบุชื่อ Developer ',
                        },
                    ]}
                >
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


            {/* 
            <Row style={{ marginTop: 30 }}>
                <Col span={24}>
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
                </Col>
            </Row> */}

        </Modal>
    )
}
