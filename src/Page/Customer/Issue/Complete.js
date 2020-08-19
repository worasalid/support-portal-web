import 'antd/dist/antd.css';
import { useHistory } from 'react-router-dom';
import React, { Component } from 'react'
import { Table, Tag } from 'antd';
import { Row, Col } from 'antd';
import { Button } from 'antd';
import MasterPage from '../MasterPage'


export default function InProgress() {
    const history = useHistory();

    function Click(data) {
        console.log(data);
    }

    function TagColor (param){
        switch (param) {
            case 'Open':   return 'green' ;
            case 'Cancel':   return 'volcano' ;
  
            default:
                return 'volcano' ;
        }
    }
    

    const columns = [

        {
            title: 'Subject',
            dataIndex: 'Subject',
           
            width: 500,
            render: (text, record) =>
                (
                    <React.Fragment>
                        <Button style={{ margin: 0, padding: 0 }} type="link" onClick={() => history.push({pathname: '/Customer/Issue/Subject/'+ record.IssueID})}> {record.IssueID} - {text} </Button>
                        <br />
                    </React.Fragment>
                    
                )
        },
        {
            title: 'Module',
            dataIndex: 'module',
            align: "center",
           
        },
        {
            title: 'IssueType',
            dataIndex: 'issuetype',
            align: "center",
           
        },
        {
            title: 'AssignTo',
            dataIndex: 'AssignTo',
            align: "center",
           
        },
        {
            title: 'IssueBy',
            align: "center",
            dataIndex: 'IssueBy',
            render: (text, record) =>
                <React.Fragment>
                    <div style={{ textAlign: "center" }}>
                        {record.IssueDate}
                    </div>
                </React.Fragment>
        },
        {
            title: 'ProgressStatus',
            dataIndex: 'ProgressStatus',
            align: "center",
        },
        {
            title: 'DueDate',
            dataIndex: 'DueDate',
            align: "center",
        },
        {
            title: 'OverDue',
            dataIndex: 'OverDue',
            render: (text, record) =>
            (
                record.OverDue > 0 ? <span style={{color:"red",textAlign:"center"}}>{record.OverDue}</span> : ""
            )
           

        },
    ];

    const dataSource = [
        {
            key: '1',
            CompanyID: 'ICON',
            IssueID: 'IssueREM003',
            Subject: 'Subject : แจ้งปัญหา Link Error',
            tags: ['InProgress'],
            product: "REM",
            module: "SaleOrder",
            issuetype: "Bug",
            IssueBy: 'Admin System',
            IssueDate: '04/07/2020',
            Detail: 'รายละเอียดเพิ่มเติม',
            AssignTo: "ICON",
            ProgressStatus: "Complete",
            DueDate: "31/08/2020",
            OverDue: 0
        },
       
    ];
    return (
        <MasterPage>
            <Row style={{ backgroundColor: "white", fontSize: 30, padding: 20 }}>
                <Col span={24} >
                    <label>รายการแจ้งปัญหา</label>
                </Col>
            </Row>
            <Row style={{ backgroundColor: "white", padding: 10 }} >
                <Table dataSource={dataSource} columns={columns}  
                    expandable={{
                        expandedRowRender: record => <p style={{ margin: 0 }}>{record.Detail}</p>,
                        rowExpandable: record => record.Detail !== "",
                    }}
                    style={{textAlign:"center"}}
                />
            </Row>
        </MasterPage>
    )
}
