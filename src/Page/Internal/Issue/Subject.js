import React, { useState } from 'react';
import { Row, Col, Layout, Collapse, DatePicker, Select } from 'antd';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { LeftCircleOutlined } from '@ant-design/icons';
import { ArrowLeftCircleFill } from 'react-bootstrap-icons';
import {  Avatar, Form, Button, List, Input, Modal } from 'antd';

import MasterPage from '../MasterPage';
import SubjectDetails from '../../../Component/Subject/SubjectDetail';
import UploadFile from '../../../Component/UploadFile'
import { Editor } from '@tinymce/tinymce-react';
import ModalSupport from '../../../Component/Dialog/Internal/modalSupport'
import Comment from '../../../Component/Comment/Internal/Comment'

const { Option } = Select;

let page = {
    data: {
        PriorityData: [{
            text: "Low",
            id: "Low"
        },
        {
            text: "Medium",
            id: "Medium"
        },
        {
            text: "High",
            id: "High"
        }],
        IssueTypeData: [{
            name: "Bug",
            id: "Bug"
        },
        {
            name: "Data",
            id: "Data"
        },
        {
            name: "Use",
            id: "Use"
        },
        {
            name: "New Requirement",
            id: "New Requirement"
        }
        ],
        AssignTodata: [{
            text: "Worasalid",
            value: "Worasalid"
        },
        {
            text: "Admin",
            value: "Admin"
        },
        {
            text: "Support",
            value: "Support"
        },
        {
            text: "Developer",
            value: "Developer"
        },
        ],
        ProgressStatusData: [
            {
                text: "Send To Dev",
                value: "Send To Dev"
            },
            {
                text: "Resolved",
                value: "Resolved"
            }
        ],
        ModuleData: [{
            text: "CRM",
            value: "CRM"
        },
        {
            text: "Finance",
            value: "Finance"
        },
        {
            text: "SaleOrder",
            value: "SaleOrder"
        },
        {
            text: "Report",
            value: "Report"
        },
        {
            text: "PrintForm",
            value: "PrintForm"
        },
        ]
    },
    loaddata: {
        Priority: [],
        IssueType: [],
        AssignTo: [],
        ProgressStatus: [],
        Module: []
    }
}

export default function Subject() {
    const match = useRouteMatch();
    const history = useHistory();
    const [visible, setVisible] = useState(false);
    const [ProgressStatus, setProgressStatus] = useState("")

    const handleEditorChange = (content, editor) => {
       
    }

    // Binding แบบวนลูปสร้าง html tag ของ dropdownselect 
    // page.data.PriorityData.forEach(x => page.loaddata.Priority.push(<Option value={x.id} >{x.text}</Option>))
    page.loaddata.Priority = page.data.PriorityData.map(x => (<Option value={x.id} >{x.text}</Option>))
    page.loaddata.AssignTo = page.data.AssignTodata.map(x => (<Option value={x.value} >{x.text}</Option>))
    page.loaddata.ProgressStatus = page.data.ProgressStatusData.map(x =>
        (<Option value={x.value} >{x.text}</Option>)
    )


    // Binding แบบ map กำหนดค่าใส่ attribute ของ dropdownselect ได้เลย (ใช้ attribute option={obj})
    // ใส่ obj ที่มีชื่อ name กับ value
    page.loaddata.IssueType = page.data.IssueTypeData.map(x => ({ name: x.name, value: x.id }))
    page.loaddata.Module = page.data.ModuleData.map(x => ({ name: x.text, value: x.value }))


    function HandleChange(value) {
        console.log(`selected ${value}`)
        setProgressStatus(value);
        setVisible(true);
        
    }

    return (
        <MasterPage>
            <div style={{ marginLeft: 0, marginRight: 0, backgroundColor: "white" }}>
                <Row style={{ marginLeft: 50 }}>
                    <Col span={2} onClick={() => history.goBack()}>
                        <a><ArrowLeftCircleFill /> &nbsp;&nbsp;Back</a>
                    </Col>
                </Row>
                <hr style={{ marginLeft: 50, marginRight: 50 }} />
                <Row>
                    {/* Content */}
                    <Col span={16} style={{ backgroundColor: "", height: 500, marginLeft: 50,overflowY:"scroll" }}>
                        <SubjectDetails defaultActiveKey="1" IssueID={match.params.id} />
                        <br/>
                        <b>Comment</b>
                        <hr/>
                        <Comment/>
                    </Col>

                    {/* Content */}

                    {/* SideBar */}
                    <Col span={6} style={{ backgroundColor: "", height: 500,marginLeft:20 }}>
                        <Row style={{ marginBottom: 30 }}>
                            <Col span={18}>
                                ProgressStatus<br />
                                <Select style={{ width: '100%' }} placeholder="None" onChange={HandleChange}>
                                    {page.loaddata.ProgressStatus}
                                </Select>
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: 30 }}>
                            <Col span={18}>
                                Priority<br />
                                <Select style={{ width: '100%' }} placeholder="None">
                                    {page.loaddata.Priority}
                                </Select>
                            </Col>
                        </Row>
       
                        <Row style={{ marginBottom: 30 }}>
                            <Col span={18}>
                                DueDate<br />
                                <DatePicker />
                            </Col>
                        </Row>

                    </Col>
                    {/* SideBar */}
                </Row>
            </div>

            <ModalSupport title={ProgressStatus} visible={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}>

            </ModalSupport>
        </MasterPage>
    )
}
