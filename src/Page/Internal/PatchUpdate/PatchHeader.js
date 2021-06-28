import React, { useEffect, useState, useReducer, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Button, Col, Row, Table, Tooltip, Tag, Modal, Select } from "antd";
import Column from "antd/lib/table/Column";
import moment from "moment";
import Axios from "axios";
import MasterPage from "../MasterPage";
import AuthenContext from "../../../utility/authenContext";
import { DownloadOutlined, TrademarkOutlined, ConsoleSqlOutlined, EyeOutlined } from "@ant-design/icons";


export default function PatchHeader() {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [patchHeader, setPatchHeader] = useState(null);

    const [pageCurrent, setPageCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [pageTotal, setPageTotal] = useState(0);

    const getPatchData = async () => {
        setLoading(true);
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/patch/list-header",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    pageCurrent: pageCurrent,
                    pageSize: pageSize
                }

            });

            if (result.status === 200) {
                setLoading(false);
                setPatchHeader(result.data.data);
                setPageTotal(result.data.total);
            }

        } catch (error) {
            setLoading(false);
        }
    }

    useEffect(() => {
        getPatchData()
    }, [])

    useEffect(() => {
        getPatchData()
    }, [pageCurrent])

    useEffect(() => {
        if (pageCurrent !== 1) {
            setPageCurrent(1);
            setPageSize(10);
        } else {
            getPatchData();
        }
    }, [])

    return (
        <MasterPage>
            <Row style={{ padding: "24px 24px 24px 24px", textAlign: "left" }}>
                <Col span={24}>
                    <label style={{ fontSize: 20, verticalAlign: "top" }}>รายการ Patch Version</label>
                </Col>
            </Row>

            <Row style={{ padding: "24px 24px 24px 24px", textAlign: "left" }}>
                <Col span={24}>
                    <Table dataSource={patchHeader} loading={loading}
                        pagination={{ current: pageCurrent, pageSize: pageSize, total: pageTotal }}

                        onChange={(x) => { setPageCurrent(x.current); setPageSize(x.pageSize) }}
                    >
                        <Column title="Patch_Version" width="20%"
                            key="key"
                            render={(record) => {
                                return (
                                    <>
                                        <label className={record.ReadDate !== null ? "table-column-text" : "table-column-text-unread"}>
                                            {record.Patch_Version}
                                        </label>

                                    </>
                                )
                            }}
                        />
                        <Column title="Description" width="40%"
                            key="key"
                            render={(record) => {
                                return (
                                    <>
                                        <label className="table-column-text">

                                        </label>

                                    </>
                                )
                            }}
                        />
                        <Column title="Cut off Date" width="10%"
                            key="key"
                            render={(record) => {
                                return (
                                    <>
                                        <label className="table-column-text">
                                            {moment(record.CreateDate).format("DD/MM/YYYY")}
                                        </label>

                                    </>
                                )
                            }}
                        />
                        <Column title="Update By" width="10%"
                            key="key"
                            render={(record) => {
                                return (
                                    <>
                                        <label className="table-column-text">
                                            {record.CreateByName}
                                        </label>

                                    </>
                                )
                            }}
                        />
                        <Column title="" width="10%"
                            key="key"
                            render={(record) => {
                                return (
                                    <>
                                        <Button type="link" icon={<EyeOutlined />}
                                            onClick={() => history.push({ pathname: "/internal/patch/details/id-" + record.Id })}
                                        />
                                    </>
                                )
                            }}
                        />

                    </Table>
                </Col>
            </Row>

        </MasterPage>
    )
}