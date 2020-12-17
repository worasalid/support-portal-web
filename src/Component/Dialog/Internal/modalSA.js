import React, { useState, useRef, useEffect } from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { Modal, Form, Input, Checkbox, Radio } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import TextArea from 'antd/lib/input/TextArea';

const radioStyle = {
    display: 'block',
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
    // const [radiochecked, setRadiochecked] = useState(false);

    const editorRef = useRef(null)


    const handleEditorChange = (content, editor) => {
        setTextValue(content);
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

    const SendFlow = async () => {
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
                        comment_text: textValue
                    }

                }
            });

            if (sendflow.status === 200) {
                SaveComment();
                await Modal.info({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>บันทึกข้อมูลสำเร็จ</p>
                        </div>
                    ),
                    onOk() {
                        editorRef.current.editor.setContent("")
                        onOk();
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
                    editorRef.current.editor.setContent("")
                    onOk();
                    history.push({ pathname: "/internal/issue/inprogress" })
                },
            });
        }
    }

    const onFinish = (values) => {
        // console.log('textbox:', stdversion);
        // console.log('Success:', values);
        // console.log('textremark:', textValue);
        SendFlow();
    };


    return (
        <Modal
            visible={visible}
            okText="Send"
            onOk={() => { return (form.submit()) }}
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            okType="dashed"
            onCancel={() => { return (form.resetFields(), setRadiovalue(null), setRadiovalue2(null), onCancel()) }}
            {...props}
        >

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
                    name="checkstd"
                    label="อยู่ใน Version STD"
                    valuePropName="checked"
                    rules={[
                        {
                            required: true,
                            message: 'กรุณาระบุ version',
                        },
                    ]}
                >
                    <Radio.Group onChange={(e) => {return setRadiovalue(e.target.value),setStdversion(null)} }>
                        <Radio style={radioStyle} value={1}>
                            STD
                              {
                                radiovalue === 1
                                    ? <Input onChange={(e) => setStdversion(e.target.value)} style={{ width: 300, marginLeft: 10 }} />
                                    : null
                            }
                        </Radio>
                        <Radio style={radioStyle} value={2}>ไม่ใช่ STD</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    name="checkeffect"
                    valuePropName="checked"
                    rules={[
                        {
                            required: true,
                            message: 'กรุณาประเมินผลกระทบ',
                        },
                    ]}
                >
                    <Radio.Group onChange={(e) => { return setRadiovalue2(e.target.value), form.setFieldsValue({description: null})}}>
                        <Radio value={1}>
                            มีผลกระทบ
                        </Radio>
                        <Radio value={2}>ไม่มีผลกระทบ</Radio>
                    </Radio.Group>
                </Form.Item>
                {
                    radiovalue2 === 1
                        ?
                        <Form.Item
                            name="description"
                            label="ประเมินผลกระทบ"
                            rules={[
                                {
                                    required: false,
                                    message: 'Please Select Assign',
                                },
                            ]}
                        >
                            <TextArea rows={5} style={{ width: "100%" }} />
                        </Form.Item>
                        : null
                }


                <Form.Item
                    // style={{ minWidth: 300, maxWidth: 300 }}
                    name="remark"
                    label="Remark :"

                >
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
                </Form.Item>
            </Form>

        </Modal>
    )
}
