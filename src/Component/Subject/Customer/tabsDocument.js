
import React, { useEffect, useState } from 'react'
import { Button, Modal, Table, Tabs } from 'antd'
import Axios from 'axios'
import { useRouteMatch, useHistory } from 'react-router-dom'
import Column from 'antd/lib/table/Column';
import { DownCircleOutlined, DownloadOutlined, UpCircleOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;

export default function TabsDocument({ visible = false, onOk, onCancel, details, ...props }) {
    const history = useHistory();
    const match = useRouteMatch();

    //data
    const [listunittest, setListunittest] = useState([]);
    const [listfiledeploy, setFiledeploy] = useState([]);
    const [listdocument, setDocument] = useState([]);
    const [listtestresult, setListtestresult] = useState([]);

    //div
    const [divcollapse, setDivcollapse] = useState("block")
    const [collapseicon, setCollapseicon] = useState(<UpCircleOutlined style={{ fontSize: 20, color: "#1890ff" }} />)

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

    const GetTestResult = async () => {
        try {
            const testresult = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/filedownload",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    refId: details.refId,
                    reftype: details.reftype,
                    grouptype: "testResult"
                }
            });

            setListtestresult(testresult.data)
        } catch (error) {

        }
    }

    useEffect(() => {
        if (details.refId) {
            GetFileDeploy();
            GetDeployDocument();
            GetTestResult();
        }
    }, [details.refId])

    return (
        <>
            <label className="header-text">Document</label>
            <span

                style={{ marginTop: 10, marginLeft: 12, marginRight: 12, cursor: "pointer" }}
                onClick={
                    () => {
                        return (
                            setDivcollapse(divcollapse === 'none' ? 'block' : 'none'),
                            setCollapseicon(divcollapse === 'block' ? <DownCircleOutlined style={{ fontSize: 20, color: "#1890ff" }} /> : <UpCircleOutlined style={{ fontSize: 20, color: "#1890ff" }} />)
                        )
                    }
                }
            >
                {collapseicon}
            </span>


            <div style={{ display: divcollapse }}>
                {
                    listtestresult.length === 0 ? "" :
                        <Tabs defaultActiveKey="1" type="card">
                            <TabPane tab="Test Result" key="1">
                                <Table dataSource={listtestresult} style={{ width: "100%" }} pagination={false}>
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
                            <TabPane tab="Document Deploy" key="2" >
                                <Table dataSource={listdocument} style={{ width: "100%" }} pagination={false}>
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
                }
            </div>
        </>
    )
}
