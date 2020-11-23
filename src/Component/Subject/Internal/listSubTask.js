
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { List, Row, Col, Button, Popconfirm, Modal } from 'antd'
import Axios from 'axios'
import { useRouteMatch, useHistory } from 'react-router-dom'
import { ArrowRightOutlined, DeleteOutlined, FileOutlined } from '@ant-design/icons';



export default forwardRef(({ ticketId, ...props }, ref) => {
    const history = useHistory();
    const [listdata, setListdata] = useState([]);

    useImperativeHandle(ref, () => ({
        GetTask: () => GetTask()
    }));

    const GetTask = async () => {
        try {
            const task = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/load-task",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    ticketId: ticketId
                }
            });
            setListdata(task.data.map((value) => {
                return {
                    Id: value.id,
                    title: value.title,
                    status: value.status,
                    description: value.description
                }
            }))
        } catch (error) {

        }
    }

    const DeleteTask = async (value) => {
        try {
            const deletetask = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/delete-task",
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketId: ticketId,
                    taskId: value
                }
            });

            if (deletetask.status === 200) {
                await Modal.info({
                    title: 'ลบ Task งานสำเร็จ',
                    content: (
                        <div>
                            <p></p>
                        </div>
                    ),
                    onOk() {
                        GetTask()
                    },
                });
            }
        } catch (error) {

        }
    }

    function renderColorPriority(param) {
        switch (param) {
            case 'Waiting Progress':
                return <ArrowRightOutlined style={{ fontSize: "16px", color: "#DC7633" }} />
            case 'Complete':
                return <ArrowRightOutlined style={{ fontSize: "16px", color: "#27AE60" }} />
            case 'InProgress':
                return <ArrowRightOutlined style={{ fontSize: "16px", color: "#DC7633" }} />
        }
    }

    // useEffect(() => {
    //     GetTask()
    // }, [])

    // useEffect(() => {
    //     GetTask();

    // }, [listdata.length])
    // console.log("listdata", listdata && listdata.length)

    return (
        <>
            <List
                itemLayout="horizontal"
                dataSource={listdata}
                renderItem={item => (
                    <Row align="middle">
                        <Col span={23} className="task-active"
                            onClick={() => history.push({ pathname: "/internal/issue/subject/" + ticketId + "/task-" + item.Id })}
                        >
                            <List.Item>
                                <List.Item.Meta
                                    title={
                                        <Row >
                                            <Col span={23} >
                                                <Row>
                                                    <Col span={1}>{<FileOutlined />}</Col>
                                                    <Col span={17}>{item.title}</Col>
                                                    <Col span={6} style={{ textAlign: "right" }} >{renderColorPriority(item.status)}{item.status}</Col>
                                                </Row>

                                            </Col>

                                        </Row>
                                    }
                                // description={item.description}
                                />
                            </List.Item>
                        </Col>
                        <Col span={1} style={{ textAlign: "right" }}>
                            <Popconfirm title="ต้องการลบ Task งาน ใช่หรือไม่"
                                okText="Yes" cancelText="No"
                                onConfirm={() => DeleteTask(item.Id)}
                                style={{ width: "300px" }}
                            >
                                <Button type="link">
                                    {
                                        item.status === "InProgress" ? "" : <DeleteOutlined style={{ fontSize: "18px" }} />
                                    }
                                </Button>
                            </Popconfirm>
                        </Col>
                    </Row>

                )}
            />
        </>
    )
});