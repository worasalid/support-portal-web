import React, { useState, useRef, useEffect, useContext } from 'react';
import { Modal, Form, Select, Spin } from 'antd';
//import { Editor } from '@tinymce/tinymce-react';
import TextEditor from '../../TextEditor';
import { useHistory, useRouteMatch } from "react-router-dom";
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import AuthenContext from "../../../utility/authenContext";

export default function ModalLeaderAssign({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const { state, dispatch } = useContext(AuthenContext);
    const history = useHistory();
    const uploadRef = useRef(null);
    const [form] = Form.useForm();
    const [textValue, setTextValue] = useState("");
    const [select_assign, setSelect_assign] = useState(null);
    const editorRef = useRef(null)

    const [assignlist, setAssignlist] = useState([]);
    const [loading, setLoading] = useState(false);

    const GetAssign = async () => {
        try {
            const assign = await Axios({
                url: process.env.REACT_APP_API_URL + "/workflow/assign-developer",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    taskid: details.taskid
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

    const SendFlow = async (param) => {
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
                        assigneeid: param,
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
                            <p>Assign งานให้ {select_assign}</p>
                        </div>
                    ),
                    okText:"Close",
                    onOk() {
                        editorRef.current.setvalue();
                        if (param === state?.usersdata?.users?.id) {
                            window.location.reload(true);
                        } else {
                            history.push({ pathname: "/internal/issue/inprogress" });
                            window.location.reload(true);
                        }

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
                okText:"Close",
                onOk() {
                    editorRef.current.setvalue();
                    onOk();

                },
            });
        }
    }

    const onFinish = (values, item) => {
        SendFlow(values.assignto);
    };

    useEffect(() => {
        if (visible) {
            GetAssign();
        }

    }, [visible])

    return (
        <Modal
            visible={visible}
            confirmLoading={loading}
            onOk={() => form.submit() }
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            okText="Send"
            okType="dashed"
            onCancel={() => {form.resetFields(); onCancel() }}
            {...props}
        >
            <Spin spinning={loading} size="large" tip="Loading...">
                <Form form={form} style={{ padding: 0, maxWidth: "100%", backgroundColor: "white" }}
                    layout="vertical"
                    name="leader-assign"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        style={{ minWidth: 300, maxWidth: 300 }}
                        label="AssignTo"
                        name="assignto"
                        rules={[
                            {
                                required: false,
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
                            onChange={(value, item) => setSelect_assign(item.label)}
                            options={
                                assignlist && assignlist.map((item) => ({
                                    value: item.UserId,
                                    label: item.UserName
                                }))
                            }
                        >
                        </Select>
                    </Form.Item>
                    <Form.Item
                        // style={{ minWidth: 300, maxWidth: 300 }}
                        name="remark"
                        label="Remark"
                        rules={[
                            {
                                required: false,
                                message: 'Please input your UnitTest!',
                            },
                        ]}
                    >
                        {/* Remark : */}
                        <TextEditor ref={editorRef} ticket_id={details.ticketid} />
                        <br />
                     AttachFile : <UploadFile ref={uploadRef} />
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    )
}
