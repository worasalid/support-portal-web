import React, { useEffect, useRef, useState } from 'react'
import { Spin, Skeleton, Row, Col, Button, Avatar, Typography, Select, Divider, Modal, Form, Tabs } from "antd";
import {
    LeftCircleOutlined, UserOutlined, UpCircleOutlined, DownCircleOutlined
} from "@ant-design/icons";
import MasterPage from '../MasterPage';
import axios from "axios"
import { useHistory, useRouteMatch } from 'react-router-dom';
import Historylog from '../../../Component/History/Internal/Historylog';

const { Option } = Select;
const { TabPane } = Tabs;

export default function CaseSubject() {
    const match = useRouteMatch();
    const history = useHistory();
    const [form] = Form.useForm();
    const [loadingPage, setLoadingPage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [caseDetails, setCaseDetails] = useState([]);
    const [issueType, setIssueType] = useState(null);
    const [caseHistory, setCaseHistory] = useState([]);

    const [divcollapse, setDivcollapse] = useState("block")
    const [collapsetext, setCollapsetext] = useState("Hide details");
    const [activityCollapse, setActivityCollapse] = useState("block");
    const [activityIcon, setActivityIcon] = useState(<DownCircleOutlined style={{ fontSize: 20, color: "#1890ff" }} />);
    const [imgUrl, setImgUrl] = useState(null);
    const [modalPreview, setModalPreview] = useState(false);
    const [modalSend, setModalSend] = useState(false);


    const getCaseDetail = async () => {
        setLoadingPage(true);
        await axios.get(`${process.env.REACT_APP_API_URL}/callcenter/case/details`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                caseId: match.params.caseid
            }
        }).then((res) => {
            setCaseDetails(res.data[0]);
            setLoadingPage(false);

        }).catch((error) => {

        });
    }

    const getIssueType = async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/master/issue-types`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
        }).then((res) => {
            setIssueType(res.data);
        }).catch((error) => {

        });
    }

    const saveData = async (param) => {
        setLoading(true);
        await axios({
            url: `${process.env.REACT_APP_API_URL}/callcenter/case/convert`,
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                caseId: match.params.caseid,
                issueType: param.issueType
            }
        }).then(() => {
            setLoading(false);
            Modal.success({
                content: 'บันทึกข้อมูลสำเร็จ',
                onOk() {
                    history.push({ pathname: "/internal/callcenter/case" })
                },
            });
        }).catch(() => {
            setLoading(false);
            Modal.error({
                content: 'บันทึกข้อมูลไม่สำเร็จ',
                onOk() {

                },
            });
        })
    }

    const completeCase = async () => {
        setLoading(true);
        await axios({
            url: `${process.env.REACT_APP_API_URL}/callcenter/case/complete`,
            method: "PATCH",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                caseId: match.params.caseid,
            }
        }).then((res) => {
            setLoading(false);
            Modal.success({
                content: 'บันทึกข้อมูลสำเร็จ',
                onOk() {
                    history.push({ pathname: "/internal/callcenter/case" })
                },
            });
        }).catch((error) => {
            setLoading(false);
            Modal.error({
                content: 'บันทึกข้อมูลไม่สำเร็จ',
                onOk() {

                },
            });
        })
    }

    const onFinish = (value) => {
        saveData(value);
    }

    useEffect(() => {
        getCaseDetail();
    }, [])

    useEffect(() => {
        if (modalSend) {
            getIssueType();
        }
    }, [modalSend])

    return (
        <MasterPage>
            <Spin spinning={loadingPage} tip="Loading..." style={{ height: "100vh" }}>
                <Skeleton loading={loadingPage}>
                    <div style={{ height: "100%", overflowY: 'hidden' }} >
                        <Row style={{ height: 'calc(100% - 0px)' }}>
                            <Col span={16} style={{ padding: "0px 24px 24px 24px", height: "100%", overflowY: "scroll" }}>
                                {/* Header เลข Case */}
                                <Row style={{ textAlign: "left" }}>
                                    <Col span={24} style={{ textAlign: "left" }}>
                                        <div offsetTop={10} style={{ zIndex: 100, overflow: "hidden", position: "fixed", width: "400px" }}>
                                            <Button
                                                type="link"
                                                icon={<LeftCircleOutlined />}
                                                // style={{zIndex:99}}
                                                style={{ fontSize: 18, padding: 0, backgroundColor: "white", width: "100%", textAlign: "left" }}
                                                onClick={() => history.goBack()}
                                            >
                                                Back
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>

                                <Row style={{ marginTop: 30 }} align="middle">
                                    <Col span={24}>
                                        <label className="topic-text">
                                            {caseDetails?.CaseNumber}
                                        </label>
                                    </Col>
                                </Row>

                                {/* Case Description */}
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
                                                        {caseDetails.Title}
                                                    </Typography.Title>
                                                </Col>
                                                <Col span={6} style={{ display: "inline", textAlign: "right" }}>
                                                    <Button title="file attach" type="link"
                                                        // style={{ display: userstate?.issuedata?.details[0]?.cntFile === 0 ? "none" : "inline-block" }}
                                                        icon={<img
                                                            style={{ height: "20px", width: "20px" }}
                                                            src={`${process.env.PUBLIC_URL}/icons-attach.png`}
                                                            alt=""
                                                        />}
                                                    // onClick={() => setModalfiledownload_visible(true)}
                                                    />
                                                    <Button title="preview" type="link"
                                                        icon={<img
                                                            style={{ height: "20px", width: "20px" }}
                                                            src={`${process.env.PUBLIC_URL}/icons-expand.png`}
                                                            alt=""
                                                        />}
                                                        onClick={() => setModalPreview(true)}
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
                                                        dangerouslySetInnerHTML={{ __html: caseDetails.Description }}
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
                                                <Tabs defaultActiveKey={"1"}>
                                                    <TabPane tab="History" key="1">
                                                        <Historylog type='Case' />
                                                    </TabPane>
                                                </Tabs>
                                            }
                                        </div>
                                    </Col>
                                </Row>
                            </Col>

                            {/* SideBar */}
                            <Col span={8} style={{ padding: "0px 0px 0px 20px", height: "100%", overflowY: "auto" }}>
                                <Row style={{ marginBottom: 20, marginTop: 24 }}>
                                    <Col span={18}>
                                        <label className="header-text">Progress Status</label>
                                        <br />
                                        {
                                            caseDetails.ProgressStatus === "InProgress"
                                                ?
                                                <Select
                                                    // placeholder="คลิกเพื่อแจ้ง Issue"
                                                    style={{ width: "100%" }}
                                                    value={caseDetails.ProgressStatus}
                                                    onChange={(value) => {
                                                        value === 1 ? setModalSend(true) :

                                                            Modal.info({
                                                                title: 'ปิด Complete',
                                                                content: (
                                                                    <div>
                                                                        <p>เลข {caseDetails?.CaseNumber}</p>
                                                                    </div>
                                                                ),
                                                                okCancel() {

                                                                },
                                                                onOk() {
                                                                    completeCase();
                                                                },
                                                            });
                                                    }}
                                                >
                                                    <Option value={1}>แจ้ง Issue</Option>
                                                    <Option value={2}>ปิด Completed</Option>
                                                </Select>
                                                :
                                                <label className="value-text">
                                                    {caseDetails.ProgressStatus}
                                                </label>
                                        }
                                    </Col>
                                </Row>

                                <Row style={{ marginBottom: 20 }}>
                                    <Col span={18}>
                                        <label className="header-text">Company</label>
                                        <br />
                                        <label className="value-text">
                                            {
                                                caseDetails.CompanyName
                                            }
                                        </label>
                                        <Divider type='vertical' />
                                        <label className="value-text">
                                            {caseDetails.CompanyFullName}
                                        </label>
                                    </Col>
                                </Row>

                                <Row style={{ marginBottom: 20 }}>
                                    <Col span={18}>
                                        <label className="header-text">Product</label>
                                        <br />
                                        <label className="value-text">
                                            {
                                                caseDetails.ProductCode
                                            }
                                        </label>
                                        <Divider type='vertical' />
                                        <label className="value-text">
                                            {caseDetails.ProductName}
                                        </label>
                                    </Col>
                                </Row>

                                <Row style={{ marginBottom: 20 }}>
                                    <Col span={18}>
                                        <label className="header-text">Scene</label>
                                        <br />
                                        <label className="value-text">
                                            {
                                                caseDetails.Scene
                                            }
                                        </label>

                                    </Col>
                                </Row>

                                <Row style={{ marginBottom: 20 }}>
                                    <Col span={18}>
                                        <label className="header-text">ผู้แจ้ง</label>
                                        <br />
                                        <label className="value-text">
                                            {
                                                caseDetails.InfomerName
                                            }
                                        </label>
                                        <Divider type='vertical' />
                                        <label className="value-text">
                                            Tel. {caseDetails.InformerTel}
                                        </label>

                                    </Col>
                                </Row>

                                <Row style={{ marginBottom: 20 }}>
                                    <Col span={18}>
                                        <label className="header-text">วันที่แจ้ง</label>
                                        <br />
                                        <label className="value-text">
                                            {
                                                caseDetails.CreateDate
                                            }
                                        </label>

                                    </Col>
                                </Row>

                                <Row style={{ marginBottom: 20 }}>
                                    <Col span={18}>
                                        <label className="header-text">ผู้รับแจ้ง</label>
                                        <br />
                                        <label className="value-text">
                                            {
                                                caseDetails.Owner
                                            }
                                        </label>

                                    </Col>
                                </Row>

                            </Col>

                        </Row>
                    </div>
                </Skeleton>
            </Spin >

            <Modal
                visible={modalSend}
                confirmLoading={loading}
                title="แจ้ง Issue"
                width={600}
                onCancel={() => setModalSend(false)}
                onOk={() => form.submit()}
                okText="Send"
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="IssueType"
                        name="issueType"
                        rules={[{ required: true, message: 'กรุณาระบุ Issue Type!' }]}
                    >
                        <Select
                            placeholder="ระบุ Issue Type"
                            options={issueType && issueType.map((n, index) => ({ value: n.Id, label: n.Name }))}
                        >

                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </MasterPage >
    )
}