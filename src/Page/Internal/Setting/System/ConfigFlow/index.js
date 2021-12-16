import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Row, Col, Input, Spin, Table, Button } from 'antd';
import MasterPage from '../../../MasterPage';
import { PieChartOutlined } from '@ant-design/icons';

const { Column } = Table;

export default function ConfigFlow() {

    const [filterFlow, setFilterFlow] = useState(null)
    const history = useHistory(null);
    const flowData =
        [
            {
                no: "1",
                flow_name: "Customer Deploy",
                description: "ตั้งค่าการเปิด/ปิด flow ในการส่งให้ Icon Deploy",
                url: "/internal/setting/system/flow-config/flow-deploy"
            },
            {
                no: "2",
                flow_name: "Flow Approve (CR,Memo)",
                description: "ตั้งค่าการส่ง Approve (CR,Memo)",
                url: "/internal/setting/system/flow-config/flow-approve"
            }
        ]

    const searchFlow = (param) => {
        let result = flowData.filter(o =>
            Object.keys(o).some(k =>
                String(o[k])
                    .toLowerCase()
                    .includes(param.toLowerCase())
            )
        );
        setFilterFlow(result);
    }
    useEffect(() => {

    }, [])

    return (
        <MasterPage>
            <div style={{ padding: "24px 24px 24px 24px" }}>
                <Row gutter={16} style={{ padding: "24px 24px 24px 24px" }}>
                    <Col span={24}>
                        <h1>รายการ Flow</h1>
                    </Col>

                </Row>
                <Row gutter={16} style={{ padding: "10px 24px 24px 24px" }}>
                    <Col span={16}>
                    </Col>
                    <Col span={8}>
                        <Input.Search placeholder="ชื่อ flow , description" allowClear
                            enterButton
                            onSearch={searchFlow}
                        />
                    </Col>
                </Row>
                <Row gutter={16} style={{ padding: "10px 24px 24px 24px" }}>
                    <Col span={24}>
                        <Table dataSource={filterFlow === null ? flowData : filterFlow} >
                            <Column title="No" align="left"
                                width="5%"
                                render={(record, row, index) => {
                                    return (
                                        <label className="table-column-text12">
                                            {record.no}
                                        </label>
                                    )
                                }}
                            />
                            <Column title="Flow Name" align="left"
                                width="35%"
                                render={(record, row, index) => {
                                    return (
                                        <label className="table-column-text12">
                                            {record.flow_name}
                                        </label>
                                    )
                                }}
                            />
                            <Column title="Description" align="left"
                                width="50%"
                                render={(record, row, index) => {
                                    return (
                                        <label className="table-column-text12">
                                            {record.description}
                                        </label>
                                    )
                                }}
                            />
                            <Column align="center"
                                width="10%"
                                render={(record, row, index) => {
                                    return (
                                        <>
                                            <Button type="link" icon={<PieChartOutlined />}
                                                onClick={() => history.push({ pathname: record.url })}
                                            />
                                        </>
                                    )
                                }}
                            />

                        </Table>
                    </Col>
                </Row>
            </div>

        </MasterPage>
    )
}