import React, { useEffect, useState } from 'react'
import { Table, Button, Row, Col, Select } from 'antd';
import Column from 'antd/lib/table/Column';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import Axios from 'axios'
import MasterPage from '../MasterPage'
import { useHistory } from 'react-router-dom';



export default function Ricef() {
    const history = useHistory();

    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(false);
    //data
    const [mastercompany, setMastercompany] = useState([]);
    const [listcompany, setListcompany] = useState([]);
    const [selectcompany, setSelectcompany] = useState(null);

    const GetCompany = async () => {
        try {
            const company_all = await Axios({
                url: process.env.REACT_APP_API_URL + "/ricef/company-ricef",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                }
            });

            if (company_all.status === 200) {
                setMastercompany(company_all.data)
              
            }
        } catch (error) {

        }
    }
    const GetCompanyRicef = async (value) => {
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/ricef/load-company",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    companyid: selectcompany && selectcompany
                }

            });

            if (result.status === 200) {
                setListcompany(result.data)
                setTimeout(() => {
                    setLoading(false)
                }, 500)
            }
        } catch (error) {

        }
    }

    useEffect(() => {
        GetCompany()
    }, [])

    useEffect(() => {
        setTimeout(() => {
            GetCompanyRicef()
            setSearch(false)
        }, 1000)

    }, [search])


    return (
        <MasterPage>
            <Row style={{ marginBottom: 16, textAlign: "left" }} gutter={[16, 16]}>
                <Col span={14}>
                </Col>
                <Col span={8} >
                    <Select placeholder="Company" mode="multiple" allowClear
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        maxTagCount={3}
                        style={{ width: "100%" }}
                        options={mastercompany.map((x) => ({ value: x.Id, label: x.Name, id: x.Id }))}
                        onChange={(value, item) => setSelectcompany(value)}
                    >

                    </Select>
                </Col>
                <Col span={2}>
                    <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: "#00CC00" }}
                        onClick={() => { setSearch(true); setLoading(true) }}
                    >
                        Search
                    </Button>
                </Col>
            </Row>
            <Table dataSource={listcompany} loading={loading}>
                <Column title="Code" width="10%" dataIndex="Code" />
                <Column title="CompanyName" width="15%" dataIndex="Name" />
                <Column title="FullName" width="50%" dataIndex=""
                    render={(record) => {
                        return (
                            <>
                                <label> {record.FullNameTH}</label>  <br />
                                <label className="value-text"> {record.FullNameEN}</label>

                            </>
                        )
                    }}
                />
                <Column title="GAP Documnet" width="15%" dataIndex="" />
                <Column title=""
                    align="center"
                    width="10%"
                    render={(record) => {
                        return (
                            <>
                                <Button type="link"
                                    icon={<EditOutlined />}
                                    onClick={() => {
                                        return (
                                            GetCompany(record.Id),
                                            history.push({ pathname: "/internal/ricef/comp-" + record.Id })
                                        )
                                    }
                                    }
                                >
                                    View
                                    </Button>
                            </>
                        )
                    }
                    }
                />

            </Table>
        </MasterPage>
    )
}
