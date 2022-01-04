import { ClockCircleOutlined, CodepenOutlined } from '@ant-design/icons'
import { Modal, Timeline, Row, Col, Button } from 'antd'
import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import moment from 'moment';

export default function DuedateLog({ visible = false, onOk, onCancel, details, ...props }) {
    const [history, setHistory] = useState([]);
    const [taskDueDate, setTaskDueDate] = useState(null);

    const getDueDateHistory = async () => {
        await Axios.get(`${process.env.REACT_APP_API_URL}/tickets/task-duedate`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                ticket_id: details.ticketId,
                task_id: details.taskId
            }
        }).then((res) => {
            setHistory(res.data);
            setTaskDueDate(res.data.filter((n) => n.type === "Create"));
        }).catch((error) => {

        })
    }

    useEffect(() => {
        if (visible) {
            getDueDateHistory();
        }
    }, [visible])


    return (
        <Modal
            visible={visible}
            onCancel={onCancel}
            cancelText="Close"
            okButtonProps={{ hidden: true }}
            {...props}
        >
            <Timeline>
                <Row style={{ marginBottom: 30 }}>
                    <Col span={24}>
                        <label className="header-text">
                            วันที่แล้วเสร็จ:
                        </label>

                        <label className="value-text" style={{ marginLeft: 20, fontWeight: "bold", }} >
                            {history[0]?.due_date === undefined ? "None" : moment(taskDueDate?.due_date).format("DD/MM/YYYY HH:mm")}
                            <ClockCircleOutlined style={{ fontSize: 16, verticalAlign: "0.1em", marginLeft: 5 }} />
                        </label>
                     
                    </Col>
                </Row>
                <Row style={{ marginBottom: 20 }}>
                    <Col span={24}>
                        <label className="header-text">
                            เลื่อน DueDate
                        </label>
                    </Col>
                </Row>
                {history.filter((x) => x.type === "Change").map((item, index) => {
                    return (
                        <Timeline.Item>
                            <Row>
                                <Col span={24}>
                                    <label type="text"
                                        style={{ padding: 0 }}
                                        className="header-text"
                                    >
                                        ครั้งที่ {index + 1}
                                    </label>

                                    <label className="value-text" style={{
                                        marginLeft: 20,
                                        fontWeight: "bold",
                                        color: index === 0 ? "orange" : index === 1 ? "#FF4D4F" : "#BE1E2D"
                                    }} >
                                        {moment(item.due_date).format("DD/MM/YYYY HH:mm")}
                                        <ClockCircleOutlined style={{ fontSize: 16, verticalAlign: "0.1em", marginLeft: 5 }} />
                                    </label>

                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <label className="value-text">
                                        &nbsp; &nbsp;{item.description}
                                    </label>
                                </Col>
                            </Row>
                        </Timeline.Item>
                    )
                })}


            </Timeline>
        </Modal>
    )
}
