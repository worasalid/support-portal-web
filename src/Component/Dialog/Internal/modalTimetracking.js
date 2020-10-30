import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Row, Col, Timeline } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { UserOutlined, LockOutlined, ClockCircleOutlined } from '@ant-design/icons';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import moment from "moment"
import Clock from "../../../utility/countdownTimer";

export default function ModalTimetracking({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const [timetracking, setTimetracking] = useState([]);

    const Timetracking = async () => {
        try {
            const timetracking = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/time-tracking",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    transgroupId: details.transgroupId
                }
            });
            setTimetracking(timetracking.data)
        } catch (error) {

        }

    }

    useEffect(() => {
        Timetracking()
    }, [visible])


    return (
        <Modal
            visible={visible}
            okButtonProps={{ hidden: true }}
            cancelText="Close"
            onCancel={onCancel}

            {...props}
        >
            <Timeline>
                {timetracking.map((item, index) => {
                    return (
                        <Timeline.Item>
                            <label type="text"
                                style={{ padding: 0 }}
                                className="header-text"
                            >
                                {item.NodeName}
                            </label>
                             &nbsp;&nbsp;&nbsp;
                            {moment(item.ReceiveDate).format("DD/MM/YYYY H:mm")}
                            <Clock
                                timeformat="th"
                                showseconds={false}
                                node_receivedate={item.ReceiveDate}
                                node_senddate={item.SendDate}
                                type="timeworking"
                            />
                            <br />
                            <p>{item.Description}</p>
                        </Timeline.Item>
                    )
                })}


            </Timeline>
        </Modal>
    )
}
