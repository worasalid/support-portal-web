import { Comment, Avatar, Form, Button, List, Row, Col, Tooltip, Divider, Modal, Popconfirm } from 'antd';
import moment from 'moment';
import React, { useState, useEffect, useRef, createElement } from 'react';
import { useHistory, useRouteMatch, Redirect, Link } from "react-router-dom";
import { Tabs } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import Uploadfile from "../../../Component/UploadFile"
import Axios from 'axios';
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled, FileOutlined, DownloadOutlined } from '@ant-design/icons';
import ModalFileDownload from '../../Dialog/Internal/modalFileDownload';


const { TabPane } = Tabs;

export default function CommentBox() {
    const editorRef = useRef(null)
    const uploadRef = useRef(null);
    const history = useHistory();
    const match = useRouteMatch();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);

    // data
    const [commentdata, setCommentdata] = useState([]);
    const [commenttext, setCommenttext] = useState("");
    const [commentid, setCommentid] = useState(null);

    // Modal
    const [modalfiledownload_visible, setModalfiledownload_visible] = useState(false);


    const loadCustomerComment = async () => {
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
                        datetime: new Date(values.CreateDate).toLocaleDateString() + " : " + new Date(values.CreateDate).toLocaleTimeString(),
                        content: values.Text,
                        cntfile: values.cntFile
                    }
                })
                );
            }
        } catch (error) {

        }
    }

    const onFinish = async (values) => {
        // console.log("file", uploadRef.current.getFiles().map((n) => n.response.id))
        console.log("commenttext", commenttext)
        try {

            if (commenttext === "") {
                throw ("")
            }
            const createcomment = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/create_comment",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketId: match.params.id,
                    comment_text: commenttext,
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
                        editorRef.current.editor.setContent("")
                        setLoading(true);

                    },
                    onCancel() {

                    }
                });


            }
        } catch (error) {
            Modal.info({
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                
                okText: "Close",
                // okCancel:true,
                content: (
                    <div>
                        <p>กรุณาระบุ Comment!</p>
                    </div>
                ),
                onOk(){

                },
                onCancel() {

                }
            });
        }
    }

    useEffect(() => {
        setTimeout(() => {
            loadCustomerComment()
            setLoading(false)
        }, 1000)
    }, [])

    useEffect(() => {
        setTimeout(() => {
            loadCustomerComment()
            setLoading(false)
        }, 1000)

    }, [loading])

    // console.log(editorRef.current)
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
                                src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                alt="ICON Support"
                            />
                        }
                        content={
                            <>
                                <label dangerouslySetInnerHTML={{ __html: item.content }} ></label>
                                <Divider style={{ margin: 0, marginBottom: 10 }} />
                                {item.cntfile === 0 ? "" :
                                    <div>
                                        <Row>
                                            <Col span={24}>
                                                <label
                                                    // onClick={() => window.open(process.env.REACT_APP_FILE_DOWNLOAD_URL + '/' + item.fileId, "_blank")}
                                                    onClick={() => { return (setCommentid(item.id), setModalfiledownload_visible(true)) }}
                                                    className="text-link">
                                                    <DownloadOutlined style={{ fontSize: 20 }} /> DownloadFile
                                                </label>

                                            </Col>
                                        </Row>
                                    </div>
                                }
                            </>
                        }
                    // actions={[
                    //     (item.filename === null ? "" : (
                    //         <>
                    //             <div>
                    //                 <Row>
                    //                     <Col span={24}>
                    //                         <label
                    //                             onClick={() => window.open(process.env.REACT_APP_FILE_DOWNLOAD_URL + '/' + item.fileId, "_blank")}
                    //                             className="text-link-hover">
                    //                             <FileOutlined /> {item.filename}
                    //                         </label>
                    //                     </Col>

                    //                 </Row>

                    //             </div>
                    //         </>
                    //     )
                    //     )
                    // ]
                    // }
                    >

                    </Comment>
                )}
            />

            <Tabs defaultActiveKey="1">
                <TabPane tab="Reply To Customer" key="1">
                    <Form
                        form={form}
                        name="Customer"
                        initialValues={{
                            // product: "REM",
                            // module: "CRM",
                            // issue_type: "Bug",
                        }}
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <Form.Item name="customer_comment">

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
                        <Form.Item name="customer_fileattach">
                            <Row>
                                <Col span={2} style={{ display: "inline" }} >
                                    Attach :
                            </Col>
                                <Col span={4} style={{ display: "inline" }} >
                                    <Uploadfile ref={uploadRef} />
                                </Col>
                                <Col span={18} style={{ textAlign: "right" }}>
                                    <Popconfirm title="Comment หาลูกค้า ใช่หรือไม่"
                                        okText="Yes" cancelText="No"
                                        onConfirm={form.submit}
                                        style={{ width: "300px" }}
                                    >
                                        <Button htmlType="submit" type="primary">
                                            Add Comment
                                    </Button>
                                    </Popconfirm>

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

