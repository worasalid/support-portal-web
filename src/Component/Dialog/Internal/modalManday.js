import React, { useState, useRef, useEffect } from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { Modal, Form, InputNumber, List, Row, Col } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
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
    const [totalmanday, setTotalmanday] = useState(0)
    const [textValue, setTextValue] = useState("");
    const [listdata, setListdata] = useState([]);


    const formProps = {
        hidden: details.flowoutput.Type === "Issue" ? true : false,
        labelCol: { span: 0 },
        wrapperCol: { span: 24 },
        labelAlign: "right",
        layout: "horizontal"
    }
    const form2Props = {
        hidden: details.flowoutput.Type === "Task" ? true : false,
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
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
                        comment_type: details.flowoutput.Type === "Issue" ? "customer" : "internal",
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
                    taskid: details.taskid,
                    mailboxid: details.mailboxid,
                    flowoutputid: details.flowoutput.FlowOutputId,
                    value: {
                        manday: values.totalmanday,
                        comment_text: textValue
                    }

                }
            });

            if (SendFlowIssue.status === 200) {
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

                },
            });
        }
    }

    const onFinish = (values) => {
        console.log('Success:', values);
        details.flowoutput.Type === "Task" ? SendFlowTask(values) : SendFlowIssue(values)
    };

    useEffect(() => {
        GetTask();
       
    }, [visible])

   

    form.setFieldsValue({ manday: `${listdata[0]?.manday}` })
    manday = manday.reduce(function(a, b){
        return a + b;
    }, 0);

    
    console.log("SumManday",manday); 

    return (
        <Modal
            visible={visible}
            okText="Send"
            onOk={() => { return details.flowoutput.Type === "Task" ? form.submit() : form2.submit() }}
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            okType="dashed"
            onCancel={() => { return (form.resetFields(), form2.resetFields(), onCancel()) }}
            {...props}
        >


            <Form form={form} style={{ padding: 0, maxWidth: "100%", backgroundColor: "white" }} {...formProps}
                name="form-taskmanday"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="manday"
                    label="Manday (Devs)"
                >
                    <InputNumber min={0} max={5} step={0.25} style={{ width: "30%" }} />
                </Form.Item>
            </Form>

            <Form form={form2} style={{ padding: 0, maxWidth: "100%", backgroundColor: "white" }} {...form2Props}
                name="form-issuemanday"

                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >

                <List
                    itemLayout="horizontal"
                    dataSource={listdata}
                    renderItem={item => (
                        <>
                            <Row>
                                <Col span={24}>
                                    <label>{item.title}</label>
                                    <InputNumber defaultValue={item.manday} disabled={true} style={{ width: "20%" }} />
                                    <label>Manday</label>
                                </Col>
                            </Row>

                        </>
                    )} >
                </List>

                <Form.Item
                    name="cr_manday"
                    label="Manday (CR Center)"
                >
                    <InputNumber min={0} max={100} step={0.25} style={{ width: "30%" }}
                        onChange={(value) => setTotalmanday(value + manday)} />
                </Form.Item>
                <InputNumber defaultValue={manday && manday} value={totalmanday} min={0} max={100} step={0.25} style={{ width: "30%" }} />

            </Form>

            <label>Remark :</label> <br />
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
