import React, { useState, useEffect } from 'react';
import { Column, Pie } from '@ant-design/charts';
import MasterPage from '../MasterPage'
import { Row, Col, Card, Spin, Table, Select, DatePicker, Checkbox, Button } from 'antd';
import moment from "moment"
import Axios from "axios";
import xlsx from 'xlsx'
import { BarChartOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;


export default function Dashboard4() {
    const [loading, setLoading] = useState(true);

    //data
    const [organize, setOrganize] = useState(null);
    const [user, setUser] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [excelData, setExcelData] = useState([])

    // filter
    const [selectOrganize, setSelectOrganize] = useState(null);
    const [selectUser, setSelecUser] = useState(null);
    const [isStack, setIsStack] = useState(true)

    const chartData_config = {
        xField: 'UserName',
        yField: 'Value',
        seriesField: 'Status',
        //isPercent: true,
        isStack: isStack,
        isGroup: !isStack,
        
       // scrollbar: { type: 'horizontal' },
        slider: {
            start: 0,
            end: 1,
            maxLimit: 100,
        },
        columnWidthRatio: 0.5,
        label: {
            position: 'middle',
            content: function content(item) {
                return item.Value.toFixed(0);
            },
            style: { fill: '#fff' },
        },
        legend: {
            layout: 'horizontal',
            position: 'bottom'
        },
        color: function color(x) {
            switch (x.Status) {
                case "MyTask":
                    return "#5B8FF9"
                    break;
                case "InProgress":
                    return "#87D068"
                    break;
                case "Resolved":
                    return "#FF5500"
                    break;
                case "Cancel":
                    return "#CD201F"
                    break;
                default:
                    break;
            }
        },
        onclick: function onclick() {
            alert()
        },

    };

    const getOrganize = async () => {
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/organize/team",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
            });

            if (result.status === 200) {
                setOrganize(result.data);
                setLoading(false);
            }
        } catch (error) {

        }
    }

    const getOrganizeUser = async () => {
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/organize/user",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    organize_id: selectOrganize && selectOrganize
                }
            });

            if (result.status === 200) {
                setUser(result.data)
            }
        } catch (error) {

        }
    }

    const getData = async () => {
        setLoading(true);
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/dashboard/user/byteam",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                params: {
                    organize_id: selectOrganize,
                    user_id: selectUser
                    // startdate: (selectDate[0] === undefined || selectDate[0] === "") ? "" : moment(selectDate[0], "DD/MM/YYYY").format("YYYY-MM-DD"),
                    // enddate: (selectDate[1] === undefined || selectDate[1] === "") ? "" : moment(selectDate[1], "DD/MM/YYYY").format("YYYY-MM-DD"),
                }
            });

            if (result.status === 200) {
                setChartData(result.data.chartdata);
                setTableData(result.data.tabledata.map((n, index) => ({
                    key: index + 1,
                    username: n.UserName,
                    mytask: n.MyTask,
                    inprogress: n.InProgress,
                    resolved: n.Resolved,
                    cancel: n.Cancel,
                    total: n.Total
                })));

                setLoading(false);
            }

        } catch (error) {
            setLoading(false);
        }


    }

    const ExportExcel = (json) => {
        if (json !== undefined) {
            let ws = xlsx.utils.json_to_sheet(json.map((x) => {
                return {
                    No: x.Row,
                    Issue: x.Number,
                    Company: x.CompanyName,
                    IssueType: x.IssueType,
                    Priority: x.Priority,
                    Status: x.GroupStatus,
                    Title: x.Title,
                    AssignDate: x.AssignIconDate,
                    DueDate: x.DueDate,
                    OverDue: x.OverDue

                }
            }));
            let wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws, 'Issue');
            xlsx.writeFile(wb, `DashBoard Issue By Team - ${moment().format("YYMMDD_HHmm")}.xlsx`);
        }
    }


    useEffect(() => {
        getOrganize()
    }, [])

    useEffect(() => {
        if (selectOrganize !== null) {
            getOrganizeUser()
        }
    }, [selectOrganize])

    useEffect(() => {
        if (selectOrganize !== null || selectUser !== null) {
            getData();
        }

    }, [selectOrganize,selectUser, isStack]);


    return (
        <MasterPage bgColor="#f0f2f5">
            <Spin spinning={loading}>

                <Row gutter={16} style={{ padding: "10px 24px 0px 24px" }}>
                    <Col span={24}>
                        {/* <div > */}
                        <Card
                            title={
                                <Row>
                                    <Col span={10}>
                                        <BarChartOutlined style={{ fontSize: 24, color: "#5BC726" }} /> DashBoard Issue By Team

                                    </Col>
                                    <Col span={8}>
                                        <Select
                                            placeholder="Select Team"
                                            showSearch
                                            style={{ width: "90%" }}
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            onChange={(value, item) => setSelectOrganize(value)}
                                            options={organize && organize.map((x) => ({ value: x.Id, label: x.Name }))}
                                        >
                                        </Select>
                                    </Col>
                                    <Col span={6}>
                                        <Select
                                            placeholder="Select User"
                                            mode='multiple'
                                            disabled={selectOrganize === null ? true : false}
                                            showSearch
                                            allowClear
                                            maxTagCount={2}
                                            style={{ width: "90%" }}
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            onChange={(value) => setSelecUser(value)}
                                            options={user && user.map((n) => ({ value: n.UserId, label: n.DisplayName  }))}
                                        >
                                        </Select>
                                    </Col>
                                </Row>
                            }
                            bordered={true}
                            style={{ width: "100%" }} className="card-dashboard"
                            extra={
                                <>
                                    <Checkbox checked={isStack} onChange={(value) => setIsStack(value.target.checked)}
                                        disabled={selectOrganize === null ? true : false}
                                    >
                                        Is Stack
                                    </Checkbox>
                                    {/* <Button type="link"
                                        hidden={selectOrganize === null ? true : false}
                                        onClick={() => ExportExcel(excelData && excelData)}
                                        title="Excel Export"
                                    >
                                        <img
                                            style={{ height: "25px" }}
                                            src={`${process.env.PUBLIC_URL}/icons-excel.png`}
                                            alt="Excel Export"
                                        />
                                    </Button> */}
                                </>
                            }

                        >
                            <Column {...chartData_config}
                                data={chartData && chartData.filter((n) => n.Value !== 0)}
                                height={300}
                                xAxis={{ position: "bottom" }}
                                
                            />
                        </Card>
                        {/* </div> */}
                    </Col>

                </Row>
                <Row gutter={16} style={{ marginTop: "10px", padding: "10px 24px 24px 24px" }}>
                    <Col span={24}>
                        <Table dataSource={tableData} loading={loading}
                            pagination={{ pageSize: 5 }}
                        >
                            <Column title="No" align="center" key="key"
                                width="10%"
                                render={(record, row, index) => {
                                    return (
                                        <label className="table-column-text12">
                                            {record.key}
                                        </label>
                                    )
                                }}
                            />

                            <Column title="UserName" key="key"
                                align="left"
                                width="65%"
                                render={(record, row, index) => {
                                    return (
                                        <label className="table-column-text12">
                                            {record.username}
                                        </label>
                                    )
                                }}
                            />

                            <Column title="MyTask" dataIndex="mytask" key="key" />
                            <Column title="InProgress" dataIndex="inprogress" key="key" />
                            <Column title="Resolved" dataIndex="resolved" key="key" />
                            <Column title="Cancel" dataIndex="cancel" key="key" />
                            <Column title="Total" dataIndex="total" key="key" />
                        </Table>
                    </Col>

                </Row>
            </Spin>
        </MasterPage>
    )
}
