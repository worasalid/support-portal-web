import React, { useState, useRef, useEffect } from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { Modal, Form, InputNumber, Input, List, Row, Col, Tag, Tooltip } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import { QuestionCircleOutlined } from '@ant-design/icons';

export default function ModalMandayLog({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();

    //data
    let [manday, setManday] = useState([])
    const [totalmanday, setTotalmanday] = useState(0)
    const [listdata, setListdata] = useState([]);

    const GetTask = async () => {
        try {
            const task = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/load-task",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    ticketId: details.ticketid,
                    mailtype: details.mailtype
                }
            });
            setManday(task.data.map((x) => x.Manday))
            setTotalmanday(details?.manday)
            setListdata(task.data.map((value) => {
                return {
                    taskid: value.TaskId,
                    title: value.Title,
                    module: value.ModuleName,
                    manday: value.Manday

                }
            }));

        } catch {

        }
    }

    useEffect(() => {
        if (visible === true) {
            GetTask();
        }

    }, [visible])

    manday = manday.reduce(function (a, b) {
        return a + b;
    }, 0);

    useEffect(() => {
        setTotalmanday(details.totalmanday)
    }, [])


    return (
        <Modal
            visible={visible}
            // okText="Send"
            okButtonProps={{ visible: false, hidden: true }}
            cancelText="Close"
            onCancel={() => onCancel()}
            {...props}
        >


            <List
                itemLayout="horizontal"
                dataSource={listdata}
                renderItem={item => (
                    <>
                        <Row>
                            <Col span={5} style={{ textAlign: "right" }}>
                                <Tooltip title={item.title}>
                                    <QuestionCircleOutlined style={{ marginRight: 10 }} />
                                </Tooltip>

                                <Tag color="#f50">{item.module}</Tag>
                            </Col>
                            <Col span={19}>

                                <InputNumber defaultValue={item.manday} disabled={true} style={{ width: "30%", marginLeft: 10 }} />
                                <label>Manday</label>
                            </Col>
                        </Row>

                    </>
                )} >
            </List>

            <Row>
                <Col span={5} style={{ textAlign: "right" }}>
                    <label>CR Center</label>
                </Col>
                <Col span={19}>
                    <InputNumber value={details.totalmanday - manday} disabled={true} style={{ width: "30%", marginLeft: 10 }} />
                    <label>Manday</label>
                    {/* <label style={{ marginRight: 20 }}>&nbsp;&nbsp;&nbsp;{totalmanday - manday}</label> */}
                </Col>
            </Row>
            <Row>
                <Col span={5} style={{ textAlign: "right" }}>
                    <label>Total Manday</label>
                </Col>
                <Col span={6} style={{ textAlign: "right" }}>
                    <label style={{ marginRight: 10 }}>&nbsp;&nbsp;&nbsp;{details.totalmanday}</label>
                </Col>

            </Row>
            <Row>
                <Col span={5} style={{ textAlign: "right" }}>
                    <label>Total Cost</label>
                </Col>
                <Col span={6} style={{ textAlign: "right" }}>
                    <label style={{ marginRight: 10 }}>&nbsp;&nbsp;&nbsp;{details.cost}</label>
                </Col>
            </Row>



        </Modal>
    )
}
