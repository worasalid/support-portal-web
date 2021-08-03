
import React, { useEffect, useState, useContext, forwardRef, useImperativeHandle } from 'react';
import { Button, Badge } from 'antd';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import MasterContext from "../../../utility/masterContext";
import { NotificationOutlined } from '@ant-design/icons';

export default forwardRef (function Notifications(props, ref) {
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const { state: masterstate, dispatch: masterdispatch } = useContext(MasterContext);
    const [notification, setNotification] = useState([]);

    useImperativeHandle(ref, () => ({
        getNoti: () => getNotification(),
  
    }));

    const getNotification = async () => {
        try {
            const countNoti = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/notification",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                }
            });

            if (countNoti.status === 200) {
                masterdispatch({ type: "COUNT_NOTI", payload: countNoti.data.total });
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
                console.log("Success");
                window.location.reload(true);
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        getNotification();
    }, [])


    return (
        <>
            <Badge
                offset={[10, 0]}
                count={masterstate?.toolbar?.top_menu?.notification}>
                <NotificationOutlined style={{ fontSize: 20 }} />
            </Badge>
        </>
    )
})

