import React, { useReducer, useContext, useState } from 'react'
import { Row, Col, Input, Button, DatePicker, Select, Tag, Spin } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import Axios from 'axios';
import { useEffect } from 'react';
import AuthenContext from '../../../utility/authenContext';
import IssueContext, { userState } from '../../../utility/issueContext';

export default function Issuesearch() {
    const { RangePicker } = DatePicker;
    const { Option } = Select;
    const { state, dispatch } = useContext(AuthenContext);
    const { state: userstate, dispatch: userdispatch } = useContext(IssueContext);

    const handleChange = (e) => {
        if (e.target.group === "company") {
            userdispatch({ type: "SELECT_COMPANY", payload: e.target.value })

        }
        if (e.target.group === "issuetype") {
            userdispatch({ type: "SELECT_TYPE", payload: e.target.value })
        }
        if (e.target.group === "product") {
            userdispatch({ type: "SELECT_PRODUCT", payload: e.target.value })
        }
        if (e.target.group === "module") {
            userdispatch({ type: "SELECT_MODULE", payload: e.target.value })
        }
        if (e.target.group === "date") {
            userdispatch({ type: "SELECT_DATE", payload: { startdate: e.target.value[0], enddate: e.target.value[1] } })
        }
        if (e.target.group === "keyword") {
            userdispatch({ type: "SELECT_KEYWORD", payload: e.target.value })
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
            getcompany();
            getproducts();
            getmodule();
            getissue_type();
        } catch (error) {

        }
    }
    useEffect(() => {
        if (state.authen) {
            getMasterdata();
        }
    }, [state.authen]);

    useEffect(() => {
        if (state.authen) {
            getmodule();

        }
    }, [userstate.filter.productState]);

    return (
        <>
            <Row style={{ marginBottom: 16, textAlign: "left" }} gutter={[16, 16]}>
                <Col span={4}>
                </Col>
                <Col span={4} >
                    <Select placeholder="Company" mode="multiple" allowClear
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        style={{ width: "100%" }}
                        // onKeyUp={(e) => {console.log(e.target)}}
                        onChange={(value, option) => handleChange({ target: { value: value || "", group: "company" } })}
                        options={userstate.masterdata && userstate.masterdata.companyState.map((x) => ({ value: x.Id, label: x.Name, id: x.Id }))}
                    >

                    </Select>
                </Col>
                <Col span={4}>
                    <Select placeholder="IssueType" mode="multiple" allowClear
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        style={{ width: "100%" }}
                        onChange={(value) => handleChange({ target: { value: value || "", group: "issuetype" } })}
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
                        onChange={(value) => handleChange({ target: { value: value || "", group: 'product' } })}
                        options={userstate.masterdata && userstate.masterdata.productState.map((x) => ({ value: x.Id, label: `${x.Name} - (${x.FullName})` }))}
                        dropdownRender={(value) => (
                            <div >
                                <Row>
                                    <Col>
                                        {value}
                                    </Col>
                                    <Col>

                                    </Col>
                                </Row>
                            </div>
                        )
                        }
                    />
                </Col>
                <Col span={4}>
                    <Select placeholder="Module"
                        mode="multiple"
                        style={{ width: "100%" }}
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        allowClear
                        onChange={(value) => handleChange({ target: { value: value || "", group: 'module' } })}
                        options={userstate.masterdata && userstate.masterdata.moduleState.map((x) => ({ value: x.Id, label: x.Name }))}
                        onClear={() => alert()}
                    />
                </Col>

                <Col span={2}>
                    <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: "#00CC00" }}
                        onClick={() => userdispatch({ type: "SEARCH", payload: true })}
                    >
                        Search
                    </Button>
                </Col>
            </Row>
            <Row style={{ marginBottom: 16, textAlign: "right" }} gutter={[16, 16]}>
                <Col span={4}></Col>
                <Col span={8} >
                    <RangePicker format="DD/MM/YYYY" style={{ width: "100%" }}
                        onChange={(date, dateString) => handleChange({ target: { value: dateString || "", group: 'date' } })}
                    />
                </Col>
                <Col span={8}>
                    <Input placeholder="Subject" name="subject" prefix="" suffix={<SearchOutlined />} onChange={(value) => handleChange({ target: { value: value.target.value || "", group: 'keyword' } })}></Input>
                </Col>
            </Row>
        </>
    )
}
