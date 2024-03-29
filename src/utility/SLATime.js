import React, { useState, useEffect } from "react";
import moment from "moment";
import { ClockCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";

function calculateMinutes(
  startTime = "00:00",
  endTime = "00:00",
  configs = {
    workStart: "09:00",
    workEnd: "18:00",
    restStart: "12:00",
    restEnd: "13:00",
  }
) {
  const work_start = moment.duration(configs.workStart);
  const work_end = moment.duration(configs.workEnd);
  const rest_start = moment.duration(configs.restStart);
  const rest_end = moment.duration(configs.restEnd);
  const rest_minutes = moment
    .duration(rest_end)
    .subtract(rest_start)
    .as("minutes");

  // start < worktime
  if (
    moment.duration(startTime).as("minutes") <
    moment.duration(configs.workStart).as("minutes")
  ) {
    startTime = configs.workStart;
  }

  // end > worktime
  if (
    moment.duration(endTime).as("minutes") >
    moment.duration(configs.workEnd).as("minutes")
  ) {
    endTime = configs.workEnd;
  }

  // calculate
  let used_minutes = moment.duration(endTime).subtract(startTime).as("minutes");

  // console.log({
  //   work_start: work_start.hours(),
  //   work_end: work_end.hours(),
  //   rest_start: rest_start.hours(),
  //   rest_end: rest_end.hours(),
  //   startTime,
  //   endTime,
  //   used_minutes,
  // });

  // over resttime
  if (
    moment.duration(endTime).hours() >= rest_end.hours() &&
    used_minutes > 0
  ) {
    used_minutes = used_minutes - rest_minutes;
  }

  return used_minutes;
}

function calculateWorkTimeByPeriod(
  startDate,
  endDate,
  callback,
  configs = {
    workStart: "9:00",
    workEnd: "18:00",
    restStart: "12:00",
    restEnd: "13:00",
    weekend: [0, 6], // sunday, saturday
  }
) {
  const FORMAT_112 = "YYYYMMDD";

  const startDate_112 = startDate.format(FORMAT_112);
  const endDate_112 = endDate.format(FORMAT_112);

  let sd = moment(startDate);

  const work_day_minute = calculateMinutes(
    configs.workStart,
    configs.workEnd,
    configs
  );

  let result_minutes = 0;

  // is due same day
  if (startDate_112 == endDate_112) {
    result_minutes = calculateMinutes(
      startDate.format("HH:mm"),
      endDate.format("HH:mm"),
      configs
    );
  } else {
    // find dates
    const dates = [];

    while (parseInt(sd.format(FORMAT_112)) <= parseInt(endDate_112)) {
      // skip holiday
      if (configs.weekend.includes(sd.days())) {
        sd.add(1, "days");
        continue;
      }
      dates.push(sd.format(FORMAT_112));
      sd.add(1, "days");
    }

    // loop sum minutes
    let daily_minute = 0;

    for (let index = 0; index < dates.length; index++) {
      const date = dates[index];

      // default
      daily_minute = work_day_minute;

      if (index == 0) {
        daily_minute = calculateMinutes(
          startDate.format("HH:mm"),
          configs.workEnd,
          configs
        );
      } else if (date == endDate_112) {
        daily_minute = calculateMinutes(
          configs.workStart,
          endDate.format("HH:mm"),
          configs
        );
      } else if (index == dates.length - 1) {
        daily_minute = calculateMinutes(
          configs.workStart,
          configs.workEnd,
          configs
        );
      }

      // console.log(date, daily_minute);

      result_minutes += daily_minute;
    }
  }

  if (callback) {
    callback(result_minutes);
  }

  return result_minutes;
}


function calculateTimeNoPeriod(startdate, duedate, enddate) {

  let start_date = moment(startdate.format("YYYY-MM-DD HH:mm"))
  let due_date = moment(duedate.format("YYYY-MM-DD HH:mm"))
  let end_date = moment(enddate.format("YYYY-MM-DD HH:mm"))
  let time_result;


  if (end_date > due_date) {
    time_result = Math.abs(moment(due_date.format("YYYY-MM-DD HH:mm")).diff(moment(end_date.format("YYYY-MM-DD HH:mm")), 'minute'))
  } else {
    time_result = Math.abs(moment(end_date.format("YYYY-MM-DD HH:mm")).diff(moment(due_date.format("YYYY-MM-DD HH:mm")), 'minute'))
  }

  return time_result
}


function business_timeFormat(time) {

  const minutes = Math.floor(Math.abs(time) % 60);
  const hours = parseInt(Math.floor((Math.abs(time) / 60) % 8));
  const days = parseInt(Math.floor(Math.abs(time) / 60) / 8);

  const result =
    (days === 0 ? "" : Math.abs(days) + "d ") +
    (hours === 0 ? "" : Math.abs(hours) + "h ") +
    Math.abs(minutes) + "m"

  return result
}


function timeFormat(time) {
  const minutes = Math.floor(Math.abs(time) % 60);
  const hours = parseInt(Math.floor((Math.abs(time) / 60)));
  const days = parseInt(Math.abs(hours) / 24 );

  const result =
    (days === 0 ? "" : Math.abs(days) + "d ") +
    (hours === 0 ? "" : Math.abs(hours) + "h ") +
    Math.abs(minutes) + "m"

  return result
}

export default function SLATime({ start, due, end, type }) {
  const [state, setstate] = useState({});

  useEffect(() => {
    // SLA ในเวลาทำงาน
    let due_minute = calculateWorkTimeByPeriod(start, due);
    let work_minute = calculateWorkTimeByPeriod(start, end);

    // SLA ตามเวลาจริง
    let due_date = moment(due.format("YYYY-MM-DD HH:mm"))
    let end_date = moment(end.format("YYYY-MM-DD HH:mm"))
    let total_minute = calculateTimeNoPeriod(start, due, end)

    if (type === "Critical") {
      setstate({
        due_date,
        end_date,
        total_minute
      });

    } else {
      setstate({
        due_minute,
        work_minute,
      });
    }

    //console.log("state",state)
  }, [start, end, due]);


  return (
    <>
      {
        type === "Critical" ?

          <Button
            type="default"
            className={
              state.end_date < state.due_date ? "sla-warning" : "sla-overdue"
            }
            size="middle"
            shape="round"
            ghost={state.end_date < state.due_date ? true : false}
          >
            {(state.due_date < state.end_date) ? "-" : ""}
            <label className="value-text">
              {timeFormat(state.total_minute)}
            </label>
            <ClockCircleOutlined style={{ fontSize: 16, verticalAlign: "0.1em" }} />
          </Button>

          :
          <Button
            type="default"
            className={
              state.work_minute < state.due_minute ? "sla-warning" : "sla-overdue"
            }
            size="middle"
            shape="round"
            ghost={state.work_minute < state.due_minute ? true : false}
          >
            {(state.due_minute < state.work_minute) ? "-" : ""}
            <label className="value-text">

              {business_timeFormat(state.due_minute - state.work_minute)}
            </label>
            <ClockCircleOutlined style={{ fontSize: 16, verticalAlign: "0.1em" }} />
          </Button>
      }
    </>
  );
}
