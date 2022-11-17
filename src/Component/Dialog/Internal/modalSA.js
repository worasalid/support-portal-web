import React, { useState, useRef, useEffect } from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { Modal, Form, InputNumber, Spin, Radio, Select, Row, Col } from 'antd';
import TextEditor from '../../TextEditor';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import TextArea from 'antd/lib/input/TextArea';


const radioStyle = {
    display: 'inline-block',
    height: '30px',
    lineHeight: '30px',
};

export default function ModalSA({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const uploadRef = useRef(null);
    const [form] = Form.useForm();
    const [radiovalue, setRadiovalue] = useState(null);
    const [radiovalue2, setRadiovalue2] = useState(null);
    const [stdversion, setStdversion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [version, setVersion] = useState([]);

    const editorRef = useRef(null)


    const getVersion = async () => {
        try {
            const version = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/config-data",
                method: "GET",
                params: {
                    groups: details.product_code + "_Version"
                }
            });

            if (version.status === 200) {
                setVersion(version.data)
            }
        } catch (error) {

        }
    }

    const SaveComment = async (type) => {
        try {
            await Axios({
                url: process.env.REACT_APP_API_URL + "/workflow/create_comment",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketid: details && details.ticketid,
                    taskid: details.taskid,
                    comment_text: editorRef.current.getValue(),
                    comment_type: type,
                    files: uploadRef.current.getFiles().map((n) => n.response),
                }
            });
        } catch (error) {

        }
    }

    const sendIssueFlow = async (values) => {
        setLoading(true);
        try {
            const sendflow = await Axios({
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
                        manday: values.manday,
                        check_std: values.check_std,
                        std_version: stdversion,
                        check_effect: values.check_effect,
                        effect_description: values.description,
                        comment_text: editorRef.current.getValue()
                    }
                }
            });

            if (sendflow.status === 200) {
                SaveComment("internal");
                onOk();
                setLoading(false);
                await Modal.success({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>ประเมิน Manday และ ผลกระทบส่งให้ CR Center</p>
                        </div>
                    ),
                    okText: "Close",
                    onOk() {
                        editorRef.current.setvalue();
                        history.push({ pathname: "/internal/issue/inprogress" })
                    },
                });
            }
        } catch (error) {
            setLoading(false);
            await Modal.error({
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                content: (
                    <div>
                        {/* <p>{error.response.data}</p> */}
                    </div>
                ),
                okText: "Close",
                onOk() {

                },
            });
        }
    }

    const sendTaskFlow = async (values) => {
        setLoading(true);
        await Axios({
            url: process.env.REACT_APP_API_URL + "/workflow/send",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                ticketid: details.ticketid,
                taskid: details.taskid,
                mailboxid: details && details.mailboxid,
                flowoutputid: details.flowoutputid,
                value: {
                    manday: values.manday,
                    check_std: values.check_std,
                    std_version: stdversion,
                    check_effect: values.check_effect,
                    effect_description: values.description,
                    comment_text: editorRef.current.getValue()
                }
            }
        }).then((res) => {
            SaveComment("task");
            onOk();
            setLoading(false);
            Modal.success({
                title: 'บันทึกข้อมูลสำเร็จ',
                content: (
                    <div>
                        <p>ประเมิน Manday และ ผลกระทบส่งให้ CR Center</p>
                    </div>
                ),
                okText: "Close",
                onOk() {
                    editorRef.current.setvalue();
                    history.push({ pathname: "/internal/issue/inprogress" })
                },
            });
        }).catch((error) => {
            setLoading(false);
            Modal.error({
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                content: (
                    <div>
                        {/* <p>{error.response.data}</p> */}
                    </div>
                ),
                okText: "Close",
                onOk() {

                },
            });
        })
    }

    const onFinish = (values) => {
        console.log(details.flowoutput)
        if (details.flowoutput.value === "Assessment") {
            sendIssueFlow(values);
        } else {
            sendTaskFlow(values);
        }
    };

    return (
        <Modal
            visible={visible}
            confirmLoading={loading}
            okText="Send"
            onOk={() => form.submit()}
            //okButtonProps={{ type: "primary", htmlType: "submit" }}
            onCancel={() => { form.resetFields(); setRadiovalue(null); setRadiovalue2(null); onCancel() }}
            {...props}
        >
            <Spin spinning={loading} size="large" tip="Loading...">
                <Form form={form} style={{ padding: 0, maxWidth: "100%", backgroundColor: "white" }}
                    name="SA"
                    //layout="vertical"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="manday"
                        label="Manday (Devs)"
                        rules={[
                            {
                                required: true,
                                message: 'กรุณาระบุ manday',
                            },
                        ]}
                    >
                        <InputNumber min={0.25} max={100} step={0.25} style={{ width: "30%" }} />
                    </Form.Item>

                    <Form.Item
                        name="check_std"
                        label="อยู่ใน Version STD"
                        // valuePropName="checked"
                        rules={[
                            {
                                required: true,
                                message: 'กรุณาระบุ version',
                            },
                        ]}
                    >
                        <Radio.Group onChange={(e) => { return setRadiovalue(e.target.value), setStdversion(null) }}>
                            <Radio style={radioStyle} value={2}>ไม่ใช่ STD</Radio>
                            <Radio style={radioStyle} value={1}>
                                STD
                                <Select placeholder="None"
                                    style={{ marginLeft: 10, display: radiovalue === 1 ? "inline-block" : "none" }}

                                    onClick={() => getVersion()}
                                    onChange={(value, item) => setStdversion(item.label)}
                                    options={version && version.map((x) => ({
                                        value: x.Value,
                                        label: x.Name
                                    }))}
                                >
                                </Select>
                            </Radio>

                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        name="check_effect"
                        // valuePropName="checked"
                        rules={[
                            {
                                required: true,
                                message: 'กรุณาประเมินผลกระทบ',
                            },
                        ]}
                    >
                        <Radio.Group onChange={(e) => { return setRadiovalue2(e.target.value), form.setFieldsValue({ description: null }) }}>
                            <Radio value={1}>
                                มีผลกระทบ
                            </Radio>
                            <Radio value={2}>ไม่มีผลกระทบ</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        style={{ display: radiovalue2 === 1 ? "block" : "none" }}
                        name="description"
                        label="ประเมินผลกระทบ"
                        rules={[
                            {
                                required: radiovalue2 === 1 ? true : false,
                                message: 'กรุณา ประเมินผลกระทบ',
                            },
                        ]}
                    >
                        <TextArea rows={5} style={{ width: "100%" }} />
                    </Form.Item>


                    <Form.Item
                        // style={{ minWidth: 300, maxWidth: 300 }}
                        name="remark"

                    >
                        <br />
                        <TextEditor ref={editorRef} ticket_id={details.ticketid} />
                        <br />
                        AttachFile : <UploadFile ref={uploadRef} />
                    </Form.Item>
                </Form>


            </Spin>
        </Modal>
    )
}
