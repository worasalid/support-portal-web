import { Comment, Avatar, Form, Button, List, Row, Col, Select, Divider, Modal, Checkbox, Spin, message } from 'antd';
import moment from 'moment';
import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { Tabs } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import Uploadfile from "../../../Component/UploadFile"
import Axios from 'axios';
import { DownCircleOutlined, DownloadOutlined, DownOutlined, EllipsisOutlined, RightCircleOutlined, RightOutlined } from '@ant-design/icons';
import ModalFileDownload from '../../Dialog/Internal/modalFileDownload';
import TextEditor from '../../TextEditor';
import PreviewImg from '../../Dialog/Internal/modalPreviewImg';
import _ from 'lodash';
import { Icon } from '@iconify/react';



const { TabPane } = Tabs;
const { Option } = Select;

export default function CommentBox({ loadingComment = false }) {
    const editorRef = useRef(null)
    const [loading, setLoading] = useState(true);
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

    const [imgUrl, setImgUrl] = useState(null);

    const [divcollapse, setDivcollapse] = useState([])

    // Modal
    const [modalfiledownload_visible, setModalfiledownload_visible] = useState(false);
    const [modalemail_visible, setModalemail_visible] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
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
                    ticketId: match.params.id,
                    type: "internal"
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

            if (editorRef.current.getValue() === "" && editorRef.current.getValue() === null && editorRef.current.getValue() === undefined) {
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
                    //taskid: match.params.task,
                    comment_text: editorRef.current.getValue(),
                    comment_type: "internal",
                    files: uploadRef.current.getFiles().map((n) => n.response),
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
                form.resetFields();
                setModalemail_visible(false)
                setLoading(true);
                setbuttonLoading(false);
                setModalLoading(false);
                loadInternalComment();
            }

        } catch (error) {
            setModalemail_visible(false);
            Modal.error({
                title: 'บันทึกข้อมูลไม่สำเร็จ',

                okText: "Close",
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
        if (commentdata.length === 0) {
            loadInternalComment()
        }
    }, [commentdata.length])


    return (
        <>
            <List
                className="korn"
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
                                <Row align="middle">
                                    <Col span={24}>
                                        <label
                                            //style={{ cursor: "pointer" }}
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
                                            item.cntfile === 0 ? "" :
                                                <span onClick={() => {
                                                    setCommentid(item.id);
                                                    setModalfiledownload_visible(true);
                                                }}
                                                >
                                                    <Icon icon="teenyicons:attach-outline"
                                                        style={{ cursor: "pointer", marginLeft: 10, color: "#1890ff" }}
                                                    />
                                                    <label style={{ cursor: "pointer", color: "#1890ff" }}>File Attach</label>
                                                </span>
                                        }
                                        {
                                            divcollapse.includes(item.key) &&
                                            (
                                                <label
                                                    style={{ cursor: "pointer", marginLeft: 10 }}
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
                                                    <Icon icon="fa-solid:ellipsis-h" />
                                                </label>
                                            )
                                        }
                                    </Col>
                                </Row>
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
                                {/* {
                                    item.cntfile === 0 ? "" :
                                        <div>
                                            <Row>
                                                <Col span={24}>
                                                    <label
                                                        onClick={() => { setCommentid(item.id); setModalfiledownload_visible(true) }}
                                                        className="text-link value-text">
                                                        <DownloadOutlined style={{ fontSize: 20 }} /> DownloadFile
                                                    </label>
                                                </Col>
                                            </Row>
                                        </div>
                                } */}
                            </>

                        }
                        actions={
                            [
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
                    </Comment >
                )}
            />

            < Tabs defaultActiveKey="1" >
                <TabPane tab="Internal Note" key="1">
                    <Form
                        name="Internal"
                        initialValues={{
                        }}
                        layout="vertical"
                    // onFinish={onFinish}
                    >
                        <Form.Item name="Internal_comment">
                            <TextEditor ref={editorRef} ticket_id={match.params.id} />
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
                                                (editorRef?.current?.getValue() === "" || editorRef?.current?.getValue() === null ? alert("กรุณาระบุ Comment!") : setModalemail_visible(true)),
                                                LoadUserInmailbox()
                                            )
                                        }
                                        }
                                    >
                                        Add Comments
                                    </Button>
                                </Col>

                            </Row>
                        </Form.Item>
                    </Form>
                </TabPane>
            </Tabs >

            {/* Modal */}
            < ModalFileDownload
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

            < Modal
                title="Issue Note"
                confirmLoading={buttonLoading}
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
                                setDisabled(e.target.checked)
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
            </Modal >

            <PreviewImg
                title="Preview"
                visible={modalPreview}
                width={1200}
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

