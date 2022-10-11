// Dashboard แบบประเมินความพอใจของลูกค้า
import React, { useEffect, useState } from "react"
import { Row, Col, Card, Input, Rate, List, Avatar, DatePicker } from 'antd';
import xlsx from 'xlsx';
import Axios from "axios";
import MasterPage from "../MasterPage";
import moment from "moment"
import { useHistory } from "react-router-dom";

const { RangePicker } = DatePicker;

export default function DashBoard5() {
    const [loading, setLoading] = useState(false);
    const [dataComment, setDataComment] = useState([]);

    const [selectDate, setSelectDate] = useState([moment('01/01/YYYY', "DD/MM/YYYY"), moment()]);
    const [filterCompany, setFilterCompany] = useState(null);
    const [minRate, setMinRate] = useState(null);
    const [maxRate, setMaxRate] = useState(null);

    const validateNumber = (value, element) => {
        const isDecimal = /^\d*\.?\d*$/;
        if (value === '' || value === '.' || isDecimal.test(value)) {
            if (element === "minRate") {
                value === "" ? setMinRate(null) : setMinRate(value)
            }
            else {
                value === "" ? setMaxRate(null) : setMaxRate(value)
            }
            // element === "minRate" ? setMinRate(value) : setMaxRate(value)
        }
    }

    const searchTicket = (param) => {
        let result = dataComment.filter(o =>
            Object.keys(o).some(k =>
                String(o[k])
                    .toLowerCase()
                    .includes(param.toLowerCase())
            )
        );
        setFilterCompany(result);
    }

    const getData = async () => {
        setLoading(true);
        await Axios({
            method: "POST",
            url: process.env.REACT_APP_API_URL + "/dashboard/dashboard5",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                startdate: (selectDate[0] === undefined || selectDate[0] === "") ? "" : moment(selectDate[0], "DD/MM/YYYY").format("YYYY-MM-DD"),
                enddate: (selectDate[1] === undefined || selectDate[1] === "") ? "" : moment(selectDate[1], "DD/MM/YYYY").format("YYYY-MM-DD"),
                minRate: minRate === null ? 0 : minRate,
                maxRate: maxRate === null ? 0 : maxRate
            }
        }).then((res) => {
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
            }));

            setLoading(false);

        }).catch(() => {
            setLoading(false);
        })
    }

    useEffect(() => {
        getData()
    }, [selectDate[0]])

    return (
        <MasterPage bgColor="#f0f2f5">
            <Row gutter={16} style={{ padding: "10px 24px 0px 24px" }}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Card
                        className="card-dashboard"
                        title={
                            <>
                                <Row>
                                    <Col span={24}>
                                        <label>ข้อเสนอแนะ / ความคิดเห็น</label>
                                    </Col>
                                </Row>
                                <Row style={{ marginTop: "20px" }}>
                                    <Col span={10} style={{ textAlign: "right" }}>
                                        <RangePicker format="DD/MM/YYYY" style={{ width: "80%", marginLeft: "50px", marginRight: "20px" }}
                                            defaultValue={[moment('01/01/YYYY', "DD/MM/YYYY"), moment()]}
                                            onChange={(date, dateString) => setSelectDate(dateString)}
                                        />
                                    </Col>
                                    <Col span={6} style={{ textAlign: "right" }}>
                                        <Input.Group compact>
                                            <Input
                                                allowClear
                                                value={minRate}
                                                style={{
                                                    width: 120,
                                                    textAlign: 'center',
                                                }}
                                                placeholder="Min Rate"
                                                onChange={(e) => validateNumber(e.target.value, "minRate")}
                                            />
                                            <Input
                                                className="site-input-split"
                                                style={{
                                                    width: 30,
                                                    borderLeft: 0,
                                                    borderRight: 0,
                                                    pointerEvents: 'none',
                                                }}
                                                placeholder="-"
                                                disabled
                                            />
                                            <Input.Search
                                                allowClear
                                                value={maxRate}
                                                className="site-input-right"
                                                style={{
                                                    width: 180,
                                                    textAlign: 'center',
                                                    marginRight: "40px"
                                                }}
                                                placeholder="Max Rate"
                                                enterButton
                                                onChange={(e) => validateNumber(e.target.value, "maxRate")}
                                                onSearch={getData}
                                            />
                                        </Input.Group>
                                    </Col>
                                    <Col span={8}>
                                        <Input.Search placeholder="ชื่อบริษัท" allowClear
                                            style={{ width: "100%" }}
                                            enterButton
                                            onSearch={searchTicket}
                                        />
                                    </Col>
                                </Row>
                            </>
                        }

                    >
                        <List
                            loading={loading}
                            itemLayout="horizontal"
                            pagination
                            dataSource={filterCompany !== null ? filterCompany : dataComment}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar icon={item.email.substring(0, 1).toLocaleUpperCase()} />}
                                        title={
                                            <>
                                                <label>{item.username}</label>&nbsp;&nbsp;
                                                <label style={{ color: "gray", fontSize: "12px" }}>{`(${item.company_fullname})`}</label>
                                            </>
                                        }
                                        description={
                                            <>
                                                <Rate disabled allowHalf value={item.avg_totalscore} style={{ fontSize: 12 }} /> &nbsp;
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
            </Row >
        </MasterPage >
    )
}