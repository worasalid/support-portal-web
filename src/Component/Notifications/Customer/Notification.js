
import React, { useEffect, useState,useContext } from 'react';
import { List, Avatar } from 'antd';
import Axios from 'axios';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import AuthenContext from "../../../utility/authenContext";

export default function Notifications(props) {
    const { state, dispatch } = useContext(AuthenContext);

    const history = useHistory()
    const [notification, setNotification] = useState([]);

    const GetNotification = async () => {
        try {
            const noti = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/notification",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                }
            });
            if (noti.status === 200) {
                setNotification(noti.data.map((value) => {
                    return {
                        ticketid: value.TicketId,
                        title: value.TicketNumber,
                        description: value.Description,
                        datetime: value.CreateDate
                    }
                }));
            }

        } catch (error) {

        }
    }

    useEffect(() => {
        GetNotification();
    }, [])


    return (
        <>
            <List
                itemLayout="horizontal"
                dataSource={notification}
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                            title={
                                <>
                                    <label className="text-link"
                                        onClick={() => { return (history.push({ pathname: "/customer/issue/subject/" + item.ticketid }), window.location.reload("false")) }}

                                    >
                                        {item.title}
                                    </label>
                                    <label style={{ marginLeft: 20 }} className="value-text">
                                        {`(${moment(item.datetime).format("DD/MM/YYYY HH:mm")})`}
                                    </label>
                                </>
                            }
                            description={
                                <>
                                    <label>{item.description}</label>
                                </>

                            }

                        />
                    </List.Item>
                )}
            />
        </>
    )
}