import React, { useState, useRef, useContext, useEffect } from 'react';
import { Modal, Rate, Form, Input } from 'antd';
import TextEditor from '../../TextEditor';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import IssueContext, { customerReducer, customerState } from "../../../utility/issueContext";
import { useHistory } from 'react-router-dom';

const { TextArea } = Input;


export default function ModalReOpen({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const uploadRef = useRef(null);
    const editorRef = useRef(null)
    // const [textValue, setTextValue] = useState("")
    const { state: customerstate, dispatch: customerdispatch } = useContext(IssueContext);
    const [form] = Form.useForm();

    // const handleEditorChange = (content, editor) => {
    //     setTextValue(content);
    // }

    const SaveComment = async () => {
        try {
            if (editorRef.current.getValue() !== "" || editorRef.current.getValue() !== null) {
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


    const FlowReOpen = async (values) => {
        try {
            const completeflow = await Axios({
                url: process.env.REACT_APP_API_URL + "/workflow/customer-send",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketid: details.ticketid,
                    mailboxid: details.mailboxid,
                    flowoutputid: details.flowoutputid
                }

            });

            if (completeflow.status === 200) {
                onOk();
                SaveComment();
                await Modal.info({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>บันทึกข้อมูลสำเร็จ</p>
                        </div>
                    ),
                    onOk() {
                        form.resetFields();
                        onOk();
                        history.push({ pathname: "/customer/issue/inprogress" })
                    },
                });
            }

        } catch (error) {
            onCancel();
            await Modal.info({
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.message}</p>
                        <p>{error.response.data}</p>
                    </div>
                ),
                onOk() {
                    form.resetFields();
                    onOk();
                },
            });

        }
    }

    const onFinish = values => {
        console.log('Success:', values);

        FlowReOpen(values)
    };

    useEffect(() => {

    }, [])

    return (
        <Modal
            visible={visible}
            onOk={() => { return (form.submit()) }}
            okButtonProps={""}
            onCancel={() => { return onCancel(), form.resetFields() }}
            {...props}
        >
            <Form
                form={form}
                name="reopen"
                layout="vertical"
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >

                <Form.Item
                    label="เหตุผลการ ReOpen"
                    name="reason"
                >
                    <TextArea rows={5} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="Remark"
                    name="remark"
                >
                    <TextEditor ref={editorRef} />
                    <br />
      AttachFile : <UploadFile ref={uploadRef} />
                </Form.Item>
            </Form >



        </Modal>
    );
}
