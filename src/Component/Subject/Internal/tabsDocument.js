
import React, { useEffect, useState } from 'react'
import { Button, Modal, Table, Tabs } from 'antd'
import Axios from 'axios'
import { useRouteMatch, useHistory } from 'react-router-dom'
import Column from 'antd/lib/table/Column';
import { DownCircleOutlined, DownloadOutlined, UpCircleOutlined } from '@ant-design/icons';
import moment from "moment"

const { TabPane } = Tabs;

function TabsDocument({ visible = false, onOk, onCancel, details, ...props }) {
    const history = useHistory();
    const match = useRouteMatch();

    //data
    const [listfile, setListfile] = useState([]);

    //div
    const [divcollapse, setDivcollapse] = useState("block")
    const [collapseicon, setCollapseicon] = useState(<DownCircleOutlined style={{ fontSize: 20, color: "#1890ff" }} />)


    const GetDocument = async () => {
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/filedownload",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    refId: details.refId,
                    reftype: details.reftype
                }
            });

            setListfile(result.data)
        } catch (error) {

        }
    }
    useEffect(() => {
        if (details.refId) {
            GetDocument();
        }
    }, [details.refId])

    return (
        <>
            {
                listfile.length !== 0
                    ?
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
                    </>
                    : ""
            }


            <div style={{ display: divcollapse }}>
                {/* UnitTest */}
                <div
                    style={{
                        display: listfile.filter((x) => x.GroupType === "unittest").length !== 0 &&
                            listfile.filter((x) => x.GroupType === "deploy_document").length === 0 &&
                            listfile.filter((x) => x.GroupType === "file_deploy").length === 0 &&
                            listfile.filter((x) => x.GroupType === "test_result_QA").length === 0 &&
                            listfile.filter((x) => x.GroupType === "vdoUpload").length === 0 ? "block" : "none"
                    }}
                >
                    <Tabs defaultActiveKey="1" type="card">
                        <TabPane tab="Unit Test" key="1">
                            <Table dataSource={listfile.filter((x) => x.GroupType === "unittest")} style={{ width: "100%", padding: 0, margin: 0 }} pagination={false}>
                                <Column title="No"
                                    width="5%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label>{index + 1}</label>

                                            </>
                                        )
                                    }
                                    }
                                />
                                {/* <Column title="ไฟล์ Unit Test" width="25%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.FileName}<br />
                                                </label>

                                            </>
                                        )
                                    }
                                    }
                                /> */}
                                <Column title="URL" width="70%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <div className="text-link value-text"
                                                    style={{
                                                        whiteSpace: "nowrap",
                                                        textOverflow: "ellipsis",
                                                        overflow: "hidden",
                                                        width: 500
                                                    }}
                                                >
                                                    <label className="text-link value-text"
                                                        onClick={() => window.open(record.Url, "_blank")}
                                                    >
                                                        {record.Url}
                                                    </label>
                                                </div>
                                            </>
                                        )
                                    }
                                    }
                                />
                                {/* <Column title="FileSize" width="15%" dataIndex="FileSize"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.FileSize}
                                                </label>
                                            </>
                                        )
                                    }
                                    }
                                /> */}
                                <Column title="OwnerName"
                                    width="25%"
                                    align="center"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.OwnerName}<br />
                                                </label>
                                                <label style={{ fontSize: 10, color: "#CCCCCC" }}>
                                                    {moment(record.ModifyDate).format("DD/MM/YYYY HH:mm")}
                                                </label>
                                            </>
                                        )
                                    }
                                    }
                                />
                                {/* <Column title=""
                                    width="3%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <Button type="link"
                                                    onClick={() => window.open(process.env.REACT_APP_FILE_DOWNLOAD_URL + '/' + record.FileId, "_blank")}
                                                >
                                                    {record.FileName === null ? "" : <DownloadOutlined style={{ fontSize: 20, color: "#007bff" }} />}

                                                </Button>

                                            </>
                                        )
                                    }
                                    }
                                /> */}
                            </Table>
                        </TabPane>
                    </Tabs>
                </div>

                {/* UnitTest, DeployDocument, File Deploy */}
                <div
                    style={{
                        display: listfile.filter((x) => x.GroupType === "unittest").length !== 0 &&
                            listfile.filter((x) => x.GroupType === "deploy_document").length !== 0 &&
                            listfile.filter((x) => x.GroupType === "file_deploy").length !== 0 &&
                            listfile.filter((x) => x.GroupType === "test_result_QA").length === 0 &&
                            listfile.filter((x) => x.GroupType === "vdoUpload").length === 0 ? "block" : "none"
                    }}
                >
                    <Tabs defaultActiveKey="1" type="card">
                        <TabPane tab="Unit Test" key="1">
                            <Table dataSource={listfile.filter((x) => x.GroupType === "unittest")} style={{ width: "100%", padding: 0, margin: 0 }} pagination={false}>
                                <Column title="No"
                                    width="5%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label>{index + 1}</label>

                                            </>
                                        )
                                    }
                                    }
                                />
                                {/* <Column title="ไฟล์ Unit Test" width="25%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.FileName}<br />
                                                </label>

                                            </>
                                        )
                                    }
                                    }
                                /> */}
                                <Column title="URL" width="70%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <div className="text-link value-text"
                                                    style={{
                                                        whiteSpace: "nowrap",
                                                        textOverflow: "ellipsis",
                                                        overflow: "hidden",
                                                        width: 500
                                                    }}
                                                >
                                                    <label className="text-link value-text"
                                                        onClick={() => window.open(record.Url, "_blank")}
                                                    >
                                                        {record.Url}
                                                    </label>
                                                </div>
                                            </>
                                        )
                                    }
                                    }
                                />
                                {/* <Column title="FileSize" width="15%" dataIndex="FileSize"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.FileSize}
                                                </label>
                                            </>
                                        )
                                    }
                                    }
                                /> */}
                                <Column title="OwnerName"
                                    width="25%"
                                    align="center"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.OwnerName}<br />
                                                </label>
                                                <label style={{ fontSize: 10, color: "#CCCCCC" }}>
                                                    {moment(record.ModifyDate).format("DD/MM/YYYY HH:mm")}
                                                </label>
                                            </>
                                        )
                                    }
                                    }
                                />
                                {/* <Column title=""
                                    width="3%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <Button type="link"
                                                    onClick={() => window.open(process.env.REACT_APP_FILE_DOWNLOAD_URL + '/' + record.FileId, "_blank")}
                                                >
                                                    {record.FileName === null ? "" : <DownloadOutlined style={{ fontSize: 20, color: "#007bff" }} />}

                                                </Button>

                                            </>
                                        )
                                    }
                                    }
                                /> */}
                            </Table>
                        </TabPane>

                        <TabPane tab="Document Deploy" key="2" >
                            <Table dataSource={listfile.filter((x) => x.GroupType === "deploy_document")} style={{ width: "100%" }} pagination={false}>
                                <Column title="No"
                                    width="5%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label>{index + 1}</label>

                                            </>
                                        )
                                    }
                                    }
                                />
                                {/* <Column title="ชื่อเอกสาร" dataIndex="FileName" width="45%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.FileName}
                                                </label>
                                            </>
                                        )
                                    }
                                    }

                                />
                                <Column title="FileSize" width="15%" dataIndex="FileSize"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.FileSize}
                                                </label>
                                            </>
                                        )
                                    }
                                    }
                                /> */}
                                <Column title="URL" width="70%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <div className="text-link value-text"
                                                    style={{
                                                        whiteSpace: "nowrap",
                                                        textOverflow: "ellipsis",
                                                        overflow: "hidden",
                                                        width: 500
                                                    }}
                                                >
                                                    <label className="text-link value-text"
                                                        onClick={() => window.open(record.Url, "_blank")}
                                                    >
                                                        {record.Url}
                                                    </label>
                                                </div>
                                            </>
                                        )
                                    }
                                    }
                                />
                                <Column title="OwnerName"
                                    align="center"
                                    width="25%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.OwnerName}<br />
                                                </label>
                                                <label style={{ fontSize: 10, color: "#CCCCCC" }}>
                                                    {moment(record.ModifyDate).format("DD/MM/YYYY HH:mm")}
                                                </label>
                                            </>
                                        )
                                    }
                                    }
                                />
                                {/* <Column title=""
                                    width="5%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <Button type="link"
                                                    onClick={() => window.open(process.env.REACT_APP_FILE_DOWNLOAD_URL + '/' + record.FileId, "_blank")}
                                                >
                                                    {record.FileName === null ? "" : <DownloadOutlined style={{ fontSize: 20, color: "#007bff" }} />}

                                                </Button>

                                            </>
                                        )
                                    }
                                    }
                                /> */}
                            </Table>
                        </TabPane>

                        <TabPane tab="File Deploy" key="3" >
                            <Table dataSource={listfile.filter((x) => x.GroupType === "file_deploy")} style={{ width: "100%" }} pagination={false}>
                                <Column title="No"
                                    width="5%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label>{index + 1}</label>

                                            </>
                                        )
                                    }
                                    }
                                />
                                <Column title="FileName" dataIndex="FileName" width="45%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.FileName}
                                                </label>
                                            </>
                                        )
                                    }}
                                />
                                <Column title="FileSize" width="15%" dataIndex="FileSize"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.FileSize}
                                                </label>
                                            </>
                                        )
                                    }}
                                />

                                <Column title="OwnerName"
                                    align="center"
                                    width="25%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.OwnerName}<br />
                                                </label>
                                                <label style={{ fontSize: 10, color: "#CCCCCC" }}>
                                                    {moment(record.ModifyDate).format("DD/MM/YYYY HH:mm")}
                                                </label>
                                            </>
                                        )
                                    }
                                    }
                                />
                                <Column title=""
                                    width="5%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <Button type="link"
                                                    onClick={() => window.open(process.env.REACT_APP_FILE_DOWNLOAD_URL + '/' + record.FileId, "_blank")}
                                                >
                                                    {record.FileName === null ? "" : <DownloadOutlined style={{ fontSize: 20, color: "#007bff" }} />}

                                                </Button>

                                            </>
                                        )
                                    }}
                                />
                            </Table>
                        </TabPane>
                   
                    </Tabs>
                </div>

                {/* UnitTest, DeployDocument, File Deploy,  QA_Document */}
                <div
                    style={{
                        display: listfile.filter((x) => x.GroupType === "unittest").length !== 0 &&
                            listfile.filter((x) => x.GroupType === "deploy_document").length !== 0 &&
                            listfile.filter((x) => x.GroupType === "file_deploy").length !== 0 &&
                            listfile.filter((x) => x.GroupType === "test_result_QA").length !== 0 &&
                            listfile.filter((x) => x.GroupType === "vdoUpload").length === 0 ? "block" : "none"
                    }}
                >
                    <Tabs defaultActiveKey="1" type="card">
                        <TabPane tab="Unit Test" key="1" closable={true}>
                            <Table dataSource={listfile.filter((x) => x.GroupType === "unittest")} style={{ width: "100%", padding: 0, margin: 0 }} pagination={false}>
                                <Column title="No"
                                    width="5%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label>{index + 1}</label>

                                            </>
                                        )
                                    }
                                    }
                                />
                                {/* <Column title="ไฟล์ Unit Test" width="25%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.FileName}<br />
                                                </label>

                                            </>
                                        )
                                    }
                                    }
                                /> */}
                                <Column title="URL" width="70%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <div className="text-link value-text"
                                                    style={{
                                                        whiteSpace: "nowrap",
                                                        textOverflow: "ellipsis",
                                                        overflow: "hidden",
                                                        width: 500
                                                    }}
                                                >
                                                    <label className="text-link value-text"
                                                        onClick={() => window.open(record.Url, "_blank")}
                                                    >
                                                        {record.Url}
                                                    </label>
                                                </div>
                                            </>
                                        )
                                    }
                                    }
                                />
                                {/* <Column title="FileSize" width="15%" dataIndex="FileSize"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.FileSize}
                                                </label>
                                            </>
                                        )
                                    }
                                    }
                                /> */}
                                <Column title="OwnerName"
                                    width="25%"
                                    align="center"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.OwnerName}<br />
                                                </label>
                                                <label style={{ fontSize: 10, color: "#CCCCCC" }}>
                                                    {moment(record.ModifyDate).format("DD/MM/YYYY HH:mm")}
                                                </label>
                                            </>
                                        )
                                    }
                                    }
                                />
                                {/* <Column title=""
                                    width="3%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <Button type="link"
                                                    onClick={() => window.open(process.env.REACT_APP_FILE_DOWNLOAD_URL + '/' + record.FileId, "_blank")}
                                                >
                                                    {record.FileName === null ? "" : <DownloadOutlined style={{ fontSize: 20, color: "#007bff" }} />}

                                                </Button>

                                            </>
                                        )
                                    }
                                    }
                                /> */}
                            </Table>
                        </TabPane>
                        <TabPane tab="Document Deploy" key="2" >
                            <Table dataSource={listfile.filter((x) => x.GroupType === "deploy_document")} style={{ width: "100%" }} pagination={false}>
                                <Column title="No"
                                    width="5%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label>{index + 1}</label>

                                            </>
                                        )
                                    }
                                    }
                                />
                                {/* <Column title="ชื่อเอกสาร" dataIndex="FileName" width="45%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.FileName}
                                                </label>
                                            </>
                                        )
                                    }
                                    }

                                />
                                <Column title="FileSize" width="15%" dataIndex="FileSize"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.FileSize}
                                                </label>
                                            </>
                                        )
                                    }
                                    }
                                /> */}
                                <Column title="URL" width="70%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <div className="text-link value-text"
                                                    style={{
                                                        whiteSpace: "nowrap",
                                                        textOverflow: "ellipsis",
                                                        overflow: "hidden",
                                                        width: 500
                                                    }}
                                                >
                                                    <label className="text-link value-text"
                                                        onClick={() => window.open(record.Url, "_blank")}
                                                    >
                                                        {record.Url}
                                                    </label>
                                                </div>
                                            </>
                                        )
                                    }
                                    }
                                />
                                <Column title="OwnerName"
                                    align="center"
                                    width="25%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.OwnerName}<br />
                                                </label>
                                                <label style={{ fontSize: 10, color: "#CCCCCC" }}>
                                                    {moment(record.ModifyDate).format("DD/MM/YYYY HH:mm")}
                                                </label>
                                            </>
                                        )
                                    }
                                    }
                                />
                                {/* <Column title=""
                                    width="5%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <Button type="link"
                                                    onClick={() => window.open(process.env.REACT_APP_FILE_DOWNLOAD_URL + '/' + record.FileId, "_blank")}
                                                >
                                                    {record.FileName === null ? "" : <DownloadOutlined style={{ fontSize: 20, color: "#007bff" }} />}

                                                </Button>

                                            </>
                                        )
                                    }
                                    }
                                /> */}
                            </Table>
                        </TabPane>
                        <TabPane tab="QA Test Result" key="3">
                            <Table dataSource={listfile.filter((x) => x.GroupType === "test_result_QA")} style={{ width: "100%" }} pagination={false}
                                scroll={{ x: "10vw" }}
                            >
                                <Column title="No"
                                    width="5%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label>{index + 1}</label>

                                            </>
                                        )
                                    }
                                    }
                                />
                                {/* <Column title="ไฟล์ Unit Test" width="25%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.FileName}
                                                </label>
                                                <br />
                                            </>
                                        )
                                    }
                                    }
                                /> */}
                                <Column title="URL" width="70%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <div className="text-link value-text"
                                                    style={{
                                                        whiteSpace: "nowrap",
                                                        textOverflow: "ellipsis",
                                                        overflow: "hidden",
                                                        width: 500
                                                    }}
                                                >
                                                    <label className="text-link value-text"
                                                        onClick={() => window.open(record.Url, "_blank")}
                                                    >
                                                        {record.Url}
                                                    </label>
                                                </div>
                                            </>
                                        )
                                    }
                                    }
                                />
                                {/* <Column title="FileSize" dataIndex="FileSize" width="15%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.FileSize}<br />
                                                </label>
                                            </>
                                        )
                                    }
                                    }
                                /> */}
                                <Column title="OwnerName"
                                    align="center"
                                    width="25%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.OwnerName}<br />
                                                </label>
                                                <label style={{ fontSize: 10, color: "#CCCCCC" }}>
                                                    {moment(record.ModifyDate).format("DD/MM/YYYY HH:mm")}
                                                </label>
                                            </>
                                        )
                                    }
                                    }
                                />
                                {/* <Column title=""
                                    width="5%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <Button type="link"
                                                    onClick={() => window.open(process.env.REACT_APP_FILE_DOWNLOAD_URL + '/' + record.FileId, "_blank")}
                                                >
                                                    {record.FileName === null ? "" : <DownloadOutlined style={{ fontSize: 20, color: "#007bff" }} />}

                                                </Button>

                                            </>
                                        )
                                    }
                                    }
                                /> */}
                            </Table>
                        </TabPane>

                    </Tabs>
                </div>

                {/* UnitTest, DeployDocument, File Deploy, QA_Document, VDO_Upload */}
                <div
                    style={{
                        display: listfile.filter((x) => x.GroupType === "vdoUpload").length !== 0 ? "block" : "none"
                    }}
                >
                    <Tabs defaultActiveKey="1" type="card">
                        <TabPane tab="Unit Test" key="1" closable={true}>
                            <Table dataSource={listfile.filter((x) => x.GroupType === "unittest")} style={{ width: "100%", padding: 0, margin: 0 }} pagination={false}>
                                <Column title="No"
                                    width="5%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label>{index + 1}</label>

                                            </>
                                        )
                                    }
                                    }
                                />
                                {/* <Column title="ไฟล์ Unit Test" width="25%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.FileName}<br />
                                                </label>

                                            </>
                                        )
                                    }
                                    }
                                /> */}
                                <Column title="URL" width="70%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <div className="text-link value-text"
                                                    style={{
                                                        whiteSpace: "nowrap",
                                                        textOverflow: "ellipsis",
                                                        overflow: "hidden",
                                                        width: 500
                                                    }}
                                                >
                                                    <label className="text-link value-text"
                                                        onClick={() => window.open(record.Url, "_blank")}
                                                    >
                                                        {record.Url}
                                                    </label>
                                                </div>
                                            </>
                                        )
                                    }
                                    }
                                />
                                {/* <Column title="FileSize" width="15%" dataIndex="FileSize"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.FileSize}
                                                </label>
                                            </>
                                        )
                                    }
                                    }
                                /> */}
                                <Column title="OwnerName"
                                    width="25%"
                                    align="center"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.OwnerName}<br />
                                                </label>
                                                <label style={{ fontSize: 10, color: "#CCCCCC" }}>
                                                    {moment(record.ModifyDate).format("DD/MM/YYYY HH:mm")}
                                                </label>
                                            </>
                                        )
                                    }
                                    }
                                />
                                {/* <Column title=""
                                    width="3%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <Button type="link"
                                                    onClick={() => window.open(process.env.REACT_APP_FILE_DOWNLOAD_URL + '/' + record.FileId, "_blank")}
                                                >
                                                    {record.FileName === null ? "" : <DownloadOutlined style={{ fontSize: 20, color: "#007bff" }} />}

                                                </Button>

                                            </>
                                        )
                                    }
                                    }
                                /> */}
                            </Table>
                        </TabPane>
                        <TabPane tab="Document Deploy" key="2" >
                            <Table dataSource={listfile.filter((x) => x.GroupType === "deploy_document")} style={{ width: "100%" }} pagination={false}>
                                <Column title="No"
                                    width="5%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label>{index + 1}</label>

                                            </>
                                        )
                                    }
                                    }
                                />
                                {/* <Column title="ชื่อเอกสาร" dataIndex="FileName" width="45%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.FileName}
                                                </label>
                                            </>
                                        )
                                    }
                                    }

                                />
                                <Column title="FileSize" width="15%" dataIndex="FileSize"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.FileSize}
                                                </label>
                                            </>
                                        )
                                    }
                                    }
                                /> */}
                                <Column title="URL" width="70%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <div className="text-link value-text"
                                                    style={{
                                                        whiteSpace: "nowrap",
                                                        textOverflow: "ellipsis",
                                                        overflow: "hidden",
                                                        width: 500
                                                    }}
                                                >
                                                    <label className="text-link value-text"
                                                        onClick={() => window.open(record.Url, "_blank")}
                                                    >
                                                        {record.Url}
                                                    </label>
                                                </div>
                                            </>
                                        )
                                    }
                                    }
                                />
                                <Column title="OwnerName"
                                    align="center"
                                    width="25%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.OwnerName}<br />
                                                </label>
                                                <label style={{ fontSize: 10, color: "#CCCCCC" }}>
                                                    {moment(record.ModifyDate).format("DD/MM/YYYY HH:mm")}
                                                </label>
                                            </>
                                        )
                                    }
                                    }
                                />
                                {/* <Column title=""
                                    width="5%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <Button type="link"
                                                    onClick={() => window.open(process.env.REACT_APP_FILE_DOWNLOAD_URL + '/' + record.FileId, "_blank")}
                                                >
                                                    {record.FileName === null ? "" : <DownloadOutlined style={{ fontSize: 20, color: "#007bff" }} />}

                                                </Button>

                                            </>
                                        )
                                    }
                                    }
                                /> */}
                            </Table>
                        </TabPane>
                        <TabPane tab="QA Test Result" key="3">
                            <Table dataSource={listfile.filter((x) => x.GroupType === "test_result_QA")} style={{ width: "100%" }} pagination={false}
                                scroll={{ x: "10vw" }}
                            >
                                <Column title="No"
                                    width="5%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label>{index + 1}</label>

                                            </>
                                        )
                                    }
                                    }
                                />
                                {/* <Column title="ไฟล์ Unit Test" width="25%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.FileName}
                                                </label>
                                                <br />
                                            </>
                                        )
                                    }
                                    }
                                /> */}
                                <Column title="URL" width="70%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <div className="text-link value-text"
                                                    style={{
                                                        whiteSpace: "nowrap",
                                                        textOverflow: "ellipsis",
                                                        overflow: "hidden",
                                                        width: 500
                                                    }}
                                                >
                                                    <label className="text-link value-text"
                                                        onClick={() => window.open(record.Url, "_blank")}
                                                    >
                                                        {record.Url}
                                                    </label>
                                                </div>
                                            </>
                                        )
                                    }
                                    }
                                />
                                {/* <Column title="FileSize" dataIndex="FileSize" width="15%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.FileSize}<br />
                                                </label>
                                            </>
                                        )
                                    }
                                    }
                                /> */}
                                <Column title="OwnerName"
                                    align="center"
                                    width="25%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.OwnerName}<br />
                                                </label>
                                                <label style={{ fontSize: 10, color: "#CCCCCC" }}>
                                                    {moment(record.ModifyDate).format("DD/MM/YYYY HH:mm")}
                                                </label>
                                            </>
                                        )
                                    }
                                    }
                                />
                                {/* <Column title=""
                                    width="5%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <Button type="link"
                                                    onClick={() => window.open(process.env.REACT_APP_FILE_DOWNLOAD_URL + '/' + record.FileId, "_blank")}
                                                >
                                                    {record.FileName === null ? "" : <DownloadOutlined style={{ fontSize: 20, color: "#007bff" }} />}

                                                </Button>

                                            </>
                                        )
                                    }
                                    }
                                /> */}
                            </Table>
                        </TabPane>
                        <TabPane tab="VDO" key="4">
                            <Table dataSource={listfile.filter((x) => x.GroupType === "vdoUpload")} style={{ width: "100%" }} pagination={false}>
                                <Column title="No"
                                    width="5%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label>{index + 1}</label>

                                            </>
                                        )
                                    }
                                    }
                                />
                                <Column title="URL" width="35%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="text-hover value-text" style={{ padding: 0, color: "#1890ff" }}
                                                    onClick={() => window.open(record.Url, "_blank")}
                                                >
                                                    {record.Url}
                                                </label>
                                            </>
                                        )
                                    }
                                    }
                                />
                                <Column title="Description" dataIndex="Remark" width="30%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.Remark}
                                                </label>
                                            </>
                                        )
                                    }
                                    }
                                />
                                <Column title="OwnerName" align="center" width="20%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.OwnerName}<br />
                                                </label>
                                                <label style={{ fontSize: 10, color: "#CCCCCC" }}>
                                                    {moment(record.ModifyDate).format("DD/MM/YYYY HH:mm")}
                                                </label>
                                            </>
                                        )
                                    }
                                    }
                                />
                            </Table>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </>
    )
}

export default React.memo(TabsDocument)