import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Select, Checkbox, Spin } from 'antd';
//import { Editor } from '@tinymce/tinymce-react';
import TextEditor from '../../TextEditor';
import { useHistory, } from "react-router-dom";
import UploadFile from '../../UploadFile'
import Axios from 'axios';

export default function ModalqaAssign({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const uploadRef = useRef(null);
    const [form] = Form.useForm();
    const editorRef = useRef(null);
    const [loading, setLoading] = useState(false);

    //data
    const [assignlist, setAssignlist] = useState([]);
    const [qa_assign, setQA_assign] = useState(null);

    const GetAssign = async () => {
        try {
            const assign = await Axios({
                url: process.env.REACT_APP_API_URL + "/workflow/assign-qa",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                }
            });
            setAssignlist(assign.data)

        } catch (error) {

        }

    }

    const SaveComment = async () => {
        try {
            if (editorRef.current.getValue() !== "" && editorRef.current.getValue() !== null && editorRef.current.getValue() !== undefined) {
                const comment = await Axios({
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

    const SendFlow = async (value) => {
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
                        assigneeid: value.assignto,
                        recheck: value.recheck,
                        comment_text: editorRef.current.getValue()
                    }
                }
            });

            if (sendflow.status === 200) {
                SaveComment();
                setLoading(false);
                onOk();
                await Modal.success({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>Assign to {qa_assign}</p>
                        </div>
                    ),
                    okText: "Close",
                    onOk() {
                        editorRef.current.setvalue();
                        history.push({ pathname: "/internal/issue/inprogress" });
                        window.location.reload(true);
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
                },
            });
        }
    }

    const onFinish = (values) => {
        SendFlow(values);
    };

    useEffect(() => {
        if (visible) {
            GetAssign();
        }

    }, [visible])



    return (
        <Modal
            visible={visible}
            onOk={() => form.submit()}
            confirmLoading={loading}
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            okText="Send"
            okType="dashed"
            onCancel={() => { return (form.resetFields(), onCancel()) }}
            {...props}
        >
            <Spin spinning={loading}>
                <Form form={form} style={{ padding: 0, maxWidth: "100%", backgroundColor: "white" }}
                    layout="vertical"
                    name="leader-assign"
                    className="login-form"
                    initialValues={{
                        recheck: false,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        style={{ minWidth: 300, maxWidth: 300 }}
                        label="AssignTo"
                        name="assignto"
                        rules={[
                            {
                                required: true,
                                message: 'Please Select Assign',
                            },
                        ]}
                    >
                        {/* <label>Assign To </label> */}
                        <Select style={{ width: '100%' }} placeholder="None"
                            showSearch
                            filterOption={(input, option) =>
                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            onChange={(value, item) => setQA_assign(item.label)}
                            options={
                                assignlist && assignlist.map((item) => ({
                                    value: item.UserId,
                                    label: item.UserName
                                }))
                            }
                        >
                        </Select>
                    </Form.Item>
                    {/* <Row>

                    <Col> */}
                    <Form.Item
                        style={{ minWidth: 300, maxWidth: 300 }}
                        name="recheck"
                        valuePropName="checked"
                        rules={[
                            {
                                required: false,
                                message: 'Please Select Assign',
                            },
                        ]}
                    >
                        <Checkbox >
                            ReCheck (ส่งกลับมาให้ Leader ตรวจสอบ)
                         </Checkbox>
                    </Form.Item>
                    {/* </Col>
                </Row> */}
                </Form>

                {/* Remark : */}
                <br />
                <br />
            Remark :
            <br />
                <TextEditor ref={editorRef} />
                     AttachFile : <UploadFile ref={uploadRef} />
            </Spin>
        </Modal>
    )
}
