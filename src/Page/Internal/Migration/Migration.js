import React, { useEffect, useState } from "react";
import { Button, Col, Row, Table, Input, Upload } from "antd";
import { ConsoleSqlOutlined, UploadOutlined } from '@ant-design/icons';
import moment from "moment";
import Axios from "axios";
import MasterPage from "../MasterPage";
import { useHistory } from "react-router";


export default function Migration() {
    const { Column } = Table;

    const history = useHistory();
    const [filterCompany, setFilterCompany] = useState(null);
    const [listcompany, setListcompany] = useState([]);

    const [search, setSearch] = useState(false);
    const [loading, setLoading] = useState(true);
    const [fileList, setFileList] = useState([]);

    const searchCompany = (param) => {
        let result = listcompany.filter(o =>
            Object.keys(o).some(k =>
                String(o[k])
                    .toLowerCase()
                    .includes(param.toLowerCase())
            )
        );
        setFilterCompany(result);
    }

    // function
    const GetCompany = async (value) => {
        try {
            const company_all = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/company",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    id: filterCompany && filterCompany
                }
            });
            if (company_all.status === 200) {
                setTimeout(() => {
                    setLoading(false);
                    setSearch(false)
                }, 1000)
                setListcompany(company_all.data)
            }

        } catch (error) {

        }
    }

    const Uploadprops = {
        name: 'file',
        action: process.env.REACT_APP_API_URL + "/tickets/test-upload",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
        },

        onChange(info) {
            if (info.file.status !== 'uploading') {
                setFileList(info.fileList)
                console.log("info uploading", info)
            }
            if (info.file.status === 'done') {
                console.log("info done", info)
                setFileList(info.fileList)
            } else if (info.file.status === 'error') {
            }
        },
        onRemove(info) {
            console.log("removeinfo", info)
        }
    };

    const upload = async () => {
        await Axios({
            url: process.env.REACT_APP_API_URL + "/master/company",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                files: fileList && fileList
            }
        });
    }

    useEffect(() => {
        GetCompany()
    }, [loading, search])

    return (
        <MasterPage>
            <div style={{ padding: "24px 24px 24px 24px", textAlign: "left" }}>
                <Row style={{ padding: "24px 24px 24px 24px", textAlign: "left" }}>
                    <Col span={24}>
                        <label style={{ fontSize: 20, verticalAlign: "top" }}>Migrate Data</label>
                    </Col>
                </Row>
                <Row style={{ padding: "24px 24px 24px 24px", textAlign: "left" }}>
                    <Col span={24}>
                        <Upload {...Uploadprops} onChange={(info) => Uploadprops.onChange(info)}>
                            <Button icon={<UploadOutlined />}>Click to Attach</Button>
                        </Upload>

                        <Button icon={<UploadOutlined />}
                            onClick={() => upload()}
                        >Click to Upload</Button>
                    </Col>
                </Row>

                {/* Search */}
                <Row gutter={[16, 16]}>
                    <Col span={16}>
                    </Col>
                    <Col span={8}>
                        <Input.Search placeholder="รหัส / ชื่อบริษัท" allowClear
                            enterButton
                            onSearch={searchCompany}
                        />
                    </Col>

                </Row>

                <Row>
                    <Col span={24} style={{ padding: "0px 24px 0px 24px" }}>
                        <Table
                            dataSource={filterCompany === null ? listcompany : filterCompany}
                            loading={loading}>
                            <Column title="Code" width="10%" dataIndex="Code" />
                            <Column title="CompanyName" width="20%" dataIndex="Name" />
                            <Column title="FullName" width="60%" dataIndex="FullNameTH" />
                            <Column title=""
                                align="center"
                                width="10%"
                                render={(record) => {
                                    return (
                                        <>
                                            <Button type="link"
                                                icon={<ConsoleSqlOutlined style={{ fontSize: 24 }} />}
                                                onClick={() => {
                                                    history.push({ pathname: "/internal/migration/sqlscript/comid-" + record.Id });
                                                }}
                                            >

                                            </Button>
                                        </>
                                    )
                                }}
                            />
                        </Table>
                    </Col>
                </Row>
            </div>
        </MasterPage>
    )
}