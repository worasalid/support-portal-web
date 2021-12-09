import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Button, Table, Modal, Row, Col, Card } from 'antd';
import MasterPage from '../../MasterPage';
import { LeftCircleOutlined, CheckOutlined, PlusOutlined, StopOutlined } from '@ant-design/icons';

const { Column } = Table;

export default function ConfigFlowApprove() {

    const [addModal, setAddModal] = useState(false);

    const history = useHistory(null)
    useEffect(() => {

    }, [])

    return (
        <MasterPage>
            <div style={{ padding: "24px 24px 24px 24px" }}>
                <Row style={{ marginBottom: 16, textAlign: "left" }} gutter={[16, 16]}>
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
                    &nbsp; &nbsp;

                </Row>
                <Row>
                    <Col>
                        <h1>ตั้งค่า Flow Approve</h1>
                    </Col>
                </Row>
                <Row style={{ marginBottom: 16, textAlign: "right" }} gutter={[16, 16]}>
                    <Col span={24}>
                        <Button type="primary" icon={<PlusOutlined />}
                            style={{ backgroundColor: "#00CC00" }}
                            onClick={() => setAddModal(true)}
                        >
                            เพิ่มข้อมูล
                        </Button>
                    </Col>
                </Row>

                <Table>
                    <Column title="No" width="5%" />
                    <Column title="ผู้อนุมัติ" width="80%" />
                </Table>
            </div>

            <Modal title="เพิ่มข้อมูล ผู้อนุมัติ"
                visible={addModal}
                width={600}
                onCancel={() => setAddModal(false)}
            >

            </Modal>
        </MasterPage>
    )
}