import React, { useEffect, useState } from 'react'
import { Button, Table, Modal, Row, Col, Card } from 'antd';
import Axios from 'axios';
import MasterPage from '../../MasterPage';
import { useHistory } from 'react-router-dom';
import { Icon } from '@iconify/react';

const { Meta } = Card;

export default function SystemConfig() {
    const history = useHistory(null);

    return (
        <MasterPage bgColor="#f0f2f5">
            <div style={{ padding: "24px 24px 24px 24px" }}>
                <Row gutter={[16, 16]}>
                    <Col hidden={true} xs={24} sm={24} md={12} lg={8} xl={6}>
                        <Card className="card-box issue-active" bordered hoverable
                            style={{ width: "100%" }}
                            onClick={() => history.push("/internal/setting/system/orgchart")}
                        >
                            <Meta
                                avatar={
                                    <img
                                        style={{ height: "50px", width: "50px" }}
                                        src={`${process.env.PUBLIC_URL}/icons-organization-chart.png`}
                                        alt=""
                                    />
                                }
                                title={<label className="card-title-menu">Organization</label>}
                                description={
                                    <label className="value-text">
                                        Organization Chart
                                    </label>

                                }
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                        <Card className="card-box issue-active" bordered hoverable
                            style={{ width: "100%" }}
                            onClick={() => history.push("/internal/setting/system/organize")}
                        >
                            <Meta
                                avatar={
                                    <img
                                        style={{ height: "40px", width: "40px" }}
                                        src={`${process.env.PUBLIC_URL}/icons-organization-chart.png`}
                                        alt=""
                                    />
                                }
                                title={<label className="card-title-menu">Organize</label>}
                                description={
                                    <label className="value-text">
                                        ตั้งค่า Organize
                                    </label>
                                }
                            />
                        </Card>
                    </Col>


                    <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                        <Card className="card-box issue-active" bordered hoverable
                            style={{ width: "100%" }}
                            onClick={() => history.push("/internal/setting/system/product")}
                        >
                            <Meta
                                avatar={
                                    <img
                                        style={{ height: "50px", width: "50px" }}
                                        src={`${process.env.PUBLIC_URL}/icons-product.png`}
                                        alt=""
                                    />
                                }
                                title={<label className="card-title-menu">ข้อมูล Product</label>}
                                description={
                                    <label className="value-text">
                                        เพิ่ม,แก้ไข ข้อมูล Product
                                    </label>

                                }
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                        <Card className="card-box issue-active" bordered hoverable
                            style={{ width: "100%" }}
                            onClick={() => history.push("/internal/setting/system/module")}
                        >
                            <Meta
                                avatar={
                                    <img
                                        style={{ height: "50px", width: "50px" }}
                                        src={`${process.env.PUBLIC_URL}/icons-module.png`}
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

                    <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                        <Card className="card-box issue-active" bordered hoverable
                            style={{ width: "100%" }}
                            onClick={() => history.push("/internal/setting/system/version")}
                        >
                            <Meta
                                avatar={
                                    <img
                                        style={{ height: "40px", width: "40px" }}
                                        src={`${process.env.PUBLIC_URL}/icons-document.png`}
                                        alt=""
                                    />
                                }
                                title={<label className="card-title-menu">ข้อมูล Version</label>}
                                description={
                                    <label className="value-text">
                                        รายละเอียด Version
                                    </label>

                                }
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                        <Card className="card-box issue-active" bordered hoverable
                            style={{ width: "100%" }}
                            onClick={() => history.push("/internal/setting/system/reopen")}
                        >
                            <Meta
                                avatar={
                                    <img
                                        style={{ height: "40px", width: "40px" }}
                                        src={`${process.env.PUBLIC_URL}/icons-document-reopen.png`}
                                        alt=""
                                    />
                                }
                                title={<label className="card-title-menu">เหตุผลการ ReOpen</label>}
                                description={
                                    <label className="value-text">
                                        ตั้งค่าเหตุผลในการ ReOpen ของลูกค้า
                                    </label>

                                }
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={42} md={12} lg={8} xl={6}>
                        <Card className="card-box issue-active" bordered hoverable
                            style={{ width: "100%" }}
                            onClick={() => history.push("/internal/setting/system/email_config")}
                        >
                            <Meta
                                avatar={
                                    <img
                                        style={{ height: "40px", width: "40px" }}
                                        src={`${process.env.PUBLIC_URL}/icons-email.png`}
                                        alt=""
                                    />
                                }
                                title={<label className="card-title-menu">ตั้งค่า Email </label>}
                                description={
                                    <label className="value-text">
                                        ตั้งค่าการส่ง Email
                                    </label>

                                }
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                        <Card className="card-box issue-active" bordered hoverable
                            style={{ width: "100%" }}
                            onClick={() => history.push("/internal/setting/system/reason_cancel")}
                        >
                            <Meta
                                avatar={
                                    <img
                                        style={{ height: "40px", width: "40px" }}
                                        src={`${process.env.PUBLIC_URL}/icons-document-cancel.png`}
                                        alt=""
                                    />
                                }
                                title={<label className="card-title-menu">เหตุผลการยกเลิก</label>}
                                description={
                                    <label className="value-text">
                                        ตั้งค่าเหตุผลการยกเลิก ของลูกค้า
                                    </label>
                                }
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                        <Card className="card-box issue-active" bordered hoverable
                            style={{ width: "100%" }}
                            onClick={() => history.push("/internal/setting/system/reason_reject")}
                        >
                            <Meta
                                avatar={
                                    <img
                                        style={{ height: "40px", width: "40px" }}
                                        src={`${process.env.PUBLIC_URL}/icons-document-cancel.png`}
                                        alt=""
                                    />
                                }
                                title={<label className="card-title-menu">เหตุผลการ Reject งาน</label>}
                                description={
                                    <label className="value-text">
                                        ตั้งค่าเหตุผลการ Reject
                                    </label>
                                }
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                        <Card className="card-box issue-active" bordered hoverable
                            style={{ width: "100%" }}
                            onClick={() => history.push("/internal/setting/system/user-manual")}
                        >
                            <Meta
                                avatar={
                                    <img
                                        style={{ height: "40px", width: "40px" }}
                                        src={`${process.env.PUBLIC_URL}/icons-upload.png`}
                                        alt=""
                                    />
                                }
                                title={<label className="card-title-menu"> Upload คู่มือการใช้งาน</label>}
                                description={
                                    <label className="value-text">
                                        ตั้งค่า Upload คู่มือเพื่อใช้ในระบบ
                                    </label>

                                }
                            />
                        </Card>
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                        <Card className="card-box issue-active" bordered hoverable
                            style={{ width: "100%" }}
                            onClick={() => history.push("/internal/setting/system/flow-approve")}
                        >
                            <Meta
                                avatar={
                                    <Icon icon="carbon:flow" width="48" height="48" />
                                }
                                title={<label className="card-title-menu"> ตั้งค่า Flow Approve</label>}
                                description={
                                    <label className="value-text">
                                        ตั้งค่าการ Approve CR , Memo
                                    </label>

                                }
                            />
                        </Card>
                    </Col>


                </Row>
            </div>

        </MasterPage>
    )
}