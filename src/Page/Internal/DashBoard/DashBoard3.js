import React, { useState, useEffect, useRef, useContext } from 'react';
import { Column, Pie } from '@ant-design/charts';
import MasterPage from '../MasterPage'
import { Row, Col, Card, Spin, Table, Select, DatePicker, Checkbox, Button, Empty, Drawer, List, Avatar, notification } from 'antd';
import moment from "moment"
import Axios from "axios";
import xlsx from 'xlsx'
import { BarChartOutlined } from '@ant-design/icons';
import { Icon } from '@iconify/react';
import _ from "lodash";
import Slider from "react-slick";
import TextEditor from '../../../Component/TextEditor';
import AuthenContext from '../../../utility/authenContext';

const { RangePicker } = DatePicker;

export default function Dashboard3() {
    const { state, dispatch } = useContext(AuthenContext);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false);
    const [drawerLoading, setDrawerLoading] = useState(false);
    const [slickCount, setSlickCount] = useState(0);
    const [slick2Count, setSlick2Count] = useState(0);
    const [openDrawer, setOpenDrawer] = useState(false);
    const editorRef = useRef(null);
    const [activeButton, setActiveButton] = useState(false);
    const [selectTicket, setSelectTicket] = useState({
        ticketId: null,
        ticketNumber: ""
    });

    //data
    const [product, setProduct] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [chartDataFilter, setChartDataFilter] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [excelData, setExcelData] = useState([]);
    const [tabProduct, setTabProduct] = useState([]);
    const [tabIconProduct, setTabIconProduct] = useState([]);
    const [dataFilter, setDataFilter] = useState([]);
    const [userChart, setUserChart] = useState([]);
    const [userChartFilter, setUserChartFilter] = useState([]);
    const [tableTeamSummary, setTableTeamSummary] = useState([]);
    const [ticketRemark, setTicketRemark] = useState([]);

    // filter
    const [selectProduct, setSelectProduct] = useState([]);
    const [selectDate, setSelectDate] = useState([]);
    const [isStack, setIsStack] = useState(false);
    const [tabSelect, setTabSelect] = useState("");

    const [selectProductTeam, setSelectProductTeam] = useState([]);
    const [tabSelectProduct, setTabSelectProduct] = useState("");

    // table filter
    const [filterInfo, setFilterInfo] = useState({ NodeName: ['H.DEV', 'DEV'] })
    const [columnIssueTypeFilter, setColumnIssueTypeFilter] = useState([]);
    const [columnNodeFilter, setColumnNodeFilter] = useState([]);
    const [columnDevFilter, setColumnDevFilter] = useState([]);

    const chartData_config = {
        xField: 'CompanyName',
        yField: 'Value',
        seriesField: 'GroupStatus',
        //isPercent: true,
        isStack: isStack,
        isGroup: !isStack,
        //scrollbar: { type: 'horizontal' },
        slider: {
            start: 0,
            end: 1,
            maxLimit: 100,
        },
        columnWidthRatio: 0.4,
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
            // if (x.developer === "InProgress") { return "#5B8FF9" } // สีฟ้า
            if (x.GroupStatus === "InProgress") { return "#52C41A" } // เขียว
            if (x.GroupStatus === "ReOpen") { return "#FF5500" } // สีส้ม
            //if (x.status === "ReOpen") { return "#CD201F" }//สีแดง
        },
        onclick: function onclick() {
            alert()
        },

    };

    const chartUser_config = {
        xField: 'developName',
        yField: 'value',
        seriesField: 'issueType',
        //isPercent: true,
        isStack: isStack,
        isGroup: !isStack,
        //scrollbar: { type: 'horizontal' },
        slider: {
            start: 0,
            end: 1,
            maxLimit: 100,
        },
        columnWidthRatio: 0.4,
        label: {
            position: 'middle',
            content: function content(item) {
                return item?.value?.toFixed(0);
            },
            style: { fill: '#fff' },
        },
        legend: {
            layout: 'horizontal',
            position: 'bottom'
        },
        color: function color(x) {
            // if (x.developer === "InProgress") { return "#5B8FF9" } // สีฟ้า
            if (x.issueType === "CR") { return "#52C41A" } // เขียว
            if (x.issueType === "Memo") { return "#FF5500" } // สีส้ม
            if (x.issueType === "Bug") { return "#CD201F" }//สีแดง
        },
        onclick: function onclick() {
            alert()
        },

    };

    const piechart_config = {
        appendPadding: 10,
        angleField: 'Total',
        colorField: 'CompanyName',
        radius: 0.75,
        label: {
            type: 'spider',
            labelHeight: 28,
            content: '{name} ({value})'
            //content: '{name}\n{percentage}',
        },
        interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    };

    const getProduct = async () => {
        try {
            const result = await Axios({
                url: process.env.REACT_APP_API_URL + "/master/products",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
            });

            if (result.status === 200) {
                setProduct(result.data);
                setLoading(false);
            }
        } catch (error) {

        }
    }

    const getData = async () => {
        setLoading(true);

        await Axios({
            url: process.env.REACT_APP_API_URL + "/dashboard/dashboard3",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                product_id: selectProduct,
                startdate: (selectDate[0] === undefined || selectDate[0] === "") ? "" : moment(selectDate[0], "DD/MM/YYYY").format("YYYY-MM-DD"),
                enddate: (selectDate[1] === undefined || selectDate[1] === "") ? "" : moment(selectDate[1], "DD/MM/YYYY").format("YYYY-MM-DD"),
            }
        }).then((res) => {
            setTabProduct(_.uniqBy(res.data.chartdata, 'Product').map((n) => {
                return {
                    product: n.Product
                }
            }));

            setSlickCount(Math.ceil(res.data.chartdata.length / 10));
            setChartData(res.data.chartdata.map((o, index) => {
                return {
                    no: index + 1,
                    CompanyName: o.CompanyName,
                    GroupStatus: o.GroupStatus,
                    Product: o.Product,
                    Value: o.Value
                }
            }));
            setTableData(res.data.tabledata);
            // setExcelData(res.data.exceldata);
            // setDataFilter(res.data.exceldata);
            // setTableTeamSummary(res.data.teamSummary);

            // setSlick2Count(Math.ceil(res.data.chartUserSummary.length / 4));
            // setUserChart(res.data.chartUserSummary.map((item, index) => {
            //     return {
            //         no: index + 1,
            //         product: item.Product,
            //         developName: item.DeveloperName,
            //         issueType: item.IssueType,
            //         value: item.Value
            //     }
            // }));

            // setColumnIssueTypeFilter(_.uniqBy(res.data.exceldata, 'IssueType').map((item) => {
            //     return {
            //         text: item.IssueType,
            //         value: item.IssueType
            //     }
            // }));

            // setColumnNodeFilter(_.uniqBy(res.data.exceldata, 'NodeName').map((item) => {
            //     return {
            //         text: item.NodeName,
            //         value: item.NodeName
            //     }
            // }));

            // setColumnDevFilter(_.uniqBy(res.data.exceldata, 'DevTeamLead').map((item) => {
            //     return {
            //         text: item.DevTeamLead,
            //         value: item.DevTeamLead
            //     }
            // }));

            setLoading(false);
        }).catch(() => {
            setLoading(false);
        })
    }

    const getDashBoardInternal = async () => {
        setLoading2(true);

        await Axios({
            url: process.env.REACT_APP_API_URL + "/dashboard/dashboard3-internal",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                product_id: selectProductTeam,
                startdate: (selectDate[0] === undefined || selectDate[0] === "") ? "" : moment(selectDate[0], "DD/MM/YYYY").format("YYYY-MM-DD"),
                enddate: (selectDate[1] === undefined || selectDate[1] === "") ? "" : moment(selectDate[1], "DD/MM/YYYY").format("YYYY-MM-DD"),
            }
        }).then((res) => {
            if (selectProductTeam.length === 0) {
                setSelectProductTeam(product.map((item) => item.Id))
            }

            setTabIconProduct(_.uniqBy(res.data.teamSummary, 'Product').map((n) => {
                return {
                    product: n.Product
                }
            }));

            setExcelData(res.data.exceldata);
            setDataFilter(res.data.exceldata);
            setTableTeamSummary(res.data.teamSummary);

            setSlick2Count(Math.ceil(res.data.chartUserSummary.length / 4));
            setUserChart(res.data.chartUserSummary.map((item, index) => {
                return {
                    no: index + 1,
                    product: item.Product,
                    developName: item.DeveloperName,
                    issueType: item.IssueType,
                    value: item.Value
                }
            }));

            setColumnIssueTypeFilter(_.uniqBy(res.data.exceldata, 'IssueType').map((item) => {
                return {
                    text: item.IssueType,
                    value: item.IssueType
                }
            }));

            setColumnNodeFilter(_.uniqBy(res.data.exceldata, 'NodeName').map((item) => {
                return {
                    text: item.NodeName,
                    value: item.NodeName
                }
            }));

            setColumnDevFilter(_.uniqBy(res.data.exceldata, 'DevTeamLead').map((item) => {
                return {
                    text: item.DevTeamLead,
                    value: item.DevTeamLead
                }
            }));

            setLoading2(false);
        }).catch(() => {
            setLoading2(false);
        })
    }

    const ExportExcel = (json) => {
        if (json !== undefined) {
            let ws = xlsx.utils.json_to_sheet(json.map((o, index) => {
                return {
                    No: index + 1,
                    Issue: o.Number,
                    Company: o.CompanyName,
                    IssueType: o.IssueType,
                    Priority: o.Priority,
                    Status: o.GroupStatus,
                    Product: o.Product,
                    Module: o.ModuleName,
                    "Task Status": o.TaskStatus,
                    FlowStatus: o.FlowStatus,
                    "Teamlead (Dev)": o.DevTeamLead === null ? "" : o.DevTeamLead,
                    HandOver: o.NodeName,
                    User: o.DisplayAllName,
                    Title: o.Title,
                    AssignDate: o.AssignIconDate,
                    DueDate: o.DueDate,
                    OverDueAll: o.OverDueAll,
                    OverDue: o.OverDue,
                    "DueDate (Dev)": o.DueDate_Dev,
                    "DueDate (Dev) ครั้งที่ 2": o.DueDate_Dev2,
                    "DueDate (Dev) ครั้งที่ 3": o.DueDate_Dev3

                }
            }));
            let wb = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(wb, ws, 'Issue');
            xlsx.writeFile(wb, `DashBoard All Site (OverDue) By Product - ${moment().format("YYMMDD_HHmm")}.xlsx`);
        }
    }

    const getTicketRemark = async (ticketId) => {
        setDrawerLoading(true);
        await Axios({
            url: process.env.REACT_APP_API_URL + "/tickets/issue-remark",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                ticketId: ticketId
            }
        }).then((res) => {
            setDrawerLoading(false);

            setTicketRemark(res.data.map((item) => {
                return {
                    ticketId: item.ticketId,
                    ticketNumber: item.TicketNumber,
                    description: item.Description,
                    userName: item.DisplayName,
                    profileImg: item.ProfileImage,
                    email: item.Email,
                    remarkDate: moment(item.CreateDate).format("DD/MM/YYYY : HH:mm")
                }
            }))
        }).catch(() => {
            setDrawerLoading(false);
        })
    }

    const saveTicketRemark = async (ticketId) => {
        try {
            if (editorRef?.current?.getValue() === "" || editorRef?.current?.getValue() === null || editorRef?.current?.getValue() === undefined) {
                throw ("กรุณาระบุ Comment!")
            }

            setDrawerLoading(true);
            await Axios({
                url: process.env.REACT_APP_API_URL + "/tickets/issue-remark",
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
                },
                data: {
                    ticketId: ticketId,
                    description: editorRef?.current?.getValue()
                }
            }).then(() => {
                setDrawerLoading(false);
                getTicketRemark(ticketId);
            })
        } catch (error) {
            notification.warning({
                duration: 1.5,
                message: error,
                placement: "bottomRight"
            });
        }
    }

    useEffect(() => {
        getProduct();
    }, [])

    useEffect(() => {
        if (selectProduct.length !== 0) {
            getData();
        }
    }, [selectProduct.length, selectDate && selectDate[0], isStack]);

    // useEffect(() => {
    //     if (selectProductTeam.length !== 0) {
    //         getDashBoardInternal();
    //     }
    // }, [selectProductTeam.length, selectDate && selectDate[0], isStack]);

    useEffect(() => {
        setFilterInfo({ NodeName: ['H.DEV', 'DEV'] })

        setColumnNodeFilter(_.uniqBy(excelData.filter(f => f.Product === tabSelectProduct), 'NodeName').map((item) => {
            return {
                text: item.NodeName === null ? "" : item.NodeName,
                value: item.NodeName === null ? "" : item.NodeName
            }
        }));

        setColumnDevFilter(_.uniqBy(excelData.filter(f => f.Product === tabSelectProduct && f.DevTeamLead !== null), 'DevTeamLead').map((item) => {
            return {
                text: item.DevTeamLead,
                value: item.DevTeamLead
            }
        }));

        const resultUserChart = [...userChart.filter((o) => o.product === tabSelectProduct)];
        setUserChartFilter(resultUserChart);
        setSlick2Count(Math.ceil(resultUserChart.length / 4));
    }, [tabSelectProduct])

    useEffect(() => {
        if (dataFilter?.length !== 0) {
        }
    }, [dataFilter?.length])

    return (
        <MasterPage bgColor="#f0f2f5">

            <Row gutter={16} style={{ padding: "10px 24px 0px 24px" }}>
                <Col span={24}>
                    <Spin spinning={loading}>
                        <Card
                            title={
                                <Row>
                                    <Col span={10}>
                                        <BarChartOutlined style={{ fontSize: 24, color: "#5BC726" }} /> DashBoard All Site (OverDue) By Product

                                    </Col>
                                    <Col span={8}>
                                        <Select
                                            placeholder="Select Product"
                                            mode='multiple'
                                            maxTagCount={1}
                                            showSearch
                                            allowClear
                                            style={{ width: "90%" }}
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            options={product && product.map((x) => ({ value: x.Id, label: `${x.Name} - (${x.FullName})`, code: x.Name }))}
                                            onChange={(value, item) => {
                                                setSelectProduct(value);
                                            }}
                                        >
                                        </Select>
                                    </Col>
                                    <Col span={6}>
                                        <RangePicker format="DD/MM/YYYY" style={{ width: "90%" }}
                                            disabled={selectProduct.length === 0 ? true : false}
                                            onChange={(date, dateString) => setSelectDate(dateString)}
                                        />
                                    </Col>
                                </Row>
                            }
                            bordered={true}
                            style={{ width: "100%" }} className="card-dashboard"
                            extra={
                                <>
                                    <Checkbox onChange={(value) => setIsStack(value.target.checked)}
                                        disabled={selectProduct.length === 0 ? true : false}
                                    >
                                        Is Stack
                                    </Checkbox>
                                    <Button type="link"
                                        hidden={selectProduct.length === 0 ? true : false}
                                        onClick={() => ExportExcel(excelData && excelData)}
                                        title="Excel Export"
                                    >
                                        <img
                                            style={{ height: "25px" }}
                                            src={`${process.env.PUBLIC_URL}/icons-excel.png`}
                                            alt="Excel Export"
                                        />
                                    </Button>
                                </>
                            }
                        >
                            {
                                selectProduct.length === 0 ? <Empty /> :
                                    <>
                                        {/* Product Tags */}
                                        <Row>
                                            {
                                                tabProduct.map((n, index) => (
                                                    <Col span={2}>
                                                        <Button
                                                            type={
                                                                (tabSelect === "" ? tabProduct[0]?.product : tabSelect) === n.product ? 'primary' : 'default'
                                                            }
                                                            shape='round'
                                                            onClick={() => {
                                                                if ((tabSelect === "" ? tabProduct[0]?.product : tabSelect) !== n.product) {
                                                                    setFilterInfo({});
                                                                }
                                                                setTabSelect(n.product);
                                                            }}
                                                        >
                                                            <label>{n.product}</label>
                                                        </Button>
                                                    </Col>
                                                ))
                                            }
                                        </Row>

                                        {/* Company Chart */}
                                        <div style={{ padding: "24px 24px 0px 24px" }}>
                                            <Slider
                                                dots={true}
                                                infinite={true}
                                                speed={500}

                                                slidesToShow={1}
                                                slidesToScroll={1}
                                                swipeToSlide={true}
                                                prevArrow={
                                                    <Icon icon="dashicons:arrow-left-alt2" color="gray" />
                                                }
                                                nextArrow={
                                                    <Icon icon="dashicons:arrow-right-alt2" color="gray" />

                                                }
                                            >

                                                {
                                                    Array.from(Array(slickCount), (e, index) => {
                                                        return (
                                                            <div>
                                                                <Column {...chartData_config}
                                                                    data={
                                                                        chartData.filter((o) => o.Product === (tabSelect === "" ? tabProduct[0]?.product : tabSelect)
                                                                            && (o.no > (index) * 10) && (o.no <= (index + 1) * 10))
                                                                    }
                                                                    height={300}
                                                                    xAxis={{ position: "bottom" }}
                                                                />
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </Slider>
                                        </div>

                                        {/* Company Summary */}
                                        <Row gutter={16} style={{ marginTop: "48px", padding: "0px 0px 24px 24px" }}>
                                            <Col span={10}>
                                                <Card className="card-dashboard" title="">
                                                    <Table dataSource={tabSelect === "" ? tableData : _.filter(tableData, { Product: tabSelect })} loading={loading}
                                                        pagination={{ pageSize: 5 }}
                                                    >
                                                        <Column title="No" align="center"
                                                            width="10%"
                                                            render={(record, row, index) => {
                                                                return (
                                                                    <label className="table-column-text12">
                                                                        {index + 1}
                                                                    </label>
                                                                )
                                                            }}
                                                        />

                                                        <Column title="Company"
                                                            align="left"
                                                            width="65%"
                                                            render={(record, row, index) => {
                                                                return (
                                                                    <label className="table-column-text12">
                                                                        {record.CompanyName}
                                                                    </label>
                                                                )
                                                            }}
                                                        />

                                                        <Column title="InProgress"
                                                            align="center"
                                                            width="10%"
                                                            render={(record, row, index) => {
                                                                return (
                                                                    <label className="table-column-text12">
                                                                        {record.InProgress}
                                                                    </label>
                                                                )
                                                            }}
                                                        />

                                                        <Column title="ReOpen"
                                                            align="center"
                                                            width="10%"
                                                            render={(record, row, index) => {
                                                                return (
                                                                    <label className="table-column-text12">
                                                                        {record.ReOpen}
                                                                    </label>
                                                                )
                                                            }}
                                                        />

                                                        <Column title="Total"
                                                            align="center"
                                                            width="10%"
                                                            render={(record, row, index) => {
                                                                return (
                                                                    <>
                                                                        {record.Total}
                                                                    </>
                                                                )
                                                            }}
                                                        />
                                                    </Table>
                                                </Card>
                                            </Col>
                                            <Col span={14}>
                                                <Card title="Issue Total" bordered={true} style={{ width: "100%" }} loading={loading} className="card-dashboard">
                                                    <Pie {...piechart_config}
                                                        data={tabSelect === "" ? tableData : _.filter(tableData, { Product: tabSelect })}
                                                        height={300}
                                                    />
                                                </Card>

                                            </Col>

                                        </Row>

                                    </>
                            }
                        </Card>
                    </Spin>
                </Col>
            </Row >

            <Row gutter={16} style={{ padding: "24px 24px 0px 24px" }}>
                <Col span={24}>
                    <Spin spinning={loading2}>
                        <Card
                            title={
                                <Row>
                                    <Col span={14}>
                                        <BarChartOutlined style={{ fontSize: 24, color: "#5BC726" }} /> DashBoard (OverDue) By Team

                                    </Col>
                                    <Col span={10}>
                                        <Select
                                            placeholder="Select Product"
                                            mode='multiple'
                                            maxTagCount={1}
                                            showSearch
                                            allowClear
                                            style={{ width: "90%" }}
                                            filterOption={(input, option) =>
                                                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                            options={product && product.map((x) => ({ value: x.Id, label: `${x.Name} - (${x.FullName})`, code: x.Name }))}
                                            onChange={(value, item) => {
                                                setSelectProductTeam(value);
                                            }}
                                        >
                                        </Select>

                                        <Icon icon="material-symbols:search" width="24" height="24"
                                            style={{ cursor: "pointer", marginLeft: "5px" }}
                                            onClick={() => getDashBoardInternal()}
                                        />
                                    </Col>
                                    {/* <Col span={6}>
                                        <RangePicker format="DD/MM/YYYY" style={{ width: "90%" }}
                                            disabled={selectProductTeam.length === 0 ? true : false}
                                            onChange={(date, dateString) => setSelectDate(dateString)}
                                        />
                                    </Col> */}
                                </Row>
                            }
                            bordered={true}
                            style={{ width: "100%" }} className="card-dashboard"
                            extra={
                                <>
                                    <Checkbox onChange={(value) => setIsStack(value.target.checked)}
                                        disabled={selectProductTeam.length === 0 ? true : false}
                                    >
                                        Is Stack
                                    </Checkbox>
                                    <Button type="link"
                                        hidden={selectProductTeam.length === 0 ? true : false}
                                        onClick={() => ExportExcel(excelData && excelData)}
                                        title="Excel Export"
                                    >
                                        <img
                                            style={{ height: "25px" }}
                                            src={`${process.env.PUBLIC_URL}/icons-excel.png`}
                                            alt="Excel Export"
                                        />
                                    </Button>
                                </>
                            }
                        >
                            {
                                selectProductTeam.length === 0 ? <Empty /> :
                                    <>
                                        {/* Product Tags */}
                                        <Row style={{ marginTop: "48px", padding: "0px 0px 24px 24px" }}>
                                            {
                                                tabIconProduct.map((n, index) => (
                                                    <Col span={2}>
                                                        <Button
                                                            type={
                                                                (tabSelectProduct === "" ? tabSelectProduct[0]?.product : tabSelectProduct) === n.product ? 'primary' : 'default'
                                                            }
                                                            shape='round'
                                                            onClick={() => {
                                                                if ((tabSelectProduct === "" ? tabSelectProduct[0]?.product : tabSelectProduct) !== n.product) {
                                                                    setFilterInfo({});
                                                                }
                                                                setTabSelectProduct(n.product);
                                                            }}
                                                        >
                                                            <label>{n.product}</label>
                                                        </Button>
                                                    </Col>
                                                ))
                                            }
                                        </Row>

                                        {/* User Chart */}
                                        <Row gutter={16} style={{ marginTop: "16px", padding: "0px 0px 24px 24px" }}>
                                            <Col span={14}>
                                                <Card title="Summary By User" bordered={true} style={{ width: "100%" }} loading={loading2} className="card-dashboard">
                                                    {
                                                        userChartFilter.length !== 0
                                                            ?
                                                            <div style={{ padding: "24px 24px 0px 24px" }}>
                                                                <Slider
                                                                    dots={true}
                                                                    infinite={true}
                                                                    speed={500}

                                                                    slidesToShow={1}
                                                                    slidesToScroll={1}
                                                                    swipeToSlide={true}
                                                                    prevArrow={
                                                                        <Icon icon="dashicons:arrow-left-alt2" color="gray" />
                                                                    }
                                                                    nextArrow={
                                                                        <Icon icon="dashicons:arrow-right-alt2" color="gray" />

                                                                    }
                                                                >

                                                                    {
                                                                        Array.from(Array(slick2Count), (e, index) => {
                                                                            return (
                                                                                <div>
                                                                                    <Column {...chartUser_config}
                                                                                        data={
                                                                                            userChartFilter.filter((o) => o.product === (tabSelectProduct === "" ? tabIconProduct[0]?.product : tabSelectProduct)
                                                                                                && (o.no > (index) * 4) && (o.no <= (index + 1) * 4))
                                                                                        }
                                                                                        height={300}
                                                                                        xAxis={{ position: "bottom" }}
                                                                                    />
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </Slider>
                                                            </div>
                                                            : <Empty />
                                                    }
                                                </Card>
                                            </Col>
                                            <Col span={10}>
                                                <Card title="Summary By Team" bordered={true} style={{ width: "100%" }} loading={loading} className="card-dashboard">
                                                    {
                                                        tabSelectProduct === "" ? <Empty />
                                                            :
                                                            <Table dataSource={tabSelectProduct === "" ? tableTeamSummary : _.filter(tableTeamSummary, { Product: tabSelectProduct })}
                                                                loading={loading2}
                                                                pagination={{ pageSize: 4 }}
                                                            >
                                                                <Table.Column
                                                                    title='TeamName'
                                                                    dataIndex='TeamName'
                                                                    fixed="left"
                                                                    width="55%"
                                                                    align='center'
                                                                    render={(value) => {
                                                                        return (
                                                                            <Row>
                                                                                <Col span={24} style={{ textAlign: 'left' }}>
                                                                                    <label className="table-column-text12">
                                                                                        {value}
                                                                                    </label>
                                                                                </Col>
                                                                            </Row>
                                                                        )
                                                                    }}
                                                                />
                                                                <Table.Column
                                                                    title='Bug'
                                                                    dataIndex='Bug'
                                                                    align='center'
                                                                    width="15%"
                                                                />
                                                                <Table.Column
                                                                    title='CR'
                                                                    dataIndex='CR'
                                                                    align='center'
                                                                    width="15%"
                                                                />
                                                                <Table.Column
                                                                    title='Memo'
                                                                    dataIndex='Memo'
                                                                    align='center'
                                                                    width="15%"
                                                                />
                                                            </Table>
                                                    }
                                                </Card>
                                            </Col>
                                        </Row>

                                        {/* Table Detail */}
                                        <Row gutter={16} style={{ marginTop: "48px", padding: "0px 0px 24px 24px" }}>
                                            <Col span={24}>
                                                {
                                                    tabSelectProduct === "" ? <Empty />
                                                        :
                                                        <Card bordered={true} style={{ width: "100%" }} loading={loading2} className="card-dashboard">
                                                            <Table dataSource={tabSelectProduct === "" ? excelData : _.filter(excelData, { Product: tabSelectProduct })} loading={loading2}
                                                                scroll={{ x: 3000 }} bordered size="small"
                                                                onChange={(pagination, filters, sorter) => {
                                                                    setFilterInfo(filters);
                                                                    console.log("filters", filters)

                                                                    // filters.NodeName.forEach((i) => console.log("i", _.filter(excelData, function (o) {
                                                                    //     return o.NodeName === i
                                                                    // })))

                                                                    // if (filters.IssueType !== null) {
                                                                    //     let issueTypeFilter = [...dataFilter]
                                                                    //     let result = []
                                                                    //     filters.IssueType.forEach((i) => _.filter(issueTypeFilter, function (o) {
                                                                    //         return o.IssueType === i
                                                                    //     }))

                                                                    //     console.log("issueTypeFilter", result)
                                                                    //     setDataFilter(result)
                                                                    // }

                                                                    // if (filters.NodeName !== null) {
                                                                    //     const resultFilter = result
                                                                    //     setDataFilter(filters.IssueType.forEach((i) => _.filter(resultFilter, function (o) {
                                                                    //         return o.IssueType === i
                                                                    //     })))
                                                                    // }

                                                                    // filters.NodeName.forEach((i) => console.log("iNodeName", _.filter(excelData, function (o) {
                                                                    //     return o.NodeName === i
                                                                    // }).length))
                                                                }}
                                                            // footer={(x) => {
                                                            //     return (
                                                            //         <>
                                                            //             <div style={{ textAlign: "right" }}>
                                                            //                 <label>จำนวนเคส : </label>
                                                            //             </div>
                                                            //         </>
                                                            //     )
                                                            // }}

                                                            // summary={(pageData) => {
                                                            //     console.log("pageData", pageData)
                                                            //     return (
                                                            //         <>
                                                            //             <Table.Summary.Row>
                                                            //                 <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                                                            //                 <Table.Summary.Cell index={1} colSpan={10}>13</Table.Summary.Cell>
                                                            //             </Table.Summary.Row>
                                                            //         </>
                                                            //     )
                                                            // }}
                                                            >
                                                                <Table.Column
                                                                    title='Issue'
                                                                    dataIndex='Number'
                                                                    fixed="left"
                                                                    width="120px"
                                                                    align='center'
                                                                    render={(value) => {
                                                                        return (
                                                                            <Row>
                                                                                <Col span={24} style={{ textAlign: 'left' }}>
                                                                                    <label className="table-column-text12">
                                                                                        {value}
                                                                                    </label>
                                                                                </Col>
                                                                            </Row>
                                                                        )
                                                                    }}
                                                                />
                                                                <Table.Column
                                                                    title='Company'
                                                                    dataIndex='CompanyName'
                                                                    fixed="left"
                                                                    width="120px"
                                                                    align='center'
                                                                    render={(value) => {
                                                                        return (
                                                                            <Row>
                                                                                <Col span={24} style={{ textAlign: 'left' }}>
                                                                                    <label className="table-column-text12">
                                                                                        {value}
                                                                                    </label>
                                                                                </Col>
                                                                            </Row>
                                                                        )
                                                                    }}
                                                                />
                                                                <Table.Column
                                                                    title='Title'
                                                                    dataIndex='Title'
                                                                    // fixed="left"
                                                                    width="300px"
                                                                    align='center'
                                                                    render={(value) => {
                                                                        return (
                                                                            <Row>
                                                                                <Col span={24} style={{ textAlign: 'left' }}>
                                                                                    <label className="table-column-text12">
                                                                                        {value}
                                                                                    </label>
                                                                                </Col>
                                                                            </Row>
                                                                        )
                                                                    }}
                                                                />
                                                                <Table.Column
                                                                    title='Issue Type'
                                                                    dataIndex='IssueType'
                                                                    width='100px'
                                                                    align='center'
                                                                    filters={columnIssueTypeFilter}
                                                                    filteredValue={filterInfo.IssueType || null}
                                                                    onFilter={(value, record) => {
                                                                        return record.IssueType.toLowerCase().includes(value.toLowerCase())
                                                                    }}
                                                                />
                                                                <Table.Column
                                                                    title='Flow Status'
                                                                    dataIndex='FlowStatus'
                                                                    width='200px'
                                                                    align='center'
                                                                    render={(value) => {
                                                                        return (
                                                                            <Row>
                                                                                <Col span={24} style={{ textAlign: 'left' }}>
                                                                                    <label className="table-column-text12">
                                                                                        {value}
                                                                                    </label>
                                                                                </Col>
                                                                            </Row>
                                                                        )
                                                                    }}
                                                                />
                                                                <Table.Column
                                                                    title='Module'
                                                                    dataIndex='ModuleName'
                                                                    width='100px'
                                                                    align='center'
                                                                    render={(value) => {
                                                                        return (
                                                                            <Row>
                                                                                <Col span={24} style={{ textAlign: 'left' }}>
                                                                                    <label className="table-column-text12">
                                                                                        {value}
                                                                                    </label>
                                                                                </Col>
                                                                            </Row>
                                                                        )
                                                                    }}
                                                                />
                                                                <Table.Column
                                                                    title='Hand Over'
                                                                    dataIndex='NodeName'
                                                                    width='100px'
                                                                    filters={columnNodeFilter}
                                                                    filteredValue={filterInfo.NodeName || null}
                                                                    onFilter={(value, record) => {
                                                                        return record.NodeName.toLowerCase().includes(value.toLowerCase())
                                                                        //return record.NodeName.includes(value)
                                                                    }}
                                                                />
                                                                <Table.Column
                                                                    title='H.Develop'
                                                                    dataIndex='DevTeamLead'
                                                                    width='150px'
                                                                    align='center'
                                                                    filters={columnDevFilter}
                                                                    filteredValue={filterInfo.DevTeamLead || null}
                                                                    onFilter={(value, record) => {
                                                                        return record.DevTeamLead === null ? "" : record.DevTeamLead.toLowerCase().includes(value.toLowerCase())
                                                                    }}
                                                                    render={(value) => {
                                                                        return (
                                                                            <Row>
                                                                                <Col span={24} style={{ textAlign: 'left' }}>
                                                                                    <label className="table-column-text12">
                                                                                        {value}
                                                                                    </label>
                                                                                </Col>
                                                                            </Row>
                                                                        )
                                                                    }}
                                                                />
                                                                <Table.Column
                                                                    title='User'
                                                                    dataIndex='DisplayAllName'
                                                                    align='center'
                                                                    width='300px'
                                                                    render={(value) => {
                                                                        return (
                                                                            <Row>
                                                                                <Col span={24} style={{ textAlign: 'left' }}>
                                                                                    <label className="table-column-text12">
                                                                                        {value}
                                                                                    </label>
                                                                                </Col>
                                                                            </Row>
                                                                        )
                                                                    }}
                                                                />
                                                                <Table.Column
                                                                    title='IssueDate'
                                                                    dataIndex='AssignIconDate'
                                                                    width='100px'
                                                                    align='center'
                                                                />
                                                                <Table.Column
                                                                    title='DueDate'
                                                                    dataIndex='DueDate'
                                                                    width='100px'
                                                                    align='center'
                                                                />
                                                                <Table.Column
                                                                    title='OverDue'
                                                                    dataIndex='OverDue'
                                                                    width='100px'
                                                                    align='center'
                                                                />
                                                                <Table.Column
                                                                    title='Due Date (ครั้งที่ 1)'
                                                                    dataIndex='DueDate_Dev'
                                                                    width='100px'
                                                                    align='center'
                                                                />
                                                                <Table.Column
                                                                    title='Due Date (ครั้งที่ 2)'
                                                                    dataIndex='DueDate_Dev2'
                                                                    width='100px'
                                                                    align='center'
                                                                />
                                                                <Table.Column
                                                                    title='Due Date (ครั้งที่ 3)'
                                                                    dataIndex='DueDate_Dev3'
                                                                    width='100px'
                                                                    align='center'
                                                                />
                                                                <Table.Column
                                                                    title='Remark'
                                                                    align='center'
                                                                    width='100px'
                                                                    render={(value, record) => {
                                                                        return (
                                                                            <Row>
                                                                                <Col span={24} style={{ textAlign: 'center' }}>
                                                                                    <Icon icon="material-symbols:info-outline" width="24" height="24"
                                                                                        style={{
                                                                                            cursor: 'pointer',
                                                                                            color: record.RemarkCnt > 1 ? "orange" : ""
                                                                                        }}

                                                                                        onClick={() => {
                                                                                            setSelectTicket({
                                                                                                ticketId: record.TicketId,
                                                                                                ticketNumber: record.Number
                                                                                            })
                                                                                            getTicketRemark(record.TicketId)
                                                                                            setOpenDrawer(true);
                                                                                        }}
                                                                                    />
                                                                                </Col>
                                                                            </Row>
                                                                        )
                                                                    }}
                                                                />
                                                            </Table>
                                                        </Card>
                                                }
                                            </Col>
                                        </Row>
                                    </>
                            }
                        </Card>
                    </Spin>
                </Col>
            </Row>

            <Drawer title={selectTicket.ticketNumber} placement="right"
                width={600}
                visible={openDrawer}
                closable={true}
                onClose={() => {
                    setOpenDrawer(false);
                    editorRef.current.setvalue("");
                }}
                footer={
                    <div
                        style={{
                            textAlign: 'right',
                        }}
                    >
                        <TextEditor
                            ref={editorRef}
                            init={{
                                toolbar1: ['undo redo | bold italic underline forecolor backcolor fontsizeselect'],
                                toolbar2: ['alignleft aligncenter alignright alignjustify bullist numlist preview']
                            }}
                        />

                        <Button
                            loading={drawerLoading}
                            onClick={() => editorRef.current.setvalue("")}
                            style={{ marginTop: 12 }}
                        >
                            Clear
                        </Button>
                        &nbsp;&nbsp; &nbsp;&nbsp;

                        <Button
                            type="primary"
                            loading={drawerLoading}
                            onClick={() => saveTicketRemark(selectTicket?.ticketId)}
                            style={{
                                backgroundColor: "#00CC00",
                                marginTop: 12
                            }}
                        >
                            Save
                        </Button>
                    </div>
                }
            >
                <Spin spinning={drawerLoading}>
                    <List
                        itemLayout="horizontal"
                        dataSource={ticketRemark}
                        renderItem={item => (
                            <List.Item key={item.ticketId}>
                                <List.Item.Meta key={item.ticketId}
                                    avatar={
                                        <Avatar size={24} src={item.profileImg}
                                            icon={item.email.substring(0, 1).toLocaleUpperCase()}
                                        />
                                    }
                                    title={
                                        <>
                                            <label
                                                style={{ marginLeft: 10 }}
                                            >
                                                {item.userName}
                                            </label>
                                            <label
                                                style={{ marginLeft: 30, color: "orange" }}
                                            >
                                                {item.remarkDate}
                                            </label>
                                        </>
                                    }
                                    description={
                                        <>
                                            <div dangerouslySetInnerHTML={{ __html: item.description }}
                                                style={{
                                                    textOverflow: "ellipsis",
                                                    overflow: "hidden",
                                                }}
                                            >
                                            </div>
                                        </>
                                    }
                                />
                            </List.Item>
                        )}
                    >
                    </List>
                </Spin>
            </Drawer >
        </MasterPage >
    )
}
