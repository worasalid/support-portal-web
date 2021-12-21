import React, { useEffect, useState, useContext, useReducer, useRef } from "react";
import MasterPage from "../MasterPage";
import { Row, Col, Table, Tooltip, Tag } from "antd";
import CaseSearch from "../../../Component/Search/Internal/CaseSearch";
import CallCenterContext, { caseReducer, caseState } from "../../../utility/callcenterContext";
import axios from "axios";
import moment from "moment";

const { Column } = Table;

export default function Case() {

    const [casestate, casedispatch] = useReducer(caseReducer, caseState);
    const [loading, setLoading] = useState(false);
    const [listcase, setListCase] = useState([]);

    const [pageCurrent, setPageCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [pageTotal, setPageTotal] = useState(0);
    const [recHover, setRecHover] = useState(-1);

    const getData = async () => {
        setLoading(true);
        await axios.get(`${process.env.REACT_APP_API_URL}/callcenter/case`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                company_id: casestate.filter.companyState,
                product_id: casestate.filter.productState,
                scene: casestate.filter.scene,
                users: casestate.filter.users,
                keyword: casestate.filter.keyword,
                pageCurrent: pageCurrent,
                pageSize: pageSize
            }
        }).then((res) => {
            setPageTotal(res.data.total);
            setListCase(res.data.result.map((n, index) => {
                return {
                    key: index,
                    code: n.Code,
                    number: n.Number,
                    product: n.Product,
                    title: n.Title,
                    scene: n.Scene,
                    description: n.Description,
                    informer_by: n.InformerBy,
                    create_by: n.CreateBy,
                    create_date: n.CreateDate,
                    call_start: n.CallStart,
                    call_end: n.CallEnd
                }
            }));
            setLoading(false);

        }).catch((error) => {

        });
    }

    useEffect(() => {
        if (casestate.search === true) {
            if (pageCurrent !== 1) {
                setPageCurrent(1);
                setPageSize(10);
            } else {
                getData();
            }
        }
        casedispatch({ type: "SEARCH", payload: false })
    }, [casestate.search]);

    useEffect(() => {
        getData();
    }, [pageCurrent]);


    return (
        <CallCenterContext.Provider value={{ state: casestate, dispatch: casedispatch }}>
            <MasterPage>
                <Row style={{ padding: "24px 24px 24px 24px", textAlign: "left" }}>
                    <Col span={24}>
                        <label style={{ fontSize: 20, verticalAlign: "top" }}>รายการแจ้งปัญหา (Voxtron)</label>
                    </Col>
                </Row>
                <CaseSearch />

                <Row>
                    <Col span={24} style={{ padding: "0px 24px 0px 24px" }}>
                        <Table dataSource={listcase} loading={loading}
                            // scroll={{y:350}}
                            //bordered
                            style={{ padding: "5px 5px" }}
                            footer={(x) => {
                                return (
                                    <>
                                        <div style={{ textAlign: "right" }}>
                                            <label>จำนวนเคส : </label>
                                            <label>{pageTotal}</label>
                                            {/* <label> จากทั้งหมด : </label>
                      <label>{pageTotal}</label> */}

                                        </div>
                                    </>
                                )
                            }}
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

                            <Column title="เลข Case" key="key" width="10%"
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <label className="table-column-text">{record.number}</label>
                                        </>
                                    )
                                }}
                            />

                            <Column title="Details" width="15%"
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <Row style={{ borderBottom: "1px dotted" }}>
                                                <Col span={10}>
                                                    <label className="table-column-text" style={{ color: "#808080", fontSize: "10px" }}>
                                                        Product :
                                                    </label>
                                                </Col>
                                                <Col span={14}>
                                                    <label
                                                        style={{ color: "#808080", fontSize: "10px" }}
                                                    >
                                                        {record.product}
                                                    </label>
                                                </Col>
                                            </Row>
                                            <Row style={{ borderBottom: "1px dotted" }}>
                                                <Col span={10}>
                                                    <label className="table-column-text" style={{ color: "#808080", fontSize: "10px" }}>
                                                        Scene :
                                                    </label>
                                                </Col>
                                                <Col span={14}>
                                                    <label
                                                        style={{ color: "#808080", fontSize: "10px" }}
                                                    >
                                                        {record.scene}
                                                    </label>
                                                </Col>
                                            </Row>
                                        </>
                                    )
                                }}
                            />
                            <Column title="Subject" key="key" width="40%"
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <label className="table-column-text">{record.title}</label>
                                        </>
                                    )
                                }}
                            />
                            <Column title="ผู้แจ้ง" key="key" align="center" width="20%"
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <label className="table-column-text">{record.informer_by}</label>
                                            <br />
                                            <Tooltip title="Company">
                                                <Tag color="#17a2b8" style={{ fontSize: 8 }} >
                                                    <label className="table-column-text" style={{ fontSize: 8 }}>
                                                        {record.code}
                                                    </label>
                                                </Tag>
                                            </Tooltip>
                                        </>
                                    )
                                }}
                            />
                            <Column title="" key="key" align="center" width="15%"
                                render={(value, record, index) => {
                                    return (
                                        <>
                                            <Row style={{ textAlign: "left" }}>
                                                <Col span={10}>
                                                    <label className="table-column-text" style={{ color: "#808080", fontSize: "10px" }}>
                                                        ผู้รับแจ้ง :
                                                    </label>
                                                </Col>
                                                <Col span={14}>
                                                    <label className="table-column-text">{record.create_by}</label>
                                                </Col>
                                            </Row>
                                            <Row style={{ textAlign: "left" }}>
                                                <Col span={10}>
                                                    <label className="table-column-text" style={{ color: "#808080", fontSize: "10px" }}>
                                                        วันที่รับแจ้ง :
                                                    </label>
                                                </Col>
                                                <Col span={14}>
                                                    <label className="table-column-text">{moment(record.call_start).format("DD/MM/YYYY")}</label>
                                                </Col>
                                            </Row>
                                            <Row style={{ textAlign: "left" }}>
                                                <Col span={10}>
                                                    <label className="table-column-text" style={{ color: "#808080", fontSize: "10px" }}>
                                                        เวลา :
                                                    </label>
                                                </Col>
                                                <Col span={14}>
                                                    <label className="table-column-text">{moment(record.call_start).format("HH:mm")}</label>
                                                    <label className="table-column-text"> - </label>
                                                    <label className="table-column-text">{moment(record.call_end).format("HH:mm")}</label>
                                                </Col>
                                            </Row>

                                        </>
                                    )
                                }}
                            />
                        </Table>
                    </Col>
                </Row>
            </MasterPage>
        </CallCenterContext.Provider >
    )
}