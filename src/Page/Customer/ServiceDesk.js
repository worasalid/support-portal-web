import { Button, Form, Input, Select, Card, Avatar } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import UploadFile from "../../Component/UploadFile";
import { BugOutlined, FileOutlined, SendOutlined, DatabaseOutlined, PhoneOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Meta } = Card;
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 24 },
};
const tailLayout = {
    wrapperCol: { offset: 8, span: 24 },
};

let page = {
    data: {
        ProductData: [
            {
                text: "REM",
                value: "REM",
            },
            {
                text: "PM",
                value: "PM",
            },
            {
                text: "Rental",
                value: "Rental",
            },
        ],
        PriorityData: [
            {
                text: "Low",
                id: "Low",
            },
            {
                text: "Medium",
                id: "Medium",
            },
            {
                text: "High",
                id: "High",
            },
        ],
        IssueTypeData: [
            {
                text: "Bug",
                value: "Bug",
            },
            {
                text: "Data",
                value: "Data",
            },
            {
                text: "Use",
                value: "Use",
            },
            {
                text: "New Requirement",
                value: "New Requirement",
            },
        ],
        ModuleData: [
            {
                text: "CRM",
                value: "CRM",
            },
            {
                text: "Finance",
                value: "Finance",
            },
            {
                text: "SaleOrder",
                value: "SaleOrder",
            },
            {
                text: "Report",
                value: "Report",
            },
            {
                text: "PrintForm",
                value: "PrintForm",
            },
        ],
    },
    loaddata: {
        Product: [],
        Priority: [],
        IssueType: [],
        Module: [],
    },
};



/// Binding DropDown
page.loaddata.Product = page.data.ProductData.map((x) => ({
    name: x.text,
    value: x.value,
}));
page.loaddata.IssueType = page.data.IssueTypeData.map((x) => ({
    name: x.text,
    value: x.value,
}));
page.loaddata.Module = page.data.ModuleData.map((x) => ({
    name: x.text,
    value: x.value,
}));

export default function ServiceDesk(props) {
    const history = useHistory();
    const [hiddenForm, sethiddenForm] = useState(true);
    const uploadRef = useRef(null);

    //#region function
    const loadmaster = async () => {
        try {
            let products = await axios({
                url: process.env.REACT_APP_API_URL + "/master/products",
                method: "GET",
            });

            let issueType = await axios({
                url: process.env.REACT_APP_API_URL + "/master/issue-types",
                method: "GET",
            });

            let module = await axios({
                url: process.env.REACT_APP_API_URL + "/master/modules",
                method: "GET",
                params: {
                    product_id: "REM",
                },
            });
            console.log("products", products.data);
            console.log("issueType", issueType.data);
            console.log("module", module.data);
        } catch (error) {
            console.log("xxx");
        }
    };

    const onFinish = async (values) => {
        console.log(values)
        // history.push("/customer/issue/inprogress");

        // console.log("values", values);
        // //  console.log("dataUpload", uploadRef.current.getFiles());
        // try {
        //   let createTicket = await axios({
        //     url: process.env.REACT_APP_API_URL + "",
        //     method: "POST",
        //     // headers: {
        //     //     "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImJhbmtfY29kZSI6IkJCTCIsInRva2VuIjpudWxsLCJ0b2tlbl9leHBpcmUiOm51bGwsImZpcnN0bmFtZV90aCI6bnVsbCwibGFzdG5hbWVfdGgiOm51bGwsImZpcnN0bmFtZV9lbiI6bnVsbCwibGFzdG5hbWVfZW4iOm51bGwsIm1vYmlsZV9ubyI6bnVsbCwicm9sZV9pZCI6MSwiaWF0IjoxNTk2NTMzNDYyLCJleHAiOjE1OTY1NzY2NjJ9.QM6GEzXP-5ZwrQk43snThcJxY3Z5pLKasnYGsXzEQUDANy2S_WW0-BAk0b3LGwUNvScJr-bBS4U33MBuQaL8Bg"
        //     // },
        //     data: {
        //       product: values.Product,
        //       module: values.Module,
        //       issuetype: values.IssueType,
        //       topic: values.Topic,
        //       details: values.Details,
        //       attachment: [],
        //     },
        //   });
        //   console.log("data", createTicket.data);
        //   ////////////////////////////////////////////////
        //   //////////////////////////////////////////////////////
        // } catch (error) {
        //   alert(error);
        //   history.push({ pathname: "/customer/issue/inprogress" });
        // }
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };
    //#endregion

    useEffect(() => {
        // loadmaster();
    }, []);

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    textAlign: "left"
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        backgroundColor: "rgb(0, 116, 224)",
                        backgroundImage: "blob:https://worasalid2.atlassian.net/5560084b-57ec-4886-b13e-36c814862b5a",
                        height: "30vh",
                        width: "100%",

                    }}
                >
                </div>
                <Card size="default" hoverable style={{
                    width: "700px",
                    top: 50,
                    position: "absolute"
                }}>
                    <h3 style={{ marginTop: 10 }}>แจ้งปัญหาการใช้งาน</h3>
                    <hr />

                    <div style={{ padding: 24 }}>
                        <SendOutlined style={{ fontSize: 30 }} />&nbsp;&nbsp;&nbsp;
                        <label className="header-text">Contact us about</label>
                        <Card className="card-box" hoverable onClick={() => sethiddenForm(false)}>
                            <Meta
                                avatar={
                                    <BugOutlined style={{ fontSize: 30 }} />
                                }
                                title={<label className="card-title-menu">Bug</label>}
                                description="แจ้งปัญหา ที่เกิดจากระบบทำงานผิดผลาด"
                            />
                        </Card>
                        <Card className="card-box" hoverable>
                            <Meta
                                avatar={
                                    <FileOutlined style={{ fontSize: 30 }} />
                                }
                                title={<label className="card-title-menu">Change Request</label>}
                                description="แจ้งปรับปรุง หรือ เพิ่มเติมการทำงานของระบบ"
                            />
                        </Card>
                        <Card className="card-box" hoverable>
                            <Meta
                                avatar={
                                    <DatabaseOutlined style={{ fontSize: 30 }} />
                                }
                                title={<label className="card-title-menu">Data</label>}
                                description="แจ้งปรับปรุงข้อมูลในระบบ"
                            />
                        </Card>
                        <Card hoverable style={{ width: "100%", marginTop: 16 }}>
                            <Meta
                                avatar={
                                    <PhoneOutlined style={{ fontSize: 30 }} />
                                }
                                title={<label style={{ color: "rgb(0, 116, 224)" }}>Use</label>}
                                description="สอบถามข้อมูลทั่วไป / การใช้งานระบบ"
                            />
                        </Card>
                    </div>
                    <Form
                       hidden={hiddenForm}
                        {...layout}

                        name="issue"
                        initialValues={{
                            product: "REM",
                            module: "CRM",
                            issue_type: "Bug",
                        }}
                        layout="vertical"
                        style={{ padding: 32 }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}

                    >

                        <Form.Item
                            label="Product"
                            name="product"
                            style={{ width: "100%" }}
                            rules={[
                                {
                                    required: true,
                                    message: "กรุณาระบุ Product!",
                                },
                            ]}
                        >
                            <Select
                                options={page.loaddata.Product}
                                onChange={(value) => ""}
                            >
                            </Select>
                        </Form.Item>
                        <Form.Item label="Module" name="module">
                            <Select placeholder="None" options={page.loaddata.Module}></Select>
                        </Form.Item>
                        <Form.Item
                            label="IssueType"
                            name="issue_type"
                            rules={[
                                {
                                    // required: true,
                                    message: "กรุณาระบุ IssueType!",
                                },
                            ]}
                        >
                            <Select
                                placeholder="None"
                                options={page.loaddata.IssueType}
                            ></Select>
                        </Form.Item>
                        <Form.Item
                            label="หัวข้อ"
                            name="subject"
                            rules={[
                                {
                                    // required: true,
                                    message: "กรุณาระบุ หัวข้อ!",
                                },
                            ]}
                        >
                            <Input placeholder="หัวข้อ" />
                        </Form.Item>
                        <Form.Item
                            label="รายละเอียด"
                            name="description"
                            rules={[
                                {
                                    // required: true,
                                    message: "กรุณาระบุ รายละเอียด!",
                                },
                            ]}
                        >
                            <TextArea rows={5} placeholder="รายละเอียด" />
                        </Form.Item>
                        <Form.Item label="ไฟล์แนบ" name="attach">
                            <UploadFile ref={uploadRef} />
                        </Form.Item>
                        <Form.Item {...tailLayout}>
                            <Button type="primary" htmlType="submit"  >
                                ยื่นเรื่อง
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>

            </div>
        </>
    );
}
