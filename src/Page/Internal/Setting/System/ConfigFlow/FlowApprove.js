import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Button, Table, Modal, Row, Col, message } from 'antd';
import MasterPage from '../../../MasterPage';
import { LeftCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Icon } from '@iconify/react';
import axios from 'axios';
import _ from "lodash";

const { Column } = Table;

export default function FlowApprove() {
    const history = useHistory(null);
    const [approver, setApprover] = useState([]);
    const [loading, setLoading] = useState(false);

    const [users, setUser] = useState([]);
    const [selectUsers, setSelectUser] = useState([]);
    const [filterUsers, setFilterUser] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [addModal, setAddModal] = useState(false);

    const getApprover = async () => {
        await axios.get(process.env.REACT_APP_API_URL + "/config/flow/approve", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            }
        }).then((res) => {
            setApprover(res.data.map((n, index) => {
                return {
                    key: index,
                    no: index + 1,
                    config_id: n.ConfigId,
                    user_id: n.UserId,
                    user_name: n.UserName

                }
            }));

        }).catch((error) => {
            console.log(error.response.data)
        })
    }

    const getUser = async () => {
        await axios.get(process.env.REACT_APP_API_URL + "/master/users", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                organize: "manage",
            }
        }).then((res) => {
            setUser(res.data.filter((n) => !approver.find((x) => x.user_id === n.UserId)).map((n, index) => {
                return {
                    key: n.UserId,
                    no: index + 1,
                    user_id: n.UserId,
                    user_name: n.UserName
                }
            }));
        }).catch((error) => {
            console.log(error.response.data)
        })
    }

    const addApprover = async () => {
        setLoading(true);
        await axios({
            url: `${process.env.REACT_APP_API_URL}/config/flow/approve`,
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                user: selectedRowKeys
            }
        }).then((res) => {
            setLoading(false);
            setAddModal(false);
            setSelectedRowKeys([]);
            
            message.success({
                content: 'เพิ่มข้อมูลสำเร็จ',
                style: {
                    marginTop: '10vh',
                },
            });
            getApprover();
        }).catch((error) => {
            setLoading(false);
            message.error({
                content: 'เพิ่มข้อมูล ไม่สำเร็จ',
                style: {
                    marginTop: '10vh',
                },
            });
        });
    }

    const deleteApprover = async (config_id) => {
        setLoading(true);
        await axios({
            url: `${process.env.REACT_APP_API_URL}/config/flow/approve`,
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                configId: config_id
            }
        }).then((res) => {
            setLoading(false);

            message.success({
                content: 'ลบข้อมูลสำเร็จ',
                style: {
                    marginTop: '10vh',
                },
            });
            getApprover();
        }).catch((error) => {
            setLoading(false);
            message.error({
                content: 'ลบข้อมูล ไม่สำเร็จ',
                style: {
                    marginTop: '10vh',
                },
            });
        });
    }

    const searchUser = (param) => {
        let result = users.filter(o =>
            Object.keys(o).some(k =>
                String(o[k])
                    .toLowerCase()
                    .includes(param.toLowerCase())
            )
        );
        setFilterUser(result);
    }

    const userSelection = {
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectUser(selectedRows)
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    useEffect(() => {
        getApprover();
    }, [])

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
                    <Col>
                        <h1>ตั้งค่า Flow Approve</h1>
                    </Col>
                </Row>
                <Row style={{ marginBottom: 16, textAlign: "right" }} gutter={[16, 16]}>
                    <Col span={24}>
                        <Button type="primary" icon={<PlusOutlined />}
                            style={{ backgroundColor: "#00CC00" }}
                            onClick={() => { setAddModal(true); getUser() }}
                        >
                            เพิ่มข้อมูล
                        </Button>
                    </Col>
                </Row>

                <Table dataSource={approver}>
                    <Column title="No" key="key" width="5%" dataIndex="no" />
                    <Column title="ผู้อนุมัติ" key="key" width="90%" dataIndex="user_name" />
                    <Column key="key"
                        render={(value, record, index) => {
                            return (
                                <>
                                    <Icon className='icon-link-delete' icon="fluent:delete-24-regular" width="24" height="24"
                                        onClick={() => deleteApprover(record.config_id)}
                                    />
                                </>
                            )
                        }}
                    />
                </Table>
            </div>

            <Modal title="เพิ่มข้อมูล ผู้อนุมัติ"
                visible={addModal}
                width={600}
                onCancel={() => {
                    setAddModal(false);
                    setSelectedRowKeys([]);
                }}
                onOk={() => {
                    addApprover();
                }}
            >
                <Table dataSource={users}
                    rowSelection={{
                        type: "checkbox",
                        ...userSelection,
                    }}
                >
                    <Column title="No" key="key" width="5%" dataIndex="no" />
                    <Column title="UserName" key="key" width="80%" dataIndex="user_name" />
                </Table>
            </Modal>
        </MasterPage>
    )
}