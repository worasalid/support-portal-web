import React, { useContext, useEffect, useState } from 'react'
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Icon } from '@iconify/react';
import { Button, Form, Input, Spin, Avatar } from "antd";
import axios from "axios";
import liff from '@line/liff';

export default function LineRegister() {
    const [lineData, setLineData] = useState();

    const [loading, setLoading] = useState(false);

    const login = async () => {
        const liffid = '1656378962-Kj8PpB73'
        await liff.init({ liffId: `${liffid}` }).catch(err => { throw err });
        if (liff.isLoggedIn()) {
            let getProfile = await liff.getProfile();
            console.log("getProfile", getProfile)
            setLineData(getProfile)
        } else {
            liff.login();
        }
    }

    const onFinish = async (value) => {
        setLoading(true);
        try {
            const result = await axios({
                url: process.env.REACT_APP_API_URL + "/line/register",
                method: "POST",
                data: {
                    email: value.email,
                    password: btoa(value.password),
                    lineId: lineData?.userId
                },
            });

            if (result.status === 200) {
                setLoading(false);
                sendNoti();
            }
        } catch (error) {

            setLoading(false);
        }
    };

    const sendNoti = async () => {
        const result = await axios({
            url: process.env.REACT_APP_API_URL + "/line/send-message",
            method: "POST",
            data: {
                lineId: lineData?.userId,
                displayname: lineData?.displayName
            },
        });
    }

    useEffect(() => {
        login();
    }, [])


    return (
        <div className="login-backgroundimg">
            <Spin spinning={loading}>
                <div
                    style={{
                        width: "100%",
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "#ccc",

                    }}
                >
                    <Form
                        style={{ padding: 32, maxWidth: 480, height: 500, backgroundColor: "white" }}
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        {/* <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <img src={`${process.env.PUBLIC_URL}/logo-space.jpg`}
                alt="" style={{ height: "100px", width: "200px" }} />
            </div> */}

                        <div style={{ textAlign: "center" }}>
                            <h1>{lineData?.displayName} </h1>

                            <Avatar size={128} src={lineData?.pictureUrl} />
                        </div>

                        {/* <h4>{lineData?.userId} </h4> */}
                        {/* <h4>{email && email} </h4> */}
                        <h2
                            style={{
                                textAlign: "center",
                                padding: 20,
                                textTransform: "uppercase",
                            }}
                        >
                            {/* Issue Portal */}
                        </h2>
                        <Form.Item
                            style={{ minWidth: 300, maxWidth: 300 }}

                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "กรุณา ระบุ อีเมล์บริษัท!",
                                },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder="Email (บริษัท)"
                            />
                        </Form.Item>
                        <Form.Item
                            style={{ minWidth: 300, maxWidth: 300 }}

                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "กรุณา ระบุ อีเมล์บริษัท!",
                                },
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder="password"
                            />
                        </Form.Item>

                        <Form.Item style={{ textAlign: "center" }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                shape="round"
                                style={{ width: 200, textAlign: "center", backgroundColor: "#00B900" }}
                                icon={<Icon icon="bi:line" fontSize="18px" />}
                            >
                                &nbsp; ลงทะเบียน
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Spin>
        </div>

    );
}
