import React, { useEffect, useState } from 'react'
import MasterPage from '../MasterPage'
import Axios from 'axios';
import { Button, Table, Modal, message, Tabs, Row, Col, Input } from 'antd';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';
import _ from "lodash";

const { Column } = Table;
const { TabPane } = Tabs;

export default function MapQA() {
    const history = useHistory(null);
    const [tabKey, setTabKey] = useState("1");
    const [loadingHeadQA, setLoaddingHeadQA] = useState(false);
    const [loadingQA, setLoaddingQA] = useState(false)

    // data
    const [headQAList, setHeadQAList] = useState([]);
    const [qalist, setQAlist] = useState([]);
    const [keyword, setKeyword] = useState([]);

    //filter
    const [filterHeadQA, setFilterHeadQA] = useState(null);
    const [filterQA, setFilterQA] = useState(null);

    const GetHeadQA = async () => {
        try {
            const head_qa = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/setting/qa-list",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    position: 0,
                    keyword: keyword
                }
            });

            if (head_qa.status === 200) {
                setHeadQAList(head_qa.data);
                setLoaddingHeadQA(false);

            }
        } catch (error) {

        }

    }

    const GetQA = async () => {
        try {
            const qa = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/setting/qa-list",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    position: 1,
                    keyword: keyword
                }
            });

            if (qa.status === 200) {
                setQAlist(qa.data);
                setLoaddingQA(false);

            }
        } catch (error) {

        }

    }

    const searchHeadQA = (param) => {
        let result = headQAList.filter(o =>
            Object.keys(o).some(k =>
                String(o[k])
                    .toLowerCase()
                    .includes(param.toLowerCase())
            )
        );
        setFilterHeadQA(result);
    }

    const searchQA = (param) => {
        let result = qalist.filter(o =>
            Object.keys(o).some(k =>
                String(o[k])
                    .toLowerCase()
                    .includes(param.toLowerCase())
            )
        );
        setFilterQA(result);
    }

    useEffect(() => {
        if (tabKey === "1" && headQAList.length === 0) {
            setLoaddingHeadQA(true);
            GetHeadQA();
        }
        if (tabKey === "2" && qalist.length === 0) {
            setLoaddingQA(true);
            GetQA();
        }
    }, [tabKey, headQAList.length, qalist.length])


    return (
        <MasterPage>
            <div style={{ padding: "24px 24px 24px 24px" }}>
                <Tabs defaultActiveKey="1" type="card" onChange={(key) => setTabKey(key)}>
                    <TabPane tab="H.QA" key="1">
                        <Row gutter={[16, 16]}>
                            <Col span={16}>
                            </Col>
                            <Col span={8}>
                                <Input.Search placeholder="รหัส / ชื่อ-นามสกุล / ชื่อเล่น" allowClear
                                    enterButton
                                    onSearch={searchHeadQA}
                                />
                            </Col>
                        </Row>
                        <Table
                            dataSource={filterHeadQA === null ? headQAList : filterHeadQA}
                            loading={loadingHeadQA}>
                            <Column title="รหัสพนักงาน" width="10%" dataIndex="Code" />
                            <Column title="ชื่อพนักงาน" width="40%" dataIndex="UserName" />
                            <Column title="ชื่อเล่น" dataIndex="NickName" />
                            <Column title="ตำแหน่ง" dataIndex="PositionName" />

                            <Column title="Site ที่รับผิดชอบ"
                                align="center"
                                width="15%"
                                render={(value, record) => {
                                    return (
                                        <>
                                            <Button type="link"
                                                onClick={() => history.push({ pathname: "/internal/setting/mapqa/siteconfig/userid-" + record.UserId })}
                                            >
                                                <label>{record.SiteOwner}</label>
                                            </Button>
                                        </>
                                    )
                                }}
                            />

                        </Table>
                    </TabPane>
                    <TabPane tab="QA" key="2">
                        <Row gutter={[16, 16]}>
                            <Col span={16}>
                            </Col>
                            <Col span={8}>
                                <Input.Search placeholder="รหัส / ชื่อ-นามสกุล / ชื่อเล่น" allowClear
                                    enterButton
                                    onSearch={searchQA}
                                />
                            </Col>
                        </Row>
                        <Table
                            dataSource={filterQA === null ? qalist : filterQA}
                            loading={loadingQA}>
                            <Column title="รหัสพนักงาน" width="10%" dataIndex="Code" />
                            <Column title="ชื่อพนักงาน" width="40%" dataIndex="UserName" />
                            <Column title="ชื่อเล่น" dataIndex="NickName" />
                            <Column title="ตำแหน่ง" dataIndex="PositionName" />
                            <Column title="Site ที่รับผิดชอบ"
                                align="center"
                                width="15%"
                                render={(value, record) => {
                                    return (
                                        <>
                                            <Button type="link"
                                                onClick={() => history.push({ pathname: "/internal/setting/mapqa/siteconfig/userid-" + record.UserId })}
                                            >
                                                <label>{record.SiteOwner}</label>
                                            </Button>
                                        </>
                                    )
                                }}
                            />
                        </Table>
                    </TabPane>
                </Tabs>
            </div>
        </MasterPage>
    )
}