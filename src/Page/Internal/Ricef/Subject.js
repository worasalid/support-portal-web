import { Col, Tag, Row, Select, Divider, Typography, Affix, Button, Avatar, Tabs, Modal, Timeline, Popconfirm } from "antd";
import React, { useState, useEffect, useContext, useRef } from "react";
import "../../../styles/index.scss";
import { useHistory, useRouteMatch } from "react-router-dom";
import RicefComment from "../../../Component/Comment/Internal/Ricef_Comment";
import Historylog from "../../../Component/History/Customer/Historylog";
import MasterPage from "../MasterPage";
import { ArrowDownOutlined, ArrowUpOutlined, ClockCircleOutlined, ConsoleSqlOutlined, FileAddOutlined, PoweroffOutlined, UserOutlined } from "@ant-design/icons";
import Axios from "axios";
import RicefContext, { ricefReducer, ricefState } from "../../../utility/ricefContext";
import Clock from "../../../utility/countdownTimer";
import moment from "moment";
import TabsDocument from "../../../Component/Subject/Customer/tabsDocument";
import CommentBox from "../../../Component/Comment/Internal/Internal_comment";


const { Option } = Select;
const { TabPane } = Tabs;


export default function Subject() {
    const match = useRouteMatch();
    const history = useHistory();
    const selectRef = useRef(null)
    const subTaskRef = useRef(null)
    const { state: ricefstate, dispatch: ricefdispatch } = useContext(RicefContext);


    //modal
    // const [visible, setVisible] = useState(false);

    //div
    const [container, setContainer] = useState(null);
    const [divcollapse, setDivcollapse] = useState("block")
    const [collapsetext, setCollapsetext] = useState("Hide details")

    // data
    const [ProgressStatus, setProgressStatus] = useState("");

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
                ricefdispatch({ type: "LOAD_RICEFDETAIL", payload: ricef_detail.data })

            }
        } catch (error) {

        }
    }

    const getIssueType = async () => {
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

    function onChange(value, item) {
        console.log("onChange", value)
        console.log("onChange2", item)
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
                    Modal.success({
                        content: 'บันทึกข้อมูลเรียบร้อยแล้ว',
                        okText: "Close"
                    });
                }


            },
        });
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
            }

        } catch (error) {

        }
    }




    function HandleChange(value, item) {
        console.log("value", value)
        console.log("item", item)
        setProgressStatus(item.label);
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

    }, [])


    return (
        <MasterPage>
            <div style={{ height: "100%" }} >
                <div className="scrollable-container" ref={setContainer} >
                    <Affix target={() => container}>
                        <Row>
                            <Col>
                                <a
                                    href="/#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        history.goBack();
                                    }}
                                >
                                    Back
          </a>
                            </Col>
                        </Row>
                    </Affix>

                    <Row>
                        {/* Content */}
                        <Col span={16} style={{ paddingTop: 10 }}>
                            <div style={{ height: "80vh", overflowY: "scroll" }}>
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
                                                // refId: userstate.issuedata.details[0] && userstate.issuedata.details[0].Id,
                                                //reftype: "Master_Ticket",
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
                                                <Historylog />
                                            </TabPane>
                                        </Tabs>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        {/* Content */}

                        {/* SideBar */}
                        <Col span={6} style={{ backgroundColor: "", height: 500, marginLeft: 20 }}>
                            <Row style={{ marginBottom: 20 }}>
                                <Col span={18}>
                                    <label className="header-text">ProgressStatus</label>
                                </Col>
                                <Col span={18} style={{ marginTop: 10 }}>
                                    <label className="value-text">{ricefstate.recefdetail[0]?.Title}</label>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: 20 }}>
                                <Col span={18} >
                                    <label className="header-text">Type</label>
                                </Col>
                                <Col span={18} >
                                    <label className="value-text">{ricefstate.recefdetail[0]?.IssueType}</label>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: 20 }}>
                                <Col span={18} >
                                    <label className="header-text">DueDate</label>
                                </Col>
                                <Col span={18} >
                                    <label className="value-text">
                                        {moment(ricefstate.recefdetail[0]?.DueDate).format("DD/MM/YYYY")}
                                    </label>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: 20 }} align="middle">
                                <Col span={18}>
                                    <label className="header-text">Priority</label>
                                </Col>
                                <Col span={18}>
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
                                    {/* <label className="value-text">{ricefstate.recefdetail[0]?.Priority}</label> */}
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
                                    <br />
                                    <Select
                                        style={{ width: '100%' }}
                                        allowClear
                                        showSearch

                                        filterOption={(input, option) =>
                                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        onClick={() => LoadModule()}

                                        options={ricefstate.masterdata.moduleState?.map((x) => ({ value: x.Id, label: x.Name, type: "module" }))}
                                        onChange={(value, item) => onChange(value, item)}
                                        value={ricefstate.recefdetail[0]?.ModuleName}
                                    />
                                    {/* <label className="value-text">{ricefstate.recefdetail[0]?.ModuleName}</label> */}
                                </Col>
                            </Row>

                        </Col>
                        {/* SideBar */}
                    </Row>
                </div>
            </div>

        </MasterPage>
    );
}
