import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { Button, Table, message, Row, Col, Checkbox } from 'antd';
import MasterPage from '../../../MasterPage';
import { LeftCircleOutlined, CheckOutlined, PlusOutlined, StopOutlined } from '@ant-design/icons';
import axios from 'axios';
import _ from "lodash";

const { Column } = Table;

export default function FlowDeploy() {
    const history = useHistory(null);
    const [loading, setLoading] = useState(false);
    const [company, setCompany] = useState([]);
    const [config, setConfig] = useState([]);
    const [filterCompany, setFilterCompany] = useState(null);

    const getData = async () => {
        setLoading(true);
        await axios.get(process.env.REACT_APP_API_URL + "/config/flow/deploy", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
        }).then((res) => {
            setCompany(_.uniqBy(res.data, "Code").map((n, index) => {
                return {
                    key: index,
                    no: index + 1,
                    code: n.Code,
                    company_name: n.FullNameTH
                }
            }));

            setConfig(res.data);
            setLoading(false);

        }).catch((error) => {
            console.log(error.response.data)
        });
    }

    const updateData = async (configId, value) => {
        setLoading(true);
        await axios({
            url: process.env.REACT_APP_API_URL + "/config/flow/deploy",
            method: "PATCH",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                config_id: configId,
                config_value: value
            }
        }).then((res) => {
            message.success({
                content: "เปลียนแปลง ข้อมูลสำเร็จ",
                style: {
                    marginTop: '10vh',
                },
            });
            setLoading(false);
            getData();
        }).catch((error) => {
            console.log(error.response.data)
        });
    }

    const searchCompany = (param) => {
        let result = company.filter(o =>
            Object.keys(o).some(k =>
                String(o[k])
                    .toLowerCase()
                    .includes(param.toLowerCase())
            )
        );
        setFilterCompany(result);
    }

    useEffect(() => {
        getData();

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
                        <h1>ตั้งค่า Flow Deploy</h1>
                    </Col>
                </Row>
                <Table dataSource={company} loading={loading}>
                    <Column title="No" dataIndex="no" />
                    <Column title="Company Code" dataIndex="code" />
                    <Column title="Company Name" dataIndex="company_name" />
                    <Column title="Config By Product"
                        render={(value, record, index) => {
                            return (
                                <>
                                    {
                                        config.filter((x) => x.Code === record.code).map((n, index) => {
                                            return (
                                                <Checkbox checked={n.ConfigValue} onChange={(e) => updateData(n.ConfigId, e.target.checked)}>{n.Product}</Checkbox>
                                            )
                                        })
                                    }
                                </>
                            )
                        }}
                    />
                </Table>


            </div>
        </MasterPage>
    )
}