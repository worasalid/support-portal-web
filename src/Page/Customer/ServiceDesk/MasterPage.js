import React, { useContext, useEffect } from 'react'
import { Card, Avatar, message } from 'antd'
import axios from 'axios'
import { UserOutlined } from '@ant-design/icons'
import AuthenContext from '../../../utility/authenContext';
import IssueContext from '../../../utility/issueContext';

export default function MasterPage(props) {
    const { state, dispatch } = useContext(AuthenContext);
    const { state: customerstate, dispatch: customerdispatch } = useContext(IssueContext);

    const getuser = async () => {
        try {
            const result = await axios({
                url: process.env.REACT_APP_API_URL + "/auth/customer/me",
                method: "get",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                }

            });
            dispatch({ type: 'Authen', payload: true });
            dispatch({ type: 'LOGIN', payload: result.data.usersdata });
        } catch (error) {

        }
    }

    useEffect(() => {
        if (!state.authen) {
            getuser();
        }
        getuser();
    }, []);


    return (
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
                <div
                    style={{
                        textAlign: "right",
                        padding: "16px",
                    }}>
                    <label className="user-login">{ state?.usersdata?.users.first_name + ' ' + state?.usersdata?.users.last_name}</label>
                    <Avatar size="default" icon={<UserOutlined />}></Avatar>

                </div>
            </div>
            <Card size="default" bordered hoverable
                style={{
                    width: "700px",
                    top: 50,
                    position: "absolute",

                }}>
                <div style={{ marginBottom: 30 }}>
                    {props.children}
                </div>
            </Card>
        </div>
    )
}
