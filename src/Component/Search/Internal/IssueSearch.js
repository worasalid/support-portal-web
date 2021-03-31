import React, { useReducer, useContext, useState } from 'react'
import { Row, Col, Input, Button, DatePicker, Select, Checkbox, Tooltip } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import Axios from 'axios';
import { useEffect } from 'react';
import AuthenContext from '../../../utility/authenContext';
import IssueContext, { userState } from '../../../utility/issueContext';


export default function Issuesearch({ Progress = "hide" }) {
    const { RangePicker } = DatePicker;
    //const { Option } = Select;
    const { state, dispatch } = useContext(AuthenContext);
    const { state: userstate, dispatch: userdispatch } = useContext(IssueContext);

    const progressstatus = [
        {
            value: "Open",
            text: "Open"
        },
        {
            value: "InProgress",
            text: "InProgress"
        },
        {
            value: "Resolved",
            text: "Resolved"
        },
        {
            value: "ReOpen",
            text: "ReOpen"
        },
        {
            value: "Complete",
            text: "Complete"
        },
    ]

    const sceneData = [
        {
            value: "None",
            text: "None"
        },
        {
            value: "Application",
            text: "Application"
        },
        {
            value: "Report",
            text: "Report"
        },
        {
            value: "Printform",
            text: "Printform"
        },
        {
            value: "Data",
            text: "Data"
        },
    ]


    const handleChange = (e) => {
        if (e.target.group === "company") {
            userdispatch({ type: "SELECT_COMPANY", payload: e.target.value })
        }
        if (e.target.group === "issuetype") {
            userdispatch({ type: "SELECT_TYPE", payload: e.target.value })
        }
        if (e.target.group === "product") {
            console.log("product", e.target.value)
            userdispatch({ type: "SELECT_PRODUCT", payload: e.target.value })
        }
        if (e.target.group === "module") {
            userdispatch({ type: "SELECT_MODULE", payload: e.target.value })
        }
        if (e.target.group === "progress") {
            userdispatch({ type: "SELECT_PROGRESS", payload: e.target.value })
        }
        if (e.target.group === "scene") {
            userdispatch({ type: "SELECT_SCENE", payload: e.target.value })
        }
        if (e.target.group === "date") {
            userdispatch({ type: "SELECT_DATE", payload: { startdate: e.target.value[0], enddate: e.target.value[1] } })
        }
        if (e.target.group === "keyword") {
            userdispatch({ type: "SELECT_KEYWORD", payload: e.target.value })
        }
        if (e.target.group === "release_note") {
            userdispatch({ type: "SELECT_ISRELEASENOTE", payload: e.target.value })
        }
    }
    const getcompany = async () => {
        const company = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/company",
            method: "get",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            }
        });
        userdispatch({ type: "LOAD_COMPANY", payload: company.data });
    }

    const getproducts = async () => {
        const products = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/products",
            method: "get",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            }
        });
        userdispatch({ type: "LOAD_PRODUCT", payload: products.data });
    }

    const getmodule = async () => {
        const module = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/modules",
            method: "get",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                productId: userstate.filter.productState
            }
        });
        userdispatch({ type: "LOAD_MODULE", payload: module.data });

    }

    const getissue_type = async () => {
        const issue_type = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/issue-types",
            method: "get",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
        });
        userdispatch({ type: "LOAD_TYPE", payload: issue_type.data });

    }

    const getMasterdata = async () => {
        try {
            // getcompany();
            // getproducts();
            // getmodule();
            // getissue_type();
        } catch (error) {

        }
    }
    useEffect(() => {
        if (state.authen) {
            getMasterdata();
        }
    }, [state.authen]);

    useEffect(() => {
        if (userstate.filter.productState.length !== 0) {
            getmodule();
        }
    }, [userstate.filter.productState]);


    return (
        <>
            <Row style={{ padding: "0px 0px 0px 24px", marginBottom: 16, textAlign: "left" }} gutter={[16, 16]}>
                <Col span={4}>
                    <Select placeholder="Progress"
                        style={{ width: "100%", display: Progress === "show" ? "block" : "none" }}
                        mode="multiple"
                        showSearch
                        allowClear
                        maxTagCount={1}
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={(value) => handleChange({ target: { value: value || "", group: 'progress' } })}
                        options={progressstatus.map((x) => ({ value: x.value, label: x.text }))}

                    />
                </Col>
                <Col span={4} >
                    <Select placeholder="Company" mode="multiple" allowClear
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        style={{ width: "100%" }}
                        maxTagCount={1}
                        // onKeyUp={(e) => {console.log(e.target)}}
                        onChange={(value, option) => handleChange({ target: { value: value || "", group: "company" } })}
                        onClick={() => getcompany()}
                        options={userstate.masterdata && userstate.masterdata.companyState.map((x) => ({ value: x.Id, label: x.Name, id: x.Id }))}
                    >

                    </Select>
                </Col>
                <Col span={4}>
                    <Select placeholder="IssueType" mode="multiple" allowClear
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        maxTagCount={2}
                        style={{ width: "100%" }}
                        onChange={(value) => handleChange({ target: { value: value || "", group: "issuetype" } })}
                        onClick={() => getissue_type()}
                        options={userstate.masterdata && userstate.masterdata.issueTypeState.map((x) => ({ value: x.Id, label: x.Name }))}
                    >

                    </Select>
                </Col>
                <Col span={4}>

                    <Select placeholder="Product" style={{ width: "100%" }}
                        allowClear
                        mode="multiple"
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        //maxTagCount={1}
                        onChange={(value) => handleChange({ target: { value: value || "", group: 'product' } })}
                        onClick={() => getproducts()}
                        options={userstate.masterdata && userstate.masterdata.productState.map((x) => ({ value: x.Id, label: `${x.Name}` }))}

                    />
                </Col>
                <Col span={4}>
                    <Select placeholder="Module"
                        mode='multiple'
                        disabled={userstate?.filter?.productState?.length === 0 ? true : false}
                        style={{ width: "100%" }}
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        maxTagCount={1}
                        allowClear
                        onChange={(value) => handleChange({ target: { value: value || "", group: 'module' } })}
                        options={userstate.masterdata && userstate.masterdata.moduleState.map((x) => ({ value: x.Id, label: x.Name }))}

                    />

                </Col>

                <Col span={2}>
                    <Button type="primary" shape="round" icon={<SearchOutlined />}
                        style={{ backgroundColor: "#00CC00" }}
                        onClick={() => userdispatch({ type: "SEARCH", payload: true })}
                    >
                        Search
                    </Button>
                </Col>
            </Row>
            <Row style={{ padding: "0px 0px 0px 24px", marginBottom: 16 }} gutter={[16, 16]}>
                <Col span={4}>
                    <Select placeholder="Scene"
                        mode='multiple'
                        style={{ width: "100%" }}
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        maxTagCount={1}
                        allowClear
                        onChange={(value) => handleChange({ target: { value: value || "", group: 'scene' } })}
                        options={sceneData.map((x) => ({ value: x.value, label: x.text }))}

                    />
                </Col>
                <Col span={8} >
                    <RangePicker format="DD/MM/YYYY" style={{ width: "100%" }}
                        onChange={(date, dateString) => handleChange({ target: { value: dateString || "", group: 'date' } })}
                    />
                </Col>
                <Col span={8}>
                    <Input placeholder="IssueNo / Subject" name="subject" prefix=""
                        suffix={<SearchOutlined />}
                        onChange={(value) => handleChange({ target: { value: value.target.value || "", group: 'keyword' } })}
                        onKeyDown={(x) => {
                            if (x.keyCode === 13) {
                                userdispatch({ type: "SEARCH", payload: true })
                            }
                        }}
                    />
                </Col>
                <Col span={2}>

                    <Tooltip title="ReleaseNote">
                        <Checkbox onChange={(value) => handleChange({ target: { value: value.target.checked || "", group: 'release_note' } })}>
                            <label style={{ fontSize: 10, display: "inline" }}>Release Note</label>

                        </Checkbox>
                        {/* <Checkbox onChange={(value) => handleChange({ target: { value: value.target.checked || "", group: 'release_note_N' } })}>
                            <label style={{ fontSize: 10, display: "inline" }}>N</label>

                        </Checkbox> */}
                    </Tooltip>

                </Col>
            </Row>
        </>
    )
}
