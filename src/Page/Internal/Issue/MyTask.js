import 'antd/dist/antd.css';
import { useHistory, useRouteMatch } from 'react-router-dom';
import React, { Component } from 'react'
import { Table, Tag, Menu, Dropdown, Input, DatePicker, Select,Button } from 'antd';
import { Row, Col } from 'antd';
import MasterPage from '../MasterPage';
import IssueSearch from "../../../Component/Search/Internal/IssueSearch";
import { useState } from 'react';
import ModalSupport from '../../../Component/Dialog/Internal/modalSupport'
import { SearchOutlined } from '@ant-design/icons';

let page = {
    data: {
        ProgressStatusData: [
            {
                text: "Send To Dev",
                value: "Send To Dev"
            },
            {
                text: "Resolved",
                value: "Resolved"
            }
        ]
    }
}


export default function MyTask() {
    const match = useRouteMatch();
    const { RangePicker } = DatePicker;
    const history = useHistory();
    const [visible, setVisible] = useState(false);
    const [ProgressStatus, setProgressStatus] = useState("");

    // function click(data) {
    //     console.log(data);
    // }

    function TagColor(param) {
        switch (param) {
            case 'Open': return 'green';
            case 'Cancel': return 'volcano';

            default:
                return 'volcano';
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
                        <Button style={{ margin: 0, padding: 0 }} type="link"
                            onClick={() => history.push({ pathname: '/Internal/Issue/Subject/' + record.IssueID })}
                        >
                            {record.IssueID} - {text} </Button>
                        <br />
                        <Tag color="#87d068">{record.CompanyID}</Tag>
                        <Tag color={TagColor(record.tags)}>{record.tags}</Tag>
                    </React.Fragment>
                )
        },
        {
            title: 'AssignTo',
            dataIndex: 'AssignTo'
        },
        {
            title: 'IssueBy',
            dataIndex: 'IssueBy',
            render: (text, record) =>
                <React.Fragment>
                    <div style={{ textAlign: "center" }}>
                        {text}<br />{record.IssueDate}
                    </div>
                </React.Fragment>
        },
        {
            title: 'ProgressStatus',
            dataIndex: 'ProgressStatus',
            render: (text, record) =>
                <React.Fragment>
                    <Dropdown
                        placement="topCenter"
                        overlayStyle={{ width: 300, boxShadow: "rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.31) 0px 0px 1px" }}
                        overlay={(
                            <Menu onSelect={x => console.log(x.selectedKeys)} onClick={(x) => { return (setVisible(true), setProgressStatus(x.key)) }}>
                                {page.data.ProgressStatusData.filter(x => x.text !== record.ProgressStatus).map(x => (<Menu.Item key={x.text}>{x.text}</Menu.Item>))}

                            </Menu>
                        )} trigger="click" >
                        <Button type="link">
                            {record.ProgressStatus}
                        </Button>
                    </Dropdown>
                </React.Fragment>

        },
        {
            title: 'OverDue',
            dataIndex: 'OverDue',
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
            IssueID: 'Issue001',
            Subject: 'Subject : แจ้งปัญหา Link Error',
            tags: ['Open'],
            IssueBy: 'Admin System',
            IssueDate: '04/07/2020',
            Detail: 'รายละเอียดเพิ่มเติม',
            AssignTo: "Support",
            ProgressStatus: "Waiting For Support",
            OverDue: 0
        },
        {
            key: '2',
            CompanyID: 'ICON2',
            IssueID: 'Issue002',
            Subject: 'Subject : แจ้งปัญหา บันทึกไม่ได้',
            tags: ['Cancel'],
            IssueBy: 'Admin System',
            IssueDate: '04/07/2020',
            Detail: 'รายละเอียดเพิ่มเติม',
            AssignTo: "Support",
            ProgressStatus: "Waiting For Support",
            OverDue: 0
        },
        {
            key: '3',
            CompanyID: 'ICON3',
            IssueID: 'Issue003',
            Subject: 'Subject : แจ้งปัญหา ข้อมูลเบิ้ลซ้ำ',
            tags: ['Open'],
            IssueBy: 'Admin System',
            IssueDate: '04/07/2020',
            Detail: '',
            AssignTo: "Support",
            ProgressStatus: "Waiting For Support",
            OverDue: 0
        },
    ];
    return (
        <MasterPage>
            <Row style={{ marginBottom: 16, textAlign: "left" }}>
                <Col span={24}>
                    <label style={{ fontSize: 20, verticalAlign: "top" }}>รายการแจ้งปัญหา</label>
                </Col>
            </Row>
           <IssueSearch/>
            <Row style={{ backgroundColor: "white", padding: 10 }}>
                <Col span={24}>
                    <Table dataSource={dataSource} columns={columns}
                        expandable={{
                            expandedRowRender: record => <p style={{ margin: 0 }}>{record.Detail}</p>,
                            rowExpandable: record => record.Detail !== "",
                        }}
                    />
                </Col>
            </Row>
            <ModalSupport title={ProgressStatus} visible={visible} onOk={() => setVisible(false)} onCancel={() => setVisible(false)} />
        </MasterPage>
    )
}
