import React, { useEffect, useState } from 'react'
import MasterPage from '../MasterPage'
import Axios from 'axios';
import { Button, Table, Tabs, Row, Col, Input } from 'antd';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';

const { Column } = Table;
const { TabPane } = Tabs;

export default function MapSA() {
    const history = useHistory(null);
    const [loading, setLoading] = useState(false);

    // data
    const [saList, setSaList] = useState([]);
    const [filterSA, setFilterSA] = useState(null);


    const getSA = async () => {
        try {
            const sa = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/setting/sa-list",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    position: 0
                    //keyword: keyword
                }
            });

            if (sa.status === 200) {
                setLoading(false);
                setSaList(sa.data);

            }
        } catch (error) {

        }

    }

    const searchSA = (param) => {
        let result = saList.filter(o =>
            Object.keys(o).some(k =>
                String(o[k])
                    .toLowerCase()
                    .includes(param.toLowerCase())
            )
        );
        setFilterSA(result);
    }

    useEffect(() => {
        setLoading(true);
        getSA();
    }, [])


    return (
        <MasterPage >
            <div style={{ padding: "24px 24px 24px 24px" }}>
                <Row gutter={[16, 16]}>
                    <Col span={16}>
                    </Col>
                    <Col span={8}>
                        <Input.Search placeholder="รหัส / ชื่อ-นามสกุล / ชื่อเล่น" allowClear
                            enterButton
                            onSearch={searchSA}
                        />
                    </Col>
                </Row>
                <Table
                    dataSource={filterSA === null ? saList : filterSA}
                    loading={loading}>

                    <Column title="รหัสพนักงาน" width="10%" dataIndex="Code" />
                    <Column title="ชื่อพนักงาน" width="40%" dataIndex="UserName" />
                    <Column title="ชื่อเล่น" dataIndex="NickName" />
                    <Column title="ตำแหน่ง" dataIndex="PositionName" />

                    <Column title="Product ที่รับผิดชอบ"
                        align="center"
                        width="15%"
                        render={(record) => {
                            return (
                                <>
                                    <Button type="link"
                                        onClick={() => history.push({ pathname: "/internal/setting/config_sa/userid-" + record.UserId })}
                                    >
                                        <EditOutlined />
                                    </Button>
                                </>
                            )
                        }
                        }
                    />

                </Table>
            </div>
        </MasterPage>
    )
}