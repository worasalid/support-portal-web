import React, { useEffect, useState } from 'react'
import { List, Avatar} from 'antd';
import moment from 'moment';
import Axios from 'axios';
import { useRouteMatch } from 'react-router-dom';
import { ClockCircleOutlined, SwapRightOutlined } from '@ant-design/icons';

export default function Historylog() {

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
                setHistorylog(historylog.data.filter((x) => x.HistoryType === "Customer" ).map((values) => {
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
        } catch (error) {

        }
    }

    useEffect(() => {
        GetHistoryLog();
    }, [])

    return (
        <List
            itemLayout="horizontal"
            bordered={false}
            dataSource={historylog}
            renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                        title={
                            <>
                            {(item.usertype === "user" ? <label style={{marginRight: "6px"}}>(ICON)</label>  :"") }
                                <b>{item.createname}</b> &nbsp;&nbsp;
                                <label style={{color: "#fa8c16"}} > {item.description}</label>&nbsp;&nbsp;&nbsp;&nbsp;
                                <ClockCircleOutlined style={{fontSize: 18}}/>&nbsp;&nbsp;
                                <label>{moment(item.createdate).format("DD/MM/YYYY H:mm")}</label>
                            </>
                        }

                        description=
                        {
                            <>
                                {item.value === "" || item.value === null ? "" :
                                    <>
                                        { item.value} &nbsp;&nbsp;
                                        < SwapRightOutlined />&nbsp;&nbsp;
                                        { item.value2}
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
