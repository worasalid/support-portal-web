import React, { useEffect, useState, useRef } from "react";
import MasterPage from "../MasterPage";
import { Button, Table, Modal, Select, Tabs, Row, Col, Spin, Card } from 'antd';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { LeftCircleOutlined } from '@ant-design/icons';
import { nanoid } from 'nanoid'
import { Icon } from '@iconify/react';

const { Column } = Table;

export default function CustomerLicense() {
    const history = useHistory();
    const tableRef = useRef(null);
    const [loading, setLoading] = useState();
    const [filterCompany, setFilterCompany] = useState(null);
    const [company, setCompany] = useState(null);
    const [product, setProduct] = useState(null);
    const [selectCompany, setSelectCompany] = useState([]);

    const getCompany = async () => {
        setLoading(true);
        await axios.get(`${process.env.REACT_APP_API_URL}/master/company`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            }
        }).then((res) => {
            setFilterCompany(res.data.map((o) => {
                return {
                    id: o.Id,
                    code: o.Code,
                    name: o.Name,
                    fullNameTh: o.FullNameTH,
                    fullNameEn: o.FullNameEN,
                    url: o.URL
                }
            }));

            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }

    const searchCompany = async () => {
        setLoading(true);
        await axios.get(`${process.env.REACT_APP_API_URL}/master/company`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                id: selectCompany
            }
        }).then((res) => {
            setCompany(res.data.map((o, index) => {
                return {
                    key: nanoid(),
                    id: o.Id,
                    code: o.Code,
                    name: o.Name,
                    fullNameTh: o.FullNameTH,
                    fullNameEn: o.FullNameEN,
                    url: o.URL
                }
            }));
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }

    const getCustomerProduct = async () => {
        await axios(`${process.env.REACT_APP_API_URL}/license/customer-products`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            }

        }).then((res) => {
            setProduct(res.data.map((o) => {
                return {
                    key: nanoid(),
                    id: o.id,
                    companyId: o.CompanyId,
                    name: o.Name,
                    fullname: o.FullName,
                    version: o.Version,
                    userLicense: o.UserLicense,
                    activeLicense: o.ActiveLicense
                }
            }))
            console.log("getCustomerProduct", res.data)
        }).catch((error) => {

        })
    }

    useEffect(() => {
        getCompany();
        getCustomerProduct()
    }, [])

    useEffect(() => {
        searchCompany();
    }, [selectCompany.length])

    return (
        <MasterPage bgColor="#f0f2f5">
            <div style={{ padding: 24 }}>

                <Card className="card-dashboard" bordered={true}
                    title={
                        <>
                            <Row>
                                <Col span={6}>
                                    ข้อมูล License
                                </Col>
                                <Col span={18} style={{ textAlign: "right" }}>
                                    <Select
                                        placeholder="เลือก บริษัท"
                                        mode='multiple'
                                        showSearch
                                        allowClear
                                        maxTagCount={2}
                                        style={{ width: "50%", textAlign: "left" }}
                                        filterOption={(input, option) =>
                                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        onChange={(value, item) => setSelectCompany(value)}
                                        options={filterCompany?.map((o) => ({ value: o.id, label: `${o.name} - (${o.fullNameTh})` }))}
                                    >
                                    </Select>
                                </Col>
                            </Row>
                        </>
                    }
                    style={{ width: "100%" }}
                >
                    <Table dataSource={company}
                        rowKey={(value) => value.key}
                        loading={loading}
                        className="header-sticky"
                        expandable={{
                            expandedRowRender: (record) => (
                                <>
                                    <Table dataSource={product.filter((item) => item.companyId === record.id)}>
                                        <Column title="Product code" dataIndex="name" />
                                        <Column title="Product Name" dataIndex="fullname" />
                                        <Column title="Version" dataIndex="version" />
                                        <Column
                                            title="User License"
                                            render={(value, record) => {
                                                return (
                                                    <>
                                                        {record.userLicense}
                                                    </>
                                                )
                                            }}
                                        />
                                        <Column
                                            title="Active License"
                                            render={(value, record) => {
                                                return (
                                                    <>
                                                        {record.activeLicense}
                                                    </>
                                                )
                                            }}
                                        />
                                        <Column
                                            render={(value, record) => {
                                                return (
                                                    <>
                                                        <Icon icon="ant-design:edit-outlined" className="icon-hover" width="18" height="18" />
                                                    </>
                                                )
                                            }}
                                        />
                                    </Table>
                                </>
                            ),
                            rowExpandable: (record) => record.code !== ""
                        }}
                    >
                        <Column title="Code" dataIndex="code" />
                        <Column title="บริษัท" dataIndex="fullNameTh" />
                        <Column title="URL" dataIndex="url" />
                        <Column
                            render={(value, record) => {
                                return (
                                    <>
                                        <Icon icon="ant-design:edit-outlined" className="icon-hover" width="18" height="18" />
                                    </>
                                )
                            }}
                        />
                    </Table>
                </Card>


            </div>
        </MasterPage>
    )
}