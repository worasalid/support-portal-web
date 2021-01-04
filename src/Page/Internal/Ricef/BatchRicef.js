import React, { useEffect, useState } from 'react'
import { Table, Button, Row, Col } from 'antd';
import Column from 'antd/lib/table/Column';
import { EditOutlined } from '@ant-design/icons';
import Axios from 'axios'
import MasterPage from '../MasterPage'
import { useRouteMatch } from 'react-router-dom';

export default function BatchRicef({ name, ...props }) {
    const match = useRouteMatch();
    const [company, setCompany] = useState(null);

    const GetCompany = async (value) => {
        try {
            const companyby_id = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/company",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    id: value
                }
            });

            if (companyby_id.status === 200) {
                setCompany(companyby_id.data)
            }


        } catch (error) {

        }
    }

    useEffect(() => {
        GetCompany(match.params.compid)
    }, [])

    console.log("company", company && company[0].Name)

    return (
        <MasterPage>
            <Row>
                <Col span={24}>
                    {/* {company && company[0].Name} */}
                    <label style={{ fontSize: 20, verticalAlign: "top" }}>{company && company[0].FullNameTH}</label>

                </Col>
            </Row>
            <Row style={{marginTop: 40}}>
                <Col span={24}>
                    <Table>
                        <Column title="ลำดับที่" width="10%" dataIndex="" />
                        <Column title="GAP Document" width="10%" dataIndex="" />
                        <Column title="วันที่" width="10%" dataIndex="" />
                    </Table>
                </Col>
            </Row>

        </MasterPage>
    )
}