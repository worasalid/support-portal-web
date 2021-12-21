import React, { useContext } from 'react'
import { Row, Col, Input, Button, DatePicker, Select, Checkbox, Tooltip } from 'antd'
import { SearchOutlined, TrademarkOutlined } from '@ant-design/icons'
import Axios from 'axios';
import { useEffect } from 'react';
import AuthenContext from '../../../utility/authenContext';
import IssueContext, { caseState } from '../../../utility/issueContext';
import CallCenterContext from '../../../utility/callcenterContext';
import axios from 'axios';


export default function Issuesearch({ Progress = "hide" }) {
    const { RangePicker } = DatePicker;
    const { Option, OptGroup } = Select;
    const { state, dispatch } = useContext(AuthenContext);
    const { state: caseState, dispatch: caseDispatch } = useContext(CallCenterContext);

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
            caseDispatch({ type: "SELECT_COMPANY", payload: e.target.value })
        }
        if (e.target.group === "product") {
            console.log("product", e.target.value)
            caseDispatch({ type: "SELECT_PRODUCT", payload: e.target.value })
        }
        if (e.target.group === "scene") {
            caseDispatch({ type: "SELECT_SCENE", payload: e.target.value })
        }
        if (e.target.group === "user") {
            caseDispatch({ type: "SELECT_USERS", payload: e.target.value })
        }
        
        if (e.target.group === "date") {
            caseDispatch({ type: "SELECT_DATE", payload: { startdate: e.target.value[0], enddate: e.target.value[1] } })
        }
        if (e.target.group === "keyword") {
            caseDispatch({ type: "SELECT_KEYWORD", payload: e.target.value })
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
        caseDispatch({ type: "LOAD_COMPANY", payload: company.data });
    }

    const getproducts = async () => {
        const products = await Axios({
            url: process.env.REACT_APP_API_URL + "/master/products",
            method: "get",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            }
        });
        caseDispatch({ type: "LOAD_PRODUCT", payload: products.data });
    }

    const getUser = async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/master/organize/user`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                organize_id: 1
            }
        }).then((res) => {
            caseDispatch({ type: "LOAD_USER", payload: res.data });
        }).catch((error) => {

        })
    }

    const getMasterdata = async () => {
        try {
            getcompany();
            getproducts();
            getUser();

        } catch (error) {

        }
    }

    useEffect(() => {
        if (state.authen === false) {

        } else {
            getMasterdata();
            setInterval(() => {
                caseDispatch({ type: "SEARCH", payload: true })
            }, 100000)
        }
    }, [state.authen]);



    return (
        <>
            <Row style={{ padding: "0px 0px 0px 24px", marginBottom: 16, textAlign: "left" }} gutter={[16, 16]}>
                <Col span={4} >

                </Col>
                <Col span={4} >

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
                        // onClick={() => getcompany()}
                        options={caseState.masterdata && caseState.masterdata.companyState.map((x) => ({ value: x.Id, label: x.Name, id: x.Id }))}
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
                        // onClick={() => getproducts()}
                        options={caseState.masterdata && caseState.masterdata.productState.map((x) => ({ value: x.Id, label: `${x.Name}` }))}

                    />
                </Col>
                <Col span={4} >
                    <Select placeholder="ผู้รับแจ้ง" mode="multiple" allowClear
                        filterOption={(input, option) =>
                            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        style={{ width: "100%" }}
                        maxTagCount={1}
                        onChange={(value, option) => handleChange({ target: { value: value || "", group: "user" } })}
                        // onClick={() => getcompany()}
                        options={caseState.masterdata && caseState.masterdata.userState.map((x) => ({ value: x.UserId, label: x.DisplayName }))}
                    >

                    </Select>
                </Col>
                <Col span={2}>
                    <Button type="primary" shape="round" icon={<SearchOutlined />}
                        style={{ backgroundColor: "#00CC00" }}
                        onClick={() => caseDispatch({ type: "SEARCH", payload: true })}
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
                    <Input placeholder="เลข Case / Subject" name="subject" prefix=""
                        suffix={<SearchOutlined />}
                        onChange={(value) => handleChange({ target: { value: value.target.value || "", group: 'keyword' } })}
                        onKeyDown={(x) => {
                            if (x.keyCode === 13) {
                                caseDispatch({ type: "SEARCH", payload: true })
                            }
                        }}
                    />
                </Col>

            </Row>
        </>
    )
}
