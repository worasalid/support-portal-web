import { Comment, Avatar, Form, Button, List, Row, Col, Select, Divider, Modal, Checkbox, Spin, message } from 'antd';
import moment from 'moment';
import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { Tabs } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import Uploadfile from "../../../Component/UploadFile"
import Axios from 'axios';
import { DownloadOutlined } from '@ant-design/icons';
import ModalFileDownload from '../../Dialog/Internal/modalFileDownload';
import TextEditor from '../../TextEditor';
import PreviewImg from '../../Dialog/Internal/modalPreviewImg';
import _ from 'lodash'


const { TabPane } = Tabs;
const { Option } = Select;

export default function TaskComment({ loadingComment = false }) {
    const editorRef = useRef(null)
    const [loading, setLoading] = useState(true);
    const uploadRef = useRef(null);
    const match = useRouteMatch();
    const [form] = Form.useForm();

    // data

    const [commentdata, setCommentdata] = useState([]);
    const [commentid, setCommentid] = useState(null);
    const [listmailbox, setListmailbox] = useState([]);
    const [imgUrl, setImgUrl] = useState(null);

    // Modal
    const [modalfiledownload_visible, setModalfiledownload_visible] = useState(false);
    const [modalemail_visible, setModalemail_visible] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [divcollapse, setDivcollapse] = useState([]);
    const [modalPreview, setModalPreview] = useState(false);

    const [disabled, setDisabled] = useState(false);
    const [buttonLoading, setbuttonLoading] = useState(false);


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
                    type: "task"
                }
            });
            if (commment_list.status === 200) {
                setLoading(false);
                setCommentdata(commment_list.data.map((values) => {
                    return {
                        key: values.Id,
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
                    taskId: match.params.task
                }
            });
            setListmailbox(mailbox.data);
        } catch (error) {

        }
    }

    const saveComment = async (values) => {
        setModalLoading(true);
        setbuttonLoading(true);
        try {
            if (editorRef.current.getValue() === "" || editorRef.current.getValue() === null) {
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
                    comment_text: editorRef.current.getValue(),
                    comment_type: "task",
                    files: uploadRef.current.getFiles().map((n) => n.response.id),
                    userid: values.send_to === undefined ? values.send_all : values.send_to
                }
            });

            if (createcomment.status === 200) {
                message.success({
                    content: 'บันทึกข้อมูลสำเร็จ',
                    style: {
                        marginTop: '10vh',
                    },
                });
                editorRef.current.setvalue()
                setModalemail_visible(false)
                setLoading(true);
                form.resetFields();
                setbuttonLoading(false);
                setModalLoading(false);
                loadInternalComment();

            }

        } catch (error) {
            setModalemail_visible(false);
            Modal.error({
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                okText: "Close",
                // okCancel:true,
                content: (
                    <div>
                        <p>{error.response?.data ? error.response?.data : error.message || error}</p>
                    </div>
                ),
                onOk() {
                    form.resetFields();
                    setbuttonLoading(false);
                    setModalLoading(false);
                },
            });
        }
    }

    const onFinish = async (values) => {
        saveComment(values)
    }

    useEffect(() => {
        loadInternalComment()
    }, [])

    return (
        <>
            <List
                loading={loading}
                itemLayout="horizontal"
                dataSource={commentdata}
                renderItem={item => (
                    <Comment
                        author={
                            <p
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    let newKeys = [...divcollapse];
                                    if (newKeys.includes(item.key)) {
                                        newKeys = _.filter(newKeys, n => n !== item.key)
                                    } else {
                                        newKeys.push(item.key)
                                    }
                                    setDivcollapse(newKeys)
                                }}
                            ><b>{item.author}</b></p>
                        }
                        datetime={
                            <>
                                <label
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        let newKeys = [...divcollapse];
                                        if (newKeys.includes(item.key)) {
                                            newKeys = _.filter(newKeys, n => n !== item.key)
                                        } else {
                                            newKeys.push(item.key)
                                        }
                                        setDivcollapse(newKeys)
                                    }}
                                >
                                    {item.datetime}
                                </label>

                                {
                                    divcollapse.includes(item.key) &&
                                    (
                                        <label
                                            // style={{ cursor: "pointer",fontSize:20,color:"#C7C7C7" }}
                                            onClick={() => {
                                                let newKeys = [...divcollapse];
                                                if (newKeys.includes(item.key)) {
                                                    newKeys = _.filter(newKeys, n => n !== item.key)
                                                } else {
                                                    newKeys.push(item.key)
                                                }
                                                setDivcollapse(newKeys)
                                            }}
                                        >
                                            {/* <EllipsisOutlined style={{ fontSize: 20,color:"#C7C7C7" }} /> */}

                                        </label>
                                    )
                                }

                            </>
                        }
                        avatar={
                            <>
                                &nbsp;&nbsp;
                                <Avatar
                                    onClick={() => {
                                        let newKeys = [...divcollapse];
                                        if (newKeys.includes(item.key)) {
                                            newKeys = _.filter(newKeys, n => n !== item.key)
                                        } else {
                                            newKeys.push(item.key)
                                        }
                                        setDivcollapse(newKeys)
                                    }}
                                    src={item.avatar}
                                    icon={item.email.substring(0, 1).toLocaleUpperCase()}
                                />
                            </>
                        }
                        content={
                            <>
                                {

                                    divcollapse.includes(item.key) === false ? (
                                        <div className="comment-description" dangerouslySetInnerHTML={{ __html: item.content }}
                                            style={{ display: divcollapse }}
                                            onClick={e => {
                                                if (e.target.tagName == "IMG") {
                                                    setImgUrl(e.target.src);
                                                    setModalPreview(true);
                                                }
                                            }}>

                                        </div>
                                    )
                                        : ""
                                }

                                <Divider style={{ margin: 0, marginBottom: 10 }} />
                                {
                                    item.cntfile === 0 ? "" :
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

                        ]
                        }
                    >

                    </Comment>
                )}
            />

            <Tabs defaultActiveKey="1">
                <TabPane tab="Task Note" key="1">
                    <Form
                        name="Internal"
                        initialValues={{
                        }}
                        layout="vertical"
                    // onFinish={onFinish}
                    >
                        <Form.Item name="Internal_comment">
                            <TextEditor ref={editorRef} />
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
                                    <Button type="primary"
                                        onClick={() => {
                                            return (

                                                (editorRef?.current?.getValue() === "" || editorRef?.current?.getValue() === null ? alert("กรุณาระบุ Comment!") : setModalemail_visible(true)),
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
                confirmLoading={buttonLoading}
                title="Task Note"
                visible={modalemail_visible}
                onCancel={() => {
                    return (
                        setModalemail_visible(false),
                        form.resetFields()
                    )
                }
                }
                width={600}
                okText="Send"
                okButtonProps={{ type: "primary", htmlType: "submit" }}
                // cancelButtonProps={{ disabled: true }}
                onOk={() => {
                    form.submit();
                    //setbuttonLoading(true);
                    //setModalLoading(true);
                }}

            >
                <Spin spinning={modalLoading}>
                    <Form
                        form={form}
                        name="send_email"
                        initialValues={{

                        }}
                        layout="horizontal"
                        onFinish={onFinish}
                    >
                        <Form.Item name="send_all" label="ส่งทุกคน"
                        // valuePropName="checked"
                        >
                            <Checkbox onChange={(e) => {
                                if (e.target.checked === true) {
                                    form.setFieldsValue({ send_all: listmailbox && listmailbox.map((x) => x.UserId) })
                                    form.setFieldsValue({ send_to: undefined })
                                } else {
                                    form.setFieldsValue({ send_all: undefined })
                                }
                            }}
                            />
                        </Form.Item>
                        <Form.Item name="send_to" label="To" >
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
                </Spin>
            </Modal>

            {/* Modal Preview */}
            <PreviewImg
                title="Preview"
                visible={modalPreview}
                width={800}
                footer={null}
                onCancel={() => {
                    setModalPreview(false);
                    setImgUrl(null);
                }}
                pathUrl={imgUrl}
            />
        </>
    );
}

