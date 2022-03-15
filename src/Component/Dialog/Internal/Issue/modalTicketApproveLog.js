import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Radio, Form, Input } from 'antd';
import axios from 'axios';

export default function ModalTicketApproveLog({ visible = false, onOk, onCancel, details, ...props }) {

    const [approveResult, setApproveResult] = useState(null);
    const [approveHistory, setApproveHistory] = useState([]);

    const getResult = async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/workflow/result-approve`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                ticketId: details?.ticketId
            }
        }).then((res) => {
            setApproveResult(res.data.data[0]);
            setApproveHistory(res.data.datalist);

        }).catch((error) => {
            console.log("error", error)
        });
    }

    useEffect(() => {
        if (visible) {
            getResult();
        }
    }, [visible])

    return (
        <>
            <Modal
                visible={visible}
                cancelText="Close"
                okButtonProps={{ hidden: true }}
                okType="dashed"
                onCancel={() => onCancel()}
                onOk={() => onOk()}

                {...props}
            >
                <Row>
                    <Col span={24}>
                        <label className='header-text' >จำนวน Manday ที่ประเมิน</label> : {`(${details.manday} Manday)`}
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col span={2}>
                        <b><label>ประเภท :</label></b>
                    </Col>
                    <Col span={22}>
                        <label>{approveResult?.ApproveType === 1 ? "ขอฟรี" : "ขอลดราคา"}</label>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col span={24}>
                        <b><label>เหตุผลในการขอ ขอนุมัติ :</label></b>
                    </Col>
                    <Col span={24}>
                        <Input.TextArea disabled rows={5} value={approveResult?.Description} />
                    </Col>
                    <Col span={24} style={{ marginTop: 30 }}>
                        <label className='header-text' >ผลการอนุมัติ :</label>&nbsp;
                        <label
                            style={{
                                color: approveResult?.ApproveResultText === null ? "orange" :
                                    approveResult?.ApproveResultText === "อนุมัติ" ? "#00CC00" : "#FF4D4F"
                            }}
                        >
                            {
                                approveResult?.ApproveResultText === null ? "รออนุมัติ" : approveResult?.ApproveResultText
                            }
                        </label>
                    </Col>
                    <Col span={24} style={{ marginTop: 30 }}>
                        <label className='header-text' >รายละเอียดการอนุมัติ</label>&nbsp;
                    </Col>
                    <Col span={24}>
                        <Input.TextArea disabled rows={5} value={approveResult?.ApproveReason} />
                    </Col>
                </Row>
                <br />
            </Modal>
        </>
    )
}