import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Alert, Spin, Modal } from "antd";
import axios from "axios";
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
import AuthenContext from '../../utility/authenContext';

export default function NormalLoginForm() {
  const { state, dispatch } = useContext(AuthenContext);
  const history = useHistory();
  const [loading, setLoading] = useState(false);



  const onFinish = async (value) => {
    setLoading(true);
    try {
      const result = await axios({
        url: process.env.REACT_APP_API_URL + "/auth/user",
        method: "POST",
        data: {
          email: value.username,
          password: btoa(value.password)
          //password: btoa("password")
        },
      });

      if (result.status === 200) {
        console.log("result", result.data, result.data.usersdata)
        setLoading(false);
        localStorage.setItem("sp-ssid", result.data.ssid);
        dispatch({ type: 'Authen', payload: true });
        dispatch({ type: 'LOGIN', payload: result.data.usersdata });
        history.push("/internal/dashboard");
        window.location.reload(true);
      }


    } catch (error) {
      await Modal.error({
        title: 'Login ไม่สำเร็จ',
        content: (
          <div>
            <p>{error.response.data}</p>
            <p>กรุณาติดต่อ ผู้ดูแลระบบ</p>
          </div>
        ),
        okText: "Close",
        onOk() {

        },
      });

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
              //   onClick={() => setLoading(true)}
              //className="login-form-button"
              >
                Log in
          </Button>
            </Form.Item>
          </Form>
        </div>

      </Spin>
    </div>
  );
}
