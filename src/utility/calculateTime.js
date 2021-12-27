import React, { Component } from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import moment from 'moment'

export class CalculateTime extends Component {

    getDuration(start_date, end_date) {
        let start = moment(start_date)
        let end = moment(end_date)

        return moment.utc(moment(end, "YYYY-MM-DD HH:mm").diff(moment(start, "YYYY-MM-DD HH:mm"))).format("HH:mm")
    }

    getHour(start_date, end_date) {
        let start = moment(start_date)
        let end = moment(end_date)
        return parseInt(moment.utc(moment(end, "YYYY-MM-DD HH:mm").diff(moment(start, "YYYY-MM-DD HH:mm"))).format("HH"))
    }

    getMinute(start_date, end_date) {
        let start = moment(start_date)
        let end = moment(end_date)
        return parseInt(moment.utc(moment(end, "YYYY-MM-DD HH:mm").diff(moment(start, "YYYY-MM-DD HH:mm"))).format("mm"))
    }

    getMiniteDuration(start_date, end_date) {
        let start = moment(start_date)
        let end = moment(end_date)
        return moment.duration(end.diff(start)).as("minutes")
    }
}


