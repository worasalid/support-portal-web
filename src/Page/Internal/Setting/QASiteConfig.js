import React, { useEffect, useState } from "react";
import MasterPage from '../MasterPage'
import { Row, Col, Button, Table, Modal, Input, message, Divider } from "antd";
import axios from "axios";
import { useRouteMatch, useHistory } from "react-router-dom";
import { LeftCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Icon } from '@iconify/react';
import _ from 'lodash'

export default function QASiteConfig() {
    const { Column } = Table;
    const match = useRouteMatch();
    const history = useHistory(null);
    const [loading, setLoading] = useState(false);
    const [modalAdd, setModalAdd] = useState(false);

    // data
    const [user, setUser] = useState(null);
    const [siteOwner, setSiteOwner] = useState([]);
    const [company, setCompany] = useState([]);
    const [selectcompany, setSelectCompany] = useState(null);

    // filter
    const [filterCompany, setFilterCompany] = useState(null);
    const [filterSiteOwner, setFilterSiteOwner] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([])


    const getUser = async () => {
        setLoading(true);
        await axios.get(`${process.env.REACT_APP_API_URL}/master/profile`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                user_id: match.params.id
            }
        }).then((res) => {
            setLoading(false);
            setUser(res.data.usersdata.users);

        }).catch((error) => {
            setLoading(false);
            console.log("error", error)
        })
    }

    const getSiteOwner = async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/master/setting/qa/site-owner`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                user_id: match.params.id
            }
        }).then((res) => {
            setSiteOwner(res.data.map((n, index) => {
                return {
                    no: index + 1,
                    user_id: n.UserId,
                    com_id: n.CompanyId,
                    com_code: n.Code,
                    com_name: n.CompanyName,
                    com_fullname: n.CompanyFullName,
                    product_owner: n.ProductCode
                }
            }))
        }).catch((error) => {

        });
    }

    const getCompany = async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/master/load-company`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            }
        }).then((res) => {
            setCompany(res.data.filter((n) => !siteOwner.find((item) => item.com_code === n.Code))
                .map((data) => {
                    return {
                        key: data.Id,
                        company_id: data.Id,
                        com_code: data.Code,
                        company_name: data.Name,
                        com_fullname: data.FullNameTH
                    }
                }));
        }).catch((error) => {

        })
    }

    const addSiteOwner = async () => {
        setLoading(true);
        await axios({
            url: `${process.env.REACT_APP_API_URL}/master/setting/qa/site-owner`,
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                user_id: match.params.id,
                company_id: selectcompany
            }
        }).then((res) => {
            setModalAdd(false);
            setLoading(false);
            getSiteOwner();
            setSelectedRowKeys([]);
            message.success({
                content: 'บันทึกข้อมูลสำเร็จ',
                style: {
                    marginTop: '10vh',
                },
            });

        }).catch((error) => {
            setModalAdd(false);
            message.error({
                content: 'บันทึกข้อมูล ไม่สำเร็จ',
                style: {
                    marginTop: '10vh',
                },
            });
        });
    }

    const deleteSiteOwner = async (param) => {
        setLoading(true);
        await axios({
            url: `${process.env.REACT_APP_API_URL}/master/setting/qa/site-owner`,
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                user_id: match.params.id,
                company_id: param
            }
        }).then((res) => {
            setLoading(false);
            getSiteOwner();
            message.success({
                content: 'ลบข้อมูลสำเร็จ',
                style: {
                    marginTop: '10vh',
                },
            });

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

    const rowSelection = {
        selectedRowKeys: [...selectedRowKeys],
        // onChange: (selectedRowKeys, selectedRows) => {
        //     setSelectCompany(selectedRows.map((n) => n.company_id));
        // }

        onSelect: (record, selected) => {
            let newKeys = [...selectedRowKeys]
            if (selected) {
                newKeys.push(record.company_id)
            } else {
                newKeys = _.filter(newKeys, n => n !== record.key)
            }
            setSelectedRowKeys(newKeys)
            setSelectCompany(newKeys)
        },
    };

    const searchCompany = (param) => {
        let result = company.filter(o =>
            Object.keys(o).some(k =>
                String(o[k])
                    .toLowerCase()
                    .includes(param.toLowerCase())
            )
        );
        setFilterCompany(result);
    }

    const searchSiteOwner = (param) => {
        let result = siteOwner.filter(o =>
            Object.keys(o).some(k =>
                String(o[k])
                    .toLowerCase()
                    .includes(param.toLowerCase())
            )
        );
        setFilterSiteOwner(result);
    }

    useEffect(() => {
        getUser();
        getSiteOwner();
    }, [])

    useEffect(() => {
        if (modalAdd) {
            getCompany();
        }
    }, [modalAdd])


    return (
        <MasterPage>
            <div style={{ padding: "24px 24px 24px 24px" }}>
                {/* ชื่อ */}
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
                        <h1>{user?.display_name}</h1>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{ textAlign: "right" }}>
                        <Input.Search placeholder="Code / ชื่อบริษัท" allowClear
                            enterButton
                            style={{ width: "40%" }}
                            onSearch={searchSiteOwner}
                        />
                        &nbsp; &nbsp; &nbsp;
                        <Button type="primary" icon={<Icon icon="akar-icons:plus" width="18" height="18" />}
                            style={{ backgroundColor: "#00cc00" }}
                            onClick={() => setModalAdd(true)}
                        >
                            เพิ่มข้อมูล
                        </Button>
                    </Col>
                </Row>

                <Table
                    loading={loading}
                    dataSource={filterSiteOwner === null ? siteOwner : filterSiteOwner}
                    rowKey={(record) => record.com_code}
                >
                    <Column title="No" dataIndex="no" />
                    <Column title="Company Code" dataIndex="com_code" />
                    <Column title="Company Name" dataIndex="com_name" />
                    <Column title="Company FullName" dataIndex="com_fullname" />
                    <Column title="Product" dataIndex="product_owner" />
                    <Column
                        render={(value, record) => {
                            return (
                                <>
                                    {/* <Icon icon="ant-design:edit-outlined" width="18" height="18"
                                        className="icon-hover"
                                        onClick={() => history.push({ pathname: `/internal/setting/config_qa/userid-${match.params.id}/comid-${record.com_id}` })}
                                    /> */}
                                    <EditOutlined
                                        className="icon-hover"
                                        style={{ fontSize: 18 }}
                                        onClick={() => history.push({ pathname: `/internal/setting/config_qa/userid-${match.params.id}/comid-${record.com_id}` })}
                                    />
                                    <Divider type="vertical" />

                                    <DeleteOutlined
                                        className="icon-hover-red"
                                        style={{ fontSize: 18 }}
                                        onClick={() => deleteSiteOwner(record.com_id)}
                                    />
                                    {/* <Icon icon="ant-design:delete-outlined" width="18" height="18"
                                        className="icon-link-delete"
                                        onClick={() => deleteSiteOwner(record.com_id)}
                                    /> */}
                                </>
                            )
                        }}
                    />
                </Table>
            </div>

            <Modal
                visible={modalAdd}
                title="เพิ่ม Site ที่ดูแล"
                width={800}
                okText="Save"
                onOk={() => {
                    {
                        selectcompany === null ?
                            alert() :
                            // console.log("selectcompany", selectcompany)
                            addSiteOwner()
                    }
                    //setModalAdd(false);
                }}
                onCancel={() => {
                    setModalAdd(false);
                }}
            >
                <Row style={{ marginBottom: 20 }}>
                    <Col span={12}>
                    </Col>
                    <Col span={12}>
                        <Input.Search placeholder="Code / ชื่อบริษัท" allowClear
                            enterButton
                            onSearch={searchCompany}
                        />
                    </Col>
                </Row>

                <Table loading={loading} dataSource={filterCompany === null ? company : filterCompany}
                    rowKey={(record) => record.key}
                    rowSelection={{
                        type: "checkbox",
                        ...rowSelection

                    }}
                    pagination={{ pageSize: 6 }}
                >
                    <Column title="Code" width="10%" dataIndex="com_code" />
                    <Column title="Company Name" width="40%" dataIndex="company_name" />
                    <Column title="Company Name" width="50%" dataIndex="com_fullname" />
                    <Column
                        render={(value, record) => {
                            return (
                                <Icon icon="ant-design:edit-outlined" width="18" height="18"
                                    onClick={() => history.push({ pathname: `/internal/setting/config_qa/userid-${match.params.id}/comid-${record.com_id}` })}
                                />
                            )
                        }}
                    />
                </Table>

            </Modal>
        </MasterPage >
    )
}