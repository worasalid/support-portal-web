import { Comment, Avatar, Form, Button, List, Row, Col, Select, Divider, Modal, Checkbox } from 'antd';
import moment from 'moment';
import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { Tabs } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import Uploadfile from "../../../Component/UploadFile"
import Axios from 'axios';
import { DownloadOutlined } from '@ant-design/icons';
import ModalFileDownload from '../../Dialog/Internal/modalFileDownload';


const { TabPane } = Tabs;
const { Option } = Select;

export default function CommentBox({ loadingComment = false }) {
    const editorRef = useRef(null)
    const [loading, setLoading] = useState(false);
    const uploadRef = useRef(null);
    const history = useHistory();
    const match = useRouteMatch();
    const [form] = Form.useForm();

    // data

    const [commentdata, setCommentdata] = useState([]);
    const [commenttext, setCommenttext] = useState("");
    const [commentid, setCommentid] = useState(null);
    const [listmailbox, setListmailbox] = useState([]);
    const [listmailto, setListmailto] = useState([]);
    const mailto = []

    // Modal
    const [modalfiledownload_visible, setModalfiledownload_visible] = useState(false);
    const [modalemail_visible, setModalemail_visible] = useState(false);

    const [disabled, setDisabled] = useState(false)

    const loadInternalComment = async () => {
        try {
            const commment_list = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/loadcomment",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    taskId: match.params.task,
                    type: "internal"
                }
            });
            if (commment_list.status === 200) {
                setCommentdata(commment_list.data.map((values) => {
                    return {
                        id: values.Id,
                        author: values.CreateName,
                        datetime: moment(values.CreateDate).format("DD/MM/YYYY H:mm"),
                        content: values.Text,
                        cntfile: values.cntFile,
                        avatar: values.ProfileImage,
                        email: values.Email
                    }
                })
                );
            }
        } catch (error) {

        }
    }

    const LoadUserInmailbox = async () => {
        try {
            const mailbox = await Axios({
                url: process.env.REACT_APP_API_URL + "/workflow/user-mailbox",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    ticketId: match.params.id,
                }
            });
            setListmailbox(mailbox.data);
        } catch (error) {

        }
    }

    const onFinish = async (values) => {
        console.log("onFinish", values)
        console.log("commenttext", commenttext)
        try {

            if (commenttext === "") {
                throw ("กรุณาระบุ Comment!")
            }

            const createcomment = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/create_comment",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketid: match.params.id,
                    taskid: match.params.task,
                    comment_text: commenttext,
                    comment_type: "internal",
                    files: uploadRef.current.getFiles().map((n) => n.response.id),
                    userid: values.sendto
                }
            });

            if (createcomment.status === 200) {
                Modal.info({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>บันทึกข้อมูลสำเร็จ</p>
                        </div>
                    ),
                    onOk() {
                        editorRef.current.editor.setContent("")
                        setModalemail_visible(false)
                        setLoading(true);
                        form.resetFields();

                    },
                });


            }

        } catch (error) {
            console.log(error.response);
            Modal.info({
                title: 'บันทึกข้อมูลไม่สำเร็จ',

                okText: "Close",
                // okCancel:true,
                content: (
                    <div>
                        <p>{error.response?.data ? error.response?.data : error.message || error}</p>
                    </div>
                ),
                onOk() {
                    setModalemail_visible(false)
                    editorRef.current.editor.setContent("")
                    form.resetFields();
                },
                onCancel() {

                }
            });
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
            loadInternalComment()
        }, 1000)
    }, [])

    useEffect(() => {
        setTimeout(() => {
            loadInternalComment()
            setLoading(false)
        }, 1000)

    }, [loading])


    return (
        <>
            <List
                loading={loading}
                itemLayout="horizontal"
                dataSource={commentdata}
                renderItem={item => (
                    <Comment
                        author={
                            <p><b>{item.author}</b></p>
                        }
                        datetime={
                            <p>{item.datetime}</p>
                        }
                        avatar={
                            <Avatar
                                src={item.avatar}
                                icon={item.email.substring(0, 1).toLocaleUpperCase()}
                            />
                        }
                        content={
                            <>
                                <label className="value-text" dangerouslySetInnerHTML={{ __html: item.content }} ></label>
                                <Divider style={{ margin: 0, marginBottom: 10 }} />
                                {item.cntfile === 0 ? "" :
                                    <div>
                                        <Row>
                                            <Col span={24}>
                                                <label
                                                    onClick={() => { return (setCommentid(item.id), setModalfiledownload_visible(true)) }}
                                                    className="text-link value-text">
                                                    <DownloadOutlined style={{ fontSize: 20 }} /> DownloadFile
                                                </label>
                                            </Col>
                                        </Row>
                                    </div>
                                }
                            </>

                        }
                        actions={[
                            // (item.filename === null ? "" : (
                            //     <>
                            //         <div>
                            //             <Row>
                            //                 <Col span={24}>
                            //                     <label
                            //                         onClick={() => window.open(process.env.REACT_APP_FILE_DOWNLOAD_URL + '/' + item.fileId, "_blank")}
                            //                         className="text-link-hover">
                            //                         <FileOutlined /> {item.filename}
                            //                     </label>
                            //                 </Col>

                            //             </Row>

                            //         </div>
                            //     </>
                            // )
                            // )
                        ]
                        }
                    >

                    </Comment>
                )}
            />

            <Tabs defaultActiveKey="1">
                <TabPane tab="Internal Note" key="1">
                    <Form
                        name="Internal"
                        initialValues={{
                        }}
                        layout="vertical"
                    // onFinish={onFinish}
                    >
                        <Form.Item name="Internal_comment">

                            {/* <TextArea rows={4} onChange={onChange} value={value} style={{ marginRight: 50 }} /> */}
                            <Editor
                                ref={editorRef}

                                apiKey="e1qa6oigw8ldczyrv82f0q5t0lhopb5ndd6owc10cnl7eau5"
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

                                onEditorChange={(content, editor) => { return (console.log("onEditorChange", editor), setCommenttext(content)) }}
                            />
                        </Form.Item>
                        <Form.Item name="Internal_fileattach">
                            <Row>
                                <Col span={2} style={{ display: "inline" }} >
                                    Attach :
                            </Col>
                                <Col span={4} style={{ display: "inline" }} >
                                    <Uploadfile ref={uploadRef} />
                                </Col>
                                <Col span={18} style={{ textAlign: "right" }}>
                                    {/* <Button htmlType="submit" type="primary">
                                        Add Comment
                                    </Button> */}
                                    <Button type="primary"
                                        onClick={() => {
                                            return (
                                                setModalemail_visible(true),
                                                LoadUserInmailbox()
                                            )
                                        }
                                        }>
                                        Add Comment
                                    </Button>
                                </Col>

                            </Row>
                        </Form.Item>
                    </Form>
                </TabPane>
            </Tabs>

            {/* Modal */}
            <ModalFileDownload
                title="File Download"
                visible={modalfiledownload_visible}
                onCancel={() => { return (setModalfiledownload_visible(false)) }}
                width={600}
                onOk={() => {
                    setModalfiledownload_visible(false);

                }}
                details={{
                    refId: commentid,
                    reftype: "Log_Ticket_Comment",
                    grouptype: "comment"
                }}
            />

            <Modal
                title="Internal Note"
                visible={modalemail_visible}
                onCancel={() => {
                    return (
                        setModalemail_visible(false),
                        setDisabled(false),
                        form.resetFields()
                    )
                }
                }
                width={600}
                okText="Send"
                okButtonProps={{ type: "primary", htmlType: "submit" }}
                onOk={() => { return (form.submit()) }}

            >
                <Form
                    form={form}
                    name="email_send"
                    initialValues={{

                    }}
                    layout="horizontal"
                    onFinish={onFinish}
                >
                    <Form.Item name="email_All" label="ส่งทุกคน" valuePropName="checked">
                        <Checkbox onChange={(e) => {
                            return (
                                setDisabled(e.target.checked)
                            )


                        }} />
                    </Form.Item>
                    <Form.Item name="sendto" label="To" >
                        <Select style={{ width: '100%' }} placeholder="None"
                            // showSearch
                            mode="multiple"
                            disabled={disabled}
                            allowClear
                            filterOption={(input, option) =>
                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }

                            // onChange={(value, item) => setListmailbox(item.value)}
                            options={
                                listmailbox && listmailbox.map((item) => ({
                                    value: item.UserId,
                                    label: item.UserName + " (" + item.Email + ")"
                                }))
                            }
                        >
                        </Select>
                    </Form.Item>
                </Form>

            </Modal>
        </>
    );
}

