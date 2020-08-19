import React, { useState, useRef } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import UploadFile from '../../UploadFile'

let page = {
    data: {
        PriorityData: [{
            text: "Low",
            id: "Low"
        },
        {
            text: "Medium",
            id: "Medium"
        },
        {
            text: "High",
            id: "High"
        }],
        IssueTypeData: [{
            name: "Bug",
            id: "Bug"
        },
        {
            name: "Data",
            id: "Data"
        },
        {
            name: "Use",
            id: "Use"
        },
        {
            name: "New Requirement",
            id: "New Requirement"
        }
        ],
        AssignTodata: [{
            text: "Worasalid",
            value: "Worasalid"
        },
        {
            text: "Admin",
            value: "Admin"
        },
        {
            text: "Support",
            value: "Support"
        },
        {
            text: "Developer",
            value: "Developer"
        },
        ],
        ProgressStatusData: [
            {
                text: "InProgress",
                value: "InProgress"
            },
            {
                text: "Resolved",
                value: "Resolved"
            }
        ],
        ModuleData: [{
            text: "CRM",
            value: "CRM"
        },
        {
            text: "Finance",
            value: "Finance"
        },
        {
            text: "SaleOrder",
            value: "SaleOrder"
        },
        {
            text: "Report",
            value: "Report"
        },
        {
            text: "PrintForm",
            value: "PrintForm"
        },
        ]
    },
    loaddata: {
        ProgressStatus: [],
        IssueType: [],
        Module: []
    }
}


export default function ModalSupport({ visible = false, onOk, onCancel, ...props }) {
    const uploadRef = useRef(null);
    page.loaddata.IssueType = page.data.IssueTypeData.map(x => ({ name: x.name, value: x.id }))
    page.loaddata.Module = page.data.ModuleData.map(x => ({ name: x.text, value: x.value }))
    function HandleChange(value) {
        console.log(`selected ${value}`)
    }
    const onFinish = (values) => {
        
         console.log('Success:', values);
         onOk()
    };

    return (
        <Modal 
            title="Basic Modal"
            visible={visible}
            // onOk ={onFinish}
            okType="dashed"
            onCancel={onCancel}
            width={800}
            footer={[
                <Button key="back">
                  Return
                </Button>,
                <Button key="submit" htmlType="submit" type="primary" onClick={onFinish}>
                  Submit
                </Button>,
              ]}
            {...props}

        >
            <Form style={{ padding: 0, maxWidth: 450, backgroundColor: "white" }}
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                IssueType
                <Form.Item
                    style={{ minWidth: 300, maxWidth: 300 }}
                    name="IssueType"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your IssueType!',
                        },
                    ]}
                >
                    <Select style={{ width: '100%' }} placeholder="None" options={page.loaddata.IssueType}>
                    </Select>
                </Form.Item>

                Module
                <Form.Item
                    style={{ minWidth: 300, maxWidth: 300 }}
                    name="module"
                    rules={[
                        {
                            required: true,
                            message: 'Please Select module!',
                        },
                    ]}
                >
                    <Select style={{ width: '100%' }} placeholder="None" options={page.loaddata.Module}>
                    </Select>
                </Form.Item>
            </Form>
             Remark :
            <Editor
                apiKey="e1qa6oigw8ldczyrv82f0q5t0lhopb5ndd6owc10cnl7eau5"
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
                onEditorChange={HandleChange}
            />
            <br />
             AttachFile : <UploadFile ref={uploadRef} />
        </Modal>
    );
}
