import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Spin, Modal } from "antd";
import axios from "axios";
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
import AuthenContext from '../../utility/authenContext';

import { GoogleLogin } from 'react-google-login';
import { PublicClientApplication } from '@azure/msal-browser';

export default function NormalLoginForm() {
  const { state, dispatch } = useContext(AuthenContext);
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const responseGoogle = (response) => {
    if (response.profileObj.email !== undefined && response.profileObj.email !== "" && response.profileObj.email !== null) {
      //console.log("responseGoogle", response.profileObj);
      googleLogin(response.profileObj)
    }
  }

  const googleLogin = async (param) => {
    setLoading(true);
    try {
      const result = await axios({
        url: process.env.REACT_APP_API_URL + "/auth/google/user",
        method: "POST",
        data: {
          email: param.email,
        },
      });
      if (result.status === 200) {
        setLoading(false);
        localStorage.setItem("sp-ssid", result.data.ssid);
        dispatch({ type: 'Authen', payload: true });
        dispatch({ type: 'LOGIN', payload: result.data.usersdata });
        history.push("/internal/mydashboard");
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
  }

  const azureLogin = async () => {
    const msalInstance = new PublicClientApplication({
      auth: {
        clientId: process.env.REACT_APP_AZURE_CLIENT_ID,
        authority: process.env.REACT_APP_AZURE_AUTHORITY,
        redirectUri: process.env.REACT_APP_WEB_URL
      },
      cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: true
      }
    });

    try {
      const result = await msalInstance.loginPopup({
        scopes: ['user.read'],
        prompt: "select_account"
      });

      if (result.accessToken) {
        setLoading(true);
        await axios(`${process.env.REACT_APP_API_URL}/auth/microsoft/user`, {
          method: "POST",
          data: {
            email: result?.account?.username,
          }
        }).then((res) => {
          setLoading(false);
          localStorage.setItem("sp-ssid", res.data.ssid);
          dispatch({ type: 'Authen', payload: true });
          dispatch({ type: 'LOGIN', payload: res.data.usersdata });
          history.push("/internal/mydashboard");

        }).catch((error) => {
          setLoading(false);
          Modal.error({
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
        })
      }
    } catch (error) {
      console.log("close")
    }
  }

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
        // console.log("result", result.data, result.data.usersdata)
        setLoading(false);
        localStorage.setItem("sp-ssid", result.data.ssid);
        dispatch({ type: 'Authen', payload: true });
        dispatch({ type: 'LOGIN', payload: result.data.usersdata });
        history.push("/internal/mydashboard");
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
    <div style={{
      backgroundImage: `url(${process.env.PUBLIC_URL}/icon-background.png)`, backgroundRepeat: "no-repeat", backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundAttachment: "fixed",
      height: "100%",

    }}>
      <Spin spinning={loading}>
        <div
          style={{
            width: "100%",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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

            {/* <div
              style={{ textAlign: "center", borderRadius: 10 }}
            >
              <GoogleLogin
                clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
              />
            </div> */}

            <div
              style={{
                textAlign: "center",
                borderRadius: 10,
              }}
            >
              <Button
                style={{
                  borderRadius: 5, height: "50px", boxShadow: "rgb(0 0 0 / 24%) 0px 2px 2px 0px, rgb(0 0 0 / 24%) 0px 0px 1px 0px"
                }}
                onClick={azureLogin}
              >
                <img src={`${process.env.PUBLIC_URL}/logo-microsoft.svg`} alt="microsoft" width={16} height={16} style={{ marginRight: 16 }} />
                Sign in with Microsoft
              </Button>
            </div>
          </Form>

        </div>
        <div style={{ position: "fixed", bottom: 30, right: 30 }}>
          <label style={{ fontSize: 14, color: "white" }}>
            Version {process.env.REACT_APP_ICON_SPACE_VERSION}
          </label>
        </div>
      </Spin>


    </div>
  );
}
