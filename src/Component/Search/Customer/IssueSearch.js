import React, { useReducer, useContext, useState } from 'react'
import { Row, Col, Input, Button, DatePicker, Select, Tag, Spin } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import Axios from 'axios';
import { productReducer, moduleReducer, issueTypeReducer, keywordReducer, initState } from '../../../utility/reducer';
import { useEffect } from 'react';
import AuthenContext from '../../../utility/authenContext';
import IssueContext from '../../../utility/issueContext';

export default function Issuesearch() {
    const { RangePicker } = DatePicker;
    const { Option } = Select;
    const { state, dispatch } = useContext(AuthenContext);
    const { state: customerstate, dispatch: customerdispatch } = useContext(IssueContext);
    const handleChange = (e) => {
        if (e.target.name === "issuetype") {
            customerdispatch({ type: "SELECT_TYPE", payload: e.target.value })
        }
        if (e.target.name === "product") {
            customerdispatch({ type: "SELECT_PRODUCT", payload: e.target.value })
        }
        if (e.target.name === "module") {
            customerdispatch({ type: "SELECT_MODULE", payload: e.target.value })
        }
        if (e.target.name === "priority") {
            customerdispatch({ type: "SELECT_PRIORITY", payload: e.target.value })
        }
        if (e.target.name === "date") {
            customerdispatch({ type: "SELECT_DATE", payload: { startdate: e.target.value[0], enddate: e.target.value[1] } })
        }
        if (e.target.name === "keyword") {
            customerdispatch({ type: "SELECT_KEYWORD", payload: e.target.value })
        }
    }
    const getproducts = async () => {
        const products = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/products",
            method: "get",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            }
        });
        customerdispatch({ type: "LOAD_PRODUCT", payload: products.data });
    }

    const getmodule = async () => {
        const module = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/modules",
            method: "get",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                productId: customerstate.filter.productState
            }
        });
        customerdispatch({ type: "LOAD_MODULE", payload: module.data });

    }

    const getissue_type = async () => {
        const issue_type = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/issue-types",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
        });
        customerdispatch({ type: "LOAD_TYPE", payload: issue_type.data });

    }

    const getpriority = async () => {
        const priority = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/priority",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
        });
        customerdispatch({ type: "LOAD_PRIORITY", payload: priority.data });
    }

    const getMasterdata = async () => {
        try {
            getproducts();
            getmodule();
            getissue_type();
            getpriority();
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
    }, [customerstate.filter.productState]);
    return (
        <>
            <Row style={{ marginBottom: 16, textAlign: "left" }} gutter={[16, 16]}>
                <Col span={2}>
                </Col>
                <Col span={4}>
                    <Select placeholder="IssueType" mode="multiple" allowClear
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        style={{ width: "100%" }}
                        onChange={(value) => handleChange({ target: { value: value || "", name: "issuetype" } })}
                        options={customerstate.masterdata && customerstate.masterdata.issueTypeState.map((x) => ({ value: x.Id, label: x.Name }))}
                    >

                    </Select>
                </Col>
                <Col span={4}>

                    <Select placeholder="Product" style={{ width: "100%" }}
                        allowClear
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={(value) => handleChange({ target: { value: value || "", name: 'product' } })}
                        options={customerstate.masterdata && customerstate.masterdata.productState.map((x) => ({ value: x.Id, label: `${x.Name} - (${x.FullName})`, group: "Product" }))}
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
                    <Select placeholder="Module" style={{ width: "100%" }}
                        showSearch
                        allowClear
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        onChange={(value) => handleChange({ target: { value: value || "", name: 'module' } })}
                        options={customerstate.masterdata && customerstate.masterdata.moduleState.map((x) => ({ value: x.Id, label: x.Name }))}
                        onClear={() => alert()}
                    />
                </Col>
                <Col span={6} >
                    <RangePicker format="DD/MM/YYYY" style={{ width: "100%" }}
                        onChange={(date, dateString) => handleChange({ target: { value: dateString || "", name: 'date' } })}
                    />
                </Col>
                <Col span={2}>
                    <Button type="primary" icon={<SearchOutlined />} style={{ backgroundColor: "#00CC00" }}
                        onClick={() => customerdispatch({ type: "SEARCH", payload: true })}
                    >
                        Search
                    </Button>
                </Col>
            </Row>
            <Row style={{ marginBottom: 16, textAlign: "left" }} gutter={[16, 16]}>
                <Col span={6}>
                </Col>
                <Col span={4}>
                    <Select placeholder="Priority" style={{ width: "100%" }}
                        allowClear
                        onChange={(value) => handleChange({ target: { value: value || "", name: 'priority' } })}
                        options={customerstate.masterdata && customerstate.masterdata.priorityState.map((x) => ({ value: x.Id, label: x.Name }))}
                        onClear={() => alert()}
                    />
                </Col>
                <Col span={10}>
                    <Input placeholder="Subject" name="subject" prefix="" suffix={<SearchOutlined />} onChange={(value) => handleChange({ target: { value: value.target.value || "", name: 'keyword' } })}></Input>
                </Col>
            </Row>
        </>
    )
}
