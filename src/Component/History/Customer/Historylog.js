import React, { useEffect, useState } from 'react'
import { List, Avatar } from 'antd';
import moment from 'moment';
import Axios from 'axios';
import { useRouteMatch } from 'react-router-dom';
import { ClockCircleOutlined, SwapRightOutlined } from '@ant-design/icons';

export default function Historylog({ loading = false }) {

    const match = useRouteMatch();
    const [historylog, setHistorylog] = useState([]);

    const GetHistoryLog = async () => {
        try {
            const historylog = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/historylog",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    ticketId: match.params.id,
                    type: "ticket"
                }
            });
            if (historylog.status === 200) {
                setHistorylog(historylog.data.filter((x) => x.HistoryType === "Customer").map((values) => {
                    return {
                        createname: values.CreateName,
                        createdate: values.CreateDate,
                        description: values.Description,
                        value: values.Value,
                        value2: values.Value2,
                        historytype: values.HistoryType,
                        usertype: values.UserType,
                        avatar: values.ProfileImage,
                        email: values.Email
                    }
                }));
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        GetHistoryLog();
    }, [loading])

    return (
        <List
           // loading={loading}
            itemLayout="horizontal"
            bordered={false}
            dataSource={historylog}
            renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src={item.avatar} icon={item.email.substring(0, 1).toLocaleUpperCase()} />}
                        title={
                            <>
                                {(item.usertype === "user" ? <label style={{ marginRight: "6px" }}>(ICON)</label> : "")}
                                <label className="value-text"><b>{item.createname}</b></label>  &nbsp;&nbsp;
                                <label className="value-text" style={{ color: "#fa8c16" }} > {item.description}</label>&nbsp;&nbsp;&nbsp;&nbsp;
                                <ClockCircleOutlined style={{ fontSize: 18 }} />&nbsp;&nbsp;
                                <label className="value-text">{moment(item.createdate).format("DD/MM/YYYY H:mm")}</label>
                            </>
                        }

                        description=
                        {
                            <>
                                {item.value === "" || item.value === null ? "" :
                                    <>
                                     <label className="value-text">{item.value}</label> &nbsp;&nbsp;
                                      
                                        < SwapRightOutlined />&nbsp;&nbsp;
                                        <label className="value-text">{item.value2}</label>
                                    </>
                                }
                            </>
                        }
                    />
                </List.Item>
            )}
        />
    )
}
