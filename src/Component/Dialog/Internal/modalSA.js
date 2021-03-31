import React, { useState, useRef, useEffect } from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { Modal, Form, Input, Spin, Radio, Select } from 'antd';
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
    const [textValue, setTextValue] = useState("");
    const [radiovalue, setRadiovalue] = useState(null);
    const [radiovalue2, setRadiovalue2] = useState(null);
    const [stdversion, setStdversion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [version, setVersion] = useState([]);

    const editorRef = useRef(null)


    const handleEditorChange = (content, editor) => {
        setTextValue(content);
    }

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
                // setVersion(version.data.map((x) => {
                //     return {
                //         value: x.value,
                //         label: x.Name
                //     }
                // }))
            }
        } catch (error) {

        }
    }

    const SaveComment = async () => {
        try {
            if (editorRef.current.getValue() !== "" && editorRef.current.getValue() !== null) {
                await Axios({
                    url: process.env.REACT_APP_API_URL + "/tickets/create_comment",
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                    },
                    data: {
                        ticketid: details && details.ticketid,
                        taskid: details.taskid,
                        comment_text: editorRef.current.getValue(),
                        comment_type: "internal",
                        files: uploadRef.current.getFiles().map((n) => n.response.id),
                    }
                });
            }
        } catch (error) {

        }
    }

    const SendFlow = async (values) => {
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
                        check_std: values.check_std,
                        std_version: stdversion,
                        check_effect: values.check_effect,
                        effect_description: values.description,
                        comment_text: textValue
                    }

                }
            });

            if (sendflow.status === 200) {
                SaveComment();
                onOk();
                setLoading(false);
                await Modal.success({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>ประเมินผลกระทบส่งให้ CR Center</p>
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
                        <p>{error.response.data}</p>
                    </div>
                ),
                okText: "Close",
                onOk() {
                    editorRef.current.setvalue();
                    onOk();
                    history.push({ pathname: "/internal/issue/inprogress" })
                },
            });
        }
    }

    const onFinish = (values) => {
        SendFlow(values);
    };

    return (
        <Modal
            visible={visible}
            confirmLoading={loading}
            okText="Send"
            onOk={() => { return (form.submit()) }}
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            okType="dashed"
            onCancel={() => { return (form.resetFields(), setRadiovalue(null), setRadiovalue2(null), onCancel()) }}
            {...props}
        >
            <Spin spinning={loading} size="large" tip="Loading...">
                <Form form={form} style={{ padding: 0, maxWidth: "100%", backgroundColor: "white" }}
                    name="qa-test"
                    layout="vertical"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >

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
                                    }))
                                    }

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
                        label="Remark :"

                    >
                        <TextEditor ref={editorRef} />
                        <br />
                     AttachFile : <UploadFile ref={uploadRef} />
                    </Form.Item>
                </Form>


            </Spin>
        </Modal>
    )
}
