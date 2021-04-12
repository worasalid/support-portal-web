import React, { useState, useRef, useContext, useEffect } from 'react';
import { Modal, Row, Col, Spin } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import IssueContext, { customerReducer, customerState } from "../../../utility/issueContext";
import { useHistory } from 'react-router-dom';


export default function ModalConfirmManday({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const uploadRef = useRef(null);
    const editorRef = useRef(null)
    const [textValue, setTextValue] = useState("")
    const { state: customerstate, dispatch: customerdispatch } = useContext(IssueContext);
    const [loading, setLoading] = useState(false);

    const handleEditorChange = (content, editor) => {
        setTextValue(content);
    }

    const SaveComment = async () => {
        try {
            if (textValue !== "") {
                await Axios({
                    url: process.env.REACT_APP_API_URL + "/tickets/create_comment",
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                    },
                    data: {
                        ticketid: details && details.ticketid,
                        comment_text: textValue,
                        comment_type: "customer",
                        files: uploadRef.current.getFiles().map((n) => n.response.id),
                    }
                });


            }
        } catch (error) {

        }
    }

    const SendFlow = async () => {
        setLoading(true);
        try {
            const sendflow = await Axios({
                url: process.env.REACT_APP_API_URL + "/workflow/customer-send",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketid: details.ticketid,
                    mailboxid: details.mailboxid,
                    flowoutputid: details.flowoutputid

                }
            });

            if (sendflow.status === 200 && sendflow.data === "InProgress") {
                SaveComment();
                onOk();
                setLoading(false);
                await Modal.success({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>Confirm Manday</p>
                        </div>
                    ),
                    onOk() {
                        editorRef.current.editor.setContent("")

                        if (sendflow.data === "InProgress") {
                            history.push({ pathname: "/customer/issue/inprogress" })
                        }

                    },
                });
            }

            if (sendflow.status === 200 && sendflow.data === "Pass") {
                setLoading(false);
                await Modal.success({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>ทดสอบ Issue เลขที่ : {customerstate.issuedata.details[0] && customerstate.issuedata.details[0].Number} ผ่าน</p>
                            <p>รอดำเนินการ Upload File </p>
                        </div>
                    ),
                    onOk() {
                        editorRef.current.editor.setContent("")
                        onOk();
                        history.push({ pathname: "/customer/issue/pass" })

                    },
                });
            }

        } catch (error) {
            setLoading(false);
            await Modal.error({
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.message}</p>
                        <p>{error.response.data}</p>
                    </div>
                ),
                onOk() {
                    editorRef.current.editor.setContent("")

                },
            });

        }
    }

    useEffect(() => {

    }, [])


    return (
        <Modal
            confirmLoading={loading}
            visible={visible}
            okText="Send"
            onOk={() => SendFlow() }
            onCancel={() => { return (editorRef.current.editor.setContent(""), onCancel()) }}
            {...props}
        >
            <Spin spinning={loading}>
                <Row style={{ marginBottom: 20 }}>
                    <Col span={6} style={{ textAlign: "right" }}>
                        <label>Manday ที่ใช้ในการแก้ไข</label>
                    </Col>
                    <Col span={4} style={{ textAlign: "right" }}>
                        <label>{details.manday}</label>
                    </Col>
                    <Col span={12} style={{ marginLeft: 20 }}>
                        <label>Manday</label>
                    </Col>
                </Row>
                <Row style={{ marginBottom: 40 }}>
                    <Col span={6} style={{ textAlign: "right" }}>
                        <label>ค่าใช้จ่าย</label>
                    </Col>
                    <Col span={4} style={{ textAlign: "right" }}>
                        <label>{details.cost}</label>
                    </Col>
                    <Col span={12} style={{ marginLeft: 20 }}>
                        <label>บาท</label>
                    </Col>
                </Row>


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
            </Spin>
        </Modal>
    );
}
