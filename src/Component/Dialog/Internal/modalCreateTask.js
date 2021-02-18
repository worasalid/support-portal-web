import React, { useState, useRef, useEffect, useContext } from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { Modal, Form, Input, Select, Button } from 'antd';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import IssueContext from '../../../utility/issueContext';
import TextEditor from '../../../Component/TextEditor';

const { TextArea } = Input;

export default function ModalCreateTask({ visible = false, onOk, onCancel, datarow, details, ...props }) {

    const { state: userstate, dispatch: userdispatch } = useContext(IssueContext);
    const [form] = Form.useForm();
    const editorRef = useRef(null)

    const LoadModule = async () => {
        try {
            const module = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/modules",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    productId: details.productId
                }
            });
            userdispatch({ type: "LOAD_MODULE", payload: module.data })
        } catch (error) {

        }
    }

    const CreateTask = async (values) => {
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
                    mailboxid: details.mailboxid
                }
            });
            if (createtask.status === 200) {
                await Modal.info({
                    title: 'สร้าง Task งานสำเร็จ',
                    content: (
                        <div>
                            <p></p>
                        </div>
                    ),
                    onOk() {
                        onOk();
                        form.resetFields();
                    },
                });
            }
        } catch (error) {
            await Modal.info({
                title: 'สร้าง Task งานไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.message}</p>
                        <p>{error.response.data}</p>
                    </div>
                ),
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

    // console.log("details",details)
    return (
        <Modal
            visible={visible}
            onOk={() => { form.submit(); onCancel() }}
            okText="Create"
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            onCancel={() => {
                return (form.resetFields(), onCancel())
            }
            }
            {...props}

        >
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
                    <TextEditor ref={editorRef} />
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

        </Modal>
    )
}