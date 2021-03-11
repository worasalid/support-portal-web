import React, { useEffect, useState } from 'react'
import { EditOutlined, FileOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Table, Modal, Row, Col, Card } from 'antd';
import Axios from 'axios';
import MasterPage from '../../MasterPage';
import { useHistory } from 'react-router-dom';

const { Meta } = Card;

export default function SystemConfig() {
    const history = useHistory(null)
    return (
        <MasterPage>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Card className="card-box issue-active" bordered hoverable
                        style={{ width: "100%" }}
                    //onClick={() => history.push("/internal/setting/system/reopen")}
                    >
                        <Meta
                            title={<label className="card-title-menu">Organize Chart</label>}
                            description={
                                <label className="value-text">
                                    Organize Chart
                                </label>

                            }
                        />
                    </Card>
                </Col>

                <Col span={6}>
                    <Card className="card-box issue-active" bordered hoverable
                        style={{ width: "100%" }}
                        onClick={() => history.push("/internal/setting/system/product")}
                    >
                        <Meta
                            title={<label className="card-title-menu">ข้อมูล Product</label>}
                            description={
                                <label className="value-text">
                                    เพิ่ม,แก้ไข ข้อมูล Product
                                </label>

                            }
                        />
                    </Card>
                </Col>

                <Col span={6}>
                    <Card className="card-box issue-active" bordered hoverable
                        style={{ width: "100%" }}
                        onClick={() => history.push("/internal/setting/system/module")}
                    >
                        <Meta
                            avatar={
                                <img
                                    style={{ height: "50px", width: "50px" }}
                                    src={`${process.env.PUBLIC_URL}/icon-module.png`}
                                    alt=""
                                />
                            }
                            title={<label className="card-title-menu">ข้อมูล Module</label>}
                            description={
                                <label className="value-text">
                                    เพิ่ม,แก้ไข,ลบ ข้อมูล Module
                                </label>

                            }
                        />
                    </Card>
                </Col>

                <Col span={6}>
                    <Card className="card-box issue-active" bordered hoverable
                        style={{ width: "100%" }}
                        onClick={() => history.push("/internal/setting/system/version")}
                    >
                        <Meta
                            title={<label className="card-title-menu">ข้อมูล Version</label>}
                            description={
                                <label className="value-text">
                                    รายละเอียด Version
                                </label>

                            }
                        />
                    </Card>
                </Col>

            </Row>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Card className="card-box issue-active" bordered hoverable
                        style={{ width: "100%" }}
                        onClick={() => history.push("/internal/setting/system/reopen")}
                    >
                        <Meta
                            avatar={<FileOutlined style={{ fontSize: 35 }} />}
                            title={<label className="card-title-menu">เหตุผลการ ReOpen</label>}
                            description={
                                <label className="value-text">
                                    ตั้งค่าเหตุผลในการ ReOpen ของลูกค้า
                                </label>

                            }
                        />
                    </Card>
                </Col>

                <Col span={6}>
                    <Card className="card-box issue-active" bordered hoverable
                        style={{ width: "100%" }}
                        onClick={() => history.push("/internal/setting/system/reopen_email")}
                    >
                        <Meta
                            avatar={<FileOutlined style={{ fontSize: 35 }} />}
                            title={<label className="card-title-menu">ตั้งค่า Email ReOpen</label>}
                            description={
                                <label className="value-text">
                                    ตั้งค่าการส่ง Email กรณี มีการ ReOpen เกิน 3 ครั้ง
                                </label>

                            }
                        />
                    </Card>
                </Col>


                <Col span={6}>
                    <Card className="card-box issue-active" bordered hoverable
                        style={{ width: "100%" }}
                        onClick={() => history.push("/internal/setting/system/reason_cancel")}
                    >
                        <Meta
                            avatar={<FileOutlined style={{ fontSize: 35 }} />}
                            title={<label className="card-title-menu">เหตุผลการยกเลิก</label>}
                            description={
                                <label className="value-text">
                                    ตั้งค่าเหตุผลการยกเลิก ของลูกค้า
                                </label>
                            }
                        />
                    </Card>
                </Col>
            </Row>

        </MasterPage>
    )
}