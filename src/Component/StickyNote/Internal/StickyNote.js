import React, { useEffect, useRef, useState } from 'react'
import TextEditor from '../../TextEditor'
import { Drawer, Button, Card, Row, Col, List, message, Spin } from 'antd'
import { EditOutlined, DeleteOutlined, SettingOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import Axios from 'axios'

const { Meta } = Card;

export default function StickyNote({ visible, onClose, ...props }) {
    const editorRef = useRef(null);
    const [addDrawer, setAddDrawer] = useState(false);
    const [editdrawer, setEditDrawer] = useState(false);
    const [stckyNote, setStickyNote] = useState([]);
    const [stckyNoteDetail, setStickyNoteDetail] = useState([]);

    const [loading, setLoading] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const getStickyNote = async () => {
        setLoading(true);
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/sticky-note",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
            });

            if (result.status === 200) {
                setLoading(false);
                setStickyNote(result.data.map((x) => {
                    return {
                        id: x.id,
                        create_date: x.create_date,
                        description: x.description
                    }
                }))
            }

        } catch (error) {
            setLoading(false);
        }
    }

    const deletetStickyNote = async (param) => {
        setLoading(true);
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/sticky-note",
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    id: param
                }
            });

            if (result.status === 200) {
                setLoading(false);
                message.success({
                    content: 'ลบข้อมูลสำเร็จ',
                    style: {
                        marginTop: '10vh',
                    },
                });
                getStickyNote();
            }

        } catch (error) {
            setLoading(false);
        }
    }

    const getStickyNoteDetail = async (param) => {
        setLoadingDetail(true);
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/sticky-note-detail",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    id: param
                }
            });

            if (result.status === 200) {
                setLoadingDetail(false);
                setStickyNoteDetail(result.data);
            }
        } catch (error) {
            setLoadingDetail(false);
        }
    }

    const editStickyNoteDetail = async (param) => {
        setLoadingDetail(true);
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/sticky-note",
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    id: param,
                    description: editorRef?.current?.getValue()
                }
            });

            if (result.status === 200) {
                setLoadingDetail(false);
                setEditDrawer(false);
                message.success({
                    content: 'แก้ไขข้อมูลสำเร็จ',
                    style: {
                        marginTop: '10vh',
                    },
                });
                getStickyNote();
            }

        } catch (error) {

        }
    }

    const addNote = async () => {
        setLoading(true);
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/sticky-note",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    description: editorRef?.current?.getValue()
                }
            });

            if (result.status === 200) {
                setLoading(false);
                setAddDrawer(false);
                editorRef.current.setvalue("");
                getStickyNote();
            }

        } catch (error) {

        }
    }

    useEffect(() => {
        if (visible) {
            getStickyNote();
        }
    }, [visible])

    useEffect(() => {
        if (editdrawer === true) {

        }
    }, [editdrawer])


    return (
        <>
            {/* view */}
            <Drawer
                title="Sticky Note"
                visible={visible}
                placement="right"
                width={1200}
                closable={true}
                onClose={() => onClose()}
               // drawerStyle={{color:"red", backgroundColor:"red"}}
                {...props}
            >

                <Spin spinning={loading}>
                    <List
                      
                        grid={{ gutter: 16, column: 5 }}
                        dataSource={stckyNote}
                        renderItem={item => (
                            <List.Item>
                                <Row>
                                    <Col span={24}>
                                        <div className="sticky-background"
                                            style={{ padding: "24px" }}
                                        >
                                            <Row style={{ marginBottom: 12 }}>
                                                <Col span={16}>
                                                    <label style={{ fontSize: 10 }}>
                                                        {moment(item.create_date).format("DD/MM/YYYY HH:mm")}
                                                    </label>

                                                </Col>
                                                <Col span={4}>
                                                    <EditOutlined key="edit" onClick={() => { setEditDrawer(true); getStickyNoteDetail(item.id) }} />
                                                </Col>
                                                <Col span={4}>
                                                    <DeleteOutlined key="setting" onClick={() => deletetStickyNote(item.id)} />
                                                </Col>
                                            </Row>

                                            <div dangerouslySetInnerHTML={{ __html: item.description }}
                                                style={{
                                                    textOverflow: "ellipsis",
                                                    overflow: "hidden",
                                                    width: 150,
                                                    height: 150
                                                }}

                                            >

                                            </div>
                                        </div>

                                    </Col>
                                </Row>
                            </List.Item>
                        )}
                    />
                </Spin>
                <Button
                    loading={loadingDetail}
                    icon={<PlusOutlined style={{ fontSize: 34 }} />}
                    shape="circle"
                    size="large"
                    type="primary"
                    onClick={() => setAddDrawer(true)}
                    style={{
                        position: "fixed",
                        bottom: 90,
                        display: "flex",
                        flexDirection: "column",
                        right: 32,
                        backgroundColor: "#00CC00"
                    }}
                />
            </Drawer>

            {/* Add */}
            <Drawer
                title="Add StickyNote"
                width={1200}
                closable={true}
                onClose={() => { setAddDrawer(false); editorRef.current.setvalue("") }}
                visible={addDrawer}
            >
                <Spin spinning={loading}>
                    <TextEditor
                        ref={editorRef}
                        init={{
                            toolbar1: ['undo redo | bold italic underline forecolor backcolor fontsizeselect'],
                            toolbar2: ['alignleft aligncenter alignright alignjustify bullist numlist preview'],
                            height: 500
                        }}
                    />

                    <Row>
                        <Col span={24} style={{ textAlign: "right", marginTop: 12 }}>
                            <Button loading={loadingDetail} type="primary" onClick={() => addNote()}
                                style={{ backgroundColor: "#00CC00" }}
                            >
                                Save
                            </Button>
                        </Col>
                    </Row>

                </Spin>
            </Drawer>

            {/* Edit */}
            <Drawer
                title="Details"
                width={800}
                closable={true}
                onClose={() => { setEditDrawer(false); editorRef.current.getValue() }}
                visible={editdrawer}
                footer={
                    <div
                        style={{
                            textAlign: 'right',
                        }}
                    >
                        <TextEditor
                            ref={editorRef}
                            init={{
                                toolbar1: ['undo redo | bold italic underline forecolor backcolor fontsizeselect'],
                                toolbar2: ['alignleft aligncenter alignright alignjustify bullist numlist preview']
                            }}
                            value={stckyNoteDetail?.description}
                        />

                        <Button loading={loadingDetail} type="primary" onClick={() => editStickyNoteDetail(stckyNoteDetail?.id)}
                            style={{ backgroundColor: "#00CC00", marginTop: 12 }}
                        >
                            Save
                        </Button>
                    </div>
                }
            >
                <Spin spinning={loadingDetail}>
                    <label dangerouslySetInnerHTML={{ __html: stckyNoteDetail?.description }}>
                    </label>
                </Spin>
            </Drawer>


        </>
    )
}