import { ClockCircleOutlined } from '@ant-design/icons'
import { Modal, Timeline, Row, Col, Button, Divider } from 'antd'
import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import moment from 'moment';

export default function DuedateLog({ visible = false, onOk, onCancel, details, ...props }) {
    const [history, setHistory] = useState([]);

    const getDueDateHistory = async () => {
        try {
            const history = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/log_duedate",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    ticketId: details.ticketId
                }
            });

            if (history.status === 200) {
                setHistory(history.data)
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        getDueDateHistory();
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
                <Row style={{ marginBottom: 20 }}>
                    <Col span={24}>
                        <label className="header-text">
                            วันที่แล้วเสร็จ:
                        </label>
                        <ClockCircleOutlined style={{ fontSize: 16, verticalAlign: "0.1em", marginLeft: 20 }} />
                        <label className="value-text" style={{ marginLeft: 5 }} >
                            {moment(history[0]?.due_date).format("DD/MM/YYYY HH:mm")}
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
                        <>
                            <Timeline.Item>

                                <Row align="middle">
                                    <Col span={12}>
                                        <label type="text"
                                            style={{ padding: 0 }}
                                            className="header-text"
                                        >
                                            ครั้งที่ {index + 1}
                                        </label>
                                        <Button type="text"
                                            style={{ marginRight: 16 }}
                                            icon={<ClockCircleOutlined style={{ fontSize: 16, verticalAlign: "0.1em" }} />}
                                            className="value-text"
                                        >
                                            <label className="value-text" style={{ marginLeft: 5 }}>
                                                {moment(item.due_date).format("DD/MM/YYYY HH:mm")}
                                            </label>

                                        </Button>
                                    </Col>
                                    <Divider type="vertical"/>
                                    <Col span={12} style={{marginTop:"10px"}}>
                                        <label className="value-text" >
                                            <p>{item.description}</p>
                                        </label>
                                    </Col>
                                </Row>
                                {/* <Row>

                                    <Col span={19}>
                                        <label className="value-text">
                                            <p>{item.description}</p>
                                        </label>
                                    </Col>
                                </Row> */}
                            </Timeline.Item>
                        </>
                    )
                })}


            </Timeline>
        </Modal>
    )
}
