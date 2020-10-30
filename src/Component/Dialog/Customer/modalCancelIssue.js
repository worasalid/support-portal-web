import React, { useState, useRef, useContext, useEffect } from 'react';
import { Modal, Rate, Form, Input } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import IssueContext, { customerReducer, customerState } from "../../../utility/issueContext";
import { useHistory } from 'react-router-dom';

const { TextArea } = Input;


export default function ModalCancelIssue({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const [textValue, setTextValue] = useState("")
    const { state: customerstate, dispatch: customerdispatch } = useContext(IssueContext);
    const [form] = Form.useForm();


    const FlowCancel = async (values) => {
        try {
            const completeflow = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/cancel",
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
                    cancel_reason: 0,
                    cancel_reasontext: "",
                    cancel_description: values.description,
                    //node_action_id: details && details.to_node_action_id,
                   // product_id: details && details.productId,
                   // module_id: details && details.moduleId,
                    flowstatus: details.flowstatus,
                    groupstatus: details.groupstatus,
                    history: {
                        historytype: "Customer",
                        description: details.flowaction
                    }
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
                        if (details.flowstatus === "Cancel") {
                            history.push({ pathname: "/customer/issue/cancel" })
                        }
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

        FlowCancel(values)
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
                layout="vertical"
                name="issuecancel"
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                <Form.Item
                    label="เหตุผลในการยกเลิก"
                    name="description"
                    rules={[{ required: true, message: 'กรุณาระบุเหตุผลในการยกเลิก' }]}
                >
                    <TextArea rows={5} style={{ width: "100%" }} />
                </Form.Item>
            </Form >



        </Modal>
    );
}
