import React from 'react'
import { List, Avatar, Row, Col } from 'antd';
import moment from 'moment';

export default function Historylog() {
    const data = [
        {
            title: 'Customer created the Issue | ' + moment().format('DD/MM/YYYY, h:mm:ss a'),
            description: ""
        },
        {
            title: 'Customer updated Progress',
            description: "Inprogress >>> Completed"
        },
    ];

    return (
        <List 
            itemLayout="horizontal"
            bordered= {false}
            dataSource={data}
            renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                        title={<a href="https://ant.design">{item.title}</a>}
                        description={item.description}
                    />
                </List.Item>
            )}
        />
    )
}
