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
                    transgroupid: details.transgroupid,
                    taskid: details.taskid
                }
            });
            setTimetracking(timetracking.data)
        } catch (error) {

        }

    }

    function convertNodeName(param) {
        switch (param) {
            case "developer_2":
                return "H.Developer"
                break;
            case "developer_1":
                return "Developer"
                break;
            case "qa_leader":
                return "H.QA"
                break;
            case "qa":
                return "QA"
                break;
            default:
                return param;

        }
        // if (param === "developer_2") {
        //     return "H.Dev"
        // }
    }

    useEffect(() => {
        if (visible) {
            Timetracking()
        }
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
                                {convertNodeName(item.NodeName)}

                            </label>
                             &nbsp;&nbsp;&nbsp;
                            <label  style={{ fontSize: 12, color:"#CCCCCC"  }}>
                                {moment(item.ReceiveDate).format("DD/MM/YYYY H:mm")}
                            </label>

                            <Clock
                                timeformat="th"
                                showseconds={false}
                                node_receivedate={item.ReceiveDate}
                                node_senddate={item.SendDate}
                                type="timeworking"
                            />
                            <br />
                            <label style={{ fontSize: 12}}>
                                {item.Description}
                            </label>
                        </Timeline.Item>
                    )
                })}


            </Timeline>
        </Modal>
    )
}
