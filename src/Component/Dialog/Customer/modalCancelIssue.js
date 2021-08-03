import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Spin, Select } from 'antd';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';

const { TextArea } = Input;


export default function ModalCancelIssue({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [cancelData, setCancelData] = useState(null);
    const [formHidden, setFormHidden] = useState(true);

    const configData = async () => {
        try {
            const configData = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/config-data",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    groups: "ResonCancel"
                }

            });

            if (configData.status === 200) {
                setCancelData(configData.data)
            }

        } catch (error) {

        }
    }

    const FlowCancel = async (values) => {
        setLoading(true);
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
                    cancel_reason: values.reason,
                    cancel_description: values.description
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

    const onChange = (value, item) => {
        if (item.label === "อื่นๆ โปรดระบุ") {
            setFormHidden(false);
           
        }else{
            setFormHidden(true);
            form.setFieldsValue({description: undefined})
        }
    }

    const onFinish = values => {
        FlowCancel(values);
    };

    useEffect(() => {
        if (visible) {
            configData();
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
                        name="reason"
                        rules={[{ required: true, message: 'กรุณาระบุเหตุผลในการยกเลิก' }]}
                    >
                        <Select placeholder="เหตุผลการ ยกเลิก" style={{ width: "100%" }}
                            allowClear
                            maxTagCount={1}
                            onChange={(value, item) => onChange(value, item)}
                            options={cancelData && cancelData.map((x) => ({ value: x.Id, label: x.Name }))}

                        />

                    </Form.Item>
                    <Form.Item
                        hidden={formHidden}
                        label="รายละเอียด"
                        name="description"
                        rules={[{ required: false, message: 'กรุณาระบุ รายละเอียด' }]}
                    >

                        <TextArea rows={5} style={{ width: "100%" }} />
                    </Form.Item>
                </Form >
            </Spin>
        </Modal>
    );
}
