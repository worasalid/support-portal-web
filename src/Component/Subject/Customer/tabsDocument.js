
import React, { useEffect, useState } from 'react'
import { Button, Table, Tabs } from 'antd'
import Axios from 'axios'
//import { useRouteMatch, useHistory } from 'react-router-dom'
import Column from 'antd/lib/table/Column';
import { DownCircleOutlined, DownloadOutlined, UpCircleOutlined } from '@ant-design/icons';
import moment from "moment"
import _ from 'lodash'

const { TabPane } = Tabs;

function TabsDocument({ visible = false, onOk, onCancel, details, ...props }) {
    //const history = useHistory();
    //const match = useRouteMatch();

    //data
    const [listGroupFile, setListGroupFile] = useState([]);
    const [listfile, setListfile] = useState([]);


    //div
    const [divcollapse, setDivcollapse] = useState("block")
    const [collapseicon, setCollapseicon] = useState(<UpCircleOutlined style={{ fontSize: 20, color: "#1890ff" }} />)


    const getDocument = async () => {
        await Axios({
            url: process.env.REACT_APP_API_URL + "/tickets/issue-document",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                refId: details.refId,
                //reftype: details.reftype
            }
        }).then((result) => {
            // หน้า Customer ให้นำ Tab ข้อมูล deploy_document กับ file_deploy ออก
            const groupFile = result.data.filter((x) => x.GroupType !== "deploy_document" && x.GroupType !== "file_deploy")
            setListGroupFile(_.uniqBy(groupFile, "GroupType"));

            setListfile(result.data);
        }).catch(() => {

        })
    }

    useEffect(() => {
        if (details.refId) {
            getDocument();
        }
    }, [details.refId])

    return (
        <>
            {
                // listfile.length !== 0
                listGroupFile.filter((x) => x.GroupType === "quotation" || x.GroupType === "testResult").length !== 0
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
                <Tabs defaultActiveKey="1" type="card">
                    {

                        listGroupFile.filter((x) => x.GroupType === "testResult" || x.GroupType === "quotation").length !== 0 &&
                        listGroupFile.map((n, index) => (
                            <TabPane
                                tab={
                                    <label style={{ fontSize: 12 }}>
                                        {
                                            n.GroupType === "quotation" ? "ใบเสนอราคา" :
                                                n.GroupType === "PO_Document" ? "เอกสาร PO" :
                                                    n.GroupType === "testResult" ? "Test Result" :
                                                        // n.GroupType === "deploy_document" ? "Document Deploy" :
                                                        //     n.GroupType === "file_deploy" ? "File Deploy" :
                                                        n.GroupType === "test_result_QA" ? "QA Test Result" :
                                                            n.GroupType === "vdoUpload" ? "Video" : ""
                                        }
                                    </label>
                                }
                                key={index}
                            >
                                {
                                    n.GroupType === "testResult" || n.GroupType === "quotation" || n.GroupType === "PO_Document" ?
                                        <Table dataSource={listfile.filter((x) => x.GroupType === n.GroupType)} style={{ width: "100%", padding: 0, margin: 0 }} pagination={false}>
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
                                            <Column title="File Name" width="55%"
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

                                            <Column title="FileSize" width="10%" dataIndex="FileSize"
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
                                            />
                                            <Column title="OwnerName" width="25%"
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
                                            <Column title=""
                                                width="3%"
                                                render={(value, record, index) => {
                                                    return (
                                                        <>
                                                            <Button type="link"
                                                                onClick={() => window.open(record.Url, "_blank")}
                                                            >
                                                                {record.FileName === null ? "" : <DownloadOutlined style={{ fontSize: 20, color: "#007bff" }} />}

                                                            </Button>

                                                        </>
                                                    )
                                                }
                                                }
                                            />
                                        </Table>

                                        :
                                        <Table dataSource={listfile.filter((x) => x.GroupType === n.GroupType)} style={{ width: "100%", padding: 0, margin: 0 }} pagination={false}>
                                            <Column title="No"
                                                width="5%"
                                                render={(value, record, index) => {
                                                    return (
                                                        <>
                                                            <label>{index + 1}</label>

                                                        </>
                                                    )
                                                }}
                                            />

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

                                        </Table>

                                }

                            </TabPane>
                        ))
                    }
                </Tabs>
            </div>
        </>
    )
}

export default React.memo(TabsDocument)
