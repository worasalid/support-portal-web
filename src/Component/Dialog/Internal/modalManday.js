import React, { useState, useRef, useEffect } from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { Modal, Form, InputNumber, Input, List, Row, Col, Radio, Tag } from 'antd';
import TextEditor from '../../TextEditor';
import UploadFile from '../../UploadFile'
import Axios from 'axios';

export default function ModalManday({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const uploadRef = useRef(null);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [hidden_form, setHidden_form] = useState(true)
    const editorRef = useRef(null)

    //data
    let [manday, setManday] = useState([])
    let [costmanday, setCostmanday] = useState(0)
    let [totalcost, setTotalcost] = useState(0)
    const [crCenterManday, setCrCenterManday] = useState(0)
    const [totalmanday, setTotalmanday] = useState(0)
    const [textValue, setTextValue] = useState("");
    const [listdata, setListdata] = useState([]);

    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    };
    const formProps = {
        hidden: details.flowoutput.Type === "Issue" ? true : false,
        labelCol: { span: 0 },
        wrapperCol: { span: 24 },
        labelAlign: "right",
        layout: "horizontal"
    }
    const form2Props = {
        hidden: details.flowoutput.Type === "Task" ? true : false,
        // labelCol: { span: 10 },
        // wrapperCol: { span: 14 },
        labelAlign: "right",
        layout: "horizontal"
    }


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
                    mailtype: "in"
                }
            });
            setManday(task.data.map((x) => x.Manday))
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

    const handleEditorChange = (content, editor) => {
        setTextValue(content);
    }

    const SaveComment = async () => {
        try {
            if (editorRef.current.getValue() !== "" && editorRef.current.getValue() !== null){
                await Axios({
                    url: process.env.REACT_APP_API_URL + "/tickets/create_comment",
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                    },
                    data: {
                        ticketid: details && details.ticketid,
                        taskid: details.taskid,
                        comment_text: textValue,
                        comment_type: "internal",
                        files: uploadRef.current.getFiles().map((n) => n.response.id),
                    }
                });
            }
        } catch (error) {

        }
    }

    const SendFlowTask = async (values) => {
        try {
            const sendflow = await Axios({
                url: process.env.REACT_APP_API_URL + "/workflow/send",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    taskid: details.taskid,
                    mailboxid: details.mailboxid,
                    flowoutputid: details.flowoutput.FlowOutputId,
                    value: {
                        manday: values.manday,
                        comment_text: textValue
                    }

                }
            });

            if (sendflow.status === 200) {
                SaveComment();
                onOk();
                await Modal.info({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>บันทึกข้อมูลสำเร็จ</p>
                        </div>
                    ),
                    onOk() {
                        editorRef.current.setvalue();
                        history.push({ pathname: "/internal/issue/inprogress" })
                    },
                });
            }
        } catch (error) {
            await Modal.info({
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.response.data}</p>
                    </div>
                ),
                onOk() {
                    editorRef.current.setvalue();
                    onOk();

                },
            });
        }
    }

    const SendFlowIssue = async (values) => {
        try {
            const SendFlowIssue = await Axios({
                url: process.env.REACT_APP_API_URL + "/workflow/send-issue",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketid: details.ticketid,
                    mailboxid: details && details.mailboxid,
                    flowoutputid: details.flowoutput.FlowOutputId,
                    value: {
                        totalmanday: totalmanday,
                        cost: totalcost,
                        comment_text: textValue
                    }

                }
            });

            if (SendFlowIssue.status === 200) {
                SaveComment();
                onOk();
                await Modal.info({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>บันทึกข้อมูลสำเร็จ</p>
                        </div>
                    ),
                    onOk() {
                        editorRef.current.setvalue();
                     
                        history.push({ pathname: "/internal/issue/inprogress" })
                    },
                });
            }
        } catch (error) {
            await Modal.info({
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.response.data}</p>
                    </div>
                ),
                onOk() {
                    editorRef.current.setvalue();
                    onOk();

                },
            });
        }
    }


    const onFinish = (values) => {
        details.flowoutput.Type === "Task" ? SendFlowTask(values) : SendFlowIssue(values)
    };

    useEffect(() => {
        GetTask();

    }, [visible])



    // form.setFieldsValue({ manday: `${listdata[0]?.manday}` })
    manday = manday.reduce(function (a, b) {
        return a + b;
    }, 0);

    useEffect(() => {
        setTotalmanday(manday + parseFloat(crCenterManday))
    }, [])

    useEffect(() => {
        setTotalmanday(manday + parseFloat(crCenterManday))
        setTotalcost((manday + crCenterManday) * costmanday)
    }, [crCenterManday, costmanday, manday])


    return (
        <Modal
            visible={visible}
            okText="Send"
            onOk={() => { return details.flowoutput.Type === "Task" ? form.submit() : form2.submit() }}
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            okType="dashed"
            onCancel={() => {
                return form.resetFields(), form2.resetFields(),
                    onCancel(),
                    setTotalmanday(0),
                    setTotalcost(0)
            }
            }
            {...props}
        >


            <Form form={form} style={{ padding: 0, maxWidth: "100%", backgroundColor: "white" }} {...formProps}
                name="form-taskmanday"

                onFinish={onFinish}
            >
                <Form.Item
                    name="manday"
                    label="Manday (Devs)"
                >
                    <InputNumber min={0.25} max={100} step={0.25} style={{ width: "30%" }} />
                </Form.Item>
            </Form>

            <Form form={form2} style={{ padding: 0, maxWidth: "100%", backgroundColor: "white" }} {...form2Props}
                name="form-issuemanday"

                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >

                <Row>



                    <Col span={8}>
                        <fieldset style={{ border: "solid 1px", borderRadius: "25px", padding: "15px" }}>
                            <Form.Item
                                name="freecost"
                                label="ค่าใช้จ่าย"
                                rules={[
                                    {
                                        required: true,
                                        message: 'กรุณาระบุ ค่าใช้จ่าย',
                                    },
                                ]}
                            >
                                <Row>
                                    <Col span={24}>
                                        <Radio.Group onChange={(e) => e.target.value}>
                                            <Radio style={radioStyle} value={1} onChange={(x) => setCostmanday(0)}>
                                                ไม่มีค่าใช้จ่าย (ฟรี)
                                </Radio>
                                            <Radio style={radioStyle} value={2} onChange={(x) => setCostmanday(details.costmanday)}>
                                                มีค่าใช้จ่าย
                               </Radio>

                                        </Radio.Group>
                                    </Col>
                                </Row>
                            </Form.Item>
                        </fieldset>
                    </Col>
                    <Col span={16}>
                        <List
                            itemLayout="horizontal"
                            dataSource={listdata}
                            renderItem={item => (
                                <>
                                    <Row>
                                        <Col span={10} style={{ textAlign: "right" }}>
                                            <Tag color="#f50">{item.module}</Tag>
                                        </Col>
                                        <Col span={10}>

                                            <InputNumber defaultValue={item.manday} disabled={true} style={{ width: "100%" }} />

                                        </Col>
                                        <Col span={4} style={{ textAlign: "center" }}>
                                            <label>Manday</label>
                                        </Col>
                                    </Row>

                                </>
                            )} >
                        </List>


                        <Row>
                            <Col span={10} style={{ textAlign: "right" }}>
                                <label>Cr Center</label>
                            </Col>
                            <Col span={10}>
                                <InputNumber min={0} max={100} step={0.25} defaultValue={0} style={{ width: "100%", marginLeft: "0px", textAlign: "right" }}
                                    onChange={(value) => {
                                        setCrCenterManday(value)
                                    }
                                    } />
                            </Col>
                            <Col span={4} style={{ textAlign: "center" }}>
                                <label>Manday</label>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={10} style={{ textAlign: "right" }}>
                                <label>Total Manday</label>
                            </Col>
                            <Col span={10} style={{ textAlign: "right" }}>
                                <label style={{ marginRight: 12 }}>&nbsp;&nbsp;&nbsp;{totalmanday}</label>
                            </Col>
                            <Col span={4} style={{ textAlign: "center" }}>
                                <label>Manday</label>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={10} style={{ textAlign: "right" }}>
                                <label>Total Cost</label>
                            </Col>
                            <Col span={10} style={{ textAlign: "right", borderBottom: "1px solid" }}>
                                <label style={{ marginRight: 12 }}>&nbsp;&nbsp;&nbsp;{totalcost}</label>
                                <u></u>
                            </Col>
                            <Col span={4} style={{ textAlign: "center" }}>
                                <label>บาท</label>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>

            <Row style={{ marginTop: 50 }}>
                <Col span={24}>
                    <label>Remark :</label> <br />
                    <TextEditor ref={editorRef} />
                    <br />
                     AttachFile : <UploadFile ref={uploadRef} />
                </Col>
            </Row>

        </Modal>
    )
}
