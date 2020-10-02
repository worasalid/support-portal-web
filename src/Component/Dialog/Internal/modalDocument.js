
import React, { useEffect, useState } from 'react'
import { Button, Modal, Table, Tabs } from 'antd'
import Axios from 'axios'
import { useRouteMatch, useHistory } from 'react-router-dom'
import Column from 'antd/lib/table/Column';
import { DownloadOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

export default function ModalDocument({ visible = false, onOk, onCancel, details, ...props }) {
    const history = useHistory();
    const match = useRouteMatch();
    const [listunittest, setListunittest] = useState([]);
    const [listfiledeploy, setFiledeploy] = useState([]);
    const [listdocument, setDocument] = useState([]);

    const GetUnitTest = async () => {
        try {
            const unittest = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/filedownload",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    refId: details.refId,
                    reftype: details.reftype,
                    grouptype: "unittest"
                }
            });

            setListunittest(unittest.data)
        } catch (error) {

        }
    }

    const GetFileDeploy = async () => {
        try {
            const filedeploy = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/filedownload",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    refId: details.refId,
                    reftype: details.reftype,
                    grouptype: "filedeploy"
                }
            });

            setFiledeploy(filedeploy.data)
        } catch (error) {

        }
    }

    const GetDeployDocument = async () => {
        try {
            const documentdeploy = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/filedownload",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    refId: details.refId,
                    reftype: details.reftype,
                    grouptype: "deploydocument"
                }
            });

            setDocument(documentdeploy.data)
        } catch (error) {

        }
    }

    useEffect(() => {
        GetUnitTest();
        GetFileDeploy();
        GetDeployDocument();
    }, [visible])

    return (
        <Modal
            visible={visible}
            onCancel={onCancel}
            cancelText="Close"
            okButtonProps={{ hidden: true }}
            {...props}
        >

            <Tabs defaultActiveKey="1" type="card">
                <TabPane tab="Unit Test" key="1">
                    <Table dataSource={listunittest}>
                        <Column title="No"
                            render={(value, record, index) => {
                                return (
                                    <>
                                        <label>{index + 1}</label>

                                    </>
                                )
                            }
                            }
                        />
                        <Column title="ไฟล์ Unit Test" dataIndex="FileName" ></Column>
                        <Column title="OwnerName" dataIndex="OwnerName" ></Column>
                        <Column title="วันที่"
                            align="center"
                            render={(value, record, index) => {
                                return (
                                    <>
                                        <label>
                                            {new Date(record.ModifyDate).toLocaleDateString('en-GB')}
                                        </label>
                                    </>
                                )
                            }
                            }
                        />
                        <Column title=""
                            render={(value, record, index) => {
                                return (
                                    <>
                                        <Button type="link"
                                            onClick={() => window.open(process.env.REACT_APP_FILE_DOWNLOAD_URL + '/' + record.FileId, "_blank")}
                                        >
                                            {record.FileId === null ? "" : <DownloadOutlined style={{ fontSize: 20, color: "#007bff" }} />}

                                        </Button>

                                    </>
                                )
                            }
                            }
                        />
                    </Table>
                </TabPane>
                <TabPane tab="File Deploy" key="2">
                    <Table dataSource={listfiledeploy}>
                        <Column title="No"
                            render={(value, record, index) => {
                                return (
                                    <>
                                        <label>{index + 1}</label>

                                    </>
                                )
                            }
                            }
                        />
                        <Column title="ไฟล์ Deploy" dataIndex="FileName" ></Column>
                        <Column title="OwnerName" dataIndex="OwnerName" ></Column>
                        <Column title="วันที่"
                            align="center"
                            render={(value, record, index) => {
                                return (
                                    <>
                                        <label>
                                            {new Date(record.ModifyDate).toLocaleDateString('en-GB')}
                                        </label>
                                    </>
                                )
                            }
                            }
                        />
                        <Column title=""
                            render={(value, record, index) => {
                                return (
                                    <>
                                        <Button type="link"
                                            onClick={() => window.open(process.env.REACT_APP_FILE_DOWNLOAD_URL + '/' + record.FileId, "_blank")}
                                        >
                                            {record.FileId === null ? "" : <DownloadOutlined style={{ fontSize: 20, color: "#007bff" }} />}

                                        </Button>

                                    </>
                                )
                            }
                            }
                        />
                    </Table>
                </TabPane>
                <TabPane tab="Document Deploy" key="3">
                    <Table dataSource={listdocument}>
                        <Column title="No"
                            render={(value, record, index) => {
                                return (
                                    <>
                                        <label>{index + 1}</label>

                                    </>
                                )
                            }
                            }
                        />
                        <Column title="ชื่อเอกสาร" dataIndex="FileName" ></Column>
                        <Column title="OwnerName" dataIndex="OwnerName" ></Column>
                        <Column title="วันที่"
                            align="center"
                            render={(value, record, index) => {
                                return (
                                    <>
                                        <label>
                                            {new Date(record.ModifyDate).toLocaleDateString('en-GB')}
                                        </label>
                                    </>
                                )
                            }
                            }
                        />
                        <Column title=""
                            render={(value, record, index) => {
                                return (
                                    <>
                                        <Button type="link"
                                            onClick={() => window.open(process.env.REACT_APP_FILE_DOWNLOAD_URL + '/' + record.FileId, "_blank")}
                                        >
                                            {record.FileId === null ? "" : <DownloadOutlined style={{ fontSize: 20, color: "#007bff" }} />}

                                        </Button>

                                    </>
                                )
                            }
                            }
                        />
                    </Table>
                </TabPane>
            </Tabs>



        </Modal>
    )
}
