import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Modal, Row, Col } from 'antd';
import moment from "moment";
import Axios from 'axios';




export default function ModalSA_Assessment({ visible = false, onOk, onCancel, details, ...props }) {
    const history = useHistory();
    const [assessment, setAssessment] = useState([]);

    const LoadAssessment = async () => {
        const result = await Axios({
            url: process.env.REACT_APP_API_URL + "/tickets/load-issue-assessment",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                ticketid: details.ticketid
            }
        });

        if (result.status === 200) {
            setAssessment(result.data);
        }
    }

    useEffect(() => {
        if (visible === true) {
            LoadAssessment();
        }
    }, [visible])

    return (
        <Modal
            visible={visible}
            okButtonProps={{ hidden: true }}
            cancelText="Close"
            onCancel={() => onCancel()}
            {...props}
        >
            <Row>
                <Col span={6}>
                    <label className="header-text">ผู้ประเมิน</label>
                </Col>
                <Col span={18}>
                    <label className="value-text"> {assessment?.UserName} </label>
                </Col>
            </Row>
            <Row style={{marginTop: 12}}>
                <Col span={6}>
                    <label className="header-text">วันที่ประเมิน</label>
                </Col>
                <Col span={18}>
                    <label className="value-text">{moment(assessment?.CreateDate).format("DD/MM/YYYY HH:mm")}</label>
                </Col>
            </Row>
            <Row style={{marginTop: 12}}>
                <Col span={6}>
                    <label className="header-text">STD Version</label>
                </Col>
                <Col span={18}>
                    <label className="value-text">{assessment?.STD === true ? "อยู่ใน Version " + assessment?.Version : "ไม่อยู่ใน STD Version"}</label>
                </Col>
            </Row>
            <Row style={{marginTop: 12}}>
                <Col span={6}>
                    <label className="header-text">ผลกระทบ</label>
                </Col>
                <Col span={18}>
                    <label className="value-text">{assessment?.IssueEffect === true ? assessment?.Description : "ไม่มีผลกระทบ"}</label>
                </Col>
            </Row>
        </Modal>
    )
}
