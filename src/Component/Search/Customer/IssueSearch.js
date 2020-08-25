import React from 'react'
import { Row, Col, Input, Button, DatePicker } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

export default function Issuesearch() {
    const { RangePicker } = DatePicker;
    return (
        <>
            <Row style={{ marginBottom: 16, textAlign: "right" }} gutter={[16, 16]}>
                <Col span={8}></Col>
                <Col span={8}>
                    <Input placeholder="Subject" prefix="" suffix={<SearchOutlined />}></Input>
                </Col>
                <Col span={6} className="gutter-row" >
                    <RangePicker format="DD/MM/YYYY" />
                </Col>
                <Col span={2}>
                    <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: "#00CC00" }}  >
                        Search
                    </Button>
                </Col>
            </Row>
        </>
    )
}
