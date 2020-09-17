import React, { useEffect, useRef, useState, useContext, useReducer } from 'react'
import { Button, Form, Input, Select, Card, Avatar, Dropdown, Menu, Row, Col, Modal } from "antd";
import { PhoneOutlined, DatabaseOutlined, FileOutlined, SendOutlined, BugOutlined } from '@ant-design/icons'
import { useHistory, useRouteMatch } from "react-router-dom";
import MasterPage from "./MasterPage"
import UploadFile from "../../../Component/UploadFile";
import Axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';
import classNames from 'classnames'
import AuthenContext from '../../../utility/authenContext';
import Reducer, { productReducer, moduleReducer, initState } from '../../../utility/reducer';

const { TextArea } = Input;
const { Option } = Select;
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
export default function IssueCreate() {
    const history = useHistory();
    const { state, dispatch } = useContext(AuthenContext);
    const [productstate, productdispatch] = useReducer(productReducer, initState.productState);
    const [modulestate, moduledispatch] = useReducer(moduleReducer, initState.moduleState);

    const match = useRouteMatch();
    const [hiddenForm, sethiddenForm] = useState(false);
    const [title, setTitle] = useState(match.params.id);
    const [description, setDescription] = useState();
    const uploadRef = useRef(null);

    const getproducts = async () => {
        const products = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/products",
            method: "get",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            }
        });
        productdispatch({ type: "SET", payload: products.data });
    }

    const getmodule = async () => {
        const module = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/modules",
            method: "get",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                productId: productstate.search
            }
        });
        moduledispatch({ type: "SET", payload: module.data });
    }

    const getMasterdata = async () => {
        try {
            getproducts();
            getmodule();
        } catch (error) {

        }
    }
    const handleEditorChange = (content, editor) => {
        console.log('Content was updated:', content);
    }
console.log("state",state)
    const onFinish = async (values) => {
        console.log("onFinish", values.description);
        console.log("file", uploadRef.current.getFiles().map((n) => n.response.id))
        try {
            let createTicket = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/create",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    type: 1,
                    product_id: values.product,
                    module_id: values.module,
                    title: values.subject,
                    description: values.description,
                    files: uploadRef.current.getFiles().map((n) => n.response.id),
                    company_id: state.user.company_id
                },
            });

            if (createTicket.status === 200) {
                Modal.info({
                    title: 'แจ้งปัญหาเรียบร้อยแล้ว',
                    content: (
                        <div>
                            <p>Issue เลขที่ : {createTicket.data}</p>

                        </div>
                    ),
                    onOk() {
                        history.push("/customer/issue/inprogress");
                    },
                });
            }

        } catch (error) {
            alert(error);
        }
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    useEffect(() => {
        setDescription(
            `${title}` === "bug" ? "แจ้งปัญหา ที่เกิดจากระบบทำงานผิดผลาด" :
                `${title}` === "changerequest" ? "แจ้งปรับปรุง หรือ เพิ่มเติมการทำงานของระบบ" :
                    `${title}` === "data" ? "แจ้งปรับปรุงข้อมูลในระบบ" :
                        `${title}` === "use" ? "สอบถามข้อมูลทั่วไป / การใช้งานระบบ" : ""
        );

    }, [title]);

    useEffect(() => {
        if (state.authen) {
            getMasterdata();
        }
    }, [state.authen]);

    useEffect(() => {
        if (state.authen) {
            getmodule();
        }
    }, [productstate.search]);

    const images_upload_handler = (blobInfo, success, failure) => {
        setTimeout(function () {
            /* no matter what you upload, we will turn it into TinyMCE logo :)*/
            success('http://moxiecode.cachefly.net/tinymce/v9/images/logo.png');
        }, 2000);
    }

    console.log(productstate.search)
    return (
        <MasterPage>
            <div style={{ padding: 24 }}>
                <div className="sd-page-header">
                    <h3>แจ้งปัญหาการใช้งาน</h3>
                    <hr />
                </div>
                <Form
                    hidden={hiddenForm}
                    {...layout}

                    name="issue"
                    initialValues={{
                        // product: "REM",
                        // module: "CRM",
                        // issue_type: "Bug",
                    }}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}

                >
                    <Form.Item
                        label="IssueType"
                        name="type"
                    >
                        <Dropdown
                            placement="topCenter"
                            overlayStyle={{
                                width: 200,
                                boxShadow:
                                    "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.31) 0px 0px 1px",
                            }}
                            overlay={
                                <Menu mode="inline" theme="light" onMouseOver="" >
                                    <Menu.Item key="1" onClick={
                                        () => { return (setTitle("bug"), history.push("/customer/servicedesk/issuecreate/bug")) }}>
                                        <Card className="issue-active" hoverable>
                                            <Meta
                                                avatar={
                                                    <BugOutlined style={{ fontSize: 30 }} />
                                                }
                                                title={<label className="card-title-menu">Bug</label>}
                                                description={description}
                                            />
                                        </Card>
                                    </Menu.Item>
                                    <Menu.Item key="2" onClick={
                                        () => { return (setTitle("changerequest"), history.push("/customer/servicedesk/issuecreate/changerequest")) }}>
                                        <Card className="issue-active" hoverable >
                                            <Meta
                                                avatar={
                                                    <FileOutlined style={{ fontSize: 30 }} />
                                                }
                                                title={<label className="card-title-menu">Change Request</label>}
                                                description={description}
                                            />
                                        </Card>
                                    </Menu.Item>
                                    <Menu.Item key="3" onClick={
                                        () => { return (setTitle("data"), history.push("/customer/servicedesk/issuecreate/data")) }}>
                                        <Card className="issue-active" hoverable>
                                            <Meta
                                                avatar={
                                                    <DatabaseOutlined style={{ fontSize: 30 }} />
                                                }
                                                title={<label className="card-title-menu">Data</label>}
                                                description={description}
                                            />
                                        </Card>
                                    </Menu.Item>
                                    <Menu.Item key="4" onClick={
                                        () => { return (setTitle("use"), history.push("/customer/servicedesk/issuecreate/use")) }}>
                                        <Card className="issue-active" hoverable style={{ width: "100%", marginTop: 16 }} >
                                            <Meta
                                                avatar={
                                                    <PhoneOutlined style={{ fontSize: 30 }} />
                                                }
                                                title={<label style={{ color: "rgb(0, 116, 224)" }}>Use</label>}
                                                description={description}
                                            />
                                        </Card>
                                    </Menu.Item>
                                </Menu>
                            }
                            trigger="click"

                        >
                            <Card className="card-box issue-active" hoverable>
                                <Meta
                                    avatar={
                                        `${title}` === "bug" ? <BugOutlined style={{ fontSize: 30 }} /> :
                                            `${title}` === "changequest" ? <FileOutlined style={{ fontSize: 30 }} /> :
                                                `${title}` === "data" ? <DatabaseOutlined style={{ fontSize: 30 }} /> :
                                                    <PhoneOutlined style={{ fontSize: 30 }} />
                                    }
                                    title={
                                        <label className="card-title-menu">
                                            {
                                                `${title}` === "bug" ? "Bug" :
                                                    `${title}` === "changerequest" ? "Change Request" :
                                                        `${title}` === "data" ? "Data" :
                                                            `${title}` === "use" ? "Use" : ""
                                            }
                                        </label>
                                    }
                                    description={description}
                                />
                            </Card>

                        </Dropdown>
                    </Form.Item>
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
                            placeholder="Product"
                            onChange={(values) => productdispatch({type: "SELECT", payload: values}) }
                            options={productstate && productstate.data.map((x) => ({ value: x.Id, label: x.Name }))}
                        />
                    </Form.Item>

                    <Form.Item label="Module" name="module">
                        <Select
                            placeholder="Module"
                            options={modulestate && modulestate.data.map(x => ({ value: x.id, label: x.name }))}>

                        </Select>
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
                                required: true,
                                message: "กรุณาระบุ รายละเอียด!",
                            },
                        ]}
                    >
                        <TextArea rows={5} placeholder="รายละเอียด" />
                         {/* <Editor
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
                            onEditorChange={handleEditorChange} 

                        /> */}
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
            </div>


        </MasterPage>
    )
}
