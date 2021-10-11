import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Button, Col, Row, Table, Tooltip, Tag, Modal, message } from "antd";
import Column from "antd/lib/table/Column";
import moment from "moment";
import Axios from "axios";
import MasterPage from "../MasterPage";
import AuthenContext from "../../../utility/authenContext";
import { LeftCircleOutlined, TrademarkOutlined, ConsoleSqlOutlined } from "@ant-design/icons";
import { Icon } from '@iconify/react';


export default function PatchDetails() {
    const match = useRouteMatch();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [patchVersion, setPatchVersion] = useState("");
    const [patchDetails, setPatchDetails] = useState("");

    const [recHover, setRecHover] = useState(-1);
    const [pageCurrent, setPageCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [pageTotal, setPageTotal] = useState(0);

    const getPatchData = async () => {
        setLoading(true);
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/patch/list-details",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    patch: match.params.id,
                    pageCurrent: pageCurrent,
                    pageSize: pageSize
                }

            });

            if (result.status === 200) {
                setLoading(false);

                setPatchDetails(result.data.data);
                setPageTotal(result.data.total);
            }

        } catch (error) {
            setLoading(false);
        }
    }

    const deletePatch = async (param) => {
        setLoading(true);
        await Axios({
            url: process.env.REACT_APP_API_URL + "/patch/list-details",
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                ticketId: param
            },
        }).then(() => {
            setLoading(false);
            message.success({
                content: 'ลบข้อมูลสำเร็จ',
                style: {
                    marginTop: '15vh',
                }
            });
            getPatchData();
        }).catch((error) => {
            Modal.error({
                title: 'ลบข้อมูลไม่สำเร็จ',
                content: error,
            });
        })
    }

    useEffect(() => {
        getPatchData()
        setPatchVersion(match.params.id);
    }, [])

    return (
        <MasterPage>
            <Row style={{ padding: "24px 24px 24px 24px", textAlign: "left" }}>
                <Col span={24}>
                    <Button
                        type="link"
                        icon={<LeftCircleOutlined />}
                        // style={{zIndex:99}}
                        style={{ fontSize: 18, padding: 0, backgroundColor: "white", width: "100%", textAlign: "left" }}
                        onClick={() => history.goBack()}
                    >
                        Back
                    </Button>
                    <label style={{ fontSize: 20, verticalAlign: "top" }}> {`รายการ Patch Version (${patchVersion && patchVersion})`}</label>
                </Col>
            </Row>

            <Table dataSource={patchDetails} loading={loading}
                style={{ padding: "24px 24px 24px 24px" }}
                // footer={(x) => {
                //     return (
                //         <>
                //             <div style={{ textAlign: "right" }}>
                //                 <label>จำนวนเคส : </label>
                //                 <label>{pageTotal}</label>
                //             </div>
                //         </>
                //     )
                // }}
                pagination={{ current: pageCurrent, pageSize: pageSize, total: pageTotal }}

                onChange={(x) => { setPageCurrent(x.current); setPageSize(x.pageSize) }}
                onRow={(record, rowIndex) => {
                    return {
                        onClick: event => { }, // click row
                        onDoubleClick: event => { }, // double click row
                        onContextMenu: event => { }, // right button click row
                        onMouseEnter: event => { setRecHover(rowIndex) }, // mouse enter row
                        onMouseLeave: event => { setRecHover(-1) }, // mouse leave row
                    };
                }}
                rowClassName={(record, index) => {
                    return (
                        (index === recHover ? "table-hover" : "")
                    )
                }}
            >
                <Column title="IssueNo" width="5%"
                    key="key"
                    render={(record) => {
                        return (
                            <>
                                <Tooltip title="ReleaseNote">
                                    <TrademarkOutlined
                                        style={{ display: record.IsReleaseNote === 1 ? "inline-block" : "none", fontSize: 16, color: "#17A2B8" }}
                                    />
                                </Tooltip>
                                &nbsp;
                                <Tooltip title="SQL Script">
                                    <ConsoleSqlOutlined
                                        style={{ display: record.SQL_Script === 1 ? "inline-block" : "none", fontSize: 16, color: "#17A2B8" }}
                                    />
                                </Tooltip>
                                <br />
                                <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"}>
                                    {record.Number}
                                </label>

                            </>
                        )
                    }}
                />

                <Column title="Details" width="15%"
                    key="key"
                    render={(record) => {
                        return (
                            <div>
                                <Row style={{ borderBottom: "1px dotted" }}>
                                    <Col span={8}>
                                        <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"} style={{ color: "#808080", fontSize: "10px" }}>
                                            Type :
                                        </label>
                                    </Col>
                                    <Col span={14}>
                                        <label
                                            style={{ color: "#808080", fontSize: "10px" }}
                                        >
                                            {record.IssueType === 'ChangeRequest' ? "CR" : record.IssueType}
                                        </label>
                                    </Col>
                                </Row>
                                <Row style={{ borderBottom: "1px dotted" }}>
                                    <Col span={8}>
                                        <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"} style={{ color: "#808080", fontSize: "10px" }}>
                                            Priority :
                                        </label>
                                    </Col>
                                    <Col span={14} >
                                        <label style={{ color: "#808080", fontSize: "10px" }}>
                                            {record.Priority}
                                        </label>
                                        {/* <hr style={{margin:"2px", border:"1px dotted #ccc"}} /> */}

                                    </Col>
                                </Row>
                                <Row style={{ borderBottom: "1px dotted" }}>
                                    <Col span={8}>
                                        <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"} style={{ color: "#808080", fontSize: "10px" }}>
                                            Product :
                                        </label>
                                    </Col>
                                    <Col span={14}>
                                        <label style={{ color: "#808080", fontSize: "10px" }}>
                                            {record.ProductName}
                                        </label>
                                    </Col>
                                </Row>
                                <Row style={{ borderBottom: "1px dotted" }}>
                                    <Col span={8}>
                                        <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"} style={{ color: "#808080", fontSize: "10px" }}>
                                            Scene :
                                        </label>
                                    </Col>
                                    <Col span={14}>
                                        <label style={{ color: "#808080", fontSize: "10px" }}>
                                            {record.Scene}
                                        </label>
                                    </Col>
                                </Row>

                                <Row hidden={record.IssueType === "ChangeRequest" || record.IssueType === "Memo" || record.IssueType === "Bug" ? false : true}
                                    style={{ borderBottom: "1px dotted" }}>
                                    <Col span={8}>
                                        <label style={{ color: "#808080", fontSize: "10px" }}>
                                            {record.IssueType === "ChangeRequest" || record.IssueType === "Memo" ? "Version :" : "Patch :"}
                                        </label>
                                    </Col>
                                    <Col span={14}>
                                        <label style={{ color: "#808080", fontSize: "10px" }}>
                                            {record.Version}
                                        </label>
                                    </Col>
                                </Row>
                            </div>
                        );
                    }}
                />
                <Column title="Subject" width="40%"
                    key="key"
                    render={(record) => {
                        return (
                            <>
                                {/* <div> */}
                                <Row align="middle">
                                    <Col span={24}>
                                        <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"}>
                                            {record.Title}
                                            {record.IsReOpen === true ? " (ReOpen)" : ""}
                                        </label>
                                        <Tag color="#00CC00"
                                            style={{
                                                borderRadius: "25px", width: "50px", height: 18, marginLeft: 10,
                                                display: record.TaskCnt > 1 ? "inline-block" : "none"
                                            }}
                                        >
                                            <label style={{ fontSize: 10 }}>{record.TaskCnt} Task</label>
                                        </Tag>
                                    </Col>

                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <label
                                            onClick={() => {
                                                history.push({ pathname: "/internal/issue/subject/" + record.Id });
                                                window.location.reload(true);
                                            }}
                                            className="table-column-detail">
                                            รายละเอียด
                                        </label>

                                    </Col>
                                </Row>
                            </>
                        )
                    }
                    }
                />

                <Column title="Issue By" width="10%"
                    key="key"
                    align="center"
                    render={(record) => {
                        return (
                            <>

                                <div>
                                    <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"}>
                                        {record.CreateBy}
                                    </label>
                                </div>

                                <div>
                                    <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"}>
                                        {moment(record.AssignIconDate).format("DD/MM/YYYY HH:mm")}
                                    </label>
                                </div>
                                <Tooltip title="Company">
                                    <Tag color="#17a2b8" style={{ fontSize: 8 }} >
                                        <label className="table-column-text" style={{ fontSize: 8 }}>
                                            {record.CompanyName}
                                        </label>
                                    </Tag>
                                </Tooltip>

                            </>
                        )
                    }}
                />

                <Column width="5%"
                    key="key"
                    align="center"
                    render={(value, record, index) => {
                        return (
                            <>
                                <div hidden={record.CutOffDate !== null ? true : false}>
                                    <Icon icon="fluent:delete-20-regular" width="20" height="20"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => deletePatch(record.Id)}
                                    />
                                </div>
                            </>
                        )
                    }}
                />


            </Table>
        </MasterPage>
    )
}