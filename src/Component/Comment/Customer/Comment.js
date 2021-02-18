import { Comment, Avatar, Form, Button, List, Row, Col, Divider, Modal } from 'antd';
import moment from 'moment';
import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { Tabs } from 'antd';
import Uploadfile from "../../../Component/UploadFile"
import Axios from 'axios';
import { FileOutlined } from '@ant-design/icons';
import ModalFileDownload from '../../Dialog/Customer/modalFileDownload';
import TextEditor from '../../TextEditor';


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

    // Modal
    const [modalfiledownload_visible, setModalfiledownload_visible] = useState(false);

    const loadComment = async () => {
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
            }
        } catch (error) {

        }
    }

    const onFinish = async (values) => {
        // console.log("file", uploadRef.current.getFiles().map((n) => n.response.id))
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
                    comment_text: editorRef.current.getValue(),
                    comment_type: "customer",
                    files: uploadRef.current.getFiles().map((n) => n.response.id),
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
                        editorRef.current.setvalue();
                        setLoading(true);

                    },
                });
            }
        } catch (error) {
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
                    editorRef.current.setvalue()
                },
                onCancel() {

                }
            });
        }
    }

    useEffect(() => {
        setTimeout(() => {
            loadComment()
            setLoading(false)
        }, 1000)
    }, [])

    useEffect(() => {
        setTimeout(() => {
            loadComment()
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
                                <label className="comment-description " dangerouslySetInnerHTML={{ __html: item.content }} ></label>
                                <Divider style={{ marginTop: 20 }} />
                                {item.cntfile === 0 ? "" :
                                    <div>
                                        <Row>
                                            <Col span={24}>
                                                <label
                                                    onClick={() => { return (setCommentid(item.id), setModalfiledownload_visible(true)) }}
                                                    className="text-link-hover">
                                                    <FileOutlined /> DownloadFile
                                                </label>
                                            </Col>
                                        </Row>
                                    </div>
                                }
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
                            <TextEditor ref={editorRef} />
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
                                    <Button htmlType="submit" type="primary">
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
        </>
    );
}

