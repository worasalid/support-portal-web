import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Row, Col, Input, Tabs, Popconfirm, message, Divider, Radio } from 'antd';
import Axios from 'axios';
import MasterPage from '../../MasterPage';
import { DeleteOutlined, EditOutlined, LeftCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useHistory } from "react-router-dom";
import _ from 'lodash'

const { TabPane } = Tabs;
const { Column } = Table;

export default function ConfigOrganize() {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [organize, setOrganize] = useState([]);

    //modal
    const [modalVisible, setModalVisible] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);

    //filter
    const [filterOrganizeUser, setFilterOrganizeUser] = useState(null);
    const [selectedRow, setSelectedRow] = useState([]);
    const [selectUserId, setSelectUserId] = useState([])

    //data
    const [organizeId, setOrganizeId] = useState("1");
    const [organizeUser, setOrganizeUser] = useState([]);
    const [user, setUser] = useState([]);
    const [selectPosition, setSelectPosition] = useState(null)

    const rowSelectionUser = {
        selectedRowKeys: selectedRow,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectUserId(selectedRowKeys);
            setSelectedRow(selectedRowKeys);
        },
    };

    const getOrganize = async () => {
        await Axios.get(process.env.REACT_APP_API_URL + "/master/organize/team", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            }
        }).then((res) => {
            setOrganize(res.data);
        }).catch((error) => {

        })
    }

    const getOrganizeUser = async () => {
        await Axios.get(process.env.REACT_APP_API_URL + "/master/organize/user", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                organize_id: organizeId
            }

        }).then((res) => {
            setOrganizeUser(res.data)
        }).catch((error) => {

        })
    }

    const getUser = async () => {
        await Axios.get(process.env.REACT_APP_API_URL + "/master/icon-users", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            }
        }).then((res) => {
            setUser(res.data.filter((x) => !organizeUser.find(item => item.UserId == x.id)).map((n, index) => {
                return {
                    key: n.id,
                    code: n.code,
                    display_name: n.display_name
                }
            }))
        }).catch((error) => {

        })
    }

    const searchOrganize = (param) => {
        let result = organizeUser.filter(o =>
            Object.keys(o).some(k =>
                String(o[k])
                    .toLowerCase()
                    .includes(param.toLowerCase())
            )
        );
        setFilterOrganizeUser(result);
    }

    const addUserInOrganize = async () => {
        setLoading(true);
        await Axios({
            url: process.env.REACT_APP_API_URL + "/master/organize/user",
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                userId: selectUserId && selectUserId,
                organizeId: organizeId && organizeId
            }
        }).then((res) => {
            setModalVisible(false);
            setLoading(false);
            getOrganizeUser();
            setSelectUserId([]);
            setSelectedRow([]);

            message.success({
                content: 'บันทึกข้อมูลสำเร็จ',
                style: {
                    marginTop: '20vh',
                },
            })

        }).catch((error) => {
            setModalVisible(false);
            setLoading(false);
            message.error({
                content: 'บันทึกข้อมูล ไม่สำเร็จ',
                style: {
                    marginTop: '20vh',
                },
            })
        })
    }

    const editUserPosition = async () => {
        console.log("selectedRow", selectedRow)
        setLoading(true);
        await Axios({
            url: process.env.REACT_APP_API_URL + "/master/organize/user",
            method: "PATCH",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                userId: selectedRow.UserId,
                organizeId: selectedRow.OrganizeId,
                position_level: selectPosition
            }
        }).then((res) => {
            setModalEdit(false);
            setLoading(false);
            getOrganizeUser();
            message.success({
                content: 'บันทึกข้อมูลสำเร็จ',
                style: {
                    marginTop: '20vh',
                },
            })

        }).catch((error) => {
            setModalEdit(false);
            setLoading(false);
            message.error({
                content: 'บันทึกข้อมูล ไม่สำเร็จ',
                style: {
                    marginTop: '20vh',
                },
            })
        })
    }

    const deleteUserOrganize = async (param) => {
        setLoading(true);
        await Axios.delete(process.env.REACT_APP_API_URL + "/master/organize/user", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                userId: param.UserId,
                organizeId: param.OrganizeId
            }
        }).then((res) => {
            setLoading(false);
            getOrganizeUser();
            message.success({
                content: 'ลบข้อมูลสำเร็จ',
                style: {
                    marginTop: '20vh',
                },
            })

        }).catch((error) => {

        })
    }

    useEffect(() => {
        getOrganize();
        getUser();
        getOrganizeUser();
    }, [])

    useEffect(() => {
        getOrganizeUser();
    }, [organizeId])

    return (
        <MasterPage>
            <div style={{ padding: "24px 24px 24px 24px" }}>
                <Row style={{ marginBottom: 16, textAlign: "left" }} gutter={[16, 16]}>
                    <Col>
                        <Button
                            type="link"
                            icon={<LeftCircleOutlined />}
                            style={{ fontSize: 18, padding: 0 }}
                            onClick={() => history.goBack()}
                        >
                            Back
                        </Button>
                    </Col>
                    &nbsp; &nbsp;
                </Row>
                <Row>
                    <Col span={24}>
                        <Tabs type="card" onChange={(key, value) => setOrganizeId(key)}>
                            {
                                organize.map((n, index) => {
                                    return (
                                        <TabPane tab={n.Name} key={n.Id}>
                                            <Row style={{ marginBottom: 16 }} gutter={[16, 16]}>
                                                <Col span={24} style={{ textAlign: "right" }}>
                                                    <Input.Search placeholder="code / Name / FullName" allowClear
                                                        style={{ width: "40%" }}
                                                        enterButton
                                                        onSearch={searchOrganize}
                                                    />
                                                    &nbsp;  &nbsp;
                                                    <Button type="primary" icon={<PlusOutlined />} style={{ backgroundColor: "#00CC00" }}
                                                        onClick={() => {
                                                            setModalVisible(true);
                                                            getUser();
                                                        }}
                                                    >
                                                        เพิ่มข้อมูล
                                                    </Button>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={24}>
                                                    <Table
                                                        loading={loading}
                                                        dataSource={filterOrganizeUser === null ? organizeUser : filterOrganizeUser}
                                                    >
                                                        <Column title="Code" dataIndex="UserCode" key="UserId" width="10%" />
                                                        <Column title="ชื่อ" width="40%"
                                                            key="UserId"
                                                            render={(value, record, index) => {
                                                                return (
                                                                    <>
                                                                        {record.DisplayName}
                                                                    </>
                                                                )
                                                            }}
                                                        />
                                                        <Column title="Email" dataIndex="Email" key="UserId" width="30%" />
                                                        {
                                                            organizeId === "2" ?
                                                                <Column title="Position" width="10%"
                                                                    render={(value, record, index) => {
                                                                        return (
                                                                            <>
                                                                                {
                                                                                    record.PositionLevel === 0 ?
                                                                                        <label style={{ color: "red" }}>H.Developer</label> :
                                                                                        <label style={{ color: "green" }}>Developer</label>
                                                                                }
                                                                            </>
                                                                        )
                                                                    }}
                                                                />
                                                                : ""

                                                        }
                                                        <Column width="10%" align="center"
                                                            key="UserId"
                                                            render={(value, record, index) => {
                                                                return (
                                                                    <>
                                                                        {
                                                                            organizeId === "2" ?
                                                                                <>
                                                                                    <EditOutlined style={{ cursor: "pointer", fontSize: 16 }}
                                                                                        onClick={() => {
                                                                                            setSelectPosition(record.PositionLevel)
                                                                                            setSelectedRow(record)
                                                                                            setModalEdit(true)
                                                                                        }}
                                                                                    />
                                                                                    <Divider type="vertical" />
                                                                                </>
                                                                                : ""
                                                                        }
                                                                        <Popconfirm
                                                                            title="ต้องการลบ user นี้ !?"
                                                                            onConfirm={() => deleteUserOrganize(record)}
                                                                        >
                                                                            <DeleteOutlined style={{ cursor: "pointer", fontSize: 16 }} />
                                                                        </Popconfirm>
                                                                    </>
                                                                )
                                                            }}
                                                        />
                                                    </Table>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                    )
                                })
                            }
                        </Tabs>
                    </Col>
                </Row>

            </div>

            {/* modal Add user  */}
            <Modal
                title="เพิ่ม User"
                visible={modalVisible}
                confirmLoading={loading}
                onOk={() => {
                    addUserInOrganize();
                }}
                onCancel={() => {
                    setSelectUserId([]);
                    setSelectedRow([]);
                    setModalVisible(false);
                }}
                okText="Save"
                cancelText="Cancel"
                width={600}
            >
                <Table dataSource={user}
                    key="code"
                    pagination={{ pageSize: 6 }}
                    rowSelection={{
                        type: "checkbox",
                        ...rowSelectionUser

                    }}
                >
                    <Column title="Code" dataIndex="code" key="key" />
                    <Column title="ชื่อ-นามสกุล" dataIndex="display_name" key="key" />
                </Table>

            </Modal>

            <Modal title="แก้ไข Position"
                visible={modalEdit}
                width={500}
                onCancel={() => setModalEdit(false)}
                onOk={() => editUserPosition()}
            >
                <Radio.Group onChange={(e) => setSelectPosition(e.target.value)} value={selectPosition === 0 ? 0 : 1}>
                    <Radio value={0}>H.Developer</Radio>
                    <Radio value={1}>Developer</Radio>
                </Radio.Group>
            </Modal>
        </MasterPage >
    )
}