import React, { useState, useContext, useEffect } from 'react';
import { Modal, Form, Input } from 'antd';

import Axios from 'axios';
//import IssueContext, { customerReducer, customerState } from "../../../utility/issueContext";
import { useHistory } from 'react-router-dom';

const { TextArea } = Input;


export default function ModalCancelIssue({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    // const [textValue, setTextValue] = useState("")
    //const { state: customerstate, dispatch: customerdispatch } = useContext(IssueContext);
    const [form] = Form.useForm();


    const FlowCancel = async (values) => {
        try {
            const cancelflow = await Axios({
                url: process.env.REACT_APP_API_URL + "/workflow/customer-cancel",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketid: details.ticketid,
                    mailboxid: details.mailboxid,
                    flowoutputid: details.flowoutputid,
                    description: values.description
                }
            });

            if (cancelflow.status === 200) {
                onCancel();
                await Modal.info({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>บันทึกข้อมูลสำเร็จ</p>
                        </div>
                    ),
                    onOk() {
                        onOk();
                        history.push({ pathname: "/customer/issue/cancel" })
                        form.resetFields();
                        
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
