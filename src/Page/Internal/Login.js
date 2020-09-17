import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import axios from "axios";
import React, {useContext, useEffect } from 'react'
import { useHistory } from "react-router-dom";
import AuthenContext from '../../utility/authenContext';

export default function NormalLoginForm() {
  const { state, dispatch } = useContext(AuthenContext);
  const history = useHistory();

  const onFinish = async (value) => {
    try {
        const result = await axios({
          url: process.env.REACT_APP_API_URL + "/auth",
          method: "POST",
          data: { email: value.username },
        });

      localStorage.setItem("sp-ssid", result.data);
      dispatch({ type: 'Authen', payload: true});
      dispatch({ type: 'LOGIN', payload: result.data.users});
      history.push("/Internal/Issue/MyTask");
    } catch (error) {
      alert("ข้อมููลไม่ถูกต้อง");
    }
  };

  return (
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
        style={{ padding: 32, maxWidth: 480, backgroundColor: "white" }}
        name="normal_login"
        className="login-form"
        initialValues={{
          username: "thidarath@iconframework.com",
          remember: true,
        }}
        onFinish={onFinish}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <img src="logo-brand.png" alt="" style={{ height: "70px" }} />
        </div>

        <h2
          style={{
            textAlign: "center",
            padding: 20,
            textTransform: "uppercase",
          }}
        >
          Issue Portal
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
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          style={{ minWidth: 300, maxWidth: 300 }}
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item style={{ textAlign: "center" }}>
          <Button
            type="primary"
            htmlType="submit"
            shape="round"
            style={{ width: 200, textAlign: "center" }}
            className="login-form-button"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
