
import React, { useEffect, useState } from 'react';
import { List, Avatar } from 'antd';
import Axios from 'axios';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

export default function Notifications(props) {
    const history = useHistory()
    const [notification, setNotification] = useState([]);
    // const data = [
    //     {
    //         title: 'ISSUE-001-20120020',
    //         description: "มีงานใหม่ส่งถึงคุณ"
    //     },
    //     {
    //         title: 'ISSUE-001-20120019',
    //         description: "มีการ Update Comment"
    //     },
    //     {
    //         title: 'ISSUE-001-20120018',
    //         description: "มีการ Update Comment"
    //     },
    //     {
    //         title: 'ISSUE-001-20120020',
    //         description: "มีงานใหม่ส่งถึงคุณ"
    //     },
    //     {
    //         title: 'ISSUE-001-20120019',
    //         description: "มีการ Update Comment"
    //     },
    //     {
    //         title: 'ISSUE-001-20120018',
    //         description: "มีการ Update Comment"
    //     },
    //     {
    //         title: 'ISSUE-001-20120020',
    //         description: "มีงานใหม่ส่งถึงคุณ"
    //     },
    //     {
    //         title: 'ISSUE-001-20120019',
    //         description: "มีการ Update Comment"
    //     },
    //     {
    //         title: 'ISSUE-001-20120018',
    //         description: "มีการ Update Comment"
    //     },
    //     {
    //         title: 'ISSUE-001-20120020',
    //         description: "มีงานใหม่ส่งถึงคุณ"
    //     },
    //     {
    //         title: 'ISSUE-001-20120019',
    //         description: "มีการ Update Comment"
    //     },
    //     {
    //         title: 'ISSUE-001-20120018',
    //         description: "มีการ Update Comment"
    //     },

    // ];

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
                                        onClick={() => { return (history.push({ pathname: "/internal/issue/subject/" + item.ticketid }), window.location.reload("false")) }}

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