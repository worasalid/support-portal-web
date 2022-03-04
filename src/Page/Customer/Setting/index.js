import React from "react";
import MasterPage from "../MasterPage";
import { Row, Col, Card } from 'antd';
import { useHistory } from 'react-router-dom';


export default function Setting() {
    const { Meta } = Card;
    const history = useHistory(null);

    return (
        <MasterPage bgColor="#f0f2f5">
            <div style={{ padding: "24px 24px 24px 24px" }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={12} lg={8} xl={6}>
                        <Card className="card-box issue-active" bordered hoverable
                            style={{ width: "100%" }}
                            onClick={() => history.push("/customer/system/setting/issue-flow")}
                        >
                            <Meta
                                avatar={
                                    <img
                                        style={{ height: "40px", width: "40px" }}
                                        src={`${process.env.PUBLIC_URL}/icons-email.png`}
                                        alt=""
                                    />
                                }
                                title={<label className="card-title-menu">ตั้งค่าการแจ้ง Issue</label>}
                                description={
                                    <label className="value-text">

                                    </label>
                                }
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        </MasterPage>
    )
}