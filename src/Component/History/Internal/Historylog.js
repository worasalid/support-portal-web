import React, { useEffect, useState,useContext } from 'react'
import { List, Avatar} from 'antd';
import moment from 'moment';
import Axios from 'axios';
import { useRouteMatch } from 'react-router-dom';
import { ClockCircleOutlined, SwapRightOutlined } from '@ant-design/icons';
import AuthenContext from "../../../utility/authenContext";

export default function Historylog({ type = "Issue" }) {

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
                            usertype: values.UserType
                        }
                    }));
                }
            } else {
                const issue_historylog = await Axios({
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

                if (issue_historylog.status === 200) {
                    setHistorylog(issue_historylog.data.map((values) => {
                        return {
                            createname: values.CreateName,
                            createdate: values.CreateDate,
                            description: values.Description,
                            value: values.Value,
                            value2: values.Value2,
                            historytype: values.HistoryType,
                            usertype: values.UserType,
                            avatar: values.ProfileImage
                        }
                    }));
                }
            }

        } catch (error) {

        }
    }

    useEffect(() => {
        GetHistoryLog();
        setLoading(false)
    }, [])

    useEffect(() => {
        GetHistoryLog();
        setLoading(false)

    }, [historylog.length])

    return (
        <List
            loading={loading}
            itemLayout="horizontal"
            bordered={false}
            dataSource={historylog}
            renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                         //avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                        //avatar={<Avatar src={state?.usersdata?.users?.profile_image}  />}
                        avatar={<Avatar src={item.avatar}  />}
                        title={
                            <>
                                <b>{item.createname}</b> &nbsp;&nbsp;
                                <label style={{ color: "#fa8c16" }} > {item.description}</label>&nbsp;&nbsp;&nbsp;&nbsp;
                                <ClockCircleOutlined style={{ fontSize: 18 }} />&nbsp;&nbsp;
                                <label>{moment(item.createdate).format("DD/MM/YYYY H:mm")}</label>
                            </>
                        }

                        description=
                        {
                            <>
                                {(item.value === "" || item.value === null) ? "" :
                                    <>
                                        { item.value} &nbsp;&nbsp;
                                        {(item.value2 === "" || item.value2 === null) ? "" :
                                            <>
                                                < SwapRightOutlined /> <label> {item.value2}</label>

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
