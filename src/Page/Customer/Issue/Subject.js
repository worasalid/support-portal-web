import React, { useState , useEffect } from 'react';
import { Row, Col, Layout, Collapse, DatePicker, Select } from 'antd';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { LeftCircleOutlined } from '@ant-design/icons';

import MasterPage from '../MasterPage';
import SubjectDetails from '../../../Component/Subject/SubjectDetail';
import CommentBox from '../../../Component/Comment/Customer/Comment'
import ModalSendIssue from '../../../Component/Dialog/Customer/modalSendIssue'

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
                text: "Cancel",
                value: "Cancel"
            },
            {
                text: "Complete",
                value: "Complete"
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
    const [Priority,setPriority] = useState("");
    const [DueDate,setDueDate] = useState("");
    const [ProgressStatus, setProgressStatus] = useState("");

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
        setVisible(true);
        setProgressStatus(value);
    }

    return (
        <MasterPage>
            <div style={{ marginLeft: 0, marginRight: 0, backgroundColor: "white" }}>
                <Row style={{ marginLeft: 50 }}>
                    <Col span={2} onClick={() => history.goBack()}>
                        <a>Back</a>
                    </Col>
                </Row>
                <hr style={{ marginLeft: 50, marginRight: 50 }} />
                <Row>
                    {/* Content */}
                    <Col span={16} style={{ backgroundColor: "", height: 500, marginLeft: 50, overflowY:"scroll"}}>
                        <SubjectDetails defaultActiveKey="1" IssueID={match.params.id} />
                        <br/>
                        <b>Comment</b>
                        <hr/>
                        <CommentBox/>
                    </Col>

                    {/* Content */}

                    {/* SideBar */}
                    <Col span={6} style={{ backgroundColor: "", height: 500,marginLeft:20 }}>
                        <Row style={{ marginBottom: 30 }}>
                            <Col span={18}>
                                ProgressStatus<br />
                                <Select  style={{ width: '100%' }} placeholder="None" onChange={HandleChange}>
                                    {page.loaddata.ProgressStatus}
                                </Select>
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: 30 }}>
                            <Col span={18}>
                                Priority<br />
                                <Select style={{ width: '100%' }} placeholder="None" onChange={(value) => {return(setPriority(value))}}>
                                    {page.loaddata.Priority}
                                </Select>
                            </Col>
                        </Row>
                     
                        <Row style={{ marginBottom: 30 }}>
                            <Col span={18}>
                                DueDate<br />
                                <DatePicker onChange={(value,dateString)=> setDueDate(dateString)} />
                            </Col>
                        </Row>

                    </Col>
                    {/* SideBar */}
                </Row>
            </div>

            <ModalSendIssue title={ProgressStatus} visible={visible} onCancel={() => setVisible(false)} onOk={() => { setVisible(false) }} />
        </MasterPage>
    )
}
