import React, { useState, useEffect } from "react";
import { List, Button } from 'antd';
import { ReadOutlined } from "@ant-design/icons";
import Axios from "axios";

export default function UserManual({ type, visible }) {
    console.log("visible", visible)
    const [document, setDocument] = useState([]);

    const getDocument = async () => {
        await Axios({
            url: process.env.REACT_APP_API_URL + "/master/config-data",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                groups: type === "customer" ? "UserManual_Customer" : "UserManual_Internal"
            }

        }).then((res) => {
            setDocument(res.data);

        }).catch((error) => {

        });
    }

    const getfileDownload = async (param) => {
        await Axios({
            url: process.env.REACT_APP_API_URL + "/master/filedownload",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                refId: param,
                reftype: "Master_ConfigData",
                grouptype: type === "customer" ? "UserManual_Customer" : "UserManual_Internal"
            }

        }).then((res) => {
            window.open(res.data[0].Url, "_blank")
        }).catch((error) => {

        });
    }

    useEffect(() => {
        if (visible) getDocument();

    }, [visible])

    return (
        <>
            <div
                style={{
                    height: "300px",
                    padding: "8px 24px",
                    overflow: "auto",
                    border: "1px solid #e8e8e8"

                }}
            >
                <List
                    dataSource={document}
                    renderItem={item => (
                        <List.Item
                            key={item.key}
                        >
                            <label className="text-hover" onClick={() => getfileDownload(item.Id)}>
                                <ReadOutlined /> &nbsp;
                                {item.Name}
                            </label>
                        </List.Item>
                    )}
                >
                </List>
            </div>
        </>
    )
}