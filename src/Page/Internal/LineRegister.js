import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Icon } from '@iconify/react';
import { Button, Form, Input, Spin, Modal } from "antd";
import axios from "axios";
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
import AuthenContext from '../../utility/authenContext';


export default function LineRegister() {
    const { state, dispatch } = useContext(AuthenContext);
    const history = useHistory();
    const [loading, setLoading] = useState(false);


    const onFinish = async (value) => {
        setLoading(true);
        try {
            const result = await axios({
                url: process.env.REACT_APP_API_URL + "/auth/line",
                method: "POST",
                data: {
                    email: value.username,
                },
            });

            if (result.status === 200) {
                localStorage.setItem("sp-ssid", result.data.ssid);
            }


        } catch (error) {

            setLoading(false);
        }
    };

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
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            username: "",
                            remember: true,
                        }}
                        onFinish={onFinish}
                    >
                        <div style={{ textAlign: "center", marginBottom: "24px" }}>
                            <img src={`${process.env.PUBLIC_URL}/logo-space.jpg`}
                                alt="" style={{ height: "100px", width: "200px" }} />
                        </div>

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
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your Username!",
                                },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder="email"
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
