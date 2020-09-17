import { Comment, Avatar, Form, Button, List, Row, Col, Tooltip, Divider, Modal } from 'antd';
import moment from 'moment';
import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { Tabs } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import Uploadfile from "../../../Component/UploadFile"
import Axios from 'axios';
import { FileOutlined } from '@ant-design/icons';


const { TabPane } = Tabs;

export default function CommentBox() {
    const editorRef = useRef(null)
    const [commentdata, setCommentdata] = useState([]);
    const [commenttext, setCommenttext] = useState("");
    const [loading, setLoading] = useState(true);
    const uploadRef = useRef(null);
    const history = useHistory();
    const match = useRouteMatch();

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
                setCommentdata(commment_list.data.map((values) => {
                    return {
                        author: values.CreateName,
                        datetime: new Date(values.CreateDate).toLocaleDateString() + " : " + new Date(values.CreateDate).toLocaleTimeString(),
                        content: values.Text,
                        fileId: values.FileId,
                        filename: values.FileName
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

            const createcomment = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/create_comment",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketId: match.params.id,
                    comment_text: commenttext,
                    comment_type: "internal",
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
                });


            }
        } catch (error) {
            alert("บันทึกไม่สำเร็จ")
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

    console.log(editorRef.current)
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
                                <Divider style={{ margin:0, marginBottom:10}}/>
                                {item.filename === null ? "" :
                                    <div>
                                        <Row>
                                            <Col span={24}>
                                                <label
                                                    onClick={() => window.open(process.env.REACT_APP_FILE_DOWNLOAD_URL + '/' + item.fileId, "_blank")}
                                                    className="text-link-hover">
                                                    <FileOutlined /> {item.filename}
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
                            // product: "REM",
                            // module: "CRM",
                            // issue_type: "Bug",
                        }}
                        layout="vertical"
                        onFinish={onFinish}
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
                                    <Button htmlType="submit" type="primary">
                                        Add Comment
                                    </Button>
                                </Col>

                            </Row>
                        </Form.Item>
                    </Form>
                </TabPane>


            </Tabs>
        </>
    );
}

