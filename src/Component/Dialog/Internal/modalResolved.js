import React, { useState, useRef, useEffect } from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { Button, Modal, Form, Table, Tabs, Row, Col } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import UploadFile from '../../UploadFile'
import Axios from 'axios';
import { DownloadOutlined } from '@ant-design/icons';
import Column from 'antd/lib/table/Column';

const { TabPane } = Tabs;

export default function ModalResolved({ visible = false, onOk, onCancel, datarow, details, ...props }) {
    const history = useHistory();
    const uploadRef = useRef(null);
    const [form] = Form.useForm();
    const [textValue, setTextValue] = useState("");
    const editorRef = useRef(null)

    const [listunittest, setListunittest] = useState([]);
    const [listfiledeploy, setFiledeploy] = useState([]);
    const [listdocument, setDocument] = useState([]);

    const GetUnitTest = async () => {
        try {
            const unittest = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/filedownload",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    refId: details.ticketId,
                    reftype: "Master_Ticket",
                    grouptype: "unittest"
                }
            });

            setListunittest(unittest.data)
        } catch (error) {

        }
    }

    const GetFileDeploy = async () => {
        try {
            const filedeploy = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/filedownload",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    refId: details.ticketId,
                    reftype: "Master_Ticket",
                    grouptype: "filedeploy"
                }
            });

            setFiledeploy(filedeploy.data)
        } catch (error) {

        }
    }

    const GetDeployDocument = async () => {
        try {
            const documentdeploy = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/filedownload",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    refId: details.ticketId,
                    reftype: "Master_Ticket",
                    grouptype: "deploydocument"
                }
            });

            setDocument(documentdeploy.data)
        } catch (error) {

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

    const SendFlow = async () => {
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
                    flowstatus: details.flowstatus
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
                        editorRef.current.editor.setContent("")
                        onOk();
                        history.push({ pathname: "/internal/issue/resolved" })
                    },
                });
            }
        } catch (error) {

        }
    }

    const onFinish = () => {
        SaveComment();
        SendFlow();
        onOk();
    };

    useEffect(() => {
        if (visible) {
            GetUnitTest();
            GetFileDeploy();
            GetDeployDocument();
        }

    }, [visible])

    return (
        <Modal
            visible={visible}
            onOk={() => { return (onFinish()) }}
            okButtonProps={{ type: "primary", htmlType: "submit" }}
            okText="Send"
            okType="dashed"
            onCancel={() => { return (form.resetFields(), onCancel()) }}
            {...props}
        >


            <Tabs defaultActiveKey="1" type="card">
                <TabPane tab="Unit Test" key="1">
                    <Table dataSource={listunittest}>
                        <Column title="No"
                            render={(value, record, index) => {
                                return (
                                    <>
                                        <label>{index + 1}</label>

                                    </>
                                )
                            }
                            }
                        />
                        <Column title="ไฟล์ Unit Test" dataIndex="FileName" ></Column>
                        <Column title="OwnerName" dataIndex="OwnerName" ></Column>
                        <Column title="วันที่"
                            align="center"
                            render={(value, record, index) => {
                                return (
                                    <>
                                        <label>
                                            {new Date(record.ModifyDate).toLocaleDateString('en-GB')}
                                        </label>
                                    </>
                                )
                            }
                            }
                        />
                        <Column title=""
                            render={(value, record, index) => {
                                return (
                                    <>
                                        <Button type="link"
                                            onClick={() => window.open(process.env.REACT_APP_FILE_DOWNLOAD_URL + '/' + record.FileId, "_blank")}
                                        >
                                            {record.FileId === null ? "" : <DownloadOutlined style={{ fontSize: 20, color: "#007bff" }} />}

                                        </Button>

                                    </>
                                )
                            }
                            }
                        />
                    </Table>
                </TabPane>
                <TabPane tab="File Deploy" key="2">
                    <Table dataSource={listfiledeploy}>
                        <Column title="No"
                            render={(value, record, index) => {
                                return (
                                    <>
                                        <label>{index + 1}</label>

                                    </>
                                )
                            }
                            }
                        />
                        <Column title="ไฟล์ Deploy" dataIndex="FileName" ></Column>
                        <Column title="OwnerName" dataIndex="OwnerName" ></Column>
                        <Column title="วันที่"
                            align="center"
                            render={(value, record, index) => {
                                return (
                                    <>
                                        <label>
                                            {new Date(record.ModifyDate).toLocaleDateString('en-GB')}
                                        </label>
                                    </>
                                )
                            }
                            }
                        />
                        <Column title=""
                            render={(value, record, index) => {
                                return (
                                    <>
                                        <Button type="link"
                                            onClick={() => window.open(process.env.REACT_APP_FILE_DOWNLOAD_URL + '/' + record.FileId, "_blank")}
                                        >
                                            {record.FileId === null ? "" : <DownloadOutlined style={{ fontSize: 20, color: "#007bff" }} />}

                                        </Button>

                                    </>
                                )
                            }
                            }
                        />
                    </Table>
                </TabPane>
                <TabPane tab="Document Deploy" key="3">
                    <Table dataSource={listdocument}>
                        <Column title="No"
                            render={(value, record, index) => {
                                return (
                                    <>
                                        <label>{index + 1}</label>

                                    </>
                                )
                            }
                            }
                        />
                        <Column title="ชื่อเอกสาร" dataIndex="FileName" ></Column>
                        <Column title="OwnerName" dataIndex="OwnerName" ></Column>
                        <Column title="วันที่"
                            align="center"
                            render={(value, record, index) => {
                                return (
                                    <>
                                        <label>
                                            {new Date(record.ModifyDate).toLocaleDateString('en-GB')}
                                        </label>
                                    </>
                                )
                            }
                            }
                        />
                        <Column title=""
                            render={(value, record, index) => {
                                return (
                                    <>
                                        <Button type="link"
                                            onClick={() => window.open(process.env.REACT_APP_FILE_DOWNLOAD_URL + '/' + record.FileId, "_blank")}
                                        >
                                            {record.FileId === null ? "" : <DownloadOutlined style={{ fontSize: 20, color: "#007bff" }} />}

                                        </Button>

                                    </>
                                )
                            }
                            }
                        />
                    </Table>
                </TabPane>
            </Tabs>
            <label className="header-text">Remark</label>
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
