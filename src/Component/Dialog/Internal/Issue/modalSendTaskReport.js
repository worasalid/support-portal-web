import React, { useState, useRef, useEffect } from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { Spin, Modal, Form, Checkbox, DatePicker } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import UploadFile from '../../../UploadFile';
import Axios from 'axios';
import TextEditor from '../../../TextEditor';
import moment from 'moment';

export default function ModalSendTaskReport({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const { RangePicker } = DatePicker;
    const history = useHistory();
    const match = useRouteMatch();
    const uploadRef = useRef(null);
    const [form] = Form.useForm();
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [hidden, setHidden] = useState(false);

    const saveComment = async () => {
        try {
            if ((editorRef.current.getValue() !== null) || (editorRef.current.getValue() === null && uploadRef.current.getFiles().length > 0)) {
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
                        comment_type: "task",
                        files: uploadRef.current.getFiles().map((n) => n.response),
                    }
                });
            }
        } catch (error) {

        }
    }

    const saveAccessRequest = async (values) => {
        console.log("date", moment(values?.requestDate).format("DD/MM/YYYY HH:mm"))
        await Axios({
            url: process.env.REACT_APP_API_URL + "/workflow/create-access-request",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                ticketId: details?.ticketid,
                ticketNumber: details?.ticketNumber,
                taskId: details?.taskid,
                requestStartDate: moment(values?.requestDate[0]).format("DD/MM/YYYY HH:mm"),
                requestEndDate: moment(values?.requestDate[1]).format("DD/MM/YYYY HH:mm")
            }
        });
    }

    const sendFlow = async (values) => {
        setLoading(true);
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
                    flowoutputid: details.flowoutputid,
                    value: {
                        deploy_url: values.deployUrl,
                        comment_text: editorRef.current.getValue()
                    }
                }
            });

            if (sendflow.status === 200) {
                saveComment();
                onOk();
                setLoading(false);

                Modal.success({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            {/* <p>บันทึกข้อมูลสำเร็จ</p> */}
                        </div>
                    ),
                    okText: "Close",
                    onOk() {
                        editorRef.current.setvalue();

                        if (details.flowoutput.value === "SendToDeploy" || details.flowoutput.value === "RequestDeploy" || details.flowoutput.value === "CheckDeploy") {
                            if (details.task_remain > 1) {
                                history.push({ pathname: "/internal/issue/subject/" + match.params.id });
                                window.location.reload(true);
                            } else {
                                history.push({ pathname: "/internal/issue/resolved" });
                                window.location.reload(true);
                            }
                        } else if (details.flowoutput.value === "CloseTask" || details.flowoutput.value === "CancelTask" || details.flowoutput.value === "ResolvedTask") {
                            history.push({ pathname: "/internal/issue/subject/" + match.params.id });
                            window.location.reload(true);
                        } else {
                            if (details.task_remain > 1) {
                                history.push({ pathname: "/internal/issue/subject/" + match.params.id });
                                window.location.reload(true);
                            } else {
                                history.push({ pathname: "/internal/issue/inprogress" });
                                window.location.reload(true);
                            }
                        }
                    },
                });
            }
        } catch (error) {
            onCancel();
            setLoading(false);
            await Modal.error({
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.response.data}</p>
                    </div>
                ),
                okText: "Close",
                okButtonProps: { hidden: true },
                okCancel() {

                    editorRef.current.setvalue();
                    window.location.reload(true);
                },
            });
        }
    }

    const onFinish = (values) => {
        sendFlow(values);
        saveAccessRequest(values);
    };

    return (
        <Modal
            visible={visible}
            confirmLoading={loading}
            okText="Send"
            onOk={() => form.submit()}
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            okType="dashed"
            onCancel={() => { form.resetFields(); onCancel() }}
            {...props}
        >
            <Spin spinning={loading} size="large" tip="Loading...">
                <Form form={form} style={{ padding: 0, maxWidth: "100%", backgroundColor: "white" }}
                    name="form"
                    layout="horizontal"
                    initialValues={{
                        remember: true,
                        accessRequest: false,
                        deployUrl: details?.deployUrl
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Access Request"
                        name="accessRequest"
                        valuePropName="checked"
                        rules={[
                            {
                                required: false,
                                message: '!!!',
                            },
                        ]}
                    >
                        <Checkbox onChange={() => setHidden(!hidden)} />
                    </Form.Item>
                    {

                        hidden
                            ? (
                                <Form.Item
                                    label="Request Date"
                                    name="requestDate"
                                    rules={[
                                        {
                                            required: true,
                                            message: '*กรุณาระบุ วันที่',
                                        },
                                    ]}
                                >
                                    {/* <DatePicker format="DD/MM/YYYY HH:mm" showTime
                                        onChange={(date, datestring) => console.log("xxx", datestring)}
                                    /> */}
                                    <RangePicker format="DD/MM/YYYY HH:mm" showTime
                                        onChange={(date, datestring) => console.log("xxx", datestring)}
                                    />
                                </Form.Item>
                            )
                            : <></>
                    }

                    <Form.Item
                        wrapperCol={6}
                        label="Deploy (URL)"
                        name="deployUrl"
                        rules={[
                            {
                                required: true,
                                message: '*กรุณาใส่ Deploy Url',
                            },
                        ]}
                    >
                        <TextArea rows="2" style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        name="remark"
                        label="Remark :"
                    >
                        <TextEditor ref={editorRef} ticket_id={details.ticketid} />
                        <br />

                        AttachFile : <UploadFile ref={uploadRef} />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    )
}
