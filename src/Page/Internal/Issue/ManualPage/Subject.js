import {
    Col, Tag, Row, Select, Divider, Typography, Button, Avatar, Tabs, Modal, Menu, Spin, Skeleton,
    Form
} from "antd";
import React, { useState, useEffect, useContext, useRef, useMemo } from "react";
import "../../../../styles/index.scss";
import { useHistory, useRouteMatch } from "react-router-dom";
// import CommentBox from "../../../Component/Comment/Internal/Comment";
import CommentBox from "../../../../Component/Comment/Internal/Comment";
import InternalCommentBox from "../../../../Component/Comment/Internal/Internal_comment";
import Historylog from "../../../../Component/History/Customer/Historylog";
import InternalHistorylog from "../../../../Component/History/Internal/Historylog";
import MasterPage from "../../MasterPage";
import {
    ArrowDownOutlined, ArrowUpOutlined, ClockCircleOutlined, FileAddOutlined, LeftCircleOutlined, UserOutlined,
    UpCircleOutlined, DownCircleOutlined, InfoCircleOutlined
} from "@ant-design/icons";
import Axios from "axios";
import AuthenContext from "../../../../utility/authenContext";
import IssueContext, { userReducer, userState } from "../../../../utility/issueContext";
import TextEditor from '../../../../Component/TextEditor';

import moment from "moment";
import TabsDocument from "../../../../Component/Subject/Customer/tabsDocument";
import ModalTimetracking from "../../../../Component/Dialog/Internal/modalTimetracking";
import ListSubTask from "../../../../Component/Subject/Internal/listSubTask";
import ModalMandayLog from "../../../../Component/Dialog/Internal/modalMandayLog";
import ModalSA_Assessment from "../../../../Component/Dialog/Internal/modalSA_Assessment";

import DuedateLog from "../../../../Component/Dialog/Internal/duedateLog";
import PreviewImg from "../../../../Component/Dialog/Internal/modalPreviewImg";
import ModalFileDownload from "../../../../Component/Dialog/Internal/modalFileDownload";
import { CalculateTime } from "../../../../utility/calculateTime";
import ModalTicketApproveLog from "../../../../Component/Dialog/Internal/Issue/modalTicketApproveLog";

const { TabPane } = Tabs;

export default function ManualPageSubject() {
    const { state, dispatch } = useContext(AuthenContext);
    const { state: userstate, dispatch: userdispatch } = useContext(IssueContext);
    const match = useRouteMatch();
    const history = useHistory();
    const editorRef = useRef(null);
    const subTaskRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const [loadingPage, setLoadingPage] = useState(true);
    const [tabKey, setTabKey] = useState("1");

    //modal
    const [visible, setVisible] = useState(false);
    const [modalpreview, setModalpreview] = useState(false);

    const [modalSaveDuedate, setModalSaveDuedate] = useState(false);
    const [historyduedate_visible, setHistoryduedate_visible] = useState(false);
    const [modaltimetracking_visible, setModaltimetracking_visible] = useState(false);

    const [modalmandaylog_visible, setModalmandaylog_visible] = useState(false);
    const [modalAssessment_visible, setModalAssessment_visible] = useState(false);

    const [modalPreview, setModalPreview] = useState(false);
    const [modalfiledownload_visible, setModalfiledownload_visible] = useState(false);
    const [modalCancel_visible, setModalCancel_visible] = useState(false);
    const [modalTicketApproveLog, setModalTicketApproveLog] = useState(false);

    //div
    const [container, setContainer] = useState(null);
    const [divcollapse, setDivcollapse] = useState("block")
    const [collapsetext, setCollapsetext] = useState("Hide details")
    const [imgUrl, setImgUrl] = useState(null);

    //div
    const [activityCollapse, setActivityCollapse] = useState("block")
    const [activityIcon, setActivityIcon] = useState(<DownCircleOutlined style={{ fontSize: 20, color: "#1890ff" }} />)

    // data
    const [ProgressStatus, setProgressStatus] = useState("");
    const [history_loading, setHistory_loading] = useState(false);
    const [duedateType, setDuedateType] = useState(null);
    const [sla, setSLA] = useState(0);

    const [btnBackTop, setBtnBackTop] = useState(false);
    const scrollRef = useRef(null);

    const getdetail = async () => {
        await Axios({
            url: process.env.REACT_APP_API_URL + "/tickets/loaddetail",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                ticketId: match.params.id
            }
        }).then((res) => {
            setLoadingPage(false);
            userdispatch({ type: "LOAD_ISSUEDETAIL", payload: res.data });
            setSLA(res.data[0].SLA);

        }).catch(() => {

        })
    }

    const renderColorPriority = (param) => {
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

    // This function will scroll the window to the top 
    const scrollToTop = () => {
        scrollRef.current.scrollTo({
            top: 0,
            behavior: 'smooth' // for smoothly scrolling
        });
    };

    const scrollBarPosition = () => {
        if (scrollRef?.current?.scrollTop > 300) {
            setBtnBackTop(true)
        } else {
            setBtnBackTop(false)
        }
    }

    const saveComment = async () => {
        if (editorRef.current.getValue() !== null && editorRef.current.getValue() !== "" && editorRef.current.getValue() !== undefined) {
            await Axios({
                url: process.env.REACT_APP_API_URL + "/workflow/create_comment",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketid: match.params.id,
                    comment_text: editorRef.current.getValue(),
                    comment_type: "customer",
                    files: [],
                }
            });
        }
    }

    const completeIssue = async () => {
        setLoading(true);
        try {
            const completeFlow = await Axios({
                url: process.env.REACT_APP_API_URL + "/workflow/user/manual/complete",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketId: match.params.id
                }
            });

            if (completeFlow.status === 200) {
                saveComment();
                await Modal.success({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>Complete Issue</p>
                        </div>
                    ),
                    okText: "Close",
                    onOk() {
                        setLoading(false);
                        editorRef.current.setvalue();
                        history.push({ pathname: "/internal/issue/manual-task" });
                        window.location.reload(true);
                    },
                });
            }
        } catch (error) {
            setLoading(false);
            await Modal.error({
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.response.data}</p>
                    </div>
                ),
                okText: "Close",
                onOk() {
                    editorRef.current.setvalue();
                },
            });
        }
    }

    const cancelIssue = async () => {
        setLoading(true);
        try {
            const cancelFlow = await Axios({
                url: process.env.REACT_APP_API_URL + "/workflow/user/manual/cancel",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketId: match.params.id
                }
            });

            if (cancelFlow.status === 200) {
                saveComment();
                await Modal.success({
                    title: 'บันทึกข้อมูลสำเร็จ',
                    content: (
                        <div>
                            <p>Cancel Issue</p>
                        </div>
                    ),
                    okText: "Close",
                    onOk() {
                        setLoading(false);
                        editorRef.current.setvalue();
                        history.push({ pathname: "/internal/issue/manual-task" });
                        window.location.reload(true);
                    },
                });
            }
        } catch (error) {
            setLoading(false);
            await Modal.error({
                title: 'บันทึกข้อมูลไม่สำเร็จ',
                content: (
                    <div>
                        <p>{error.response.data}</p>
                    </div>
                ),
                okText: "Close",
                onOk() {
                    editorRef.current.setvalue();
                },
            });
        }
    }

    useEffect(() => {
        getdetail();
    }, [])


    useEffect(() => {
        if (historyduedate_visible) {
        }
    }, [historyduedate_visible])

    useEffect(() => {
        if (modalSaveDuedate === false) {
        }
    }, [modalSaveDuedate])


    const tabDocDetail = useMemo(() => {
        return {
            refId: userstate?.issuedata?.details[0]?.Id
        }
    }, [userstate?.issuedata?.details[0]?.Id])

    return (
        <MasterPage>
            <Spin spinning={loadingPage} tip="Loading..." style={{ height: "100vh" }}>
                <Skeleton loading={loadingPage}>
                    <div style={{ height: "100%", overflowY: 'hidden' }} ref={setContainer}>
                        <Row style={{ height: 'calc(100% - 0px)' }}>
                            {/* Content */}
                            <Col ref={scrollRef} span={16} style={{ padding: "0px 24px 0px 24px", height: "100%", overflowY: "scroll" }}
                                onScroll={(e) => scrollBarPosition()}
                            >
                                <Row style={{ textAlign: "left", zIndex: 1, backgroundColor: "white", position: 'sticky', top: "0px" }}>
                                    <Col span={24} style={{ textAlign: "left", backgroundColor: "white" }}>
                                        {/* <div  style={{ zIndex: 100, overflow: "hidden", position: "fixed", width: "100%",backgroundColor: "gray" }}> */}
                                        <Button
                                            type="link"
                                            icon={<LeftCircleOutlined />}
                                            // style={{zIndex:99}}
                                            style={{ fontSize: 18, padding: 0, backgroundColor: "white", width: "100%", textAlign: "left" }}
                                            onClick={() => history.goBack()}
                                        >
                                            Back
                                        </Button>
                                        {/* </div> */}
                                    </Col>
                                </Row>

                                <Row style={{ position: 'sticky', top: "30px", zIndex: 1, backgroundColor: "white" }} align="middle">
                                    <Col span={24} style={{ backgroundColor: "white", marginBottom: 0 }}>
                                        <label className="topic-text">
                                            {userstate?.issuedata?.details[0]?.Number}
                                            {userstate?.issuedata?.details[0]?.IsReOpen === true ? " (ReOpen)" : ""}
                                        </label>
                                        &nbsp; &nbsp;
                                        <label style={{ fontSize: 30, color: "red" }}
                                            hidden={userstate?.mailbox[0]?.GroupStatus === "Cancel" ? false : true}
                                        >
                                            ยกเลิก
                                        </label>
                                    </Col>
                                </Row>

                                {/* Issue Description */}
                                <Row style={{ marginRight: 24, overflow: "hidden" }}>
                                    <Col span={24}>
                                        <div className="issue-detail-box">
                                            <Row>
                                                <Col span={2} style={{ display: "inline" }}>
                                                    <Avatar size={32} icon={<UserOutlined />} />
                                                </Col>
                                                <Col span={16} style={{ display: "inline" }}>
                                                    <Typography.Title level={4}>
                                                        {/* <Avatar size={32} icon={<UserOutlined />} />&nbsp;&nbsp;   */}
                                                        {userstate?.issuedata?.details[0]?.Title}
                                                    </Typography.Title>
                                                </Col>
                                                <Col span={6} style={{ display: "inline", textAlign: "right" }}>
                                                    <Button title="file attach" type="link"
                                                        style={{ display: userstate?.issuedata?.details[0]?.cntFile === 0 ? "none" : "inline-block" }}
                                                        icon={<img
                                                            style={{ height: "20px", width: "20px" }}
                                                            src={`${process.env.PUBLIC_URL}/icons-attach.png`}
                                                            alt=""
                                                        />}
                                                        onClick={() => setModalfiledownload_visible(true)}
                                                    />
                                                    <Button title="preview" type="link"
                                                        icon={<img
                                                            style={{ height: "20px", width: "20px" }}
                                                            src={`${process.env.PUBLIC_URL}/icons-expand.png`}
                                                            alt=""
                                                        />}
                                                        onClick={() => setModalpreview(true)}
                                                    />
                                                    {/* <Divider type="vertical" /> */}
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
                                                    <div className="issue-description"
                                                        dangerouslySetInnerHTML={{ __html: userstate?.issuedata?.details[0]?.Description }}
                                                        onClick={e => {
                                                            if (e.target.tagName == "IMG") {
                                                                setImgUrl(e.target.src);
                                                                setModalPreview(true);
                                                            }
                                                        }}>

                                                    </div>
                                                </div>
                                            </Row>
                                        </div>

                                    </Col>
                                </Row>

                                {/* TAB Document */}
                                <Row style={{ marginTop: 36, marginRight: 24 }}>
                                    <Col span={24}>

                                        <TabsDocument
                                            details={tabDocDetail}
                                        />
                                    </Col>
                                </Row>

                                {/* SubTask */}
                                <Row style={{ marginRight: 24 }}>
                                    <Col span={24}>
                                        <ListSubTask
                                            ticketId={match.params.id} ref={subTaskRef}
                                        />
                                    </Col>
                                </Row>

                                {/* TAB Activity */}
                                <Row style={{ marginTop: 36, marginRight: 24 }}>
                                    <Col span={24}>
                                        <label className="header-text">Activity</label>
                                        <span
                                            style={{ marginTop: 10, marginLeft: 12, marginRight: 12, cursor: "pointer" }}
                                            onClick={
                                                () => {
                                                    return (
                                                        setActivityCollapse(activityCollapse === 'block' ? 'none' : 'block'),
                                                        setActivityIcon(activityCollapse === 'block' ? <UpCircleOutlined style={{ fontSize: 20, color: "#1890ff" }} /> : <DownCircleOutlined style={{ fontSize: 20, color: "#1890ff" }} />)
                                                    )
                                                }
                                            }
                                        >
                                            {activityIcon}
                                        </span>

                                        <div style={{ display: activityCollapse }}>
                                            {
                                                //userstate?.mailbox[0]?.NodeName === "support" || userstate?.mailbox[0]?.NodeName === "cr_center"
                                                state?.usersdata?.organize?.OrganizeCode === "support" || state?.usersdata?.organize?.OrganizeCode === "cr_center" ||
                                                    state?.usersdata?.organize?.OrganizeCode === "consult"
                                                    ?

                                                    <Tabs style={{ overflow: "visible" }} defaultActiveKey={"1"} onChange={(key) => { setTabKey(key) }}>
                                                        <TabPane tab="Comment" key="1">
                                                            <CommentBox />
                                                        </TabPane>
                                                        <TabPane tab="Internal Note" key="2">
                                                            {
                                                                tabKey === "2" ? <InternalCommentBox /> : ""
                                                            }

                                                        </TabPane>
                                                        <TabPane tab="History Log" key="3">
                                                            <InternalHistorylog loading={history_loading} />
                                                        </TabPane>
                                                    </Tabs>
                                                    :
                                                    <Tabs style={{ overflow: "visible" }} defaultActiveKey={"1"} onChange={(key) => setTabKey(key)}>
                                                        <TabPane tab="Internal Note" key="1" >
                                                            {
                                                                tabKey === "1" ? <InternalCommentBox /> : ""
                                                            }
                                                        </TabPane>
                                                        <TabPane tab="History Log" key="2">
                                                            <InternalHistorylog loading={history_loading} />
                                                        </TabPane>
                                                    </Tabs>
                                            }
                                        </div>
                                    </Col>
                                </Row>

                                <div style={{ textAlign: "right", position: "sticky", bottom: 150 }}>
                                    {btnBackTop && (
                                        <button onClick={() => scrollToTop()} className="back-to-top">
                                            &#8679;
                                        </button>
                                    )}
                                </div>
                            </Col>
                            {/* Content */}

                            {/* SideBar */}
                            <Col span={8} style={{ padding: "0px 0px 0px 20px", height: "100%", overflowY: "auto" }}>
                                {/* Progress Status */}
                                <Row style={{ marginBottom: 20, marginTop: 24 }}>
                                    <Col span={18}>
                                        <label className="header-text">Progress Status</label>
                                    </Col>
                                    <Col span={18} style={{ marginTop: 0 }}>
                                        <Select
                                            style={{ width: '100%' }}
                                            allowClear
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            options={[
                                                {
                                                    value: 'complete',
                                                    label: 'Complete',
                                                },
                                                {
                                                    value: 'cancel',
                                                    label: 'Cancel',
                                                }
                                            ]}
                                            onChange={(value, item) => {
                                                setVisible(true);
                                                setProgressStatus(item.label);
                                            }}
                                            value={userstate?.issuedata?.details[0]?.FlowStatus}
                                        />
                                    </Col>
                                </Row>

                                {/* Priority (Customer)*/}
                                <Row style={{ marginBottom: 20 }} align="middle">
                                    <Col span={24}>
                                        <label className="header-text">Priority</label>
                                        <label className="value-text"> (Customer)</label>
                                    </Col>
                                    <Col span={18}>
                                        <label className="value-text">{userstate.issuedata.details[0]?.Priority}</label>
                                    </Col>
                                </Row>

                                {/* Priority (ICON) */}
                                <Row style={{ marginBottom: 20 }} align="middle">
                                    <Col span={24}>
                                        <label className="header-text">Priority</label>
                                        <label className="value-text"> (ICON)</label>
                                    </Col>
                                    <Col span={18} style={{ marginTop: 10 }}>
                                        <label className="value-text">
                                            {renderColorPriority(userstate.issuedata.details[0] && userstate.issuedata.details[0].InternalPriority)}&nbsp;&nbsp;
                                            {userstate.issuedata.details[0] && userstate.issuedata.details[0].InternalPriority}
                                        </label>
                                    </Col>
                                </Row>

                                {/* SLA */}
                                <Row style={{
                                    marginBottom: 20,
                                    display: (userstate.issuedata.details[0]?.IssueType === "Bug" || userstate.issuedata.details[0]?.IssueType === "Use") &&
                                        (userstate.issuedata.details[0]?.SLA_DueDate !== undefined &&
                                            userstate.issuedata.details[0]?.SLA_DueDate !== null) ? "block" : "none"
                                }}
                                >

                                    <Col span={24} style={{ marginTop: "10px", display: userstate?.issuedata?.details[0]?.IssueType === "Bug" ? "block" : "none" }}>
                                        <label className="header-text">SLA</label>
                                        <RenderSLA sla={sla} ticket_sla={userstate?.issuedata?.details[0]?.TicketSLA} priority={userstate?.issuedata?.details[0]?.InternalPriority} />
                                        <label className="header-text">DueDate</label>
                                        <label className="value-text" style={{ marginLeft: 10 }}>
                                            {(userstate?.issuedata?.details[0]?.SLA_DueDate === null ? "None" : moment(userstate?.issuedata?.details[0]?.SLA_DueDate).format("DD/MM/YYYY HH:mm"))}
                                        </label>

                                    </Col>
                                </Row>

                                {/*  DueDate (Internal) เคส CR , Memo*/}
                                <Row style={{
                                    marginBottom: 20,
                                    display: userstate.issuedata.details[0]?.IssueType === "ChangeRequest" || userstate.issuedata.details[0]?.IssueType === "Memo" ? "block" : "none"
                                }}>
                                    <Col span={18}>
                                        <label className="header-text">DueDate (ICON)</label>

                                        <Button type="link" icon={<ClockCircleOutlined
                                            style={{ fontSize: 18, marginLeft: 12 }} />}
                                        />

                                        <br />
                                        {
                                            userstate?.mailbox[0]?.NodeName === "cr_center"
                                                ? <label className="text-link value-text"
                                                    onClick={() => (setModalSaveDuedate(true), setDuedateType("internal"))}
                                                >
                                                    {userstate.issuedata.details[0] &&
                                                        (userstate.issuedata.details[0].SLA_DueDate === null ? "None" : moment(userstate.issuedata.details[0].SLA_DueDate).format("DD/MM/YYYY HH:mm"))}
                                                </label>
                                                : <label className="value-text">
                                                    &nbsp;&nbsp;
                                                    {(userstate?.issuedata.details[0]?.SLA_DueDate === null ? "None" : moment(userstate?.issuedata?.details[0]?.SLA_DueDate).format("DD/MM/YYYY HH:mm"))}
                                                </label>
                                        }

                                    </Col>
                                </Row>

                                {/*  DueDate (Customer) เคส CR , Memo*/}
                                <Row style={{
                                    marginBottom: 20,
                                    display: (userstate.issuedata.details[0]?.IssueType === "ChangeRequest" || userstate.issuedata.details[0]?.IssueType === "Memo")
                                        && userstate?.issuedata?.details[0]?.SLA_DueDate !== null
                                        && userstate?.issuedata?.details[0]?.DueDate === null ? "block" : "none"
                                }}>
                                    <Col span={18}>
                                        <label className="header-text">DueDate (Customer)</label>

                                        <Button type="link"
                                            icon={<ClockCircleOutlined style={{ fontSize: 18, marginLeft: 12 }} />}
                                            onClick={() => setHistoryduedate_visible(true)}
                                        />
                                        <br />
                                        {
                                            userstate?.mailbox[0]?.NodeName === "support"
                                                ? <label className="text-link value-text"
                                                    onClick={() => (setModalSaveDuedate(true), setDuedateType("customer"))}
                                                >
                                                    {userstate.issuedata.details[0] &&
                                                        (userstate.issuedata.details[0].DueDate === null ? "None" : moment(userstate.issuedata.details[0].DueDate).format("DD/MM/YYYY HH:mm"))}
                                                </label>
                                                : <label className="value-text">
                                                    &nbsp;&nbsp;
                                                    {(userstate?.issuedata.details[0]?.DueDate === null ? "None" : moment(userstate?.issuedata?.details[0]?.DueDate).format("DD/MM/YYYY HH:mm"))}
                                                </label>
                                        }

                                    </Col>
                                </Row>

                                {/* Change DueDate (Customer) */}
                                <Row style=
                                    {{
                                        marginBottom: 20,
                                        display: userstate?.mailbox[0]?.NodeName === "support" && userstate?.issuedata?.details[0]?.DueDate !== null ? "block" : "none"
                                    }}>
                                    <Col span={18}>
                                        <label className="header-text">DueDate (Customer)</label>

                                        <Button type="link"
                                            icon={<ClockCircleOutlined style={{ fontSize: 18, marginLeft: 12 }} />}
                                            onClick={() => setHistoryduedate_visible(true)}
                                        />

                                        <br />
                                        {/* คลิกเปลี่ยน DueDate ได้เฉพาะ support */}
                                        <div
                                            style={{
                                                display: userstate?.mailbox[0]?.NodeName === "support" && userstate?.issuedata?.details[0]?.SLA_DueDate !== null ?
                                                    "block" : "none"
                                            }}>

                                            <Tag hidden={userstate?.issuedata.details[0]?.cntDueDate >= 1 ? false : true}
                                                style={{ marginLeft: 12, cursor: "pointer" }}
                                                color="warning" onClick={() => setHistoryduedate_visible(true)}>
                                                DueDate ถูกเลื่อน
                                            </Tag>
                                        </div>
                                        <div
                                            style={{
                                                display: userstate?.mailbox[0]?.NodeName === "support" && userstate?.issuedata?.details[0]?.SLA_DueDate === null ?
                                                    "block" : "none"
                                            }}>

                                            <label className="value-text">
                                                None
                                            </label>
                                        </div>
                                    </Col>
                                </Row>

                                {/* Company */}
                                <Row style={{ marginBottom: 20 }}>
                                    <Col span={18}>
                                        <label className="header-text">Company</label>
                                        <br />
                                        <label className="value-text">{userstate.issuedata.details[0] && userstate.issuedata.details[0].CompanyName}</label>
                                    </Col>
                                </Row>

                                {/* IssueType */}
                                <Row style={{ marginBottom: 20 }}>
                                    <Col span={18}>
                                        <label className="header-text">IssueType</label>
                                    </Col>
                                    <Col span={18}>
                                        <label className="value-text">
                                            {userstate.issuedata.details[0] && userstate.issuedata.details[0].IssueType}
                                        </label>
                                    </Col>
                                </Row>

                                {/* Product */}
                                <Row style={{ marginBottom: 20 }}>
                                    <Col span={18}>
                                        <label className="header-text">Product</label>
                                    </Col>
                                    <Col span={18}>
                                        <label className="value-text">
                                            {userstate.issuedata.details[0] && userstate.issuedata.details[0].ProductName}
                                        </label>
                                    </Col>
                                </Row>

                                {/* Scene */}
                                <Row style={{ marginBottom: 20 }}>
                                    <Col span={18}>
                                        <label className="header-text">Scene</label>
                                    </Col>
                                    <Col span={18}>
                                        <label className="value-text">
                                            {userstate.issuedata.details[0] && userstate.issuedata.details[0].Scene}
                                        </label>
                                    </Col>
                                </Row>

                                {/* IssueBy */}
                                <Row style={{ marginBottom: 20 }}>
                                    <Col span={18}>
                                        <label className="header-text">IssueBy</label>
                                    </Col>
                                    <Col span={18} style={{ marginTop: 0 }}>
                                        <label className="value-text">
                                            {userstate?.issuedata?.details[0]?.IssueBy}
                                            {
                                                userstate?.issuedata?.details[0]?.OwnerTel === null ? "" :
                                                    <>
                                                        <Divider type="vertical" />
                                                        <label>{`Tel. ${userstate?.issuedata?.details[0]?.OwnerTel}`}</label>
                                                    </>
                                            }
                                        </label>
                                    </Col>
                                </Row>

                                {/* Version */}
                                <Row style={{ marginBottom: 20 }}
                                    hidden={userstate?.mailbox[0]?.NodeName !== "cr_center" && userstate?.issuedata?.details[0]?.Version === null ? true : false}
                                >
                                    <Col span={18}>
                                        <label className="header-text">Version</label>
                                        <br />
                                        <label className="value-text">{userstate?.issuedata?.details[0]?.Version}</label>
                                    </Col>
                                </Row>

                                {/* Total Manday */}
                                <Row style={{
                                    marginBottom: 20,
                                    display: (userstate.issuedata.details[0]?.IssueType === "ChangeRequest" || userstate.issuedata.details[0]?.IssueType === "Memo") &&
                                        userstate.issuedata.details[0]?.Manday ? "block" : "none"
                                }}>
                                    <Col span={18}>
                                        <label className="header-text">Total Manday</label>
                                        <Button type="link"
                                            icon={<InfoCircleOutlined />}
                                            onClick={() => setModalmandaylog_visible(true)} >
                                        </Button>

                                    </Col>
                                    <Col span={18}>
                                        <label className="value-text">
                                            {`${userstate.issuedata.details[0]?.Manday} Manday`}
                                        </label>
                                        <label className="value-text">
                                            {userstate.issuedata.details[0]?.Cost === 0 ? " (ฟรี ไม่มีค่าใช้จ่าย)" : " (มีค่าใช้จ่าย)"}
                                        </label>
                                    </Col>
                                </Row>

                                {/* ผลประเมินผลของ SA */}
                                <Row
                                    hidden={
                                        (userstate.issuedata.details[0]?.IssueType === "ChangeRequest" || userstate.issuedata.details[0]?.IssueType === "Memo") &&
                                            userstate.issuedata.details[0]?.IsAssessment !== 0 ? false : true
                                    }
                                    style={{ marginBottom: 20 }}>
                                    <Col span={18}>
                                        <label className="header-text">ผลประเมินผลของ SA</label>
                                        <Button icon={<InfoCircleOutlined />} type="link" onClick={() => setModalAssessment_visible(true)} />
                                    </Col>
                                </Row>

                                {/* ผลการอนุมัติ */}
                                <Row
                                    hidden={
                                        (userstate.issuedata.details[0]?.IssueType === "ChangeRequest" || userstate.issuedata.details[0]?.IssueType === "Memo") &&
                                            (userstate?.mailbox[0]?.NodeName === "cr_center" || userstate?.mailbox[0]?.NodeName === "approver") &&
                                            userstate.issuedata.details[0]?.IsTicketApprove !== 0 ? false : true
                                    }
                                    style={{ marginBottom: 20 }}>
                                    <Col span={18}>
                                        <label className="header-text">
                                            ผลการอนุมัติ
                                        </label>
                                        <Divider type="vertical" />
                                        <label className="header-text"
                                            style={{
                                                color: userstate.issuedata.details[0]?.ApproveResultText === "รออนุมัติ" ? "orange" :
                                                    userstate.issuedata.details[0]?.ApproveResultText === "อนุมัติ" ? "#00CC00" : "#FF4D4F"
                                            }}
                                        >
                                            {userstate.issuedata.details[0]?.ApproveResultText}
                                        </label>
                                        <Button icon={<InfoCircleOutlined />} type="link" onClick={() => setModalTicketApproveLog(true)} />
                                    </Col>
                                </Row>

                            </Col>
                            {/* SideBar */}
                        </Row>
                    </div>

                </Skeleton>
                {/* Modal */}
                <Modal
                    title="Preview"
                    width={1000}
                    visible={modalpreview}
                    okButtonProps={{ hidden: true }}
                    cancelText="Close"
                    onCancel={() => setModalpreview(false)}
                >
                    <Row>
                        <Col span={16} style={{ display: "inline" }}>
                            <Typography.Title level={4}>
                                <Avatar size={32} icon={<UserOutlined />} />&nbsp;&nbsp;  {userstate.issuedata.details[0] && userstate.issuedata.details[0].Title}
                            </Typography.Title>
                        </Col>
                    </Row>

                    <div className="issue-description"
                        dangerouslySetInnerHTML={{ __html: userstate?.issuedata?.details[0]?.Description }} >

                    </div>
                    {/* <img 
            src="https://space-api.iconrem.com/files/16"
            /> */}
                </Modal>

                {/* ประวัติ DueDate Customer */}
                <DuedateLog
                    title="ประวัติ DueDate"
                    visible={historyduedate_visible}
                    onCancel={() => setHistoryduedate_visible(false)}
                    details={{
                        ticketId: userstate?.issuedata.details[0]?.Id
                    }}
                />

                <ModalTimetracking
                    title="Time Tracking"
                    width={600}
                    visible={modaltimetracking_visible}
                    onCancel={() => { return (setModaltimetracking_visible(false)) }}
                    details={{
                        transgroupId: userstate?.mailbox[0]?.TransGroupId,
                    }}
                />

                <ModalMandayLog
                    title="ข้อมูล Manday"
                    visible={modalmandaylog_visible}
                    width={800}
                    onCancel={() => { return (setModalmandaylog_visible(false)) }}
                    details={{
                        ticketid: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
                        mailtype: userstate?.mailbox[0]?.MailType,
                        cost: userstate.issuedata.details[0]?.Cost,
                        totalmanday: userstate.issuedata.details[0]?.Manday
                    }}
                />

                <ModalSA_Assessment
                    title="ข้อมูลประเมิน ผลกระทบ"
                    visible={modalAssessment_visible}
                    width={600}
                    onCancel={() => { return (setModalAssessment_visible(false)) }}
                    details={{
                        ticketid: userstate.issuedata.details[0]?.Id,
                    }}
                />

                <PreviewImg
                    title="Preview"
                    visible={modalPreview}
                    width={1200}
                    footer={null}
                    onCancel={() => {
                        setModalPreview(false);
                        setImgUrl(null);
                    }}
                    pathUrl={imgUrl}
                />

                <ModalFileDownload
                    title="File Download"
                    visible={modalfiledownload_visible}
                    onCancel={() => { return (setModalfiledownload_visible(false)) }}
                    width={600}
                    onOk={() => {
                        setModalfiledownload_visible(false);

                    }}
                    details={{
                        refId: userstate?.issuedata?.details[0]?.Id,
                        reftype: "Master_Ticket",
                        grouptype: "attachment"
                    }}
                />

                <ModalTicketApproveLog
                    title="ผลการอนุมัติ"
                    visible={modalTicketApproveLog}
                    width={800}
                    onCancel={() => setModalTicketApproveLog(false)}
                    onOk={() => {
                        setModalTicketApproveLog(false);
                    }}
                    details={{
                        ticketId: userstate?.issuedata?.details[0]?.Id,
                        manday: userstate?.issuedata?.details[0]?.Manday === null ? userstate?.issuedata?.details[0]?.cntManday : userstate?.issuedata?.details[0]?.Manday
                    }}
                />

                {/* Manual Complete and Cancel */}
                <Modal
                    visible={visible}
                    title={ProgressStatus}
                    confirmLoading={loading}
                    width={600}
                    okText="Send"
                    onOk={() => {
                        if (ProgressStatus === "Complete") {
                            completeIssue()
                        } else {
                            cancelIssue()
                        }
                    }}
                    okButtonProps={{ type: "primary", htmlType: "submit" }}
                    okType="dashed"
                    onCancel={() => {
                        setVisible(false);
                        editorRef.current.setvalue();
                    }}
                >
                    <Spin spinning={loading} size="large" tip="Loading...">
                        <Form style={{ padding: 0, maxWidth: "100%", backgroundColor: "white" }}
                            name="qa-test"
                            layout="vertical"
                            className="login-form"
                            initialValues={{
                                remember: true,
                            }}
                        >
                            <Form.Item
                                name="remark"
                                label="Remark :"
                            >
                                <TextEditor ref={editorRef} ticket_id={match.params.id} />
                            </Form.Item>
                        </Form>
                    </Spin>
                </Modal >
            </Spin >
        </MasterPage >
    );
}

export function RenderSLA({ sla = 0, ticket_sla = 0, priority = "" }) {

    const calculateTime = new CalculateTime();

    function rederSLAPriority(sla, ticket_sla, priority) {
        switch (priority) {
            case 'Critical':
                return (
                    <>
                        {ticket_sla < sla ?

                            <label className="value-text">
                                {
                                    calculateTime.countSLACritical(sla, ticket_sla).en_1.d === 0 ? "" : `${calculateTime.countcountSLACriticalDownSLA(sla, ticket_sla).en_1.d}d `
                                }
                                {
                                    calculateTime.countSLACritical(sla, ticket_sla).en_1.h === 0 ? "" : `${calculateTime.countSLACritical(sla, ticket_sla).en_1.h}h `
                                }
                                {
                                    calculateTime.countSLACritical(sla, ticket_sla).en_1.m === 0 ? "" : `${calculateTime.countSLACritical(sla, ticket_sla).en_1.m}m `
                                }

                            </label>
                            :
                            <label className="value-text">
                                {"-"}
                                {
                                    calculateTime.countSLACriticalOverDue(ticket_sla).en_1.d === 0 ? "" : `${calculateTime.countSLACriticalOverDue(ticket_sla).en_1.d}d `
                                }
                                {
                                    calculateTime.countSLACriticalOverDue(ticket_sla).en_1.h === 0 ? "" : `${calculateTime.countSLACriticalOverDue(ticket_sla).en_1.h}h `
                                }
                                {
                                    calculateTime.countSLACriticalOverDue(ticket_sla).en_1.m === 0 ? "" : `${calculateTime.countSLACriticalOverDue(ticket_sla).en_1.m}m `
                                }
                            </label>
                        }
                    </>
                )
            default:
                return (
                    <>
                        {ticket_sla < sla ?

                            <label className="value-text">
                                {
                                    calculateTime.countDownSLA(sla, ticket_sla).en_1.d === 0 ? "" : `${calculateTime.countDownSLA(sla, ticket_sla).en_1.d}d `
                                }
                                {
                                    calculateTime.countDownSLA(sla, ticket_sla).en_1.h === 0 ? "" : `${calculateTime.countDownSLA(sla, ticket_sla).en_1.h}h `
                                }
                                {
                                    calculateTime.countDownSLA(sla, ticket_sla).en_1.m === 0 ? "" : `${calculateTime.countDownSLA(sla, ticket_sla).en_1.m}m `
                                }

                            </label>
                            :
                            <label className="value-text">
                                {"-"}
                                {
                                    calculateTime.countSLAOverDue(sla, ticket_sla).en_1.d === 0 ? "" : `${calculateTime.countSLAOverDue(sla, ticket_sla).en_1.d}d `
                                }
                                {
                                    calculateTime.countSLAOverDue(sla, ticket_sla).en_1.h === 0 ? "" : `${calculateTime.countSLAOverDue(sla, ticket_sla).en_1.h}h `
                                }
                                {
                                    calculateTime.countSLAOverDue(sla, ticket_sla).en_1.m === 0 ? "" : `${calculateTime.countSLAOverDue(sla, ticket_sla).en_1.m}m `
                                }
                            </label>
                        }
                    </>
                )
        }
    }

    return (
        <Button
            type="default"
            className={
                ticket_sla < sla ? "sla-warning" : "sla-overdue"
            }
            size="middle"
            shape="round"
            ghost={ticket_sla < sla ? true : false}
        >

            {rederSLAPriority(sla, ticket_sla, priority)}
            < ClockCircleOutlined style={{ fontSize: 16, verticalAlign: "0.1em" }} />
        </Button>
    )
}
