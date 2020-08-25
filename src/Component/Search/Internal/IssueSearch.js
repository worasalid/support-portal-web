import React from 'react'
import { Row, Select, Col, Input, Button, DatePicker } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

export default function IssueSearch() {
    const { RangePicker } = DatePicker;
    return (
        <>
        <Row style={{ marginBottom: 16, marginLeft:30 }} >
        <Col span={24}>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Select placeholder="Company" style={{ width: "100%" }}>
                    </Select>
                </Col>
                <Col span={6}>
                    <Select placeholder="Product" style={{ width: "100%" }}>
                    </Select>
                </Col>
                <Col span={6}>
                    <Input placeholder="Subject" prefix="" suffix={<SearchOutlined />}></Input>
                </Col>
                <Col span={6}>
                    <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: "#00CC00" }}  >
                        Search
                    </Button>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Select placeholder="Module" style={{ width: "100%" }}>
                    </Select>
                </Col>
                <Col span={6} className="gutter-row" >
                    <RangePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
                </Col>
            </Row>
        </Col>
    </Row>
    </>
    )
}
