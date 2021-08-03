import React, { useEffect, useState, useContext } from 'react'
import { List, Avatar } from 'antd';
import moment from 'moment';
import Axios from 'axios';
import { useRouteMatch } from 'react-router-dom';
import { ClockCircleOutlined, SwapRightOutlined } from '@ant-design/icons';
import AuthenContext from "../../../utility/authenContext";

export default function Historylog({ type = "Issue", subtype = "ticket" }) {

    const match = useRouteMatch();
    const { state, dispatch } = useContext(AuthenContext);
    const [loading, setLoading] = useState(true)
    const [historylog, setHistorylog] = useState([]);


    const GetHistoryLog = async () => {
        try {
            if (type === "RICEF") {
                const ricef_historylog = await Axios({
                    url: process.env.REACT_APP_API_URL + "/ricef/historylog",
                    method: "GET",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                    },
                    params: {
                        ricefid: match.params.ricefid
                    }
                });

                if (ricef_historylog.status === 200) {
                    setHistorylog(ricef_historylog.data.map((values) => {
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
                    setLoading(false);
                }
            }

            if (type === "Issue") {
                if (subtype === "ticket") {
                    const ticket_historylog = await Axios({
                        url: process.env.REACT_APP_API_URL + "/tickets/historylog",
                        method: "GET",
                        headers: {
                            "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                        },
                        params: {
                            ticketId: match.params.id,
                            taskid: match.params.task,
                            type: "ticket"
                        }
                    });
                    if (ticket_historylog.status === 200) {
                        await setHistorylog(ticket_historylog.data.map((values) => {
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
                        setLoading(false);
                    }
                }

                if (subtype === "task") {
                    const task_historylog = await Axios({
                        url: process.env.REACT_APP_API_URL + "/tickets/historylog",
                        method: "GET",
                        headers: {
                            "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                        },
                        params: {
                            ticketId: match.params.id,
                            taskid: match.params.task,
                            type: "task"
                        }
                    });

                    if (task_historylog.status === 200) {
                        await setHistorylog(task_historylog.data.map((values) => {
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
                        setLoading(false);
                    }
                }
            }

        } catch (error) {

        }
    }

    useEffect(() => {
        if (historylog.length === 0) {
            GetHistoryLog();
        }
    }, [historylog.length])

    return (
        <List
            loading={loading}
            itemLayout="horizontal"
            bordered={false}
            dataSource={historylog}
            renderItem={item => (
                <List.Item >
                    <List.Item.Meta
                        avatar={<Avatar src={item.avatar} icon={item.email.substring(0, 1).toLocaleUpperCase()} />}
                        title={
                            <>
                                <label className="value-text"><b>{item.createname}</b></label>  &nbsp;&nbsp;

                                <label className="value-text" style={{ color: "#fa8c16" }} > {item.description}</label>&nbsp;&nbsp;&nbsp;
                                {/* <label className="value-text">{`(${item.value})`}</label> */}
                                <ClockCircleOutlined style={{ fontSize: 18, marginLeft: 0 }} />&nbsp;&nbsp;
                                <label className="value-text">{moment(item.createdate).format("DD/MM/YYYY H:mm")}</label>

                            </>
                        }

                        description=
                        {
                            <>
                                {(item.value === "" || item.value === null) ? "" :
                                    <>
                                        <label className="value-text">  {item.value}</label>  &nbsp;&nbsp;

                                        {(item.value2 === "" || item.value2 === null) ? "" :
                                            <>
                                                < SwapRightOutlined /> <label className="value-text"> {item.value2}</label>

                                            </>
                                        }
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
