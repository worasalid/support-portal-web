import { ClockCircleOutlined } from '@ant-design/icons'
import { Modal, Timeline, Row, Col, Button } from 'antd'
import Axios from 'axios';
import React, { useEffect, useState } from 'react'

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
                {history.map((item, index) => {
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
                                    <Button type="text"
                                        style={{ marginRight: 16 }}
                                        icon={<ClockCircleOutlined style={{ fontSize: 16, verticalAlign: "0.1em" }} />}
                                        className="value-text"
                                    >
                                        <label className="value-text">
                                            {new Date(item.due_date).toLocaleDateString('en-GB')}
                                        </label>

                                    </Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <p>{item.description}</p></Col>
                            </Row>
                        </Timeline.Item>
                    )
                })}


            </Timeline>
        </Modal>
    )
}
