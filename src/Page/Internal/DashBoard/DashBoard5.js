// Dashboard แบบประเมินความพอใจของลูกค้า
import React, { useEffect, useState } from "react"
import { Row, Col, Card, Spin, Table, Rate, List, Avatar } from 'antd';
import { Pie } from '@ant-design/charts';
import xlsx from 'xlsx';
import Axios from "axios";
import MasterPage from "../MasterPage";
import moment from "moment"

const { Column } = Table;

export default function DashBoard5() {
    const [tableScore, setTableScore] = useState([]);
    const [dataComment, setDataComment] = useState([]);

    const getData = async () => {
        await Axios.get(process.env.REACT_APP_API_URL + "/dashboard/dashboard5", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
        }).then((res) => {
            setTableScore(res.data.chartdata.map((n, index) => ({
                no: index + 1,
                company_name: n.CompanyName,
                company_fullname: n.CompanyFullName,
                quantity: n.Quantity,
                avg_score: n.AVG_Score,
                avg_score2: n.AVG_Score2,
                avg_score3: n.AVG_Score3,
                avg_score4: n.AVG_Score4,
                avg_score5: n.AVG_Score5,
                avg_totalscore: n.AVG_TotalScore
            })));

            setDataComment(res.data.tabledata.map((n, index) => {
                return {
                    no: index,
                    company_name: n.CompanyName,
                    company_fullname: n.CompanyFullName,
                    suggestion: n.Suggestion,
                    createdate: n.CreateDate,
                    username: n.UserName,
                    email: n.Email,
                    avg_totalscore: n.AVG_TotalScore
                }
            }))

        }).catch(() => {

        })
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <MasterPage bgColor="#f0f2f5">
            <Row gutter={16} style={{ padding: "10px 24px 0px 24px" }}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Card
                        className="card-dashboard"
                        title="สรุปคะแนนความพึงพอใจ"
                    >
                        <Row>
                            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                {/* <Card
                                    className="card-dashboard"
                                    title="สรุปคะแนนความพึงพอใจ"
                                > */}

                                <Table dataSource={tableScore}
                                >
                                    <Column title="No" dataIndex="no" />
                                    <Column title="Company" style={{ fontSize: 10, padding: 8 }}
                                        render={(value, record, index) => {
                                            return (
                                                <>
                                                    <label className="table-column-text">{record.company_name}</label>
                                                </>
                                            )
                                        }}
                                    />
                                    <Column title="Quantity"
                                        render={(value, record, index) => {
                                            return (
                                                <>
                                                    <label className="table-column-text">{record.quantity}</label>
                                                </>
                                            )
                                        }}
                                    />
                                    <Column title="Rate"
                                        render={(value, record, index) => {
                                            return (
                                                <>
                                                    <Rate disabled allowHalf defaultValue={record.avg_totalscore} />

                                                </>
                                            )
                                        }}
                                    />
                                    <Column title="Score"
                                        render={(value, record, index) => {
                                            return (
                                                <>
                                                    <label className="table-column-text">{record.avg_totalscore}</label>
                                                </>
                                            )
                                        }}
                                    />
                                </Table>

                                {/* </Card> */}
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} style={{ padding: "10px 24px 0px 24px" }}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Card
                        className="card-dashboard"
                        title="ข้อเสนอแนะ / ความคิดเห็น"
                    >
                        <List
                            itemLayout="horizontal"
                            dataSource={dataComment}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar icon={item.email.substring(0, 1).toLocaleUpperCase()} />}
                                        title={item.username}
                                        description={
                                            <>
                                                <Rate disabled allowHalf defaultValue={item.avg_totalscore} style={{ fontSize: 12 }} /> &nbsp;
                                                {moment(item.createdate).format("DD/MM/YYYY")} <br /><br />
                                                <label>{item.suggestion}</label>
                                            </>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
            </Row>
        </MasterPage>
    )
}