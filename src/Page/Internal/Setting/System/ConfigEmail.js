import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Button, Table, Row, Col } from 'antd';
import MasterPage from '../../MasterPage';
import { LeftCircleOutlined, CheckOutlined, PlusOutlined, StopOutlined } from '@ant-design/icons';

const { Column } = Table;

export default function ConfigEmail() {
    const history = useHistory(null)
    const dataSource = [
        {
            key: '1',
            topic: "ตั้งค่า Email ในการ ReOpen",
            description: 'ส่งเมล์ กรณีที่มีการ ReOpen เกิน 3 ครั้ง',
            url: "/internal/setting/system/email_config/reopen"
        },
        {
            key: '2',
            topic: "ตั้งค่า Email Patch Update",
            description: 'ส่งเมล์ แจ้งกรณี update patch version',
            url: "/internal/setting/system/email_config/patch"
        }
    ]
    return (
        <MasterPage>
            <Row style={{ padding: "24px 24px 24px 24px" }}>
                <Col>
                    <Button
                        type="link"
                        icon={<LeftCircleOutlined />}
                        style={{ fontSize: 18, padding: 0 }}
                        onClick={() => history.goBack()}
                    >
                        Back
                    </Button>
                </Col>
            </Row>
            <Row style={{ padding: "24px 24px 24px 24px" }}>
                <Col>
                    <h1>ตั้งค่า Email</h1>
                </Col>
            </Row>

            <Table style={{ padding: "24px 24px 24px 24px" }}
                dataSource={dataSource}
            >
                <Column title="No" width="5%" dataIndex="key" />
                <Column title="หัวข้อ" width="45%" dataIndex="topic" />
                <Column title="รายละเอียด" width="40%" dataIndex="description" />
                <Column title="" width="10%"
                    render={(record) => {
                        return (
                            <>
                                <Button onClick={() => history.push({pathname: record.url})} >
                                    view
                                </Button>
                            </>
                        )
                    }}
                />
            </Table>

        </MasterPage>
    )
}