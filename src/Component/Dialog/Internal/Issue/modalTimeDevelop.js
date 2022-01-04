import React, { useState, forwardRef, useEffect, useImperativeHandle } from 'react';
import { Modal, DatePicker, Spin, TimePicker, Table, Row, Col, Button, Divider, Form } from 'antd';
import axios from 'axios';
import moment from "moment";
import { Icon } from '@iconify/react';
import ClockSLA from "../../../../utility/SLATime";
import { CalculateTime } from '../../../../utility/calculateTime';
import _ from 'lodash'

const { RangePicker } = DatePicker;
const { Column } = Table;

export default forwardRef(function TrackingTimeDevelop({ visible = false, onOk, onCancel, datarow, details, ...props }, ref) {

    useImperativeHandle(ref, () => ({
        getTime: () => getTime(),
        getDuration: () => totalDuration,
    }));


    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [selectDate, setSelectDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [timeDevelop, setTimeDevelop] = useState([]);
    const [totalDuration, setTotalDuration] = useState(0)

    const timeResult = new CalculateTime()


    function disabledTime(current,) {
        console.log("current", moment(current).format("HH:mm"))
        return current < moment().add(15, "d"); // ล่วงหน้า ตามจำนวนวันที่กำหนด
    }

    const getTime = async () => {
        await axios.get(`${process.env.REACT_APP_API_URL}/tickets/time-develop`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            params: {
                ticket_id: details.ticketId,
                task_id: details.taskId
            }
        }).then((res) => {
            setTimeDevelop(_.sortBy(res.data, ['start_date', 'start_time']).map((n, index) => {
                return {
                    item_id: n.item_id,
                    start_date: n.start_date,
                    start_time: n.start_date,
                    end_time: n.end_date,
                    duration: timeResult.getMiniteDuration(n.start_date, n.end_date)
                }

            }));
            setTotalDuration(_.sum(res.data.map((n) => n.duration)));

        }).catch((error) => {

        })
    }

    const addTime = async () => {
        setLoading(true);
        await axios({
            url: `${process.env.REACT_APP_API_URL}/tickets/time-develop`,
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                ticket_id: details.ticketId,
                task_id: details.taskId,
                start_date: moment(`${selectDate} ${startTime}`).format("YYYY-MM-DD HH:mm"),
                end_date: moment(`${selectDate} ${endTime}`).format("YYYY-MM-DD HH:mm")
            }
        }).then((res) => {
            setLoading(false);
            getTime();
            form.resetFields();
        }).catch(() => {
            setLoading(false);
        })
    }

    const deleteTime = async (param) => {
        setLoading(true);
        await axios({
            url: `${process.env.REACT_APP_API_URL}/tickets/time-develop`,
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("sp-ssid")
            },
            data: {
                item_id: param
            }
        }).then((res) => {
            setLoading(false);
            getTime();
        }).catch((error) => {
            setLoading(false);
        })
    }

    const onFinish = async (value) => {
        console.log("select StartTime", moment(`${selectDate} ${startTime}`).format("YYYY-MM-DD HH:mm"))
        console.log("select End Time", moment(`${selectDate} ${endTime}`).format("YYYY-MM-DD HH:mm"))

        // console.log("check start",timeDevelop.map((n) => moment("2021-12-27 09:53").isBetween(moment("2021-12-27 09:53").format("YYYY-MM-DD HH:mm"), moment("2021-12-27 10:15").format("YYYY-MM-DD HH:mm"), undefined, '[)')))
        // console.log("check end",timeDevelop.map((n) => moment("2021-12-27 10:14").isBetween(moment("2021-12-27 09:53").format("YYYY-MM-DD HH:mm"), moment("2021-12-27 10:15").format("YYYY-MM-DD HH:mm"), undefined, '[)')))
        // console.log("check start", timeDevelop.map((n) => moment(moment(`${selectDate} ${startTime}`).format("YYYY-MM-DD HH:mm")).isBetween(moment(n.start_date).format("YYYY-MM-DD HH:mm"), moment(n.end_date).format("YYYY-MM-DD HH:mm"), undefined, '[)')))
        // console.log("check end", timeDevelop.map((n) => moment(moment(`${selectDate} ${endTime}`).format("YYYY-MM-DD HH:mm")).isBetween(moment(n.start_date).format("YYYY-MM-DD HH:mm"), moment(n.end_date).format("YYYY-MM-DD HH:mm"), undefined, '[)')))
        addTime();

        // console.log(timeDevelop.map((n) => {
        //     return moment(moment(`${selectDate} ${startTime}`).format("YYYY-MM-DD HH:mm")).isBetween(moment(n.start_date).format("YYYY-MM-DD HH:mm"), moment(n.end_date).format("YYYY-MM-DD HH:mm"), undefined, '[)')
        // }))

        // if (timeDevelop.map((n) => moment(moment(`${selectDate} ${endTime}`).format("YYYY-MM-DD HH:mm")).isBetween(moment(n.start_date).format("YYYY-MM-DD HH:mm"), moment(n.end_date).format("YYYY-MM-DD HH:mm"), undefined, '[)')) == true) {
        //     console.log("endTime ซ้ำ")
        // }
    }

    useEffect(() => {
        if (visible) {
            getTime();
        }
    }, [visible])

    return (
        <>
            <Modal
                visible={visible}
                confirmLoading={loading}
                okText="Save"
                okButtonProps={{ hidden: true }}
                okType="dashed"
                cancelText="Close"
                onCancel={() => {
                    onCancel();
                    setSelectDate(null);
                    form.resetFields();
                }}
                {...props}
            >

                <Form form={form} name="control-hooks" onFinish={onFinish}>
                    <Row>
                        <Col span={8}>
                            <Form.Item name="select_date" rules={[{ message: "ระบุ วันที่", required: true }]}>
                                <DatePicker value={selectDate} format="DD/MM/YYYY" onChange={(date, datesting) => setSelectDate(moment(date, "YYYY-MM-DD").format("YYYY-MM-DD"))} />
                            </Form.Item>

                        </Col>
                        <Col span={6}>
                            <Form.Item name="start_time" rules={[{ message: "ระบุ เวลาเริ่ม ", required: true }]}>
                                <TimePicker placeholder='เริ่ม' format="HH:mm" showSecond={false} onChange={(date, datesting) => { setStartTime(datesting); console.log(datesting) }} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="end_time" rules={[{ message: "ระบุ เวลาสิ้นสุด", required: true }]}>
                                <TimePicker placeholder='สิ้นสุด' format="HH:mm" showSecond={false} onChange={(date, datesting) => setEndTime(datesting)} />
                            </Form.Item>
                        </Col>
                        <Col span={4} style={{ textAlign: "right" }}>
                            <Button type='primary'
                                onClick={() => form.submit()}
                            >Add</Button>
                        </Col>
                    </Row>
                </Form>

                <br />
                <br />
                <Table dataSource={timeDevelop} loading={loading} pagination={false}>
                    <Column title="วันที่" dataIndex="date"
                        render={(value, record, index) => {
                            return (
                                <>
                                    {moment(record.start_date).format("DD/MM/YYYY")}
                                </>
                            )
                        }}
                    />
                    <Column title="เริ่ม"
                        render={(value, record, index) => {
                            return (
                                <>
                                    {moment(record.start_time).format("HH:mm")}
                                </>
                            )
                        }}
                    />
                    <Column title="สิ้นสุด"
                        render={(value, record, index) => {
                            return (
                                <>
                                    {moment(record.end_time).format("HH:mm")}
                                </>
                            )
                        }}
                    />
                    <Column title="ระยะเวลา" align='center'
                        render={(value, record, index) => {
                            return (
                                <div style={{ textAlign: "right" }}>
                                    {
                                        timeResult.getHour(record.start_time, record.end_time) !== 0 ?
                                            `${timeResult.getHour(record.start_time, record.end_time)} ชม ` : ""
                                    }

                                    {
                                        timeResult.getMinute(record.start_time, record.end_time) !== 0 ?
                                            `${timeResult.getMinute(record.start_time, record.end_time)} นาที ` : ""
                                    }

                                    <Icon icon="carbon:time" width="18" height="18" />
                                </div>
                            )
                        }}
                    />
                    <Column
                        render={(value, record, index) => {
                            return (
                                <>
                                    {/* <Icon icon="ant-design:edit-outlined" width="18" height="18" />
                                    <Divider type='vertical' /> */}
                                    <Icon icon="fluent:delete-24-regular" width="18" height="18" className='icon-link-hover'
                                        onClick={() => deleteTime(record.item_id)}
                                    />
                                </>
                            )
                        }}
                    />
                </Table>

                {/* <Row style={{ marginTop: 24 }}>
                    <Col span={16} style={{ textAlign: "right" }}>

                    </Col>
                    <Col span={5}>
                        <div style={{ textAlign: "right", marginRight: 16, color: "orange" }}>
                            {
                                moment.duration(_.sum(timeDevelop.map((n) => n.duration)), 'minute')._data.hours !== 0 ?
                                    `${moment.duration(_.sum(timeDevelop.map((n) => n.duration)), 'minute')._data.hours} ชม ` : ""
                            }

                            {
                                moment.duration(_.sum(timeDevelop.map((n) => n.duration)), 'minute')._data.minutes !== 0 ?
                                    `${moment.duration(_.sum(timeDevelop.map((n) => n.duration)), 'minute')._data.minutes} นาที ` : ""
                            }

                            <Icon icon="carbon:time" width="18" height="18" />
                        </div>
                    </Col>
                    <Col span={3} >

                    </Col>
                </Row> */}
            </Modal>
        </>
    )
})