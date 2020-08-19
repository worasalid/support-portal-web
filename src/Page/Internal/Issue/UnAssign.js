import 'antd/dist/antd.css';
import { useHistory } from 'react-router-dom';
import React, { Component } from 'react'
import { Table, Tag, Space, Layout, Menu } from 'antd';
import { Row, Col } from 'antd';
import { Button } from 'antd';
import MasterPage from '../MasterPage';

export default function Unassign() {
    const history = useHistory();

    function click(data) {
        console.log(data);
        alert();
    }

    const columns = [
        {
            title: 'Company',
            dataIndex: 'CompanyID',
            key: 'CompanyID',
            // render: text => <a href="http://google.com" target="_blank">{text}</a>,
            render: data => <Button type="link" onClick={() => click()}>{data}</Button>
            // render: data => <Button type="link" onClick={click}>{data}</Button>

        },
        {
            title: 'IssueID',
            dataIndex: 'IssueID',


        },
        {
            title: 'Subject',
            dataIndex: 'Subject',
            width: 500
        },
        {
            title: 'Assign',
            dataIndex: ''
        },

        {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: data => (
                <>
                    {data.map(x => {
                        let color = x.length > 5 ? 'geekblue' : 'green';
                        if (x === 'Cancel') {
                            color = 'volcano';
                        }
                        console.log(x)
                        return (
                            <Tag color={color} key={color}>
                                {x.toUpperCase()}
                            </Tag>

                        );
                    })}
                </>
            ),
        },
        {
            title: 'IssueBy',
            dataIndex: 'IssueBy',
            width: 150
        },
        {
            title: 'IssueDate',
            dataIndex: 'IssueDate'

        }
        
    ];

    const data = [
        {
            key: '1',
            CompanyID: 'ICON',
            IssueID: 'Issue001',
            Subject: 'Subject : แจ้งปัญหา Link Error',
            address: 'New York No. 1 Lake Park',
            tags: ['Open'],
            IssueBy: 'Admin System',
            IssueDate: '04/07/2020',
            Detail: 'รายละเอียดเพิ่มเติม'
        },
        {
            key: '2',
            CompanyID: 'ICON2',
            IssueID: 'Issue002',
            Subject: 'Subject : แจ้งปัญหา บันทึกไม่ได้',
            address: 'London No. 1 Lake Park',
            tags: ['Cancel'],
            IssueBy: 'Admin System',
            IssueDate: '04/07/2020',
            Detail: 'รายละเอียดเพิ่มเติม'
        },
        {
            key: '3',
            CompanyID: 'ICON3',
            IssueID: 'Issue003',
            Subject: 'Subject : แจ้งปัญหา ข้อมูลเบิ้ลซ้ำ',
            address: 'Sidney No. 1 Lake Park',
            tags: ['Open'],
            IssueBy: 'Admin System',
            IssueDate: '04/07/2020',
            Detail: ''
        },
    ];
    return (
        <MasterPage>
            <Row style={{ backgroundColor: "white", fontSize: 30, padding: 20 }}>
                <Col span={24} >
                    <label>UnAssign</label>
                </Col>
            </Row>
            <Row style={{ backgroundColor: "white", padding: 10 }}>
                <Table dataSource={data} columns={columns}
                    expandable={{
                        expandedRowRender: record => <p style={{ margin: 0 }}>{record.Detail}</p>,
                        rowExpandable: record => record.Detail !== "",
                    }}
                />
            </Row>
        </MasterPage>
    )
}