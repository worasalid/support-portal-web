import { Upload, Button, Avatar, Form, Input, Card, Row, Col, Spin } from "antd";
import React, { useState, useEffect, useContext } from "react";
import Axios from 'axios';
import MasterPage from './MasterPage';
import AuthenContext from "../../utility/authenContext";
import { EyeTwoTone, LaptopOutlined, MailOutlined, UserOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";


export default function Profile() {
    const { state, dispatch } = useContext(AuthenContext);
    const [fileList, setFileList] = useState(null)
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)


    const layout = {
        labelCol: {
            span: 2,
        },
        wrapperCol: {
            span: 16,
        },
    };

    // function onChange(info) {
    //     const basae64 = toBase64(info.file.originFileObj)
    //     basae64.then((x) => {
    //         setFileList(x)
    //     })
    // }

    function onChange(info) {
        getProfile();
        console.log("info", info)
    }

    const toBase64 = file => new Promise((resolve, reject) => {
        let blob = new Blob([file], {
            type: file.type,
        });

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });


    const handlePreview = async (file) => {
        return file.url
        // if (!file.url && !file.preview) {
        // }

    }

    const getProfile = async () => {
        try {
            const getProfile = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/profile",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    user_id: state?.usersdata?.users?.id
                }
            });
            //console.log("getProfile",getProfile.data.usersdata)
            // dispatch({ type: 'LOGIN', payload: getProfile.data.usersdata });
            setFileList(getProfile.data.usersdata.users.profile_image)
        } catch (error) {

        }
    }

    const saveProfile = async (value) => {
        try {
            const saveprofile = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/save-profile",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    firstname: value.firstname,
                    lastname: value.lastname,
                    email: value.email,
                    password: btoa(value.password),
                    base64_image: fileList
                }
            });


        } catch (error) {

        }
    }

    const onFinish = async (value) => {
        setLoading(true);
        saveProfile(value);
        // console.log("onFinish", value)
        // console.log("atob", btoa(value.password))
    };

    useEffect(() => {
        getProfile();
        // set data
        if (state?.usersdata?.users?.password !== undefined) {
            form.setFieldsValue({
                firstname: state?.usersdata?.users?.first_name,
                lastname: state?.usersdata?.users?.last_name,
                email: state?.usersdata?.users?.email,
                position: state?.usersdata?.users?.position_name,
                password: atob(state?.usersdata?.users?.password)
            })
        }
    }, [state?.usersdata?.users])

    useEffect(() => {
        if (loading === true) {
            getProfile();
            setTimeout(() => {
                setLoading(false);
                window.location.reload(true);
            }, 1000)
        }
        // set data
        if (state?.usersdata?.users?.password !== undefined) {
            form.setFieldsValue({
                firstname: state?.usersdata?.users?.first_name,
                lastname: state?.usersdata?.users?.last_name,
                email: state?.usersdata?.users?.email,
                position: state?.usersdata?.users?.position_name,
                password: atob(state?.usersdata?.users?.password)
            })
        }
    }, [loading])


    return (

        <MasterPage bgColor="#f0f2f5">
            <Spin spinning={loading} tip="Loading..." style={{ width: 1024, height: 1000 }}>
                <div style={{ position: "absolute", top: 30, width: "100%", padding: "0px 24px 0px 24px" }}>
                    <img
                        style={{ width: "100%", height: "100px", backgroundColor: "#FFFFFF" }}
                    />
                </div>
                <div style={{ position: "absolute", top: 60, padding: "0px 0px 24px 24px" }}>
                    <Upload
                        style={{ position: "absolute" }}
                        onChange={onChange}
                        onPreview={handlePreview}
                        showUploadList={false}
                        listType="picture"
                        name="file"
                        action={process.env.REACT_APP_API_URL + "/files"}
                        headers={{
                            "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                        }}
                        data={{
                            upload_type: "profile",
                            user_id: state?.usersdata?.users?.id
                        }}

                    >
                        <Button type="link">
                            <Avatar style={{ border: "1px solid", borderColor: "gray" }} size={96}
                                icon={state?.usersdata?.users?.email.substring(0, 1).toLocaleUpperCase()}
                                src={fileList && fileList}
                            // src="http://localhost:4000/files/50"
                            >
                            </Avatar>
                        </Button>
                        <label style={{ fontSize: "24px" }}>
                            {state.usersdata && `${state.usersdata?.users.first_name} ${state.usersdata?.users.last_name}`}
                        </label>

                    </Upload>
                </div>

                {/* ข้อมูลโปร์ไฟล์ */}
                <div style={{ marginTop: 0, position: "absolute", top: 180, padding: "0px 0px 0px 24px" }}>
                    {/* <label className="header-text">ข้อมูลโปรไฟล์</label> */}
                    <Card size="default" title="ข้อมูลโปรไฟล์" className="card-dashboard" bordered
                        style={{
                            width: "500px",
                            marginTop: 20
                            //top: 50,
                            //position: "absolute",

                        }}>

                        <div >
                            <Form {...layout} form={form} style={{ padding: 0, width: "100%", backgroundColor: "white" }}
                                name="userprofile"
                                className="login-form"
                                onFinish={onFinish}
                            >

                                <Form.Item
                                    label={<><UserOutlined /> </>}
                                    name="firstname"
                                >
                                    <Input placeholder="ชื่อ" />
                                </Form.Item>
                                <Form.Item
                                    label={<> </>}
                                    name="lastname"

                                >
                                    <Input placeholder="นามสกุล" />
                                </Form.Item>
                                <Form.Item
                                    label={<><EyeOutlined /> </>}
                                    name="password"

                                >
                                    <Input.Password placeholder="input password"
                                        visibilityToggle={false}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={<><MailOutlined tabIndex="email" /></>}
                                    name="email"
                                >
                                    <Input placeholder="อีเมล์" />
                                </Form.Item>
                                <Form.Item
                                    label={<><LaptopOutlined tabIndex="ตำแหน่ง" /></>}
                                    name="position"
                                >
                                    <Input placeholder="ตำแหน่งงาน" />
                                </Form.Item>

                            </Form>
                            <Row style={{ textAlign: "right" }}>
                                <Col span={24} >
                                    <Button
                                        style={{ backgroundColor: "#00CC00", marginLeft: 10 }}
                                        onClick={() => form.submit()} type="primary"
                                    >Save</Button>
                                </Col>
                            </Row>
                        </div>
                    </Card>
                </div>

                {/* ข้อมูลอื่นๆ */}
                <div style={{ marginTop: 0, position: "absolute", top: 150, left: 600, width: "500px" }}>
                    {/* <label className="header-text">อื่นๆ</label> */}
                    <Card size="default" title="การแจ้งเตือน" className="card-dashboard" bordered hoverable
                        style={{
                            width: "100%",
                            marginTop: 20
                        }}>
                        ...........
                    </Card>
                </div>

                <div style={{ marginTop: 0, position: "absolute", top: 400, left: 600, width: "500px" }}>
                    {/* <label className="header-text">อื่นๆ</label> */}
                    <Card size="default" title="อื่นๆ" className="card-dashboard" bordered hoverable
                        style={{
                            width: "100%",
                            marginTop: 20
                        }}>
                        ...........
                    </Card>
                </div>

            </Spin >
        </MasterPage>


    )
}




