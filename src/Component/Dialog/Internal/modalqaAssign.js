import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Checkbox, Row, Col } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { useHistory, useRouteMatch } from "react-router-dom";
import UploadFile from '../../UploadFile'
import Axios from 'axios';

export default function ModalqaAssign({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const uploadRef = useRef(null);
    const [form] = Form.useForm();
    const [textValue, setTextValue] = useState("");
    const editorRef = useRef(null)

    //data
    const [assignlist, setAssignlist] = useState([]);
    const [qa_assign, setQA_assign] = useState(null);

    const handleEditorChange = (content, editor) => {
        setTextValue(content);
    }

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
            if (textValue !== "") {
                const comment = await Axios({
                    url: process.env.REACT_APP_API_URL + "/tickets/create_comment",
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                    },
                    data: {
                        ticketId: details && details.ticketId,
                        comment_text: textValue,
                        comment_type: "internal",
                        files: uploadRef.current.getFiles().map((n) => n.response.id),
                    }
                });
            }
        } catch (error) {

        }
    }

    const SendFlow = async (value) => {
        try {
            const sendflow = await Axios({
                url: process.env.REACT_APP_API_URL + "/workflow/send",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    mailbox_id: details && details.mailboxId,
                    node_output_id: details && details.node_output_id,
                    to_node_id: details && details.to_node_id,
                    node_action_id: details && details.to_node_action_id,
                    // product_id: details && details.productId,
                    // module_id: details && details.moduleId,
                    to_user_id: value.assignto,
                    flowstatus: details.flowstatus,
                    groupstatus: details.groupstatus,
                    recheck: value.recheck,
                    history: {
                        historytype: "Internal",
                        description: details.flowaction,
                        value: "Assign Task To " + qa_assign,
                        value2: ""
                      }
                }
            });

            if (sendflow.status === 200) {
                await Modal.info({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>บันทึกข้อมูลสำเร็จ</p>
                        </div>
                    ),
                    onOk() {
                        editorRef.current.editor.setContent("");
                        onOk();
                        history.push({ pathname: "/internal/issue/inprogress" })
                    },
                });
            }
        } catch (error) {
            alert(error)
        }
    }

    const onFinish = (values) => {
        console.log('Success:', values);
        SaveComment();
        SendFlow(values);
        onOk();
    };

    useEffect(() => {
        if (visible) {
            GetAssign();
        }

    }, [visible])

   
   
    return (
        <Modal
            visible={visible}
            onOk={() => { return (form.submit()) }}
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            okText="Send"
            okType="dashed"
            onCancel={() => { return (form.resetFields(), onCancel()) }}
            {...props}
        >

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
                        onChange= {(value,item) => setQA_assign(item.label)}
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
            <br />
            <Editor
                apiKey="e1qa6oigw8ldczyrv82f0q5t0lhopb5ndd6owc10cnl7eau5"
                ref={editorRef}
                initialValue=""
                init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar1: 'undo redo | styleselect | bold italic underline forecolor fontsizeselect | link image',
                    toolbar2: 'alignleft aligncenter alignright alignjustify bullist numlist preview table openlink',
                }}
                onEditorChange={handleEditorChange}
            />
            <br />
                     AttachFile : <UploadFile ref={uploadRef} />

        </Modal>
    )
}
