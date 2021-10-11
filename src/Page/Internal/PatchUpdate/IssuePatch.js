import React, { useEffect, useState, useReducer, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Button, Col, Row, Table, Tooltip, Tag, Modal, Select } from "antd";
import Column from "antd/lib/table/Column";
import moment from "moment";
import Axios from "axios";
import MasterPage from "../MasterPage";
import AuthenContext from "../../../utility/authenContext";
import IssueContext, { userReducer, userState } from "../../../utility/issueContext";
import { TrademarkOutlined, ConsoleSqlOutlined } from "@ant-design/icons";


export default function IssuePatch() {
    const history = useHistory();
    const [userstate, userdispatch] = useReducer(userReducer, userState);
    const { state, dispatch } = useContext(AuthenContext);
    const [loading, setLoadding] = useState(false);

    //data
    const [product, setProduct] = useState([]);
    const [filterProduct, setFilterProduct] = useState(4);
    const [version, setVersion] = useState("");
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const [pageCurrent, setPageCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [pageTotal, setPageTotal] = useState(0);
    const [recHover, setRecHover] = useState(-1);



    const rowIssueSelection = {
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);

        },
    };

    const getVersion = async () => {
        await Axios.get(process.env.REACT_APP_API_URL + "/patch/version", {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                productId: filterProduct
            }
        }).then((res) => {
            let patchVersion = (res.data.patch_number).toString().length === 1 ? `${res.data.version}.00${res.data.patch_number}` :
                (res.data.patch_number).toString().length === 2 ? `${res.data.version}.0${res.data.patch_number}` :
                    (res.data.patch_number).toString().length === 3 ? `${res.data.version}.${res.data.patch_number}` : ""

            setVersion(patchVersion)
        }).catch((error) => {

        })
    }

    const getproducts = async () => {
        const products = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/products",
            method: "get",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            }
        }).then((res) => {
            setProduct(res.data)
        }).catch((error) => {

        })
        // userdispatch({ type: "LOAD_PRODUCT", payload: products.data });
    }

    const getIssue = async () => {
        try {
            const issue = await Axios({
                url: process.env.REACT_APP_API_URL + "/patch/issue-patch",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    productId: filterProduct,
                    start_date: "2021-01-01",
                    end_date: "2021-12-31"
                }
            });

            if (issue.status === 200) {
                userdispatch({ type: "LOAD_ISSUE", payload: issue.data })
            }

        } catch (error) {

        }
    }

    const updatePatch = async () => {
        setLoadding(true);
        try {
            const issue = await Axios({
                url: process.env.REACT_APP_API_URL + "/patch/issue-patch",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    productId: filterProduct,
                    ticket_id: selectedRowKeys,
                    version: version
                }
            });

            if (issue.status === 200) {
                setLoadding(false);
                Modal.success({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            {/* <p>บันทึกข้อมูลสำเร็จ</p> */}
                        </div>
                    ),
                    okText: "Close",
                    onOk() {
                        getIssue();
                    },
                });
            }

        } catch (error) {
            setLoadding(false);
            Modal.error({
                title: 'บันทึกข้อมูล ไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.response.data}</p>
                    </div>
                ),
                okText: "Close",
                onOk() {
                },
            });
        }
    }

    // Fuction 

    // const handleChange = (e) => {
    //     if (e.target.group === "product") {
    //         console.log("product", e.target.value)
    //         userdispatch({ type: "SELECT_PRODUCT", payload: e.target.value })
    //     }
    // }

    useEffect(() => {
        getVersion();
        getproducts();
        getIssue();
    }, []);

    useEffect(() => {
        getVersion();
        getIssue();
    }, [filterProduct])

    return (
        <IssueContext.Provider value={{ state: userstate, dispatch: userdispatch }}>
            <MasterPage>
                <Row style={{ padding: "24px 24px 24px 24px", textAlign: "left" }}>
                    <Col span={24}>
                        <label style={{ fontSize: 20, verticalAlign: "top" }}>Cut Of Version</label>
                    </Col>
                </Row>
                <Row style={{ padding: "24px 24px 24px 24px", textAlign: "right" }}>
                    <Col span={24}>
                        <label className="blinktext" style={{ fontSize: 24, verticalAlign: "top", color: "green", marginRight: 20 }}>
                            Currunt Version:
                        </label>
                        <label style={{ fontSize: 24, verticalAlign: "top" }}>
                            {version}
                        </label>
                    </Col>
                </Row>

                <Row style={{ padding: "24px 24px 24px 24px" }}>
                    <Col span={12} >
                        <Select
                            showSearch
                            style={{ width: 500 }}
                            placeholder="Select Product"
                            optionFilterProp="children"
                            defaultValue={4}
                            filterOption={(input, option) =>
                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            options={product.map((n) => ({ value: n.Id, label: `${n.Name} - (${n.FullName})` }))}
                            onChange={(value) => setFilterProduct(value)}
                        />

                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                        <Button
                            type="primary"
                            onClick={() => {
                                if (selectedRowKeys.length === 0) {
                                    Modal.warning({
                                        title: 'กรุณา เลือกรายการ',
                                        content: (
                                            <div>

                                            </div>
                                        ),
                                        okText: "Close",
                                        onOk() {

                                        }
                                    });
                                } else {
                                    updatePatch();
                                }
                            }}
                        >
                            Generate Patch
                        </Button>
                    </Col>
                </Row>

                <Table dataSource={userstate?.issuedata?.data} loading={loading}
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

                    // onChange={(x) => { setPageCurrent(x.current); setPageSize(x.pageSize) }}
                    // onRow={(record, rowIndex) => {
                    //     return {
                    //         onClick: event => { }, // click row
                    //         onDoubleClick: event => { }, // double click row
                    //         onContextMenu: event => { }, // right button click row
                    //         onMouseEnter: event => { setRecHover(rowIndex) }, // mouse enter row
                    //         onMouseLeave: event => { setRecHover(-1) }, // mouse leave row
                    //     };
                    // }}
                    rowClassName={(record, index) => {
                        return (
                            (index === recHover ? "table-hover" : "")
                        )
                    }}
                    rowSelection={{
                        type: "checkbox",
                        ...rowIssueSelection,
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

                    <Column title="Due Date" width="10%"
                        key="key"
                        align="center"
                        render={(record) => {
                            return (
                                <>
                                    <div style={{
                                        display: state?.usersdata?.organize?.OrganizeCode === "support" &&
                                            record.Is_DueDate === 0 ? "inline-block" : "none"
                                    }}>
                                        <label className="table-column-text" style={{ color: "red" }}>
                                            กรุณาแจ้ง DueDate ลูกค้า
                                        </label>
                                    </div>
                                    <div style={{
                                        display: state?.usersdata?.organize?.OrganizeCode === "cr_center" &&
                                            record.Is_SLA_DueDate === 0 ? "inline-block" : "none"
                                    }}>
                                        <label className="table-column-text" style={{ color: "red" }}>
                                            กรุณาระบุ DueDate
                                        </label>
                                    </div>

                                    <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"}>
                                        {record.DueDate === null ? "" : moment(record.DueDate).format('DD/MM/YYYY')}
                                    </label>
                                    <br />
                                    <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"}>
                                        {record.DueDate === null ? "" : moment(record.DueDate).format('HH:mm')}
                                    </label>
                                    <br />
                                    <div style={{ display: record.cntDueDate >= 1 ? "block" : "none" }}>
                                        <Tag style={{ marginLeft: 16 }} color="warning"

                                        >
                                            <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"}>
                                                เลื่อน Due
                                            </label>
                                        </Tag>
                                    </div>
                                </>
                            )
                        }}
                    />

                    <Column
                        title="ProgressStatus" width="10%"
                        key="key"
                        align="center"
                        render={(record) => {
                            return (
                                <>
                                    <div>
                                        <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"}>
                                            {record.FlowStatus}
                                        </label>
                                        <br />
                                        <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"}>
                                            {moment(record.ResolvedDate).format("DD/MM/YYYY")}<br />
                                            {moment(record.ResolvedDate).format("HH:mm")}
                                        </label>
                                        <label
                                            style={{ display: record.IsReOpen === true ? "block" : "none" }}
                                            className="table-column-text">
                                            (ReOpen)
                                        </label>
                                    </div>
                                </>
                            );

                        }}
                    />


                </Table>
            </MasterPage>
        </IssueContext.Provider>
    )
}