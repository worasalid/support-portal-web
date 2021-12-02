import { Comment, Avatar, Form, Button, List, Row, Col, Divider, Modal } from 'antd';
import moment from 'moment';
import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { Tabs } from 'antd';
import Uploadfile from "../../../Component/UploadFile"
import Axios from 'axios';
import { DownloadOutlined, UserOutlined } from '@ant-design/icons';
import ModalFileDownload from '../../Dialog/Customer/modalFileDownload';
import TextEditor from '../../TextEditor';
import _ from 'lodash'
import PreviewImg from '../../Dialog/Internal/modalPreviewImg';
import { Icon } from '@iconify/react';


const { TabPane } = Tabs;

export default function CommentBox() {
    const editorRef = useRef(null)

    const [loading, setLoading] = useState(true);
    const uploadRef = useRef(null);
    // const history = useHistory();
    const match = useRouteMatch();

    //data
    const [commentdata, setCommentdata] = useState([]);
    const [commentid, setCommentid] = useState(null);
    const [divcollapse, setDivcollapse] = useState([])
    const [imgUrl, setImgUrl] = useState(null);

    // Modal
    const [modalfiledownload_visible, setModalfiledownload_visible] = useState(false);
    const [modalPreview, setModalPreview] = useState(false);

    const loadComment = async () => {
        setLoading(true);
        try {
            const commment_list = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/loadcomment",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    ticketId: match.params.id,
                    type: "customer"

                }
            });
            if (commment_list.status === 200) {
                setCommentdata(commment_list.data.map((values) => {
                    return {
                        key: values.Id,
                        id: values.Id,
                        author: values.CreateName,
                        datetime: moment(values.CreateDate).format("DD/MM/YYYY HH:mm"),
                        content: values.Text,
                        cntfile: values.cntFile,
                        avatar: values.ProfileImage,
                        email: values.Email
                    }
                })
                );
                setLoading(false);

            }
        } catch (error) {
            setLoading(false);
        }
    }
    const onFinish = async (values) => {
        setLoading(true);
        try {

            if (editorRef.current.getValue() === "" || editorRef.current.getValue() === null || editorRef.current.getValue() === undefined) {
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
                    comment_text: editorRef.current.getValue(),
                    comment_type: "customer",
                    files: uploadRef.current.getFiles().map((n) => n.response),
                    files_id: editorRef.current.getFiles()
                }
            });

            if (createcomment.status === 200) {
                Modal.success({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            {/* <p>บันทึกข้อมูลสำเร็จ</p> */}
                        </div>
                    ),
                    okText: "Close",
                    onOk() {
                        editorRef.current.setvalue();
                        console.log(uploadRef);
                        loadComment();

                    },
                });


            }
        } catch (error) {
            setLoading(false);
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
                    editorRef.current.setvalue()
                },
                onCancel() {

                }
            });
        }
    }

    useEffect(() => {
        // setLoading(false);
        if (commentdata.length === 0) {
            loadComment()
        }

    }, [commentdata.length])

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
                                                <Icon icon="teenyicons:attach-outline" style={{ cursor: "pointer", marginLeft: 10, color: "#1890ff" }}
                                                    onClick={() => {
                                                        setCommentid(item.id);
                                                        setModalfiledownload_visible(true);
                                                    }}
                                                />
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
                                    src={item.avatar === null ? <UserOutlined /> : item.avatar}
                                    icon={item.email === null ? <UserOutlined /> : item.email.substring(0, 1).toLocaleUpperCase()}
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
                                                        onClick={() => { return (setCommentid(item.id), setModalfiledownload_visible(true)) }}
                                                        className="text-link value-text">
                                                        <DownloadOutlined style={{ fontSize: 20 }} /> DownloadFile
                                                    </label>
                                                </Col>
                                            </Row>
                                        </div>
                                } */}
                            </>
                        }

                    >

                    </Comment>
                )}
            />

            <Tabs defaultActiveKey="1">
                <TabPane tab="Reply To ICON" key="1">
                    <Form
                        name="issue"
                        initialValues={{
                            // product: "REM",
                            // module: "CRM",
                            // issue_type: "Bug",
                        }}
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <Form.Item name="comment">
                            <TextEditor ref={editorRef} ticket_id={match.params.id} />
                        </Form.Item>
                        <Form.Item name="fileattach">
                            <Row>
                                <Col span={2} style={{ display: "inline" }} >
                                    Attach :
                                </Col>
                                <Col span={4} style={{ display: "inline" }} >
                                    <Uploadfile ref={uploadRef} />
                                </Col>
                                <Col span={18} style={{ textAlign: "right" }}>
                                    <Button htmlType="submit" type="primary" loading={loading}>
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

