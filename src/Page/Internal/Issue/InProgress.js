import 'antd/dist/antd.css';
import { useHistory } from 'react-router-dom';
import React, { Component,useState } from 'react'
import { Table, Tag, Space, Layout, Menu, Dropdown } from 'antd';
import { Row, Col } from 'antd';
import { Button } from 'antd';
import MasterPage from '../MasterPage'
import ModalSupport from '../../../Component/Dialog/Internal/modalSupport'

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
    }
}


export default function InProgress() {
    const history = useHistory();
    const [visible, setVisible] = useState(false);

    function click(data) {
        console.log(data);
    }

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
                        <Button style={{ margin: 0, padding: 0 }} type="link" onClick={() => { console.log(record.IssueID); history.push({ pathname: '/Internal/Issue/Subject/' + record.IssueID});}}> {record.IssueID} - {text} </Button>
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
                    <Menu onSelect={x => console.log(x.selectedKeys)} onClick={(x) => { return (setVisible(true)) }}>
                      {page.data.ProgressStatusData.filter(x => x.text !== record.ProgressStatus).map(x =>(<Menu.Item key={x.text}>{x.text}</Menu.Item>) )}

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
            dataIndex: 'DueDate'
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
            tags: ['InProgress'],
            IssueBy: 'Admin System',
            IssueDate: '04/07/2020',
            Detail: 'รายละเอียดเพิ่มเติม',
            AssignTo: "Developer",
            ProgressStatus: "InProgress",
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
            <Row style={{ backgroundColor: "white", padding: 10 }}>
                <Table dataSource={dataSource} columns={columns}
                    expandable={{
                        expandedRowRender: record => <p style={{ margin: 0 }}>{record.Detail}</p>,
                        rowExpandable: record => record.Detail !== "",
                    }}
                />
            </Row>
            <ModalSupport visible={visible} onOk={()=> setVisible(false)} onCancel={()=> setVisible(false)}/>
        </MasterPage>
       
    )
}
