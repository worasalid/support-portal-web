import React, { useEffect, useRef, useState, useContext, useReducer } from 'react'
import { Button, Form, Input, Select, Card, Dropdown, Menu, Row, Col, Modal, List } from "antd";
import { PhoneOutlined, DatabaseOutlined, FileOutlined, BugOutlined, HomeOutlined } from '@ant-design/icons'
import { useHistory, useRouteMatch } from "react-router-dom";
import MasterPage from "./MasterPage"
import UploadFile from "../../../Component/UploadFile";
import Axios from 'axios';
// import classNames from 'classnames'
import AuthenContext from '../../../utility/authenContext';
import { customerReducer, customerState } from '../../../utility/issueContext';
import TextEditor from '../../../Component/TextEditor';
import { Editor } from '@tinymce/tinymce-react';

const { TextArea } = Input;
// const { Option } = Select;
const { Meta } = Card;
const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 24 },
};
const tailLayout = {
    wrapperCol: { offset: 20, span: 24 },
};

export default function IssueCreate() {
    const history = useHistory();
    const { state, dispatch } = useContext(AuthenContext);
    const [customerstate, customerdispatch] = useReducer(customerReducer, customerState)

    const match = useRouteMatch();
    const [hiddenForm, sethiddenForm] = useState(false);
    const [issueType, setIssueType] = useState([]);
    const [title, setTitle] = useState(match.params.id);
    const [typeDes, setTypeDes] = useState();
    const [description, setDescription] = useState();

    const [form] = Form.useForm();
    const uploadRef = useRef(null);
    const editorRef = useRef(null)

    const image_upload_handler = (blobInfo, success, failure, progress) => {
        var xhr, formData;

        xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open("POST", process.env.REACT_APP_API_URL + "/files");

        xhr.upload.onprogress = function (e) {
            progress((e.loaded / e.total) * 100);
        };

        xhr.onload = function () {
            var json;

            if (xhr.status === 403) {
                failure("HTTP Error: " + xhr.status, { remove: true });
                return;
            }

            if (xhr.status < 200 || xhr.status >= 300) {
                failure("HTTP Error: " + xhr.status);
                return;
            }

            json = JSON.parse(xhr.responseText);

            if (!json || typeof json.url != "string") {
                failure("Invalid JSON: " + xhr.responseText);
                return;
            }

            success(json.url);
        };

        xhr.onerror = function () {
            failure(
                "Image upload failed due to a XHR Transport error. Code: " + xhr.status
            );
        };

        formData = new FormData();
        formData.append("file", blobInfo.blob(), blobInfo.filename());

        xhr.send(formData);
    };

    const cusScene = [
        {
            name: "None",
            value: "None"
        },
        {
            name: "Application",
            value: "Application"
        },
        {
            name: "Report",
            value: "Report"
        },
        {
            name: "Printform",
            value: "Printform"
        },
        {
            name: "Data",
            value: "Data"
        }
    ]

    const GetIssueType = async () => {
        try {
            const issuetype = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/issue-types",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                }
            });
            if (issuetype.status === 200) {
                setIssueType(issuetype.data.map((value) => {
                    return {
                        id: value.Id,
                        name: value.Name,
                        description: value.Description
                    }
                }))
            }
        } catch (error) {

        }
    }

    const getproducts = async () => {
        const products = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/customer-products",
            method: "get",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                company_id: state?.usersdata?.users?.company_id
            }
        });
        if (products.status === 200) {
            customerdispatch({ type: "LOAD_PRODUCT", payload: products.data })
        }

    }

    const getmodule = async () => {
        const module = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/modules",
            method: "get",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                productId: customerstate.filter.productState
            }
        });
        customerdispatch({ type: "LOAD_MODULE", payload: module.data })
    }

    const getpriority = async () => {
        const priority = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/priority",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            }
        });
        customerdispatch({ type: "LOAD_PRIORITY", payload: priority.data })
    }

    const getMasterdata = () => {
        getproducts();
        // getmodule();
        getpriority();
        GetIssueType();

    }

    const onFinish = async (values) => {
        try {
            let createTicket = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/create",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    company_id: state.usersdata.users.company_id,
                    type: match.params.id,
                    product_id: values.product,
                    module_id: values.module,
                    scene: values.scene,
                    priority: values.priority,
                    title: values.subject,
                    description: description,
                    files: uploadRef.current.getFiles().map((n) => n.response.id),

                },
            });

            if (createTicket.status === 200) {
                Modal.success({
                    title: 'แจ้งปัญหาเรียบร้อยแล้ว',
                    content: (
                        <div>
                            <p>Issue เลขที่ : {createTicket.data}</p>

                        </div>
                    ),
                    onOk() {
                        history.push("/customer/issue/mytask");
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
        setTypeDes(
            match.params.id === "1" ? "แจ้งปัญหา ที่เกิดจากระบบทำงานผิดผลาด" :
                match.params.id === "2" ? "แจ้งปรับปรุง หรือ เพิ่มเติมการทำงานของระบบ" :
                    match.params.id === "3" ? "แจ้งปรับปรุงข้อมูลในระบบ" :
                        match.params.id === "4" ? "สอบถามข้อมูลทั่วไป / การใช้งานระบบ" : ""
        );

        setTitle(
            match.params.id === "1" ? "Bug" :
                match.params.id === "2" ? "ChageRequest" :
                    match.params.id === "3" ? "Memo" :
                        match.params.id === "4" ? "Use" : ""
        );


    }, [title]);

    // useEffect(() => {
    //     if (!state.authen) {
    //         getMasterdata();
    //         getproducts();
    //     }
    //     if (state?.usersdata?.users === undefined) {
    //         getMasterdata();
    //         getproducts();
    //     }

    // }, [state.authen]);

    useEffect(() => {
        if (state?.usersdata?.users?.company_id) {
            getMasterdata();
        }
    }, [state?.usersdata?.users?.company_id]);

    useEffect(() => {
        if (state.authen) {
            getmodule();
        }
    }, [customerstate.filter.productState]);

    return (
        <MasterPage>
            <div style={{ padding: 24 }}>
                <div className="sd-page-header">
                    <Row>
                        <Col span={18}>
                            <h3>แจ้งปัญหาการใช้งาน</h3>
                        </Col>
                        <Col span={6} style={{ textAlign: "right" }}>
                            <Button
                                type="link"
                                onClick={() => history.push({ pathname: "/customer/servicedesk" })}
                            >
                                <HomeOutlined style={{ fontSize: 20 }} /> กลับสู่เมนูหลัก
                            </Button>
                        </Col>
                    </Row>

                </div>

                <Form
                    form={form}
                    hidden={hiddenForm}
                    {...layout}

                    name="issue"
                    initialValues={{
                        // product: "REM",
                        // module: 2,
                        priority: 4
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
                            style={{ height: 80 }}
                            overlayStyle={{
                                width: 200,
                                boxShadow:
                                    "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.31) 0px 0px 1px",
                            }}
                            overlay={
                                // <List
                                //     itemLayout="horizontal"
                                //     dataSource={issueType}
                                //     renderItem={item => (
                                //         <>
                                //             <Menu mode="inline" theme="light" onMouseOver=""  >
                                //                 <Menu.Item key={item.id} style={{height:100}}>
                                //                     <Card className="issue-active" hoverable style={{width:"100%", padding:0,margin:0}}>
                                //                         <Meta
                                //                             avatar={
                                //                                 <BugOutlined style={{ fontSize: 30 }} />
                                //                             }
                                //                             title={<label className="card-title-menu">{item.name}</label>}
                                //                             description={item.description}
                                //                         />
                                //                     </Card>
                                //                 </Menu.Item>
                                //             </Menu>

                                //         </>
                                //     )}
                                // />
                                <Menu mode="inline" theme="light" onMouseOver=""
                                >
                                    <Menu.Item key="1" onClick={
                                        () => { return (setTitle("Bug"), history.push("/customer/servicedesk/issuecreate/1")) }}>
                                        <Card className="issue-active" hoverable>
                                            <Meta
                                                avatar={
                                                    <BugOutlined style={{ fontSize: 30 }} />
                                                }
                                                title={<label className="card-title-menu">{issueType[0]?.name}</label>}
                                                description={issueType[0]?.description}
                                            />
                                        </Card>
                                    </Menu.Item>
                                    <Menu.Item key="2" onClick={
                                        () => { return (setTitle("CR"), history.push("/customer/servicedesk/issuecreate/2")) }}>
                                        <Card className="issue-active" hoverable >
                                            <Meta
                                                avatar={
                                                    <FileOutlined style={{ fontSize: 30 }} />
                                                }
                                                title={<label className="card-title-menu">{issueType[1]?.name}</label>}
                                                description={issueType[1]?.description}
                                            />
                                        </Card>
                                    </Menu.Item>
                                    <Menu.Item key="3" onClick={
                                        () => { return (setTitle("Memo"), history.push("/customer/servicedesk/issuecreate/3")) }}>
                                        <Card className="issue-active" hoverable>
                                            <Meta
                                                avatar={
                                                    <DatabaseOutlined style={{ fontSize: 30 }} />
                                                }
                                                title={<label className="card-title-menu">{issueType[2]?.name}</label>}
                                                description={issueType[2]?.description}
                                            />
                                        </Card>
                                    </Menu.Item>
                                    <Menu.Item key="4" onClick={
                                        () => { return (setTitle("Use"), history.push("/customer/servicedesk/issuecreate/4")) }}>
                                        <Card className="issue-active" hoverable style={{ width: "100%", marginTop: 16 }} >
                                            <Meta
                                                avatar={
                                                    <PhoneOutlined style={{ fontSize: 30 }} />
                                                }
                                                title={<label style={{ color: "rgb(0, 116, 224)" }}>{issueType[3]?.name}</label>}
                                                description={issueType[3]?.description}
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
                                        `${title}` === "Bug" ? <BugOutlined style={{ fontSize: 30 }} /> :
                                            `${title}` === "CR" ? <FileOutlined style={{ fontSize: 30 }} /> :
                                                `${title}` === "Memo" ? <DatabaseOutlined style={{ fontSize: 30 }} /> :
                                                    <PhoneOutlined style={{ fontSize: 30 }} />
                                    }
                                    title={
                                        <label className="card-title-menu">
                                            {title}
                                        </label>
                                    }
                                    description={typeDes}
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
                            onChange={(value) => customerdispatch({ type: "SELECT_PRODUCT", payload: value })}
                            options={customerstate && customerstate.masterdata.productState.map((x) => ({ value: x.ProductId, label: `${x.Name} - (${x.FullName})` }))}
                        />
                    </Form.Item>


                    <Form.Item label="Scene" name="scene">
                        <Select
                            placeholder="Scene"
                            //mode="multiple"
                            // defaultValue="None"
                            showSearch
                            allowClear
                            filterOption={(input, option) =>
                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            // options={customerstate && customerstate.masterdata.moduleState.map(x => ({ value: x.Id, label: x.Name }))}
                            options={cusScene.map(x => ({ value: x.value, label: x.name }))}
                        >

                        </Select>
                    </Form.Item>

                    {/* <Form.Item label="Module" name="module">
                        <Select
                            placeholder="Module"
                            mode="multiple"
                            // defaultValue="None"
                            showSearch
                            allowClear
                            filterOption={(input, option) =>
                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            options={customerstate && customerstate.masterdata.moduleState.map(x => ({ value: x.Id, label: x.Name }))}
                        >

                        </Select>
                    </Form.Item> */}

                    <Form.Item label="Priority" name="priority">
                        <Select
                            defaultValue={4}
                            placeholder="Priority"
                            options={customerstate && customerstate.masterdata.priorityState.map(x => ({ value: x.Id, label: x.Name }))}>

                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="หัวข้อ"
                        name="subject"
                        rules={[
                            {
                                required: true,
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
                        <Editor
                            ref={editorRef}
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
                                block_unsupported_drop: false,
                                paste_data_images: true,
                                images_upload_handler: image_upload_handler,
                                toolbar1: 'undo redo | styleselect | bold italic underline forecolor fontsizeselect | link image',
                                toolbar2: 'alignleft aligncenter alignright alignjustify bullist numlist preview table openlink',
                            }}
                            onEditorChange={(content, editor) => setDescription(content)}
                        />
                    </Form.Item>
                    <Form.Item label="ไฟล์แนบ" name="attach">
                        <UploadFile ref={uploadRef} />
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button
                            style={{ width: 100 }}
                            type="primary"
                            htmlType="submit"
                            size="middle"
                        >
                            บันทึก
                            </Button>
                    </Form.Item>
                </Form>
            </div>


        </MasterPage>
    )
}
