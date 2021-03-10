import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Table, Modal, Checkbox, message, Tabs, Row, Col, Select, Input } from 'antd';
import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router';
//import { useHistory } from 'react-router-dom';
import MasterPage from '../MasterPage'

const { Column } = Table;
const { TabPane } = Tabs;

export default function MapCompany() {
    const history = useHistory(null);
    const [supportlist, setSupportlist] = useState([])
    const [consultList, setConsultList] = useState([])

    const [master_company, setMaster_company] = useState([])
    const [companylist, setCompanylist] = useState([])
    const [selectcompanylist, setSelectCompanylist] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([])

    // Modal
    const [modalCompany_visible, setModalCompany_visible] = useState(false);
    const [modalConfig, setModalConfig] = useState(false);

    const [userdata, setUserdata] = useState();
    const [loadingCompany, setLoadingCompany] = useState(false)
    const [loadingConfig, setLoadingConfig] = useState(false)
    const [binding, setBinding] = useState(true)

    // filter
    const [filterSupport, setFilterSupport] = useState(null);
    const [filterConsult, setFilterConsult] = useState(null);
    const [filterCompany, setFilterCompany] = useState(null);


    const loadsupport = async () => {
        const company_support = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/support-company",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                organize_code: "support",
                keyword: filterSupport
            }
        });

        if (company_support.status === 200) {
            setSupportlist(company_support.data.map((data) => {
                return {
                    key: data.UserId,
                    userId: data.UserId,
                    code: data.Code,
                    username: data.UserName,
                    nickname: data.NickName,
                    cnt_company: data.CntCompany
                }
            }))
        }
    }

    const loadConsult = async () => {
        const consult = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/support-company",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                organize_code: "consult",
                keyword: filterConsult
            }
        });

        if (consult.status === 200) {
            setConsultList(consult.data.map((data) => {
                return {
                    key: data.UserId,
                    userId: data.UserId,
                    code: data.Code,
                    username: data.UserName,
                    nickname: data.NickName,
                    cnt_company: data.CntCompany
                }
            }))
        }
    }

    // Config ราย Site
    const loadsupport_company = async () => {
        const companylistby_id = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/support-companylist",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                userId: userdata && userdata.userId

            }
        });

        if (companylistby_id.status === 200) {
            setCompanylist(companylistby_id.data.map((data) => {
                return {
                    key: data.Id,
                    com_code: data.Code,
                    company_name: data.CompanyName,
                    isreceive: data.IsReceive,
                    isview: data.IsView
                }
            }))
        }
    }

    // โหลดข้อมูล Master บริษัท
    const getCompany = async () => {
        const company = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/loadcompany_byuser",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                userId: userdata && userdata.userId,
                keyword: filterCompany
            }
        });

        if (company.status === 200) {
            setMaster_company(company.data.map((data) => {
                return {
                    key: data.Id,
                    com_code: data.Code,
                    company_name: data.Name
                }
            }));
        }
    }

    const rowSelection = {
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectCompanylist(selectedRowKeys);
            setSelectedRowKeys(selectedRowKeys)
        },
    };

    const mapping_company = async () => {
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/mapping-company",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    userId: userdata && userdata.userId,
                    companyId: selectcompanylist && selectcompanylist
                }
            });

            if (result.status === 200) {
                loadsupport_company()
                Modal.info({
                    title: 'บันทึกข้อมูลเรียบร้อย',
                    content: (
                        <div>
                            <p></p>
                        </div>
                    ),
                    onOk() {
                        // setBinding(true)
                        setTimeout(() => {
                            setBinding(false)
                        }, 1000)
                        setModalConfig(false)
                    },
                });
            }
        } catch (error) {

        }
    }

    const deletemapping = async (value) => {
        console.log("selectcompanylist", selectcompanylist);
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/delete-mapping-company",
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    userId: userdata && userdata.userId,
                    companyId: value
                }
            });
            if (result.status === 200) {
                setBinding(true)
                //message.loading({ content: 'Loading...', duration: 0.5 });
                setTimeout(() => {

                    message.success({ content: 'Success!', duration: 0.5 });
                    loadsupport_company()
                }, 1000);

            }

        } catch (error) {

        }
    }

    const updateConfig = async (value) => {
        try {
            const config = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/update-config-support",
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    userid: userdata && userdata.userId,
                    companyid: value.id,
                    isreceive: value.isreceive,
                    isview: value.isview
                }
            });

            if (config.status === 200) {
                message.loading({ content: 'Loading...', duration: 0.5 });
                setTimeout(() => {

                    message.success({ content: 'Success!', duration: 1 });
                    loadsupport_company()
                }, 1000);

            }
        } catch (error) {

        }
    }

    useEffect(() => {
        loadsupport()
        loadConsult()
    }, [binding])

    useEffect(() => {
        if (modalConfig) {
            loadsupport_company();
        }
    }, [userdata, modalConfig])

    useEffect(() => {
        if (modalCompany_visible) {
            getCompany();
        }
    }, [modalCompany_visible])



    return (
        <MasterPage>
            <>
                <Tabs defaultActiveKey="1" type="card">
                    <TabPane tab="Support Team" key="1">
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                            </Col>
                            <Col span={9}>
                                <Input placeholder="ชื่อ-นามสกุล" allowClear
                                    onKeyDown={(x) => {
                                        if (x.keyCode === 13) {
                                            loadsupport()
                                        }
                                    }}
                                    onChange={(x) => setFilterSupport(x.target.value)} />
                            </Col>
                            <Col span={2}>
                                <Button type="primary" shape="round" icon={<SearchOutlined />}
                                    style={{ backgroundColor: "#00CC00" }}
                                    onClick={() => loadsupport()}
                                >
                                    Search
                                 </Button>
                            </Col>
                        </Row>
                        <Table dataSource={supportlist}
                        // loading={loadingConfig}
                        // expandable={{
                        //     expandedRowRender: record => <p style={{ margin: 0 }}>{record.username}</p>,
                        //     rowExpandable: record => record.cnt_company !== 0,
                        // }}
                        >
                            <Column title="รหัสพนักงาน" dataIndex="code" width="10%" />
                            <Column title="ชื่อพนักงาน" dataIndex="username" />

                            {/* <Column title="จำนวน Site ที่ดูแล"
                                align="center"
                                width="15%"
                                render={(record) => {
                                    return (
                                        <>
                                            <label className="table-column-text"
                                            >
                                                <Button type="link"
                                                    onClick={() => {
                                                        return (

                                                            setModalConfig(true),
                                                            setUserdata({
                                                                userId: record.userId,
                                                                user_name: record.username
                                                            })
                                                        )
                                                    }
                                                    }
                                                >
                                                    {record.cnt_company}
                                                </Button>
                                            </label>
                                        </>
                                    )
                                }

                                }
                            /> */}
                            <Column title="จำนวน Site ที่ดูแล"
                                align="center"
                                width="15%"
                                render={(record) => {
                                    return (
                                        <>
                                            <label className="table-column-text"
                                            >
                                                <Button type="link"
                                                    onClick={() => {
                                                        history.push({ pathname: "/internal/setting/support_site_config/userid-" + record.userId  });

                                                    }
                                                    }
                                                >
                                                    {record.cnt_company}
                                                </Button>
                                            </label>
                                        </>
                                    )
                                }

                                }
                            />
                        </Table>
                    </TabPane>
                    <TabPane tab="Consult Team" key="2">
                        <Row gutter={[16, 16]}>
                            <Col span={12}>
                            </Col>
                            <Col span={9}>
                                <Input placeholder="ชื่อ-นามสกุล" allowClear
                                    onKeyDown={(x) => {
                                        if (x.keyCode === 13) {
                                            loadConsult()
                                        }
                                    }}
                                    onChange={(x) => setFilterConsult(x.target.value)} />
                            </Col>
                            <Col span={2}>
                                <Button type="primary" shape="round" icon={<SearchOutlined />}
                                    style={{ backgroundColor: "#00CC00" }}
                                    onClick={() => loadConsult()}
                                >
                                    Search
                                 </Button>
                            </Col>
                        </Row>
                        <Table dataSource={consultList}>
                            <Column title="รหัสพนักงาน" dataIndex="code" width="10%" />
                            <Column title="ชื่อพนักงาน" dataIndex="username" />

                            {/* <Column title="จำนวน Site ที่ดูแล"
                                align="center"
                                width="15%"
                                render={(record) => {
                                    return (
                                        <>
                                            <label className="table-column-text"
                                            >
                                                <Button type="link"
                                                    onClick={() => {
                                                        return (

                                                            setModalCompany_visible(true),
                                                            setUserdata({
                                                                userId: record.userId,
                                                                user_name: record.username
                                                            })
                                                        )
                                                    }
                                                    }
                                                >
                                                    {record.cnt_company}
                                                </Button>
                                            </label>
                                        </>
                                    )
                                }

                                }
                            /> */}
                            <Column title="จำนวน Site ที่ดูแล"
                                align="center"
                                width="15%"
                                render={(record) => {
                                    return (
                                        <>
                                            <label className="table-column-text"
                                            >
                                                <Button type="link"
                                                    onClick={() => {
                                                        history.push({ pathname: "/internal/setting/support_site_config/userid-" + record.userId  });

                                                    }
                                                    }
                                                >
                                                    {record.cnt_company}
                                                </Button>
                                            </label>
                                        </>
                                    )
                                }

                                }
                            />

                        </Table>
                    </TabPane>
                </Tabs>

                {/* Config */}
                <Modal
                    title={userdata && userdata.user_name}
                    visible={modalConfig}
                    style={{ height: 700 }}
                    width={700}
                    onCancel={() => setModalConfig(false)}
                    onOk={() => loadsupport_company()}
                    cancelText="Close"
                    okButtonProps={{ hidden: true }}
                >
                    <div>

                        <Button type="primary" icon={<PlusOutlined />}
                            style={{ backgroundColor: "#00CC00" }}
                            onClick={() => {
                                // setModalConfig(true);
                                // setLoadingCompany(true);

                                setModalCompany_visible(true)
                                setLoadingCompany(true);
                            }}
                        >
                            เพิ่มข้อมูล
                    </Button>
                    </div>
                    <Table dataSource={companylist}
                    //loading={loadingCompany}

                    >
                        <Column title="Code" dataIndex="com_code"></Column>
                        <Column title="CompanyName" dataIndex="company_name"></Column>
                        <Column title="รับ Issue"
                            align="center"
                            width="15%"
                            render={(record) => {
                                return (
                                    <>
                                        <Checkbox
                                            checked={record.isreceive}
                                            //defaultChecked={record.isreceive}
                                            onChange={(e) => updateConfig({ id: record.key, isreceive: e.target.checked, isview: record.isview })}
                                        />
                                    </>
                                )
                            }

                            }
                        />
                        <Column title="View Issue"
                            align="center"
                            width="15%"
                            render={(record) => {
                                return (
                                    <>
                                        <Checkbox
                                            checked={record.isview}
                                            //defaultChecked={record.isview}
                                            onChange={(e) => updateConfig({ id: record.key, isreceive: record.isreceive, isview: e.target.checked })}
                                        />
                                    </>
                                )
                            }

                            }
                        />
                        <Column title=""
                            align="center"
                            width="15%"
                            render={(record) => {
                                return (
                                    <>
                                        <Button type="link"
                                            onClick={() => {
                                                return (
                                                    // setLoading(true),
                                                    setTimeout(() => {
                                                        // setLoading(false)
                                                        deletemapping(record.key)
                                                        setBinding(false)
                                                    }, 1000)

                                                )
                                            }
                                            }
                                        >
                                            Delete
                                    </Button>
                                    </>
                                )
                            }
                            }
                        />
                    </Table>
                </Modal>

                {/* Master บริษัท */}
                <Modal
                    title="ข้อมูลบริษัท"
                    width="700px"
                    style={{ height: 500 }}
                    visible={modalCompany_visible}
                    onCancel={() => {
                        // setModalConfig(false);
                        setModalCompany_visible(false);
                        setSelectedRowKeys([]);
                    }}
                    onOk={() => {
                        return (
                            mapping_company()

                        )
                    }}
                >
                    <Row style={{ marginBottom: 20 }}>
                        <Col span={8}>
                        </Col>
                        <Col span={12}>
                            <Input placeholder="ชื่อบริษัท" allowClear
                                onKeyDown={(x) => {
                                    if (x.keyCode === 13) {
                                        getCompany()
                                    }
                                }}
                                onChange={(x) => setFilterCompany(x.target.value)}
                            />
                        </Col>
                        <Col span={2}>
                            <Button type="primary" shape="round" icon={<SearchOutlined />}
                                style={{ backgroundColor: "#00CC00", marginLeft: 10 }}
                                onClick={() => getCompany()}
                            >
                                Search
                                 </Button>
                        </Col>
                    </Row>
                    <Table dataSource={master_company}
                        //loading={loadingCompany}
                        //pagination={{ pageSize: 8, total: 100 }}
                        rowSelection={{
                            type: "checkbox",
                            ...rowSelection,
                        }}
                    >
                        <Column title="Code" dataIndex="com_code"></Column>
                        <Column title="CompanyName" dataIndex="company_name"></Column>
                    </Table>
                </Modal>
          
            </>
        </MasterPage>
    )
}
