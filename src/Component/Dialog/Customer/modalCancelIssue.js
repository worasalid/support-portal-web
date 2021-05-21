import React, { useState, useContext, useEffect } from 'react';
import { Modal, Form, Input, Spin } from 'antd';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';

const { TextArea } = Input;


export default function ModalCancelIssue({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);


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
                setLoading(false);
                onCancel();

                await Modal.success({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>บันทึกข้อมูลสำเร็จ</p>
                        </div>
                    ),
                    okText: "Close",
                    onOk() {
                        onOk();
                        history.push({ pathname: "/customer/issue/cancel" });
                        form.resetFields();
                        window.location.reload(true);

                    },
                });
            }

        } catch (error) {
            setLoading(false);
            onCancel();

            await Modal.error({
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.message}</p>
                        <p>{error.response.data}</p>
                    </div>
                ),
                okText: "Close",
                onOk() {
                    form.resetFields();
                    onOk();
                },
            });

        }
    }

    const onFinish = values => {
        setLoading(true);
        FlowCancel(values);
    };

    useEffect(() => {
        if (visible) {

        }
    }, [visible])

    return (
        <Modal
            visible={visible}
            onOk={() => form.submit()}
            okButtonProps={""}
            onCancel={() => {
                onCancel();
                form.resetFields();
            }}
            {...props}
        >
            <Spin spinning={loading} size="large" tip="Loading...">
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
            </Spin>
        </Modal>
    );
}
