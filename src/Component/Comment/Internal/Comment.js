import { Comment, Avatar, Form, Button, List, Row, Col, Divider, Modal, Popconfirm } from 'antd';
import moment from 'moment';
import React, { useState, useEffect, useRef } from 'react';
import { useHistory, useRouteMatch } from "react-router-dom";
import { Tabs } from 'antd';
import Uploadfile from "../../../Component/UploadFile"
import Axios from 'axios';
import { DownloadOutlined, UserOutlined } from '@ant-design/icons';
import ModalFileDownload from '../../Dialog/Internal/modalFileDownload';
import TextEditor from '../../TextEditor';
import PreviewImg from '../../Dialog/Internal/modalPreviewImg';
import _ from 'lodash'
import { Icon } from '@iconify/react';


const { TabPane } = Tabs;

export default function CommentBox() {
    const editorRef = useRef(null)
    const uploadRef = useRef(null);
    const history = useHistory();
    const match = useRouteMatch();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [elementDisable, setElementDisable] = useState(false);

    const container = useState(null);

    // data
    const [commentdata, setCommentdata] = useState([]);
    const [commenttext, setCommenttext] = useState("");
    const [commentid, setCommentid] = useState(null);
    const [divcollapse, setDivcollapse] = useState([])
    const [imgUrl, setImgUrl] = useState(null);

    // Modal
    const [modalfiledownload_visible, setModalfiledownload_visible] = useState(false);
    const [modalPreview, setModalPreview] = useState(false);

    const image_upload_handler = (blobInfo, success, failure, progress) => {
        var xhr, formData;

        xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open("POST", process.env.REACT_APP_API_URL + "/files");

        xhr.upload.onprogress = function (e) {
            progress((e.loaded / e.total) * 100);
        };

        xhr.onload = function () {
            var json;

            if (xhr.status === 403) {
                failure("HTTP Error: " + xhr.status, { remove: true });
                return;
            }

            if (xhr.status < 200 || xhr.status >= 300) {
                failure("HTTP Error: " + xhr.status);
                return;
            }

            json = JSON.parse(xhr.responseText);

            if (!json || typeof json.url != "string") {
                failure("Invalid JSON: " + xhr.responseText);
                return;
            }

            success(json.url);
        };

        xhr.onerror = function () {
            failure(
                "Image upload failed due to a XHR Transport error. Code: " + xhr.status
            );
        };

        formData = new FormData();
        formData.append("file", blobInfo.blob(), blobInfo.filename());

        xhr.send(formData);
    };

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

    const onFinish = async (values) => {
        try {

            if (editorRef.current.getValue() === "" || editorRef.current.getValue() === null) {
                throw ("กรุณาระบุ Comment!")
            }
            setLoading(true);
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
                }
            });

            if (createcomment.status === 200) {
                loadCustomerComment();
                Modal.success({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    // content: (
                    //     <div>
                    //         <p>บันทึกข้อมูลสำเร็จ</p>
                    //     </div>
                    // ),
                    onOk() {
                        editorRef.current.setvalue();
                        setElementDisable(false);

                    },
                    okText: "Close",

                });


            }
        } catch (error) {
            Modal.warning({
                title: 'บันทึกข้อมูลไม่สำเร็จ',

                okText: "Close",
                // okCancel:true,
                content: (
                    <div>
                        <p>กรุณาระบุ Comment!</p>
                    </div>
                ),
                onOk() {
                    editorRef.current.setvalue();
                    form.resetFields();
                    setElementDisable(false);
                    setLoading(false);
                },
                onCancel() {
                    setElementDisable(false);
                    setLoading(false);
                }
            });
        }
    }

    useEffect(() => {
        loadCustomerComment()
    }, [])

    return (
        <div>
            <List
                loading={loading}
                itemLayout="horizontal"
                dataSource={commentdata}
                renderItem={item => (
                    <Comment
                        author={
                            <Row align="middle">
                                <Col span={24}>
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
                                    ><b>{item.author}</b></label>
                                </Col>
                            </Row>
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

            {/* {
                container && <Affix target={() => container}>
                    
                </Affix>
            } */}

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

                            <TextEditor ref={editorRef} ticket_id={match.params.id} />
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
                                        onConfirm={() => {
                                            form.submit();
                                            setElementDisable(true);
                                        }}
                                        style={{ width: "300px" }}
                                        disabled={elementDisable}
                                    >
                                        <Button htmlType="submit" type="primary" disabled={elementDisable}>
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

        </div>
    );
}

