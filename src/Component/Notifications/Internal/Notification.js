
import React, { useEffect, useState, useContext, forwardRef, useImperativeHandle } from 'react';
import { Button, Badge } from 'antd';
import Axios from 'axios';
import { useHistory } from 'react-router-dom';
import MasterContext from "../../../utility/masterContext";
import { NotificationOutlined } from '@ant-design/icons';

export default forwardRef(function Notifications(props, ref) {
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const { state: masterstate, dispatch: masterdispatch } = useContext(MasterContext);
    const [notification, setNotification] = useState([]);

    useImperativeHandle(ref, () => ({
        getNoti: () => getNotification(),
        updateNoti: (props) => updateCountNoti(props)

    }));

    const getNotification = async () => {
        await Axios({
            url: process.env.REACT_APP_API_URL + "/master/notification",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            }
        }).then((result) => {
            masterdispatch({ type: "COUNT_NOTI", payload: result.data.total });
        }).catch(() => {

        })
    }

    const updateCountNoti = async (param) => {
        await Axios({
            url: process.env.REACT_APP_API_URL + "/master/notification",
            method: "PATCH",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                ticket_id: param
            }
        }).then(() => {
            getNotification();
        }).catch(() => {

        })
    }

    useEffect(() => {
        getNotification();
    }, [masterstate?.toolbar?.top_menu?.notification])


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

