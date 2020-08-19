import React, { useState, useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom';
import { Form, Row, Col, Select, Input } from 'antd';
import { Upload, message, Button } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import CommentBox from '../Component/Comment'
import UploadFile from '../Component/UploadFile'
import axios from 'axios';
const { TextArea } = Input;


let page = {
    data: {
        ProductData: [{
            text: "REM",
            value: "REM"
        },
        {
            text: "PM",
            value: "PM"
        },
        {
            text: "Rental",
            value: "Rental"
        }
        ],
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
            text: "Bug",
            value: "Bug"
        },
        {
            text: "Data",
            value: "Data"
        },
        {
            text: "Use",
            value: "Use"
        },
        {
            text: "New Requirement",
            value: "New Requirement"
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
        Product: [],
        Priority: [],
        IssueType: [],
        Module: []
    }
}

/// Binding DropDown
page.loaddata.Product = page.data.ProductData.map(x => ({ name: x.text, value: x.value }))
page.loaddata.IssueType = page.data.IssueTypeData.map(x => ({ name: x.text, value: x.value }))
page.loaddata.Module = page.data.ModuleData.map(x => ({ name: x.text, value: x.value }))


export default function Customer() {
    const history = useHistory();
    const uploadRef = useRef(null);
    const [product,setProduct] = useState("");
    // const url = new URL(window.location.href);
    // const CompanyParam = url.searchParams.get("CompanyId")
    // const UserIdParam = url.searchParams.get("UserId")
    // const EmailParam = url.searchParams.get("Email")

    //#region function
    const loadmaster = async () => {
        try {
            let products = await axios({
                url: process.env.REACT_APP_API_URL + "/master/products",
                method: "GET"
            });

            let issueType = await axios({
                url: process.env.REACT_APP_API_URL + "/master/issue-types",
                method: "GET"
            });

            let module = await axios({
                url: process.env.REACT_APP_API_URL + "/master/modules",
                method: "GET",
                params:{
                    product_id: "REM"
                }
            });
            console.log("products", products.data)
            console.log("issueType", issueType.data)
            console.log("module", module.data)
            

        } catch (error) {
            console.log("xxx")

        }
    }
    const onFinish = async (values) => {
        console.log("values",values)
        //  console.log("dataUpload", uploadRef.current.getFiles());
        try {
            let createTicket = await axios({
                url: process.env.REACT_APP_API_URL + "",
                method: "POST",
                // headers: {
                //     "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImJhbmtfY29kZSI6IkJCTCIsInRva2VuIjpudWxsLCJ0b2tlbl9leHBpcmUiOm51bGwsImZpcnN0bmFtZV90aCI6bnVsbCwibGFzdG5hbWVfdGgiOm51bGwsImZpcnN0bmFtZV9lbiI6bnVsbCwibGFzdG5hbWVfZW4iOm51bGwsIm1vYmlsZV9ubyI6bnVsbCwicm9sZV9pZCI6MSwiaWF0IjoxNTk2NTMzNDYyLCJleHAiOjE1OTY1NzY2NjJ9.QM6GEzXP-5ZwrQk43snThcJxY3Z5pLKasnYGsXzEQUDANy2S_WW0-BAk0b3LGwUNvScJr-bBS4U33MBuQaL8Bg" 
                // },
                data: {
                    product: values.Product,
                    module: values.Module,
                    issuetype: values.IssueType,
                    topic: values.Topic,
                    details: values.Details,
                    attachment: []
                }
            });
            console.log("data", createTicket.data)

            ////////////////////////////////////////////////

            //////////////////////////////////////////////////////
        } catch (error) {
            alert(error);
            history.push({ pathname: "/customer/issue/inprogress" })

        }
    };
    //#endregion

    useEffect(() => {
        loadmaster()
    }, [])
    return (
        <div style={{
            display: "flex",
            height: "100vh%",
            width: "100%",
            justifyContent: "center",
            background: "-webkit-linear-gradient(bottom, #0250c5, #d43f8d)",
            padding: 20

        }}>

            <Form
                style={{ padding: 20, minWidth: 500, maxWidth: 500, backgroundColor: "white" }}
                name="Issue"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                <h3 style={{ marginTop: 10 }}>แจ้งปัญหาการใช้งาน</h3>
                <hr />
                <Form.Item
                    style={{ minWidth: 200, maxWidth: 300 }}
                    label="Product"
                    name="Product"
                    rules={[
                        {
                            required: true,
                            message: 'กรุณาระบุ Product!',
                        },
                    ]}
                >
                    <Select style={{ width: '95%', marginLeft: 10 }} placeholder="None" options={page.loaddata.Product} onChange={(value) => setProduct(value)}>
                    </Select>
                </Form.Item>
                <Form.Item
                    style={{ minWidth: 200, maxWidth: 300 }}
                    label="Module"
                    name="Module"
                >
                    <Select style={{ width: '91%', marginLeft: 20 }} placeholder="None" options={page.loaddata.Module}>
                    </Select>
                </Form.Item>
                <Form.Item
                    style={{ minWidth: 200, maxWidth: 300 }}
                    label="IssueType"
                    name="IssueType"
                    rules={[
                        {
                            // required: true,
                            message: 'กรุณาระบุ IssueType!',
                        },
                    ]}
                >
                    <Select style={{ width: '100%' }} placeholder="None" options={page.loaddata.IssueType}>
                    </Select>
                </Form.Item>

                <Form.Item
                    style={{ minWidth: 300, maxWidth: 500 }}
                    label="หัวข้อ"
                    name="."
                    rules={[
                        {
                            // required: true,
                            message: 'กรุณาระบุ หัวข้อ!',
                        },
                    ]}
                >
                </Form.Item>
                <Form.Item
                    style={{ minWidth: 300, maxWidth: 500, marginTop: -30 }}
                    name="Topic"
                    rules={[
                        {
                            // required: true,
                            message: 'กรุณาระบุ หัวข้อ!',
                        },
                    ]}
                >
                    <Input placeholder="Username" style={{ width: '100%', marginLeft: 0 }} />
                </Form.Item>
                <Form.Item
                    style={{ minWidth: 300, maxWidth: 500 }}
                    label="รายละเอียด"
                    name="x"
                    rules={[
                        {
                            // required: true,
                            message: 'กรุณาระบุ รายละเอียด!',
                        },
                    ]}
                >

                </Form.Item>

                <Form.Item
                    style={{ minWidth: 300, maxWidth: 500 }}
                    name="Details"
                    rules={[
                        {
                            // required: true,
                            message: 'กรุณาระบุ รายละเอียด!',

                        },
                    ]}
                >
                    <TextArea rows={4} style={{ marginTop: -30 }} />
                </Form.Item>
                <Form.Item
                    style={{ minWidth: 300, maxWidth: 500 }}
                    label="Attachment"
                    name="Attachment"

                >
                    <UploadFile ref={uploadRef} />
                </Form.Item>
                <Form.Item style={{ textAlign: "right" }}>
                    <Button type="primary" htmlType="submit" onClick={onFinish}>
                        Send
                     </Button>
                </Form.Item>
            </Form>


        </div>
    );
}
