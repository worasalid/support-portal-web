import React, { useReducer, useContext, useEffect } from 'react'
import { PhoneOutlined, DatabaseOutlined, FileOutlined, SendOutlined, BugOutlined } from '@ant-design/icons'
import { Card } from 'antd'
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
                    <h3>แจ้งปัญหาการใช้งาน</h3>
                    <hr />
                </div>

                <div class="sd-page-topic">
                    <SendOutlined style={{ fontSize: 30 }} />&nbsp;&nbsp;&nbsp;
                <label className="header-text">เลือกประเภทปัญหาการใช้งาน</label>
                </div>
                <Card className="card-box issue-active" bordered hoverable onClick={() => history.push({ pathname: "/customer/servicedesk/issuecreate/bug" })}>
                    <Meta
                        avatar={
                            <BugOutlined style={{ fontSize: 30 }} />
                        }
                        title={<label className="card-title-menu">Bug</label>}
                        description="แจ้งปัญหา ที่เกิดจากระบบทำงานผิดผลาด"
                    />
                </Card>
                <Card className="card-box issue-active" hoverable onClick={() => history.push({ pathname: "/customer/servicedesk/issuecreate/changerequest" })}>
                    <Meta
                        avatar={
                            <FileOutlined style={{ fontSize: 30 }} />
                        }
                        title={<label className="card-title-menu">Change Request</label>}
                        description="แจ้งปรับปรุง หรือ เพิ่มเติมการทำงานของระบบ"
                    />
                </Card>
                <Card className="card-box issue-active" hoverable onClick={() => history.push({ pathname: "/customer/servicedesk/issuecreate/data" })}>
                    <Meta
                        avatar={
                            <DatabaseOutlined style={{ fontSize: 30 }} />
                        }
                        title={<label className="card-title-menu">Memo</label>}
                        description="แจ้งปรับปรุงข้อมูลในระบบ"
                    />
                </Card>
                <Card className="card-box issue-active" hoverable onClick={() => history.push({ pathname: "/customer/servicedesk/issuecreate/use" })}>
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
