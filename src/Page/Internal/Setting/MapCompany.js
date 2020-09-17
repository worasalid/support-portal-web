import { PlusOutlined } from '@ant-design/icons';
import { Button, Table, Modal } from 'antd';
import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import MasterPage from '../MasterPage'

const { Column } = Table;

export default function MapCompany() {
    const [master_company, setMaster_company] = useState([])
    const [supportlist, setSupportlist] = useState([])
    const [companylist, setCompanylist] = useState([])
    const [selectcompanylist, setSelectCompanylist] = useState([])

    const [modaluser_visible, setModaluser_visible] = useState(false);
    const [visible, setVisible] = useState(false);

    const [userdata, setUserdata] = useState();
    const [selectionType, setSelectionType] = useState('checkbox');
    const [loading, setLoading] = useState(false)
    const [binding, setBinding] = useState(false)

    const getCompany = async () => {
        const company = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/loadcompany_byuser",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params:{
                userId: userdata && userdata.userId
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

    const loadsupport = async () => {
        const company_support = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/support-company",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
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
                    company_name: data.CompanyName
                }
            }))
        }
    }

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectCompanylist(selectedRowKeys);
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            
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
                        setBinding(true)
                        setVisible(false)
                    },
                });
            }
        } catch (error) {

        }
    }

    const deletemapping = async (value) => {
        console.log("selectcompanylist",selectcompanylist);
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
            setBinding(true)
        } catch (error) {

        }
    }

    useEffect(() => {
        loadsupport()
    }, [])

    useEffect(() => {
        loadsupport_company();
        getCompany();
    }, [userdata])

    useEffect(() => {
        loadsupport_company();
        loadsupport();
    }, [binding])
    
    return (
        <MasterPage>
            <div>
                <Table dataSource={supportlist} loading={false}
                    // expandable={{
                    //     expandedRowRender: record => <p style={{ margin: 0 }}>{record.username}</p>,
                    //     rowExpandable: record => record.cnt_company !== 0,
                    // }}
                >
                    <Column title="รหัสพนักงาน" dataIndex="code" />
                    <Column title="ชื่อพนักงาน" dataIndex="username" />
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
                                                return (

                                                    setModaluser_visible(true),
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
                                                ""
                                            )
                                        }
                                        }
                                    >
                                        <label>Delete</label>
                                    </Button>
                                </>
                            )
                        }
                        }
                    />

                </Table>
            </div>

            <Modal
                title={userdata && userdata.user_name}
                visible={modaluser_visible}
                style={{ height: 1000 }}
                onCancel={() => setModaluser_visible(false)}
                onOk={() => loadsupport_company()}
                cancelText="Close"
                okButtonProps={{hidden:true}}
            >
                <div>
                    <label
                        onClick={() => setVisible(true)}
                    ><PlusOutlined /> เพิ่มข้อมูล</label>
                </div>
                <Table dataSource={companylist} loading={loading}>
                    <Column title="Code" dataIndex="com_code"></Column>
                    <Column title="CompanyName" dataIndex="company_name"></Column>
                    <Column title=""
                        align="center"
                        width="15%"
                        render={(record) => {
                            return (
                                <>
                                    <Button type="link"
                                        onClick={() => {
                                            return (
                                                setLoading(true),
                                                setTimeout(() => {
                                                    setLoading(false)
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

            <Modal
                title=""
                width="700px"
                visible={visible}
                onCancel={() => setVisible(false)}
                onOk={() => {
                    return (
                        mapping_company(),
                        setTimeout(() => {
                            setBinding(false)
                        },1000)
                        )
                }}
            >
                <Table dataSource={master_company}
                    rowSelection={{
                        type: "checkbox",
                          ...rowSelection,
                    }}
                >
                    <Column title="Code" dataIndex="com_code"></Column>
                    <Column title="CompanyName" dataIndex="company_name"></Column>
                </Table>
            </Modal>
        </MasterPage>
    )
}
