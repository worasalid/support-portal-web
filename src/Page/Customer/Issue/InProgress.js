import 'antd/dist/antd.css';
import { useHistory } from 'react-router-dom';
import React, { Component, useState, useEffect } from 'react'
import { Table, Dropdown, Menu } from 'antd';
import { Row, Col } from 'antd';
import { Spin, Alert } from 'antd';
import { Button } from 'antd';
import MasterPage from '../MasterPage'
import ModalSendIssue from '../../../Component/Dialog/Customer/modalSendIssue'
import axios from 'axios';


export default function InProgress() {
    const history = useHistory();
    const [visible, setVisible] = useState(false);
    const [loading, setLoadding] = useState(false)
    const [loadticket, setLoadticket] = useState([])
    const [ProgressStatus, setProgressStatus] = useState("");
    let page = {
        data: {
            ProgressStatusData: [
                {
                    text: "InProgress",
                    value: "InProgress"
                },
                {
                    text: "Cancel",
                    value: "Complete"
                },
                {
                    text: "Complete",
                    value: "Complete"
                }
            ]
        },
        loaddata: {
            loadProgressStatus: []
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
                        <Button style={{ margin: 0, padding: 0, textAlign: "left" }} type="link" onClick={() => history.push({ pathname: '/Customer/Issue/Subject/' + record.IssueID + '-' + record.Subject })}> {record.IssueID} - {text} </Button>
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
            title: 'IssueDate',
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
            render: (text, record) =>

                <React.Fragment>
                    <Dropdown
                        placement="topCenter"
                        overlayStyle={{ width: 300, boxShadow: "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.31) 0px 0px 1px" }}
                        overlay={(
                            <Menu onSelect={x => console.log(x.selectedKeys)} onClick={(x) => { return (setVisible(true), setProgressStatus(x.key)) }}>
                                {page.data.ProgressStatusData.filter(x => x.text !== record.ProgressStatus).map(x => (<Menu.Item key={x.text}>{x.text}</Menu.Item >))}

                            </Menu>
                        )} trigger="click" >
                        <Button type="link">
                            {record.ProgressStatus}
                        </Button>
                    </Dropdown>
                </React.Fragment>

        },
        {
            title: 'DueDate',
            dataIndex: 'DueDate',
            align: "center",
        },
        {
            title: 'OverDue',
            dataIndex: 'OverDue',
            align: "center",
            render: (text, record) =>
                (
                    record.OverDue > 0 ? <span style={{ color: "red", textAlign: "center" }}>{record.OverDue}</span> : ""
                )
        },
    ];

    const dataSource = [
        {
            key: '1',
            CompanyID: 'ICON',
            IssueID: 'IssueREM001',
            Subject: 'Subject : แจ้งปัญหา Link Error',
            tags: ['InProgress'],
            product: "REM",
            module: "Finance",
            issuetype: "Bug",
            IssueBy: 'Admin System',
            IssueDate: '04/07/2020',
            Detail: 'รายละเอียดเพิ่มเติม',
            AssignTo: "ICON",
            ProgressStatus: "Waiting for Support",
            DueDate: "31/08/2020",
            OverDue: 0
        },
        {
            key: '2',
            CompanyID: 'ICON',
            IssueID: 'IssueREM002',
            Subject: 'Subject : Error บันทึกข้อมูลไม่ได้',
            tags: ['InProgress'],
            product: "REM",
            module: "CRM",
            issuetype: "Bug",
            IssueBy: 'Admin System',
            IssueDate: '04/07/2020',
            Detail: 'รายละเอียดเพิ่มเติม',
            AssignTo: "ICON",
            ProgressStatus: "InProgress",
            DueDate: "31/08/2020",
            OverDue: 0
        },

    ];

    const loadIssue = () => {
        // setLoadding(true);
        axios({
            url: "http://10.207.0.244/api/tickets",
            method: "GET",
            headers: {
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IuC4p-C4o-C4quC4pOC4qeC4juC4tOC5jCDguIjguLjguYnguKLguYDguIjguKPguLTguI0iLCJuYW1laWQiOiIxNiIsIlVzZXJJZCI6IjE2IiwibmJmIjoxNTk3Mjg4MDMxLCJleHAiOjE1OTc4OTI4MzEsImlhdCI6MTU5NzI4ODAzMX0.MORhQP-p0LsM-sPNGwG8IvCDjQWjwWNvZrPetejl6Dg"
            }
        }).then(res => {
            setLoadding(false);
            setLoadticket(res.data);
        }).catch(err => {
            setLoadding(false);
        });

    };
    useEffect(() => {
        loadIssue()
    }, []);



    return (
        <MasterPage>
            {/* <Spin spinning={loading} tip="Loading..."> */}
            <Row style={{ backgroundColor: "white", fontSize: 30, padding: 20 }}>
                <Col span={12} >
                    <label>รายการแจ้งปัญหา</label>
                </Col>
            </Row>
            <Row style={{ backgroundColor: "white", padding: 10 }}>
                <Table dataSource={dataSource} columns={columns} loading={loading}
                    expandable={{
                        expandedRowRender: record => <p style={{ margin: 0 }}>{record.Detail}</p>,
                        rowExpandable: record => record.Detail !== "",
                    }}
                />
            </Row>
            <ModalSendIssue title={ProgressStatus} visible={visible} onCancel={() => setVisible(false)} onOk={() => { setVisible(false); loadIssue() }} />
            {/* </Spin> */}
        </MasterPage>
    )
}
