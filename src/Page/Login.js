import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { setToken, getToken } from '../utility';

export default function NormalLoginForm() {
    const history = useHistory();
    const onFinish = async (value) => {
        try {
            const result = await axios({
                url: process.env.REACT_APP_API_URL + "/auth",
                method: "POST",
                data: { email: value.username }
            });

            localStorage.setItem("sp-ssid", result.data);
            history.push('/Internal/Issue/MyTask');

        } catch (error) {
            alert("ข้อมููลไม่ถูกต้อง")
          
        }

    };
    // useEffect(() => {
    //     onFinish();
    // }, []])
    return (
        <div style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            background: "-webkit-linear-gradient(bottom, #0250c5, #d43f8d)",
            padding: 20

        }}>
            <Form style={{ padding: 20, maxWidth: 450, backgroundColor: "white" }}
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                <img src="logo-brand.png" />
                <h2 style={{ textAlign: "center", padding: 20 }}>Issue Portal</h2>
                <Form.Item
                    style={{ minWidth: 300, maxWidth: 300 }}
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Username!',
                        },
                    ]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    style={{ minWidth: 300, maxWidth: 300 }}
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
                    ]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <a className="login-form-forgot" href="#">
                        Forgot password
          </a>
                </Form.Item>
                <Form.Item style={{ textAlign: "center" }}>
                    <Button type="primary" htmlType="submit" shape="round"
                        style={{ width: 200, textAlign: "center" }}
                        className="login-form-button">
                        Log in
                    </Button>
                    <br />
                      Or <a href="">register now!</a>
                </Form.Item>
            </Form>
        </div>
    );
};



