import React, { useState, useRef, useContext, useEffect } from 'react';
import { Modal, Rate, Form, Input } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import IssueContext, { customerReducer, customerState } from "../../../utility/issueContext";
import { useHistory } from 'react-router-dom';

const { TextArea } = Input;


export default function ModalReOpen({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const uploadRef = useRef(null);
    const editorRef = useRef(null)
    const [textValue, setTextValue] = useState("")
    const { state: customerstate, dispatch: customerdispatch } = useContext(IssueContext);
    const [form] = Form.useForm();

    const handleEditorChange = (content, editor) => {
        setTextValue(content);
      }

    const FlowReOpen = async (values) => {
        try {
            const completeflow = await Axios({
                url: process.env.REACT_APP_API_URL + "/workflow/reopen",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketId: details && details.ticketId,
                    ticketnumber: details && details.ticketnumber,
                    mailbox_id: details && details.mailboxId,
                    node_output_id: details && details.node_output_id,
                    to_node_id: details && details.to_node_id,
                    node_action_id: details && details.to_node_action_id,
                    product_id: details && details.productId,
                    module_id: details && details.moduleId,
                    flowstatus: details.flowstatus,
                    groupstatus: details.groupstatus,
                    type: "Customer",
                    history: {
                        historytype: "Customer",
                        description: details.flowaction
                    },
                   reason: values.reason

                }
            });

            if (completeflow.status === 200) {
                onCancel();
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
            </Form >



        </Modal>
    );
}
