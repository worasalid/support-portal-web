import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Modal, Form, Select } from 'antd';
import UploadFile from '../../UploadFile';
import Axios from 'axios';
import TextEditor from '../../TextEditor';

const { Option } = Select;

export default function ModalResolved({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const uploadRef = useRef(null);
    const uploadRef_testresult = useRef(null);
    const [form] = Form.useForm();
    const editorRef = useRef(null)

    const progressOnPremise = [
        {
            name: "Waiting Customer Update Patch",
            label: "Waiting Customer Update Patch"
        },
        {
            name: "Waiting Customer Deploy PRD",
            label: "Waiting Customer Deploy PRD"
        }
    ]

    const progressOnCloud = [
        {
            name: "Automatic Update Patch",
            label: "Automatic Update Patch"
        },
        {
            name: "Waiting Customer Test",
            label: "Waiting Customer Test"
        },
        {
            name: "Deploy PRD Completed",
            label: "Deploy PRD Completed"
        }
    ]


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
                        comment_text: editorRef.current.getValue(),
                        comment_type: "customer",
                        files: uploadRef.current.getFiles().map((n) => n.response.id),
                    }
                });
            }
        } catch (error) {

        }
    }

    const SaveTestResult = async () => {
        try {
            const comment = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/save-document",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketid: details && details.ticketid,
                    files: uploadRef_testresult.current.getFiles().map((n) => n.response.id),
                    reftype: "Master_Ticket",
                    grouptype: "testResult"
                }
            });
        } catch (error) {

        }
    }

    const SendFlow = async (item) => {
        try {
            const sendflow = await Axios({
                url: process.env.REACT_APP_API_URL + "/workflow/send-issue",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketid: details.ticketid,
                    mailboxid: details && details.mailboxid,
                    flowoutputid: details.flowoutput.FlowOutputId,
                    value: {
                        progress_description: item.progress_description
                    }
                }
            });

            if (sendflow.status === 200) {
                SaveTestResult();
                SaveComment();
                onOk();
                await Modal.success({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>บันทึกข้อมูลสำเร็จ</p>
                        </div>
                    ),
                    onOk() {
                        editorRef.current.setvalue();
                        history.push({ pathname: "/internal/issue/resolved" })
                    },
                });
            }
        } catch (error) {
            await Modal.error({
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.response.data}</p>
                    </div>
                ),
                onOk() {
                    editorRef.current.setvalue();
                    onOk();

                },
            });
        }
    }

    const onFinish = (values) => {
        console.log('onFinish:', values);
        SendFlow(values);
    };

    useEffect(() => {
        if (visible) {
        }

    }, [visible])


    return (
        <Modal
            visible={visible}
            onOk={() => { return (form.submit()) }}
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            okText="Send"
            okType="dashed"
            onCancel={() => { return (form.resetFields(), editorRef.current.setvalue(), onCancel()) }}
            {...props}
        >

            <Form form={form} style={{ padding: 0, maxWidth: "100%", backgroundColor: "white" }}
                layout="vertical"
                name="form-resolved"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    style={{ minWidth: 300, maxWidth: 800 }}
                    label="สถานะ Progress"
                    name="progress_description"
                    rules={[
                        {
                            required: true,
                            message: 'กรุณาระบุ Progress'
                        },
                    ]}
                >

                    <Select
                        placeholder="None"
                        style={{ width: "60%" }}
                        options={
                            details && details?.iscloudsite === false ?
                                progressOnPremise.map((x) => ({ value: x.name, label: x.label })) :
                                progressOnCloud.map((x) => ({ value: x.name, label: x.label }))
                        }
                    />
                </Form.Item>

                {
                    details.flowoutput.value === "Deploy"
                        ? ""
                        : <Form.Item
                            style={{ minWidth: 300, maxWidth: 800 }}
                            label="Test Result (ใบส่งมอบงาน)"
                            name="uploadresult"
                            rules={[
                                {
                                    required: false,
                                    message: 'กรุณาแนบ (ใบส่งมอบงาน)'
                                },
                            ]}
                        >
                            <UploadFile ref={uploadRef_testresult} />
                        </Form.Item>
                }


            </Form>



            <label className="header-text">Remark</label>
            <TextEditor ref={editorRef} />
            <br />
                     AttachFile : <UploadFile ref={uploadRef} />

        </Modal>
    )
}
