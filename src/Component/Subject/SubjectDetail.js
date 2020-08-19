import React, { useState } from 'react';
import { useHistory,useRouteMatch } from 'react-router-dom';
import { PageHeader, Breadcrumb, Row, Col, Layout, Collapse, DatePicker, Select } from 'antd';
import CommentBox from '../Comment'

const { Panel } = Collapse;

export default function SubjectDetail(props) {
    return (
        <div>
            <h1 style={{ fontSize: 20 }}>{props.IssueID}</h1>
            <Collapse accordion style={{ marginLeft: 0, marginRight: 50 }} defaultActiveKey={props.defaultActiveKey}>
                <Panel header="รายละเอียด" key="1" style={{ borderTop: "0px solid" }}>
                    <p>TEST </p>
                    <p>TEST </p>
                </Panel>
            </Collapse>
            <br/>

        </div>
    )
}
