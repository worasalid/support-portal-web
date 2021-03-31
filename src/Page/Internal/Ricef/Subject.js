import { Col, Row, Select, Typography, Spin, Button, Avatar, Tabs, Modal, DatePicker } from "antd";
import React, { useState, useEffect, useContext, useRef } from "react";
import "../../../styles/index.scss";
import { useHistory, useRouteMatch } from "react-router-dom";
import RicefComment from "../../../Component/Comment/Internal/Ricef_Comment";
import Historylog from "../../../Component/History/Internal/Historylog";
import MasterPage from "../MasterPage";
import { ArrowDownOutlined, ArrowUpOutlined, UserOutlined, LeftCircleOutlined } from "@ant-design/icons";
import Axios from "axios";
import AuthenContext from "../../../utility/authenContext";
import RicefContext, { ricefReducer, ricefState } from "../../../utility/ricefContext";
import moment from "moment";
import TabsDocument from "../../../Component/Subject/Internal/tabsDocument";

import ModalDeveloper from "../../../Component/Dialog/Internal/Ricef/modalDeveloper";
import ModalConsult from "../../../Component/Dialog/Internal/Ricef/modalConsult";

const { Option } = Select;
const { TabPane } = Tabs;

export default function Subject() {
    const match = useRouteMatch();
    const history = useHistory();
    const uploadRef = useRef(null);
    const editorRef = useRef(null)
    const [textValue, setTextValue] = useState("");
    const [loadingPage, setLoadingPage] = useState(true);

    const { state, dispatch } = useContext(AuthenContext);
    const { state: ricefstate, dispatch: ricefdispatch } = useContext(RicefContext);

    //modal
    const [modalVisible, setModalVisible] = useState(null)
    const [modalDeveloper, setModalDeveloper] = useState(null)

    //div
    const [container, setContainer] = useState(null);
    const [divcollapse, setDivcollapse] = useState("block")
    const [collapsetext, setCollapsetext] = useState("Hide details")

    // data
    const [flowText, setFlowText] = useState(null);
    const [flowOutput, setFlowOutput] = useState("");
    const [flowStatus, setFlowStatus] = useState("");
    const [duedate, setDuedate] = useState("31/11/2021");
    // const [ricefstatus, setRicefstatus] = useState(null);
    const flowdata = [
        {
            Id: 1,
            Name: "Send To Dev",
            type: "progress",
            flowstatus: "InProgress"
        },
        {
            Id: 2,
            Name: "Send Unit Test",
            type: "progress",
            flowstatus: "Resolved"
        },
        {
            Id: 3,
            Name: "ReOpen",
            type: "progress",
            flowstatus: "ReOpen"
        },
        {
            Id: 4,
            Name: "Complete",
            type: "progress",
            flowstatus: "Complete"
        }

    ]
    const GetFlowOutput = async () => {
        if (ricefstate.recefdetail[0]?.Status === "Open") {
            setFlowOutput(flowdata.filter((x) => x.Id === 1).map((x) => ({ value: x.Id, label: x.Name, type: x.type, status: x.flowstatus })))
        }
        if (ricefstate.recefdetail[0]?.Status === "InProgress" || ricefstate.recefdetail[0]?.Status === "ReOpen") {
            setFlowOutput(flowdata.filter((x) => x.Id === 2).map((x) => ({ value: x.Id, label: x.Name, type: x.type, status: x.flowstatus })))
        }
        if (ricefstate.recefdetail[0]?.Status === "Resolved") {
            setFlowOutput(flowdata.filter((x) => x.Id === 3 || x.Id === 4).map((x) => ({ value: x.Id, label: x.Name, type: x.type, status: x.flowstatus })))
        }
    }

    const handleEditorChange = (content, editor) => {
        setTextValue(content);
    }

    const GetRicefDetail = async () => {
        try {
            const ricef_detail = await Axios({
                url: process.env.REACT_APP_API_URL + "/ricef/load-ricefdetail",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    ricefid: match.params.ricefid
                }
            });

            if (ricef_detail.status === 200) {
                setLoadingPage(false);
                ricefdispatch({ type: "LOAD_RICEFDETAIL", payload: ricef_detail.data })
                setDuedate(ricefstate?.recefdetail[0]?.DueDate)
            }
        } catch (error) {

        }
    }

    const LoadModule = async () => {
        try {
            const module = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/modules",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    productId: ricefstate.recefdetail[0]?.ProductId
                }
            });
            ricefdispatch({ type: "LOAD_MODULE", payload: module.data })
        } catch (error) {

        }
    }

    const GetPriority = async () => {
        try {
            const priority = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/priority",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
            });
            ricefdispatch({ type: "LOAD_PRIORITY", payload: priority.data })
        } catch (error) {

        }
    }

    const GetType = async () => {
        try {
            const issuetype = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/issue-types",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
            });
            ricefdispatch({ type: "LOAD_TYPE", payload: issuetype.data })
        } catch (error) {

        }
    }

    function onChange(value, item) {
        console.log("item", item)
        if (item.type === "progress" && item.value === 1) {
            setFlowText(item.label);
            setFlowStatus(item.status);
            setModalVisible(true);
        }
        if (item.type === "progress" && item.value === 2) {
            setFlowText(item.label);
            setFlowStatus(item.status);
            setModalDeveloper(true);
        }
        if (item.type === "progress" && (item.value === 3 || item.value === 4)) {
            setFlowText(item.label);
            setFlowStatus(item.status);
            setModalVisible(true);
        }
        if (item.type !== "progress") {
            Modal.info({
                title: 'ต้องการเปลียนข้อมูล ใช่หรือไม่',
                content: (
                    <div>
                        <p></p>
                    </div>
                ),
                okCancel() {

                },
                onOk() {
                    if (item.type === "priority") {
                        UpdatePriority(value);
                    }
                    if (item.type === "module") {
                        UpdateModule(value);
                    }
                    if (item.type === "riceftype") {
                        UpdateType(value);
                    }
                    if (item.type === "duedate") {
                        UpdateDueDate(value);
                    }

                },
            });
        }

    }

    const UpdatePriority = async (value, item) => {
        try {
            const priority = await Axios({
                url: process.env.REACT_APP_API_URL + "/ricef/update-priority",
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ricefid: match.params.ricefid,
                    priority: value,
                }
            });
            if (priority.status === 200) {
                GetRicefDetail();
                Modal.success({
                    content: 'บันทึกข้อมูลเรียบร้อยแล้ว',
                    okText: "Close"
                });
            }

        } catch (error) {

        }
    }

    const UpdateModule = async (value, item) => {
        try {
            const module = await Axios({
                url: process.env.REACT_APP_API_URL + "/ricef/update-module",
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ricefid: match.params.ricefid,
                    module: value,
                }
            });
            if (module.status === 200) {
                GetRicefDetail();
                Modal.success({
                    content: 'บันทึกข้อมูลเรียบร้อยแล้ว',
                    okText: "Close"
                });
            }

        } catch (error) {
            Modal.success({
                content: 'Error',
                okText: "Close"
            });
        }
    }

    const UpdateType = async (value, item) => {
        try {
            const module = await Axios({
                url: process.env.REACT_APP_API_URL + "/ricef/update-type",
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ricefid: match.params.ricefid,
                    type: value,
                }
            });
            if (module.status === 200) {
                GetRicefDetail();
                Modal.success({
                    content: 'บันทึกข้อมูลเรียบร้อยแล้ว',
                    okText: "Close"
                });
            }

        } catch (error) {
            Modal.success({
                content: error,
                okText: "Close"
            });
        }
    }

    const UpdateDueDate = async (value, item) => {
        try {
            const module = await Axios({
                url: process.env.REACT_APP_API_URL + "/ricef/update-duedate",
                method: "PATCH",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ricefid: match.params.ricefid,
                    duedate: value,
                }
            });
            if (module.status === 200) {
                GetRicefDetail();
                Modal.success({
                    content: 'บันทึกข้อมูลเรียบร้อยแล้ว',
                    okText: "Close"
                });
            }

        } catch (error) {
            Modal.success({
                content: error,
                okText: "Close"
            });
        }
    }

    function HandleChange(value, item) {
        console.log("value", value)
        console.log("item", item)

    }

    function renderColorPriority(param) {
        switch (param) {
            case 'Critical':
                return <ArrowUpOutlined style={{ fontSize: "16px", color: "#C0392B" }} />
            case 'High':
                return <ArrowUpOutlined style={{ fontSize: "16px", color: "#E74C3C" }} />
            case 'Medium':
                return <ArrowDownOutlined style={{ fontSize: "16px", color: "#DC7633" }} />
            case 'Low':
                return <ArrowDownOutlined style={{ fontSize: "16px", color: "#27AE60" }} />

        }
    }

    useEffect(() => {
        GetRicefDetail();
        setDuedate(ricefstate?.recefdetail[0]?.DueDate)
    }, [])


    return (
        <MasterPage>
            <Spin spinning={loadingPage} tip="Loading..." style={{ height: "100%" }}>
                <div style={{ height: "100%", overflowY: 'hidden' }} ref={setContainer} >
                    <Row style={{ padding: "0px 0px 0px 24px" }}>
                        <Col>
                            <Button
                                type="link"
                                icon={<LeftCircleOutlined />}
                                style={{ fontSize: 18, padding: 0 }}
                                onClick={() => history.goBack()}
                            >
                                Back
                               </Button>
                        </Col>
                    </Row>

                    <Row style={{ height: 'calc(100% - 32px)' }}>
                        {/* Content */}
                        <Col span={16} style={{ padding: "0px 0px 24px 24px", height: "100%", overflowY: "scroll" }}>
                            {/* Issue Description */}
                            <Row style={{ marginRight: 24 }}>
                                <Col span={24}>

                                    <label className="topic-text">{ricefstate.recefdetail[0]?.IssueNumber}</label>
                                    <div className="issue-detail-box">
                                        <Row>
                                            <Col span={16} style={{ display: "inline" }}>
                                                <Typography.Title level={4}>
                                                    <Avatar size={32} icon={<UserOutlined />} />&nbsp;&nbsp;  {ricefstate.recefdetail[0]?.Title}
                                                </Typography.Title>
                                            </Col>
                                            <Col span={8} style={{ display: "inline", textAlign: "right" }}>
                                                <Button type="link"
                                                    onClick={
                                                        () => {
                                                            return (
                                                                setDivcollapse(divcollapse === 'none' ? 'block' : 'none'),
                                                                setCollapsetext(divcollapse === 'block' ? 'Show details' : 'Hide details')
                                                            )
                                                        }
                                                    }
                                                >{collapsetext}
                                                </Button>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <div style={{ display: divcollapse }}>
                                                <p>
                                                    {ricefstate.recefdetail[0]?.Description}
                                                </p>

                                            </div>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>

                            {/* TAB Document */}
                            <Row style={{ marginTop: 36, marginRight: 24 }}>
                                <Col span={24}>

                                    <TabsDocument
                                        details={{
                                            refId: match.params.ricefid,
                                            reftype: "Master_Ricef",
                                        }}
                                    />
                                </Col>
                            </Row>

                            {/* TAB Activity */}
                            <Row style={{ marginTop: 36, marginRight: 24 }}>
                                <Col span={24}>
                                    <label className="header-text">Activity</label>
                                    <Tabs defaultActiveKey="1" >
                                        <TabPane tab="Ricef Note" key="1" >
                                            <RicefComment />
                                        </TabPane>
                                        <TabPane tab="History Log" key="2">
                                            <Historylog type="RICEF" />
                                        </TabPane>
                                    </Tabs>
                                </Col>
                            </Row>
                        </Col>
                        {/* Content */}

                        {/* SideBar */}
                        <Col span={8} style={{ padding: "0px 0px 0px 20px", height: "100%", overflowY: "auto" }}>
                            <Row style={{ marginBottom: 20 }}>
                                <Col span={18}>
                                    <label className="header-text">ProgressStatus</label>
                                </Col>
                                <Col span={18} style={{ marginTop: 10 }}>
                                    <div
                                        style={{
                                            display: (state?.usersdata?.organize?.OrganizeCode === "dev" && ricefstate.recefdetail[0]?.Status === "InProgress" || ricefstate.recefdetail[0]?.Status === "ReOpen") ||
                                                (state?.usersdata?.organize?.OrganizeCode === "consult" && ricefstate.recefdetail[0]?.Status !== "InProgress") ? "block" : "none"
                                        }}
                                    >
                                        <Select
                                            style={{ width: '100%' }}
                                            allowClear
                                            showSearch

                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            onClick={() => GetFlowOutput()}
                                            options={flowOutput}
                                            onChange={(value, item) => onChange(value, item)}
                                            value={ricefstate.recefdetail[0]?.Status}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            display: (state?.usersdata?.organize?.OrganizeCode === "dev" && (ricefstate.recefdetail[0]?.Status !== "InProgress" && ricefstate.recefdetail[0]?.Status !== "ReOpen")) ||
                                                (state?.usersdata?.organize?.OrganizeCode === "consult" && ricefstate.recefdetail[0]?.Status === "InProgress") ? "block" : "none"
                                        }}>
                                        <label className="value-text">{ricefstate.recefdetail[0]?.Status}</label>
                                    </div>

                                </Col>
                            </Row>
                            <Row style={{ marginBottom: 20 }}>
                                <Col span={18} >
                                    <label className="header-text">Type</label>
                                </Col>
                                <Col span={18} >
                                    <div
                                        style={{
                                            display: state?.usersdata?.organize?.OrganizeCode === "consult" &&
                                                ricefstate.recefdetail[0]?.Status === "Open" ? "block" : "none"
                                        }}>
                                        <Select
                                            style={{ width: '100%' }}
                                            allowClear
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            onClick={() => GetType()}

                                            options={ricefstate.masterdata.issueTypeState?.map((x) => ({ value: x.Id, label: x.Name, type: "riceftype" }))}
                                            onChange={(value, item) => onChange(value, item)}
                                            value={ricefstate.recefdetail[0]?.IssueType}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            display: state?.usersdata?.organize?.OrganizeCode === "dev" ||
                                                (state?.usersdata?.organize?.OrganizeCode === "consult" && ricefstate.recefdetail[0]?.Status !== "Open") ? "block" : "none"
                                        }}>
                                        <label className="value-text">{ricefstate.recefdetail[0]?.IssueType}</label>
                                    </div>


                                </Col>
                            </Row>

                            <Row style={{ marginBottom: 20 }} align="middle">
                                <Col span={18}>
                                    <label className="header-text">Priority</label>
                                </Col>
                                <Col span={18}>
                                    <div
                                        style={{
                                            display: state?.usersdata?.organize?.OrganizeCode === "consult" ? "block" : "none"
                                        }}>
                                        <Select
                                            style={{ width: '100%' }}
                                            allowClear
                                            showSearch

                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            onClick={() => GetPriority()}

                                            options={ricefstate.masterdata.priorityState?.map((x) => ({ value: x.Id, label: x.Name, type: "priority" }))}
                                            onChange={(value, item) => onChange(value, item)}
                                            value={ricefstate.recefdetail[0]?.Priority}
                                        />
                                    </div>

                                    <div
                                        style={{
                                            display: state?.usersdata?.organize?.OrganizeCode === "dev" ? "block" : "none"
                                        }}>
                                        <label className="value-text">{ricefstate.recefdetail[0]?.Priority}</label>
                                    </div>
                                </Col>
                            </Row>

                            <Row style={{ marginBottom: 20 }}>
                                <Col span={18}>
                                    <label className="header-text">Company</label>
                                    <br />
                                    <label className="value-text">{ricefstate.recefdetail[0]?.CompanyName}</label>
                                </Col>
                            </Row>

                            <Row style={{ marginBottom: 20 }}>
                                <Col span={18}>
                                    <label className="header-text">Product</label>
                                    <br />
                                    <label className="value-text">{ricefstate.recefdetail[0]?.ProductName} {`(${ricefstate.recefdetail[0]?.ProductFullName})`}</label>
                                </Col>
                            </Row>

                            <Row style={{ marginBottom: 20 }}>
                                <Col span={18}>
                                    <label className="header-text">Module</label>
                                </Col>
                                <Col span={18}>
                                    <div
                                        style={{
                                            display: state?.usersdata?.organize?.OrganizeCode === "consult" &&
                                                ricefstate.recefdetail[0]?.Status === "Open" ? "block" : "none"
                                        }}>
                                        <Select
                                            style={{ width: '100%' }}
                                            allowClear
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            onClick={() => LoadModule()}

                                            options={ricefstate.masterdata.moduleState?.map((x) => ({ value: x.Id, label: x.Name, type: "module" }))}
                                            onChange={(value, item) => onChange(value, item)}
                                            value={ricefstate.recefdetail[0]?.ModuleName}
                                        />
                                    </div>

                                    <div
                                        style={{
                                            display: state?.usersdata?.organize?.OrganizeCode === "dev" ||
                                                (state?.usersdata?.organize?.OrganizeCode === "consult" && ricefstate.recefdetail[0]?.Status) !== "Open" ? "block" : "none"
                                        }}>
                                        <label className="value-text">{ricefstate.recefdetail[0]?.ModuleName}</label>
                                    </div>

                                </Col>
                            </Row>
                            <Row style={{ marginBottom: 20 }}>
                                <Col span={18} >
                                    <label className="header-text">DueDate</label>
                                </Col>
                                <Col span={18} >
                                    <DatePicker
                                        style={{
                                            display: state?.usersdata?.organize?.OrganizeCode === "consult" ? "block" : "none"
                                        }}
                                        value={moment(ricefstate?.recefdetail[0]?.DueDate, "DD/MM/YYYY")}
                                        format="DD/MM/YYYY"
                                        onChange={(date, dateString) => onChange(dateString, { value: dateString, type: "duedate" })}
                                    />
                                    <label className="value-text"
                                        style={{
                                            display: state?.usersdata?.organize?.OrganizeCode === "dev" ? "block" : "none"
                                        }}
                                    >
                                        {ricefstate?.recefdetail[0]?.DueDate}
                                    </label>
                                </Col>
                            </Row>
                        </Col>
                        {/* SideBar */}
                    </Row>

                </div>

                <ModalConsult
                    visible={modalVisible}
                    title={flowText}
                    width={800}
                    onCancel={() => setModalVisible(false)}
                    onOk={() => setModalVisible(false)}
                    details={{
                        ricefid: ricefstate.recefdetail[0]?.RicefId,
                        flowstatus: flowStatus && flowStatus,
                        status: ricefstate.recefdetail[0]?.Status

                    }}
                />

                <ModalDeveloper
                    title={flowText}
                    visible={modalDeveloper}
                    width={800}
                    onCancel={() => setModalDeveloper(false)}
                    onOk={() => setModalDeveloper(false)}
                    details={{
                        ricefid: ricefstate.recefdetail[0]?.RicefId,
                        flowstatus: flowStatus && flowStatus,
                        status: ricefstate.recefdetail[0]?.Status
                    }}
                />
            </Spin>
        </MasterPage>
    );
}
