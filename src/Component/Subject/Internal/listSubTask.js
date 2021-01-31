
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { List, Row, Col, Button, Popconfirm, Modal, Tag } from 'antd'
import Axios from 'axios'
import { useHistory } from 'react-router-dom'
import { ArrowRightOutlined, DeleteOutlined, FileOutlined, UpCircleOutlined, DownCircleOutlined } from '@ant-design/icons';



export default forwardRef(({ ticketId, mailtype, ...props }, ref) => {
    const history = useHistory();
    const [listdata, setListdata] = useState([]);

    //div
    const [divcollapse, setDivcollapse] = useState("none")
    const [collapseicon, setCollapseicon] = useState(<UpCircleOutlined style={{ fontSize: 20, color: "#1890ff" }} />)

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
                    ticketId: ticketId,
                    mailtype: mailtype
                }
            });

            setListdata(task.data.map((value) => {
                return {
                    taskId: value.TaskId,
                    title: value.Title,
                    module: value.ModuleName,
                    status: value.Status,
                    flowstatus: value.FlowStatus,
                    description: value.Description
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

    function renderTaskStatus(param) {
        switch (param) {
            case 'Waiting Progress':
                return <>
                    <ArrowRightOutlined style={{ fontSize: "16px", color: "#DC7633" }} />&nbsp;&nbsp;
                    <label style={{ color: "#DC7633" }}>{param}</label>
                </>
            case 'InProgress':
                return <>
                    <ArrowRightOutlined style={{ fontSize: "16px", color: "#DC7633" }} />&nbsp;&nbsp;
                    <label style={{ color: "#DC7633" }}>{param}</label>
                </>
            case 'Done':
                return <>
                    <ArrowRightOutlined style={{ fontSize: "16px", color: "#27AE60" }} />&nbsp;&nbsp;
                    <label style={{ color: "#27AE60" }}>{param}</label>
                </>
            case 'Resolved':
                return <>
                    <ArrowRightOutlined style={{ fontSize: "16px", color: "#27AE60" }} />&nbsp;&nbsp;
                    <label style={{ color: "#27AE60" }}>{param}</label>
                </>
            case 'Complete':
                return <>
                    <ArrowRightOutlined style={{ fontSize: "16px", color: "#27AE60" }} />&nbsp;&nbsp;
                    <label style={{ color: "#52c41a" }}>{param}</label>
                </>

        }
    }

    useEffect(() => {
        GetTask();
        setDivcollapse("block")
    }, [mailtype])

    // useEffect(() => {
    //     GetTask();

    // }, [listdata.length])
    //  console.log("mailtype", mailtype)

    return (
        <>
            {
                listdata.length !== 0
                    ?
                    <>
                        <label className="header-text">Task</label>
                        <span

                            style={{ marginTop: 10, marginLeft: 12, marginRight: 12, cursor: "pointer" }}
                            onClick={
                                () => {
                                    return (
                                        setDivcollapse(divcollapse === 'none' ? 'block' : 'none'),
                                        setCollapseicon(divcollapse === 'block' ? <DownCircleOutlined style={{ fontSize: 20, color: "#1890ff" }} /> : <UpCircleOutlined style={{ fontSize: 20, color: "#1890ff" }} />)
                                    )
                                }
                            }
                        >
                            {collapseicon}
                        </span>
                        {/* <div>
                            <Progress percent={30} strokeColor="#52c41a"></Progress>
                        </div> */}
                    </>
                    : ""

            }

            <div style={{ display: divcollapse, marginTop: "16px" }}>
                <List
                    itemLayout="horizontal"
                    dataSource={listdata}
                    renderItem={item => (
                        <Row align="middle">
                            <Col span={23} className="task-active"
                                style={{ boxShadow: "rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px" }}
                                onClick={() => history.push({ pathname: "/internal/issue/subject/" + ticketId + "/task-" + item.taskId })}
                            >
                                <List.Item >
                                    <List.Item.Meta
                                        title={
                                            <Row >
                                                <Col span={23} >
                                                    <Row>
                                                        <Col span={1}>{<FileOutlined />}</Col>
                                                        <Col span={15}>
                                                            <label className="value-text">
                                                                {item.title}
                                                            </label>

                                                            <Tag color="#f50">{item.module}
                                                            </Tag>
                                                        </Col>
                                                        <Col span={8} style={{ textAlign: "right" }} >{renderTaskStatus(item.status)}</Col>
                                                    </Row>
                                                    <Row style={{ textAlign: "right" }}>
                                                        <Col span={24}>
                                                            <label className="value-text">
                                                                {item.flowstatus === null ? "" : `(${item.flowstatus})`}
                                                            </label>
                                                        </Col>
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
                                    onConfirm={() => DeleteTask(item.taskId)}
                                    style={{ width: "300px" }}
                                >
                                    <Button type="link">
                                        {
                                            item.status !== "Waiting Progress" ? "" : <DeleteOutlined style={{ fontSize: "18px" }} />
                                        }
                                    </Button>
                                </Popconfirm>
                            </Col>
                        </Row>

                    )}
                />
            </div>
        </>
    )
});