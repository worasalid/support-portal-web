
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { List, Row, Col, Button, Popconfirm, Modal, Tag } from 'antd'
import Axios from 'axios'
import { useHistory } from 'react-router-dom'
import { ArrowRightOutlined, DeleteOutlined, UpCircleOutlined, DownCircleOutlined } from '@ant-design/icons';



export default forwardRef(({ ticketId, mailtype, ...props }, ref) => {
    const history = useHistory();
    const [listdata, setListdata] = useState([]);
    const [countdata, setCountdata] = useState(null)

    //div
    const [divcollapse, setDivcollapse] = useState("none")
    const [collapseicon, setCollapseicon] = useState(<DownCircleOutlined style={{ fontSize: 20, color: "#1890ff" }} />)


    useImperativeHandle(ref, () => ({
        GetTask: () => GetTask(),
        getData: () => listdata,
        CountData: () => countdata
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
                    // mailtype: mailtype
                }
            });

            setCountdata(task.data.length)

            setListdata(task.data.map((value) => {
                return {
                    taskId: value.TaskId,
                    title: value.Title,
                    module: value.ModuleName,
                    status: value.Status,
                    flowstatus: value.FlowStatus,
                    description: value.Description,
                    releasenote: value.IsReleaseNote,
                    manday: value.Manday,
                    cntFile: value.cntFile
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
                await Modal.success({
                    title: 'ลบ Task งานสำเร็จ',
                    content: (
                        <div>
                            <p></p>
                        </div>
                    ),
                    okText: "Close",
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
            case 'Cancel':
                return <>
                    <ArrowRightOutlined style={{ fontSize: "16px", color: "#cd201f" }} />&nbsp;&nbsp;
                    <label style={{ color: "#cd201f" }}>{param}</label>
                </>

        }
    }

    useEffect(() => {
        GetTask();
        setDivcollapse("block")
    }, [ticketId])



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
                                        setCollapseicon(divcollapse === 'block' ? <UpCircleOutlined style={{ fontSize: 20, color: "#1890ff" }} /> : <DownCircleOutlined style={{ fontSize: 20, color: "#1890ff" }} />)
                                    )
                                }
                            }
                        >
                            {collapseicon}
                        </span>

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
                                style={{ boxShadow: "rgba(9, 30, 66, 0.25) 0px 1px 10px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px", marginBottom: 20 }}
                                onClick={() => history.push({ pathname: "/internal/issue/subject/" + ticketId + "/task-" + item.taskId })}
                            >
                                <List.Item >
                                    <List.Item.Meta
                                        title={
                                            <Row style={{ padding: "0px 0px 0px 10px" }}>
                                                <Col span={23} >
                                                    <Row>
                                                        <Col span={18}>
                                                            <img
                                                                style={{ height: "25px", width: "25px" }}
                                                                src={`${process.env.PUBLIC_URL}/icons-doc-task.png`}
                                                                alt=""
                                                            />&nbsp;
                                                            <label className="value-text">
                                                                {item.title}
                                                            </label>
                                                               &nbsp;&nbsp;
                                                            <label className="value-text">
                                                                {
                                                                    item.cntFile !== 0 ?
                                                                        <img
                                                                            style={{ height: "20px", width: "20px" }}
                                                                            src={`${process.env.PUBLIC_URL}/icons-attach.png`}
                                                                            alt=""
                                                                        /> : ""
                                                                }
                                                            </label>
                                                               &nbsp;&nbsp;
                                                              <Tag color="#17A2B8">{item.module}
                                                            </Tag>
                                                            &nbsp;&nbsp;
                                                            <Tag color="#87d068"
                                                                style={{ display: item.releasenote === true ? "inline-block" : "none" }}
                                                            >
                                                                ReleaseNote
                                                            </Tag>
                                                            <label
                                                                style={{
                                                                    display: item.manday !== 0 ? "inline-block" : "none",
                                                                    fontSize: 12
                                                                }}
                                                            >
                                                                ({item.manday} Manday)
                                                            </label>
                                                        </Col>
                                                        <Col span={6} style={{ textAlign: "right" }} >{renderTaskStatus(item.status)}</Col>
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
            <div className="task-animation">

            </div>
        </>
    )
});

