
import React, { useEffect, useState } from 'react'
import { Button, Table, Tabs } from 'antd'
import Axios from 'axios'
//import { useRouteMatch, useHistory } from 'react-router-dom'
import Column from 'antd/lib/table/Column';
import { DownCircleOutlined, DownloadOutlined, UpCircleOutlined } from '@ant-design/icons';
import moment from "moment"

const { TabPane } = Tabs;

export default function TabsDocument({ visible = false, onOk, onCancel, details, ...props }) {
    //const history = useHistory();
    //const match = useRouteMatch();

    //data

    const [listfile, setListfile] = useState([]);

    //div
    const [divcollapse, setDivcollapse] = useState("block")
    const [collapseicon, setCollapseicon] = useState(<UpCircleOutlined style={{ fontSize: 20, color: "#1890ff" }} />)


    const GetDocument = async () => {
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/issue-document",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    refId: details.refId,
                    //reftype: details.reftype
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
                // listfile.length !== 0
                listfile.filter((x) => x.GroupType === "quotation" || x.GroupType === "testResult").length !== 0
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
                {/* ใบเสนอราคา */}
                <div
                    style={{
                        display: listfile.filter((x) => x.GroupType === "quotation").length !== 0 &&
                            listfile.filter((x) => x.GroupType !== "quotation").length === 0 ? "block" : "none"
                    }}
                >
                    <Tabs defaultActiveKey="1" type="card">
                        <TabPane tab="ใบเสนอราคา" key="1">
                            <Table dataSource={listfile.filter((x) => x.GroupType === "quotation")} style={{ width: "100%" }} pagination={false}>
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
                                <Column title="ชื่อเอกสาร" dataIndex="FileName" width="45%"></Column>
                                <Column title="FileSize" dataIndex="FileSize" width="15%"></Column>
                                <Column title="OwnerName" dataIndex="OwnerName" width="20%"></Column>
                                <Column title="วันที่"
                                    align="center"
                                    width="10%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label>
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
                </div>

                {/* ใบ PO */}
                <div
                    style={{
                        display: listfile.filter((x) => x.GroupType === "PO_Document").length !== 0 &&
                            listfile.filter((x) => x.GroupType === "testResult").length === 0 ? "block" : "none"
                    }}
                >
                    <Tabs defaultActiveKey="1" type="card">
                        <TabPane tab="ใบเสนอราคา" key="1">
                            <Table dataSource={listfile.filter((x) => x.GroupType === "quotation")} style={{ width: "100%" }} pagination={false}>
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
                                <Column title="ชื่อเอกสาร" dataIndex="FileName" width="45%"></Column>
                                <Column title="FileSize" dataIndex="FileSize" width="15%"></Column>
                                <Column title="OwnerName" dataIndex="OwnerName" width="20%"></Column>
                                <Column title="วันที่"
                                    align="center"
                                    width="10%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label>
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
                                                    {record.FileId === null ? "" : <DownloadOutlined style={{ fontSize: 20, color: "#007bff" }} />}

                                                </Button>

                                            </>
                                        )
                                    }
                                    }
                                />
                            </Table>
                        </TabPane>
                        <TabPane tab="เอกสาร PO" key="2">
                            <Table dataSource={listfile.filter((x) => x.GroupType === "PO_Document")} style={{ width: "100%" }} pagination={false}>
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
                                <Column title="ชื่อเอกสาร" dataIndex="FileName" width="45%"></Column>
                                <Column title="FileSize" dataIndex="FileSize" width="15%"></Column>
                                <Column title="OwnerName" dataIndex="OwnerName" width="20%"></Column>
                                <Column title="วันที่"
                                    align="center"
                                    width="10%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label>
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
                </div>


                {/* ใบเสนอราคา , testResult */}
                <div
                    style={{
                        display: listfile.filter((x) => x.GroupType === "quotation").length !== 0
                            && listfile.filter((x) => x.GroupType === "testResult").length !== 0 ? "block" : "none"
                    }}
                >
                    <Tabs defaultActiveKey="1" type="card">
                        <TabPane tab="ใบเสนอราคา" key="1">
                            <Table dataSource={listfile.filter((x) => x.GroupType === "quotation")} style={{ width: "100%" }} pagination={false}>
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
                                <Column title="ชื่อเอกสาร" dataIndex="FileName" width="45%"></Column>
                                <Column title="FileSize" dataIndex="FileSize" width="15%"></Column>
                                <Column title="OwnerName" dataIndex="OwnerName" width="20%"></Column>
                                <Column title="วันที่"
                                    align="center"
                                    width="10%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label>
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
                                                    {record.FileId === null ? "" : <DownloadOutlined style={{ fontSize: 20, color: "#007bff" }} />}

                                                </Button>

                                            </>
                                        )
                                    }
                                    }
                                />
                            </Table>
                        </TabPane>
                        <TabPane tab="เอกสาร PO" key="2">
                            <Table dataSource={listfile.filter((x) => x.GroupType === "PO_Document")} style={{ width: "100%" }} pagination={false}>
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
                                <Column title="ชื่อเอกสาร" dataIndex="FileName" width="45%"></Column>
                                <Column title="FileSize" dataIndex="FileSize" width="15%"></Column>
                                <Column title="OwnerName" dataIndex="OwnerName" width="20%"></Column>
                                <Column title="วันที่"
                                    align="center"
                                    width="10%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label>
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
                                                    {record.FileId === null ? "" : <DownloadOutlined style={{ fontSize: 20, color: "#007bff" }} />}

                                                </Button>

                                            </>
                                        )
                                    }
                                    }
                                />
                            </Table>
                        </TabPane>
                        <TabPane tab="Test Result" key="3">
                            <Table dataSource={listfile.filter((x) => x.GroupType === "testResult")} style={{ width: "100%" }} pagination={false}>
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
                                <Column title="ชื่อเอกสาร" dataIndex="FileName" width="45%"></Column>
                                <Column title="FileSize" dataIndex="FileSize" width="15%"></Column>
                                <Column title="OwnerName" dataIndex="OwnerName" width="20%"></Column>
                                <Column title="วันที่"
                                    align="center"
                                    width="10%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label>
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
                                                    {record.FileId === null ? "" : <DownloadOutlined style={{ fontSize: 20, color: "#007bff" }} />}

                                                </Button>

                                            </>
                                        )
                                    }
                                    }
                                />
                            </Table>
                        </TabPane>
                        <TabPane tab="Document Deploy" key="4" >
                            <Table dataSource={listfile.filter((x) => x.GroupType === "deploydocument")} style={{ width: "100%" }} pagination={false}>
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
                                <Column title="ชื่อเอกสาร" dataIndex="FileName" width="45%"></Column>
                                <Column title="FileSize" dataIndex="FileSize" width="15%"></Column>
                                <Column title="OwnerName" dataIndex="OwnerName" width="20%"></Column>
                                <Column title="วันที่"
                                    align="center"
                                    width="10%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label>
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
                </div>

                {/* ใบเสนอราคา , testResult, VDO */}
                <div
                    style={{
                        display: listfile.filter((x) => x.GroupType === "quotation" && x.GroupType === "testResult" && x.GroupType === "vdoUpload").length !== 0 ? "block" : "none"
                    }}
                >
                    <Tabs defaultActiveKey="1" type="card">
                        <TabPane tab="ใบเสนอราคา" key="1">
                            <Table dataSource={listfile.filter((x) => x.GroupType === "quotation")} style={{ width: "100%" }} pagination={false}>
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
                                <Column title="ชื่อเอกสาร" dataIndex="FileName" width="45%"></Column>
                                <Column title="FileSize" dataIndex="FileSize" width="15%"></Column>
                                <Column title="OwnerName" dataIndex="OwnerName" width="20%"></Column>
                                <Column title="วันที่"
                                    align="center"
                                    width="10%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label>
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
                                                    {record.FileId === null ? "" : <DownloadOutlined style={{ fontSize: 20, color: "#007bff" }} />}

                                                </Button>

                                            </>
                                        )
                                    }
                                    }
                                />
                            </Table>
                        </TabPane>
                        <TabPane tab="Test Result" key="2">
                            <Table dataSource={listfile.filter((x) => x.GroupType === "testResult")} style={{ width: "100%" }} pagination={false}>
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
                                <Column title="ชื่อเอกสาร" dataIndex="FileName" width="45%"></Column>
                                <Column title="FileSize" dataIndex="FileSize" width="15%"></Column>
                                <Column title="OwnerName" dataIndex="OwnerName" width="20%"></Column>
                                <Column title="วันที่"
                                    align="center"
                                    width="10%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label>
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
                                                    {record.FileId === null ? "" : <DownloadOutlined style={{ fontSize: 20, color: "#007bff" }} />}

                                                </Button>

                                            </>
                                        )
                                    }
                                    }
                                />
                            </Table>
                        </TabPane>
                        <TabPane tab="Document Deploy" key="3" >
                            <Table dataSource={listfile.filter((x) => x.GroupType === "deploydocument")} style={{ width: "100%" }} pagination={false}>
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
                                <Column title="ชื่อเอกสาร" dataIndex="FileName" width="45%"></Column>
                                <Column title="FileSize" dataIndex="FileSize" width="15%"></Column>
                                <Column title="OwnerName" dataIndex="OwnerName" width="20%"></Column>
                                <Column title="วันที่"
                                    align="center"
                                    width="10%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label>
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
                                                    {record.FileId === null ? "" : <DownloadOutlined style={{ fontSize: 20, color: "#007bff" }} />}

                                                </Button>

                                            </>
                                        )
                                    }
                                    }
                                />
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
                                <Column title="URL" width="55%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="text-hover" style={{ padding: 0, color: "#1890ff" }}
                                                    onClick={() => window.open(record.Url, "_blank")}
                                                >
                                                    {record.Url}
                                                </label>
                                            </>
                                        )
                                    }
                                    }
                                />
                                <Column title="Description" dataIndex="Remark" width="30%"></Column>
                                <Column title="วันที่"
                                    align="center"
                                    width="10%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label>
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

                {/*testResult */}
                <div
                    style={{
                        display: (listfile.filter((x) => x.GroupType === "quotation").length === 0)
                            && (listfile.filter((x) => x.GroupType === "testResult").length !== 0)
                            && (listfile.filter((x) => x.GroupType === "vdoUpload").length === 0) ? "block" : "none"

                    }}
                >
                    <Tabs defaultActiveKey="1" type="card">
                        <TabPane tab="Test Result" key="1">
                            <Table dataSource={listfile.filter((x) => x.GroupType === "testResult")} style={{ width: "100%" }} pagination={false}>
                                <Column title="No"
                                    width="5%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">{index + 1}</label>

                                            </>
                                        )
                                    }
                                    }
                                />
                                <Column title="ชื่อเอกสาร" dataIndex="FileName" width="45%"
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
                                />
                                <Column title="FileSize" dataIndex="FileSize" width="15%"
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
                                />
                                <Column title="OwnerName"
                                    align="center"
                                    width="20%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.OwnerName}<br />
                                                </label>
                                                <label className="value-text">
                                                    {moment(record.ModifyDate).format("DD/MM/YYYY")}<br />
                                                    {moment(record.ModifyDate).format("HH:mm")}
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
                            <Table dataSource={listfile.filter((x) => x.GroupType === "deploydocument")} style={{ width: "100%" }} pagination={false}>
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
                                <Column title="ชื่อเอกสาร" dataIndex="FileName" width="45%"
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
                                />
                                <Column title="FileSize" dataIndex="FileSize" width="15%"
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
                                />
                                <Column title="OwnerName"
                                    align="center"
                                    width="20%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.OwnerName}<br />
                                                </label>
                                                <label className="value-text">
                                                    {moment(record.ModifyDate).format("DD/MM/YYYY")}<br />
                                                    {moment(record.ModifyDate).format("HH:mm")}
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
                </div>

                {/*testResult, VDO Upload */}
                <div
                    style={{
                        // display : "block"
                        display: listfile.filter((x) => x.GroupType === "quotation").length === 0
                            && listfile.filter((x) => x.GroupType === "testResult").length !== 0
                            && listfile.filter((x) => x.GroupType === "vdoUpload").length !== 0 ? "block" : "none"

                    }}
                >
                    <Tabs defaultActiveKey="1" type="card">
                        <TabPane tab="Test Result" key="1">
                            <Table dataSource={listfile.filter((x) => x.GroupType === "testResult")} style={{ width: "100%" }} pagination={false}>
                                <Column title="No"
                                    width="5%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">{index + 1}</label>

                                            </>
                                        )
                                    }
                                    }
                                />
                                <Column title="ชื่อเอกสาร" dataIndex="FileName" width="45%"
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
                                />
                                <Column title="FileSize" dataIndex="FileSize" width="15%"
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
                                />
                                <Column title="OwnerName"
                                    align="center"
                                    width="20%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.OwnerName}<br />
                                                </label>
                                                <label className="value-text">
                                                    {moment(record.ModifyDate).format("DD/MM/YYYY")}<br />
                                                    {moment(record.ModifyDate).format("HH:mm")}
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
                            <Table dataSource={listfile.filter((x) => x.GroupType === "deploydocument")} style={{ width: "100%" }} pagination={false}>
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
                                <Column title="ชื่อเอกสาร" dataIndex="FileName" width="45%"
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
                                />
                                <Column title="FileSize" dataIndex="FileSize" width="15%"
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
                                />
                                <Column title="OwnerName"
                                    align="center"
                                    width="20%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="value-text">
                                                    {record.OwnerName}<br />
                                                </label>
                                                <label className="value-text">
                                                    {moment(record.ModifyDate).format("DD/MM/YYYY")}<br />
                                                    {moment(record.ModifyDate).format("HH:mm")}
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
                                                    {record.FileId === null ? "" : <DownloadOutlined style={{ fontSize: 20, color: "#007bff" }} />}

                                                </Button>

                                            </>
                                        )
                                    }
                                    }
                                />
                            </Table>
                        </TabPane>

                        <TabPane tab="VDO" key="3">
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
                                <Column title="Description"  width="50%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                                <label className="text-hover value-text" >
                                                    {record.Remark}
                                                </label>
                                            </>
                                        )
                                    }
                                    }
                                />
                                <Column title="วันที่"
                                    align="center"
                                    width="10%"
                                    render={(value, record, index) => {
                                        return (
                                            <>
                                               <label className="text-hover value-text" >
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
