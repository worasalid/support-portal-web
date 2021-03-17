import React, { useEffect, useState } from 'react'
import { useHistory, useRouteMatch } from 'react-router-dom';
import MasterPage from '../MasterPage'
import { Button, Table, Modal, Checkbox, message, Tabs, Row, Col, Input } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import Axios from 'axios';

const { Column } = Table;

export default function CompanySiteConfig() {
    const match = useRouteMatch();
    const history = useHistory(null);

    // data
    const [company, setCompany] = useState([]);
    const [supportSiteOwner, setSupportSiteOwner] = useState([]);

    const getCompany = async (param) => {
        try {
            const company = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/company",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    id: match.params.id
                }
            });

            if (company.status === 200) {
                setCompany(company.data)
            }
        } catch (error) {

        }
    }

    const getSupportSiteOwner = async (param) => {
        try {
            const support = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/setting/support/site-support-byuser",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    company_id: match.params.id
                }
            });

            if (support.status === 200) {
                setSupportSiteOwner(support.data)
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        getCompany();
        getSupportSiteOwner();
    }, [])

    return (
        <MasterPage>
            <Row style={{ marginBottom: 16, textAlign: "left" }} gutter={[16, 16]}>

                <Button type="primary" shape="circle" icon={<ArrowLeftOutlined />}
                    onClick={() => history.goBack()}
                />
              &nbsp; &nbsp;
             <h1>{company[0]?.FullNameTH}</h1>
            </Row>

            <Row style={{ marginTop: 20 }}>
                <Col span={14}>
                    <Table dataSource={supportSiteOwner}>

                        <Column title="ผู้ดูแล Site"
                            render={(record) => {
                                return (
                                    <>
                                        <label className="value-text">
                                            {record.DisplayName}
                                        </label>
                                    </>

                                )
                            }
                            }
                        />
                         <Column title="Product ที่ดูแล"
                            render={(record) => {
                                return (
                                    <>
                                        <label className="value-text">
                                            {record.ProductName}
                                        </label>
                                    </>

                                )
                            }
                            }
                        />

                    </Table>
                </Col>
            </Row>
        </MasterPage>
    )
}