import React, { useReducer, useContext, useEffect } from 'react'
import { PhoneOutlined, DatabaseOutlined, FileOutlined, SendOutlined, BugOutlined, HomeOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row } from 'antd'
import { useHistory } from "react-router-dom";

import MasterPage from "./MasterPage"
import AuthenContext from '../../../utility/authenContext';
import { userReducer, userState } from '../../../utility/reducer';

const { Meta } = Card;

export default function IssueMenu() {
    const history = useHistory();
    const { state, dispatch } = useContext(AuthenContext);
    // console.log(localStorage.getItem("sp-ssid"))
    return (
        <MasterPage>
            <div style={{ padding: 24 }}>
                <div className="sd-page-header">
                    <Row>
                        <Col span={18}>
                            <h3>แจ้งปัญหาการใช้งาน</h3>
                        </Col>
                        <Col span={6} style={{ textAlign: "right" }}>
                            <Button
                                type="link"
                                onClick= {() => history.push({ pathname: "/customer/servicedesk"})}
                            >
                                <HomeOutlined style={{ fontSize: 20 }} /> กลับสู่เมนูหลัก
                            </Button>
                        </Col>
                    </Row>



                    <hr />
                </div>

                <div class="sd-page-topic">
                    <SendOutlined style={{ fontSize: 30 }} />&nbsp;&nbsp;&nbsp;
                <label className="header-text">เลือกประเภทปัญหาการใช้งาน</label>
                </div>
                <Card className="card-box issue-active" bordered hoverable onClick={() => history.push({ pathname: "/customer/servicedesk/issuecreate/1" })}>
                    <Meta
                        avatar={
                            <BugOutlined style={{ fontSize: 30 }} />
                        }
                        title={<label className="card-title-menu">Bug</label>}
                        description="แจ้งปัญหา ที่เกิดจากระบบทำงานผิดผลาด"
                    />
                </Card>
                <Card className="card-box issue-active" hoverable onClick={() => history.push({ pathname: "/customer/servicedesk/issuecreate/2" })}>
                    <Meta
                        avatar={
                            <FileOutlined style={{ fontSize: 30 }} />
                        }
                        title={<label className="card-title-menu">Change Request</label>}
                        description="แจ้งปรับปรุง หรือ เพิ่มเติมการทำงานของระบบ"
                    />
                </Card>
                <Card className="card-box issue-active" hoverable onClick={() => history.push({ pathname: "/customer/servicedesk/issuecreate/3" })}>
                    <Meta
                        avatar={
                            <DatabaseOutlined style={{ fontSize: 30 }} />
                        }
                        title={<label className="card-title-menu">Memo</label>}
                        description="แจ้งปรับปรุงข้อมูลในระบบ"
                    />
                </Card>
                <Card className="card-box issue-active" hoverable onClick={() => history.push({ pathname: "/customer/servicedesk/issuecreate/4" })}>
                    <Meta
                        avatar={
                            <PhoneOutlined style={{ fontSize: 30 }} />
                        }
                        title={<label style={{ color: "rgb(0, 116, 224)" }}>Use</label>}
                        description="สอบถามข้อมูลทั่วไป / การใช้งานระบบ"
                    />
                </Card>
            </div>
        </MasterPage>
    )
}
