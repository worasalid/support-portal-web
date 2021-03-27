import React, { useContext } from 'react'
import { Card } from 'antd'
import { useHistory } from "react-router-dom";
import MasterPage from "./MasterPage"
import AuthenContext from '../../../utility/authenContext';
import { HomeOutlined, SendOutlined, CommentOutlined } from '@ant-design/icons';

const { Meta } = Card;

export default function Index() {
    const history = useHistory();
    const { state, dispatch } = useContext(AuthenContext)

    return (
        <MasterPage>
            <div style={{ padding: 24 }}>
                <div className="sd-page-header">
                    <h3>Issue Portal</h3>
                    <hr />
                </div>
                <div className="sd-page-topic">
                    <SendOutlined style={{ fontSize: 30 }} />&nbsp;&nbsp;&nbsp;
                <label className="header-text">Contact us about</label>
                </div>

                <Card className="card-box issue-active" bordered hoverable
                    onClick={() => history.push({ pathname: "/customer/servicedesk/issuemenu" })}>
                    <Meta
                        avatar={
                            <CommentOutlined style={{ fontSize: 30 }} />
                        }
                        title={<label className="card-title-menu">แจ้งปัญหาการใช้งาน</label>}
                        description="แจ้งปัญหาการใช้งาน / สอบถามข้อมูล"
                    />
                </Card>
                <Card className="card-box issue-active" bordered hoverable
                    style={{ marginTop: 30 }}
                    onClick={() => history.push({ pathname: "/customer/dashboard" })}>
                    <Meta
                        avatar={
                            <HomeOutlined style={{ fontSize: 30 }} />
                        }
                        title={<label className="card-title-menu">หน้าหลัก</label>}
                        description="เข้าสู่ หน้าหลัก / Home"
                    />
                </Card>
            </div>
        </MasterPage>
    )
}
