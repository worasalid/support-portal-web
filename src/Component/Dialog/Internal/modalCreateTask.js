import React, { useState, useRef, useEffect, useContext } from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { Modal, Form, Input, Select, Spin } from 'antd';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import IssueContext from '../../../utility/issueContext';
import TextEditor from '../../../Component/TextEditor';

const { TextArea } = Input;

export default function ModalCreateTask({ visible = false, onOk, onCancel, datarow, details, ...props }) {

    const { state: userstate, dispatch: userdispatch } = useContext(IssueContext);
    const [form] = Form.useForm();
    const editorRef = useRef(null);
    const uploadRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const LoadModule = async () => {
        try {
            const module = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/modules",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    productId: details.productid
                }
            });
            userdispatch({
                type: "LOAD_MODULE",
                payload: module.data.filter((n) => n.IsActive === true)
            })
        } catch (error) {

        }
    }

    const CreateTask = async (values) => {
        setLoading(true);
        try {
            const createtask = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/create-task",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketid: details.ticketid,
                    title: values.title,
                    description: editorRef.current.getValue(),
                    moduleid: values.module,
                    mailboxid: details.mailboxid,
                    files: uploadRef.current.getFiles().map((n) => n.response),
                }
            });
            if (createtask.status === 200) {
                setLoading(false);
                onCancel();
                await Modal.success({
                    title: 'สร้าง Task งานสำเร็จ',
                    content: (
                        <div>
                            <p></p>
                        </div>
                    ),
                    okText: "Close",
                    onOk() {
                        onOk();
                        form.resetFields();
                        window.location.reload();
                    },
                });
            }
        } catch (error) {
            setLoading(false);
            await Modal.error({
                title: 'สร้าง Task งานไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.message}</p>
                        <p>{error.response.data}</p>
                    </div>
                ),
                okText: "Close",
                onOk() {
                    onOk();
                },
            });
        }

    }

    const onFinish = (values) => {
        CreateTask(values);
    };

    useEffect(() => {
        if (visible) {
            LoadModule();
            form.setFieldsValue({ title: details.title })
        }

    }, [visible])

    return (
        <Modal
            visible={visible}
            confirmLoading={loading}
            onOk={() => { form.submit() }}
            okText="Create"
            okButtonProps={{ type: "primary", htmlType: "submit", color: "#00CC00" }}
            onCancel={() => {
                return (form.resetFields(), onCancel())
            }
            }
            {...props}

        >
            <Spin spinning={loading} size="large" tip="Loading...">
                <Form form={form} style={{ padding: 0, maxWidth: "100%", backgroundColor: "white" }}
                    name="form-createtask"
                    className="login-form"
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        style={{ width: "100%" }}
                        name="title"
                        label="Title"
                        rules={[
                            {
                                required: true,
                                message: 'กรุณาระบุ หัวข้อ!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        style={{ width: "100%" }}
                        name="description"
                        label="Description"

                    >
                        <TextEditor ref={editorRef} ticket_id={details.ticketid} />
                    </Form.Item>

                    <Form.Item
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
                    </Form.Item>
                </Form>
                <br />
                AttachFile : <UploadFile ref={uploadRef} />
            </Spin>
        </Modal>
    )
}