
import React, { useEffect, useState } from 'react';
import { List, Avatar, Spin, Badge } from 'antd';
import Axios from 'axios';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';

export default function Notifications(props) {
    const history = useHistory()
    const [pageStart, setPageStart] = useState(1)
    const [loading, setLoading] = useState(true)
    const [notification, setNotification] = useState([]);
    const [hasMore, setHasMore] = useState(true)

    const getNotiDetails = async (page) => {
        try {
            setLoading(true)
            const noti = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/notification-details",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    limit: 10,
                    offset: (page - 1) * 10
                }
            });

            if (noti.status === 200) {
                setLoading(false);
                setHasMore(noti.data.hasMore)
                setNotification([
                    ...notification, ...noti.data.data.map((value) => {
                        return {
                            id: value.Id,
                            ticketid: value.TicketId,
                            title: value.TicketNumber,
                            description: value.Description,
                            datetime: value.CreateDate,
                            readdate: value.ReadDate
                        }
                    })
                ]);
            }

        } catch (error) {

        }
    }

    const updateCountNoti = async (param) => {
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/notification",
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    id: param
                }
            });

            if (result.status === 200) {
                console.log("Success")
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        getNotiDetails(pageStart);
    }, [])


    return (
        <div
            style={{
                height: "300px",
                padding: "8px 24px",
                overflow: "auto",
                border: "1px solid #e8e8e8"

            }}
        >
            <InfiniteScroll
                initialLoad={false}
                pageStart={1}
                loadMore={(page) => page > 6 ? "" : getNotiDetails(page)}
                //loader={(x) => console.log("loader", x)}
                hasMore={!loading && hasMore}
                useWindow={false}

            >
                <List
                    itemLayout="horizontal"
                    dataSource={notification}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                title={
                                    <>
                                        {/* <label
                                            onClick={() => {
                                                history.push({ pathname: "/internal/issue/subject/" + item.ticketid });
                                                window.location.reload(true);
                                                updateCountNoti(item.id);
                                            }}

                                        > */}
                                        <Badge dot={true}
                                            offset={[-5]}
                                            style={{ display: item?.readdate === null ? "inline-block" : "none" }}
                                        >
                                            {/* {item.title} */}
                                        </Badge>

                                        <label className="text-link"
                                            onClick={() => {
                                                history.push({ pathname: "/internal/issue/subject/" + item.ticketid });
                                                window.location.reload(true);
                                                updateCountNoti(item.id);
                                            }}
                                        >
                                            {item.title}
                                        </label>

                                        {/* </label> */}
                                        <label
                                            style={{ marginLeft: 20 }}
                                            className={item?.readdate === null ? "noti-text-unread" : "noti-text"}
                                        >
                                            {`(${moment(item.datetime).format("DD/MM/YYYY HH:mm")})`}
                                        </label>
                                    </>
                                }
                                description={
                                    <>
                                        <label
                                            className={item?.readdate === null ? "noti-text-unread" : "noti-text"}
                                        >{item.description}</label>
                                    </>

                                }

                            />
                        </List.Item>
                    )}
                >
                    {loading && hasMore && (
                        <div style={{
                            position: 'absolute',
                            bottom: '40px',
                            width: '100%',
                            textAlign: 'center',
                        }}>
                            <Spin />
                        </div>
                    )}
                </List>
            </InfiniteScroll>

        </div >
    )
}

