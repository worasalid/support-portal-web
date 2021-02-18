import React, { Component, useEffect, useState } from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import moment from 'moment'

export default function CountTimer({ type, duedate, resolvedDate, completeDate, receiveDate, sendDate }) {
    const [slaDueDate, setSlaDueDate] = useState(null)
    var datenow = moment("2021-10-15").format("DD/MM/YYYY HH:mm")
    var duedatesla = moment("2021-10-17").format("DD/MM/YYYY HH:mm")

    function dateTimeDiffToNow(duedate) {
        return (
            setSlaDueDate(moment(duedate).format("DD/MM/YYYY HH:mm"))
        )

    }

    useEffect(() => {
        if (duedate !== undefined) {
            dateTimeDiffToNow(duedate)
        }

    }, [duedate])
    console.log("datenow", moment().format("DD/MM/YYYY HH:mm"))
    console.log("datediff", moment(duedatesla).format("DD/MM/YYYY HH:mm").diff(moment(datenow).format("DD/MM/YYYY HH:mm")))
    return (
        <>
            <label>{slaDueDate}</label>
        </>
    )
}