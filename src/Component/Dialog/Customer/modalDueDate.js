import React, { useState, useRef, useContext, useEffect } from 'react';
import { DatePicker, Modal, Row, Col } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import moment from 'moment';
import IssueContext from "../../../utility/issueContext";
import { useHistory } from 'react-router-dom';


export default function ModalDueDate({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const uploadRef = useRef(null);
    const editorRef = useRef(null)
    const [textValue, setTextValue] = useState("")
    const { state: customerstate, dispatch: customerdispatch } = useContext(IssueContext);

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

            if (sendflow.status === 200 ) {
                SaveComment();
                onOk();
                
                await Modal.info({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            {/* <p>ส่ง Issue เลขที่ : {customerstate.issuedata.details[0] && customerstate.issuedata.details[0].Number}</p> */}
                            <p>ให้ ICON ดำเนินการแก้ไข</p>
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

        } catch (error) {
            await Modal.info({
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
            visible={visible}
            okText="Send"
            onOk={() => { return ( SendFlow()) }}
            onCancel={() => { return (editorRef.current.editor.setContent(""), onCancel()) }}
            {...props}
        >

            <Row>
                <Col span={24}>
                    <DatePicker format="DD/MM/YYYY"
                        defaultValue={moment(details.duedate, "DD/MM/YYYY")} disabled />
                </Col>
            </Row>

            <Row style={{marginTop: 40}}>
                Remark :  <br />
                <Col span={24}>
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
                </Col>
            </Row>




        </Modal>
    );
}
