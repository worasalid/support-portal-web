import React, { Component, useEffect, useState } from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import moment from 'moment'

export default function CountTimer({ type, duedate, resolvedDate, completeDate, receiveDate, sendDate }) {
    const [slaDueDate, setSlaDueDate] = useState(null)
    var datenow = moment("2021-10-15").format("DD/MM/YYYY HH:mm")
    var duedatesla = moment("2021-10-17").format("DD/MM/YYYY HH:mm")

     function CalculateDueDate(duedate, hour) {
        duedate = moment().toDate();    
        let startdate = moment(duedate).format("YYYY-MM-DD HH:mm")
      
        for (let i = 0; i < hour; i++) {
          if (moment(startdate).format("dddd")) {
      
          }
          // แจ้งก่อน 9.00
          if (moment(startdate).format("HH") < "09") {
            startdate = moment(startdate).format("YYYY-MM-DD 09:00")
            if (moment(startdate).format("dddd") === "Saturday") {
              startdate = moment(startdate).add(1, 'days').format("YYYY-MM-DD HH:mm")
            }
            if (moment(startdate).format("dddd") === "Sunday") {
              startdate = moment(startdate).add(1, 'days').format("YYYY-MM-DD HH:mm")
            }
          }
          // แจ้งหลัง 18.00
          if (moment(startdate).format("HH") > "17") {
            startdate = moment(startdate).add(1, 'days').format("YYYY-MM-DD 09:00")
            if (moment(startdate).format("dddd") === "Saturday") {
              startdate = moment(startdate).add(1, 'days').format("YYYY-MM-DD HH:mm")
            }
            if (moment(startdate).format("dddd") === "Sunday") {
              startdate = moment(startdate).add(1, 'days').format("YYYY-MM-DD HH:mm")
            }
          }
          // แจ้งในเวลาทำการ
          if (moment(startdate).format("HH") >= "09") {
            startdate = moment(startdate).add(1, 'hour').format("YYYY-MM-DD HH:mm")
            if (moment(startdate).format("HH") === "12") {
              startdate = moment(startdate).add(1, 'hour').format("YYYY-MM-DD HH:mm")
            }
            if (moment(startdate).format("HH") >= "18") {
              startdate = moment(startdate).add(1, 'day').format("YYYY-MM-DD 09:mm")
              if (moment(startdate).format("dddd") === "Saturday") {
                startdate = moment(startdate).add(1, 'days').format("YYYY-MM-DD HH:mm")
              }
              if (moment(startdate).format("dddd") === "Sunday") {
                startdate = moment(startdate).add(1, 'days').format("YYYY-MM-DD HH:mm")
              }
            }
          }
        }
        return startdate;
    }

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

    return (
        <>
            <label>{slaDueDate}</label>
        </>
    )
}