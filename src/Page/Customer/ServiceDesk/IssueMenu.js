import React, { useReducer, useContext, useEffect, useState } from 'react'
import { PhoneOutlined, DatabaseOutlined, FileOutlined, SendOutlined, BugOutlined, HomeOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row,Typography,List } from 'antd'
import { useHistory } from "react-router-dom";

import MasterPage from "./MasterPage"
import AuthenContext from '../../../utility/authenContext';
import { userReducer, userState } from '../../../utility/reducer';
import Axios from 'axios';


const { Meta } = Card;

export default function IssueMenu() {
    const history = useHistory();
    const { state, dispatch } = useContext(AuthenContext);
    const [issuedata, setIssuedata] = useState([])

    const GetIssueType = async () => {
        try {
            const issuetype = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/issue-types",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                }
            });
            if (issuetype.status === 200) {
                setIssuedata(issuetype.data.map((value) => {
                    return {
                        id: value.Id,
                        name: value.Name,
                        description: value.Description
                    }
                }))
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        GetIssueType();
    }, [])



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
                                onClick={() => history.push({ pathname: "/customer/servicedesk" })}
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

                <List
                    itemLayout="horizontal"
                    dataSource={issuedata}
                    renderItem={item => (
                        <Card className="card-box issue-active" bordered hoverable onClick={() => history.push({ pathname: "/customer/servicedesk/issuecreate/" + item.id })}>
                            <Meta
                                avatar={
                                   
                                    item.name === "Bug" ?  <BugOutlined style={{ fontSize: 30 }} /> :
                                    item.name === "ChangeRequest" ?  <FileOutlined style={{ fontSize: 30 }} /> :
                                    item.name === "Memo" ?  <DatabaseOutlined style={{ fontSize: 30 }} /> : 
                                    item.name === "Use" ?  <PhoneOutlined style={{ fontSize: 30 }} /> : 
                                    item.name === "None" ?  <FileOutlined style={{ fontSize: 30 }} /> : ""
                                   
                                }
                                title={<label className="card-title-menu">{item.name}</label>}
                                description={item.description}
                            />
                        </Card>
                    )}
                />
            </div>
        </MasterPage>
    )
}
