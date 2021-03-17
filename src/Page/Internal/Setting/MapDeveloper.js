import React, { useEffect, useState } from 'react'
import MasterPage from '../MasterPage'
import Axios from 'axios';
import { Button, Table, Modal, message, Tabs, Row, Col, Input } from 'antd';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router';

const { Column } = Table;
const { TabPane } = Tabs;

export default function MapDeveloper() {
    const history = useHistory(null);

    const [tabKey, setTabKey] = useState("1")
    const [loadingHeadDev, setLoadingHeadDev] = useState(false);
    const [loadingDev, setLoadingDev] = useState(false);

    // data
    const [userid, setUserid] = useState(null);
    const [HeadDeveloperList, setHeadDeveloperList] = useState([]);
    const [developerlist, setDeveloperlist] = useState([]);

    // filter
    const [filterHdev, setFilterHdev] = useState(null);
    const [filterDev, setFilterDev] = useState(null);



    const GetHeadDeveloper = async () => {
        try {
            const headdeveloper = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/developer-list",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    position: 0
                    //keyword: keyword
                }
            });

            if (headdeveloper.status === 200) {
                setLoadingHeadDev(false);
                setHeadDeveloperList(headdeveloper.data);

            }
        } catch (error) {

        }

    }

    const GetDeveloper = async () => {
        try {
            const developer = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/developer-list",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    position: 1
                    //keyword: keyword
                }
            });

            if (developer.status === 200) {
                setLoadingDev(false);
                setDeveloperlist(developer.data);

            }
        } catch (error) {

        }

    }

    const Success = () => {
        message.success({
            content: 'บันทึกข้อมูลสำเร็จ',
            className: 'custom-class',
            style: {
                marginTop: '5vh',
            },
        });
    };

    const searchHeadDeveloper = (param) => {
        let result = HeadDeveloperList.filter(o =>
            Object.keys(o).some(k =>
                String(o[k])
                    .toLowerCase()
                    .includes(param.toLowerCase())
            )
        );
        setFilterHdev(result);
    }

    const searchDeveloper = (param) => {
        let result = developerlist.filter(o =>
            Object.keys(o).some(k =>
                String(o[k])
                    .toLowerCase()
                    .includes(param.toLowerCase())
            )
        );
        setFilterDev(result);
    }

    useEffect(() => {
        if (tabKey === "1" && HeadDeveloperList.length === 0) {
            setLoadingHeadDev(true);
            GetHeadDeveloper();
        }
        if (tabKey === "2" && developerlist.length === 0) {
            setLoadingDev(true);
            GetDeveloper();
        }
    }, [tabKey, HeadDeveloperList.length, developerlist.length])


    return (
        <MasterPage>
            <div >
                <Tabs defaultActiveKey="1" type="card" onChange={(key) => setTabKey(key)}>
                    <TabPane tab="H.Developer" key="1">
                        <Row gutter={[16, 16]}>
                            <Col span={16}>
                            </Col>
                            <Col span={8}>
                                <Input.Search placeholder="รหัส / ชื่อ-นามสกุล / ชื่อเล่น" allowClear
                                    enterButton
                                    onSearch={searchHeadDeveloper}
                                />
                            </Col>

                        </Row>
                        <Table
                            dataSource={filterHdev === null ? HeadDeveloperList : filterHdev}
                            loading={loadingHeadDev}
                            pagination={{ pageSize: 6 }}
                        >
                            <Column title="รหัสพนักงาน" width="10%" dataIndex="Code" />
                            <Column title="ชื่อพนักงาน" width="40%" dataIndex="UserName" />
                            <Column title="ชื่อเล่น" dataIndex="NickName" />
                            <Column title="ตำแหน่ง" dataIndex="PositionName" />
                            {/* <Column title="Module ที่ดูแล"
                                align="center"
                                width="15%"
                                render={(record) => {
                                    return (
                                        <>
                                            <Button type="link"
                                                onClick={() => {
                                                    return (
                                                        setVisible(true),
                                                        setUserid(record.UserId),
                                                        setUsername(record.UserName),
                                                        GetDeveloperModule(record.UserId)
                                                    )
                                                }
                                                }
                                            >
                                                <label>View</label>
                                            </Button>
                                        </>
                                    )
                                }
                                }
                            /> */}
                            <Column title="Module ที่รับผิดชอบ"
                                align="center"
                                width="15%"
                                render={(record) => {
                                    return (
                                        <>
                                            <Button type="link"
                                                onClick={() => history.push({ pathname: "/internal/setting/config_developer/userid-" + record.UserId })}
                                            >
                                                <EditOutlined />
                                            </Button>
                                        </>
                                    )
                                }
                                }
                            />

                        </Table>
                    </TabPane>
                    <TabPane tab="Developer" key="2">
                        <Row gutter={[16, 16]}>
                            <Col span={16}>
                            </Col>
                            <Col span={8}>
                                <Input.Search placeholder="รหัส / ชื่อ-นามสกุล / ชื่อเล่น" allowClear
                                    enterButton
                                    onSearch={searchDeveloper}
                                />
                            </Col>
                        </Row>
                        <Table
                            dataSource={filterDev === null ? developerlist : filterDev}
                            pagination={{ pageSize: 6 }}
                            loading={loadingDev}
                        >
                            <Column title="รหัสพนักงาน" width="10%" dataIndex="Code" />
                            <Column title="ชื่อพนักงาน" width="40%" dataIndex="UserName" />
                            <Column title="ชื่อเล่น" dataIndex="NickName" />
                            <Column title="ตำแหน่ง" dataIndex="PositionName" />
                            <Column title="Module ที่รับผิดชอบ"
                                align="center"
                                width="15%"
                                render={(record) => {
                                    return (
                                        <>
                                            <Button type="link"
                                                onClick={() => history.push({ pathname: "/internal/setting/config_developer/userid-" + record.UserId })}
                                            >
                                                <EditOutlined />
                                            </Button>
                                        </>
                                    )
                                }
                                }
                            />
                        </Table>
                    </TabPane>
                </Tabs>

            </div>


        </MasterPage>
    )
}
