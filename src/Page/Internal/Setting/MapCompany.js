import { PlusOutlined } from '@ant-design/icons';
import { Button, Table, Modal, Checkbox, message } from 'antd';
import Axios from 'axios';
import React, { useEffect, useState } from 'react'
//import { useHistory } from 'react-router-dom';
import MasterPage from '../MasterPage'

const { Column } = Table;

export default function MapCompany() {
    const [master_company, setMaster_company] = useState([])
    const [supportlist, setSupportlist] = useState([])
    const [companylist, setCompanylist] = useState([])
    const [selectcompanylist, setSelectCompanylist] = useState([])

    // Modal
    const [modalCompany_visible, setModalCompany_visible] = useState(false);
    const [modalConfig, setModalConfig] = useState(false);

    const [userdata, setUserdata] = useState();
    const [loadingCompany, setLoadingCompany] = useState(false)
    const [loadingConfig, setLoadingConfig] = useState(false)
    const [binding, setBinding] = useState(true)


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
                    company_name: data.CompanyName,
                    isreceive: data.IsReceive,
                    isview: data.IsView
                }
            }))
        }
    }

    const getCompany = async () => {
        const company = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/loadcompany_byuser",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
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



    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectCompanylist(selectedRowKeys);
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
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
            setBinding(true)
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
    }, [binding])

    useEffect(() => {
        if (modalConfig || modalCompany_visible) {
            loadsupport_company();
            getCompany();
        }

    }, [userdata, modalConfig, modalCompany_visible])

    // useEffect(() => {
    //     loadsupport_company();
    //     loadsupport();
    // }, [binding])

    return (
        <MasterPage>
            <div>
                <Table dataSource={supportlist}
                // loading={loadingConfig}
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
                visible={modalCompany_visible}
                style={{ height: 700 }}
                width={700}
                onCancel={() => setModalCompany_visible(false)}
                onOk={() => loadsupport_company()}
                cancelText="Close"
                okButtonProps={{ hidden: true }}
            >
                <div>
                    <label
                        onClick={() => { return (setModalConfig(true), setLoadingCompany(true)) }}
                    ><PlusOutlined /> เพิ่มข้อมูล</label>
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

            <Modal
                title="ข้อมูลบริษัท"
                width="700px"
                style={{ height: 500 }}
                visible={modalConfig}
                onCancel={() => setModalConfig(false)}
                onOk={() => {
                    return (
                        mapping_company()

                    )
                }}
            >
                <Table dataSource={master_company} 
                //loading={loadingCompany}
                    pagination={{ pageSize: 8, total: 100 }}
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
