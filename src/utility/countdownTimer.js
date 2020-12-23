import { ClockCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { Component } from "react";
import moment from 'moment'

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      overdue: false
    };
  }
  componentWillMount() {
    const { deadline, createdate, resolvedDate, node_receivedate, node_senddate, type } = this.props;
    // this.getTimeUntil(deadline, createdate, resolvedDate);
    // this.getTimeWorking(node_receivedate, node_senddate)
  }
  componentDidMount() {
    const { deadline, createdate, resolvedDate, node_receivedate, node_senddate, type } = this.props;
    // คำนวนระยะเวลาทำงาน
    if (type === "timeworking") {
      this.getTimeWorking(node_receivedate, node_senddate)
      console.log("A")
    }

    // SLA ยังไม่เกิน DueDate
    if (this.props.resolvedDate === undefined &&
      moment(this.props.deadline).format("YYYY-MM-DD HH:mm") > moment().format("YYYY-MM-DD HH:mm") &&
      type === undefined) {

      //setInterval(() => this.getTimeUntil(this.props.deadline), 1000);
      this.dateTimeDiffToNow(this.props.deadline)
      console.log("B")
    }
    /// SLA เกิน DueDate (กรณีแก้ไขยังไม่เสร็จ)
    if (this.props.resolvedDate === undefined &&
      moment(this.props.deadline).format("YYYY-MM-DD HH:mm") < moment().format("YYYY-MM-DD HH:mm") &&
      type === undefined) {
      //setInterval(() => this.getTimeUntil(this.props.deadline), 1000);
      this.dateTimeDiffToNow(this.props.deadline)
      console.log("C")
    }

    /// SLA เกิน DueDate (กรณีแก้ไขเสร็จ)
    if (this.props.resolvedDate !== undefined && type === undefined) {
      this.getTimeUntil(deadline, createdate, resolvedDate);
      console.log("D");
      console.log("resolvedDate",this.props.resolvedDate);

    }

  }
  leading0(num) {
    //return num < 10 ? "0" + num : num;
    return num;
  }

  dateTimeDiffToNow(deadline, createdate) {
    let from = moment(deadline);
    //let to = moment(new Date("2020-11-18 09:15"))
    let to = moment();
    let diff = Math.abs(moment(from.format("YYYY-MM-DD")).diff(moment(to.format("YYYY-MM-DD")), 'days'));
    let minute = 0;
    let timehistory = [];
    for (let i = 0; i <= 1; i++) {


      let result = moment(from).add(i, 'd');
      // ภายในวันเดียวกัน ไม่เกิน 18.00
      if (moment(result).format("YYYY-MM-DD") === moment(to).format("YYYY-MM-DD")
        && moment(result).format("YYYY-MM-DD") === moment(from).format("YYYY-MM-DD")
        && moment(result).format("dddd") !== "Saturday"
        && moment(result).format("dddd") !== "Sunday") {
        timehistory.push({
          timestart: moment(result).format("YYYY-MM-DD HH:mm"),
          timeend: moment(to).format("YYYY-MM-DD HH:mm"),
          hour: moment(from).format("HH") < "12" && moment(to).format("HH") > "12"
            ? Math.abs(moment(result.format("YYYY-MM-DD HH:mm")).diff(moment(to.format("YYYY-MM-DD HH:mm")), 'hours')) - 1
            : Math.abs(moment(result.format("YYYY-MM-DD HH:mm")).diff(moment(to.format("YYYY-MM-DD HH:mm")), 'hours')),
          minute: Math.abs(moment(result.format("YYYY-MM-DD HH:mm")).diff(moment(to.format("YYYY-MM-DD HH:mm")), 'minute')) % 60,
          remark: 1
        })

        // minute += Math.abs(moment(result.format("YYYY-MM-DD HH:mm")).diff(moment(to.format("YYYY-MM-DD HH:mm")), 'minute'))
      }

      //////////////// ข้ามวัน
      // ปัจจุบัน
      if (moment(from).format("YYYY-MM-DD") !== moment(to).format("YYYY-MM-DD")
        && moment(result).format("YYYY-MM-DD") === moment(to).format("YYYY-MM-DD")
        && moment(result).format("YYYY-MM-DD") !== moment(from).format("YYYY-MM-DD")
        && moment(result).format("dddd") !== "Saturday"
        && moment(result).format("dddd") !== "Sunday") {

        if (moment(to).format("HH") < "18") {
          timehistory.push({
            timestart: moment(result).format("YYYY-MM-DD 09:00"),
            timeend: moment(to).format("YYYY-MM-DD HH:mm"),
            hour: moment(to).format("HH") > "12"
              ? Math.abs(moment(result.format("YYYY-MM-DD 09:00")).diff(moment(to.format("YYYY-MM-DD HH:mm")), 'hours')) - 1
              : Math.abs(moment(result.format("YYYY-MM-DD 09:00")).diff(moment(to.format("YYYY-MM-DD HH:mm")), 'hours')),
            minute: moment(to).format("HH") === "12"
              ? 0
              : Math.abs(moment(result.format("YYYY-MM-DD 09:00")).diff(moment(to.format("YYYY-MM-DD HH:mm")), 'minute')) % 60,
            remark: 2
          })

        } else {
          timehistory.push({
            timestart: moment(result).format("YYYY-MM-DD 09:00"),
            timeend: moment(to).format("YYYY-MM-DD 18:00"),
            hour: moment(to).format("HH") > "12"
              ? Math.abs(moment(result.format("YYYY-MM-DD 09:00")).diff(moment(to.format("YYYY-MM-DD 18:00")), 'hours')) - 1
              : Math.abs(moment(result.format("YYYY-MM-DD 09:00")).diff(moment(to.format("YYYY-MM-DD 18:00")), 'hours')),
            minute: moment(to).format("HH") === "12"
              ? Math.abs(moment(result.format("YYYY-MM-DD 09:00")).diff(moment(to.format("YYYY-MM-DD 18:00")), 'minute')) % 60
              : 0,
            remark: 2
          })
        }

        minute += Math.abs(moment(result.format("YYYY-MM-DD 09:00")).diff(moment(to.format("YYYY-MM-DD HH:mm")), 'minute')) % 60
      }

      // เต็มวัน 09.00 - 18.00
      if (moment(from).format("YYYY-MM-DD") !== moment(to).format("YYYY-MM-DD")
        && moment(result).format("YYYY-MM-DD") !== moment(from).format("YYYY-MM-DD")
        && moment(result).format("YYYY-MM-DD") !== moment(to).format("YYYY-MM-DD")
        && moment(result).format("dddd") !== "Saturday"
        && moment(result).format("dddd") !== "Sunday") {
        timehistory.push({
          timestart: moment(result).format("YYYY-MM-DD 09:00"),
          timeend: moment(result).format("YYYY-MM-DD 18:00"),
          hour: Math.abs(moment(result.format("YYYY-MM-DD 09:00")).diff(moment(result.format("YYYY-MM-DD 18:00")), 'hours')) - 1,
          minute: Math.abs(moment(result.format("YYYY-MM-DD 09:00")).diff(moment(result.format("YYYY-MM-DD 18:00")), 'minute')) % 60,
          remark: 3
        })

        // minute += Math.abs(moment(result.format("YYYY-MM-DD 09:00")).diff(moment(result.format("YYYY-MM-DD 18:00")), 'minute'))
      }

      // วันที่เิริ่ม ถึง 18.00 
      if (moment(from).format("YYYY-MM-DD") !== moment(to).format("YYYY-MM-DD")
        && moment(result).format("YYYY-MM-DD") === moment(from).format("YYYY-MM-DD")
        && moment(result).format("YYYY-MM-DD") !== moment(to).format("YYYY-MM-DD")
        && moment(result).format("dddd") !== "Saturday"
        && moment(result).format("dddd") !== "Sunday") {
        timehistory.push({
          timestart: moment(result).format("YYYY-MM-DD HH:mm"),
          timeend: moment(result).format("YYYY-MM-DD 18:00"),
          hour: moment(result).format("HH") < "12"
            ? Math.abs(moment(result.format("YYYY-MM-DD HH:mm")).diff(moment(result.format("YYYY-MM-DD 18:00")), 'hours')) - 1
            : Math.abs(moment(result.format("YYYY-MM-DD HH:mm")).diff(moment(result.format("YYYY-MM-DD 18:00")), 'hours')),
          minute: Math.abs(moment(result.format("YYYY-MM-DD HH:mm")).diff(moment(result.format("YYYY-MM-DD 18:00")), 'minute')) % 60,
          remark: 4
        })

        // minute += Math.abs(moment(result.format("YYYY-MM-DD HH:mm")).diff(moment(result.format("YYYY-MM-DD 18:00")), 'minute'))
      }

    }
    // let seconds = minute % 3600;
    // let minutes = minute % 60;
    // let h = Math.floor(minute / 60);
    // let hours = h % 8;
    // let days = Math.floor(h / 8);
    // let overdue = true
    console.log("timehistory", timehistory)

    let minutes = 0;
    for (let i = 0; i < timehistory.length; i++) {
      let t = timehistory[i];
      minutes += (t.hour * 60) + t.minute;
    }
    // console.log(minutes)

    let min = minutes % 60;
    let hours = Math.floor(minutes / 60);
    let h = hours % 8;
    let d = Math.floor(hours / 8);

    // console.log({ days: d, hours: h, minutes: min});
    const overdue = moment(from).format("YYYY-MM-DD HH:mm") < moment(to).format("YYYY-MM-DD HH:mm") ? true : false
    this.setState({ days: d, hours: h, minutes: min, seconds: 0, overdue: overdue });
  }

  getTimeUntil(deadline, createdate, resolvedDate) {
    let time;
    if (resolvedDate !== undefined && createdate !== undefined) {
      time = Date.parse(deadline) - Date.parse(resolvedDate);

    } else {
      time = Date.parse(deadline) - Date.parse(new Date());
      const x = this.dateTimeDiffToNow(deadline, createdate);
    }

    if (time < 0) {
      const seconds = Math.floor((time / 1000) % 60);
      const minutes = Math.floor((time / 1000 / 60) % 60) - (-1);
      const hours = Math.floor((time / (1000 * 60 * 60)) % 24) - (-1);
      const days = Math.floor(time / (1000 * 60 * 60 * 24)) - (-1);
      const overdue = true
      this.setState({ days, hours, minutes, seconds, overdue });


    } else {
      const seconds = Math.floor((time / 1000) % 60);
      const minutes = Math.floor((time / 1000 / 60) % 60);
      const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
      const days = Math.floor(time / (1000 * 60 * 60 * 24));
      const overdue = false
      this.setState({ days, hours, minutes, seconds, overdue });
    }
  }

  getTimeWorking(node_receivedate, node_senddate) {
    if (node_senddate && node_senddate !== undefined) {
      let time;
      time = Date.parse(node_receivedate) - Date.parse(node_senddate);
      const seconds = Math.floor((time / 1000) % 60);
      const minutes = Math.floor((time / 1000 / 60) % 60) - (-1);
      const hours = Math.floor((time / (1000 * 60 * 60)) % 24) - (-1);
      const days = Math.floor(time / (1000 * 60 * 60 * 24)) - (-1);
      const overdue = false
      this.setState({ days, hours, minutes, seconds, overdue });
    }
  }


  render() {

    const { showday = true, showhour = true, showminute = true, showseconds = true, timeformat = "en" } = this.props;

    // console.log(this.state)

    return (
      <>
        <Button
          type="default"
          onClick={this.props.onClick}
          className={this.state.overdue === true ? "sla-overdue" : "sla-warning"}
          size="middle"
          shape="round"
          ghost={this.state.overdue === false ? true : false}
        >
          {this.state.overdue === false ? "" : " - "}
          {
            showday && (
              <>
                {timeformat === "en"
                  ? this.state.days === 0 ? "" : <span> {`${this.leading0(Math.abs(this.state.days))}d`}&nbsp;</span>
                  : this.state.days === 0 ? "" : <span> {`${this.leading0(Math.abs(this.state.days))}วัน`}&nbsp;</span>
                }
              </>
            )
          }
          {
            showhour && (
              <>
                {timeformat === "en"
                  ? this.state.hours === 0 ? "" : <span> {`${this.leading0(Math.abs(this.state.hours))}h`}&nbsp;</span>
                  : this.state.hours === 0 ? "" : <span> {`${this.leading0(Math.abs(this.state.hours))}ชั่วโมง`}&nbsp;</span>
                }
              </>
            )
          }
          {
            showminute && (
              <>
                {timeformat === "en"
                  ? this.state.minutes === 0 ? "" : <span> {`${this.leading0(Math.abs(this.state.minutes))}m`}&nbsp;</span>
                  : this.state.minutes === 0 ? "" : <span> {`${this.leading0(Math.abs(this.state.minutes))}นาที`}&nbsp;</span>
                }
              </>
            )
          }

          {
            showseconds && (
              <>
                {timeformat === "en"
                  ? <span> {`${this.leading0(Math.abs(this.state.seconds))}s`}&nbsp;</span>
                  : <span> {`${this.leading0(Math.abs(this.state.seconds))}วินาที`}&nbsp;</span>
                }
              </>
            )
          }
          {
            // เลือกไม่แสดง วินาที แต่ถ้า เวลาต่ำสุดอยู่หลักวินาทีก็ให้แสดง
            showseconds === false && this.state.minutes === 0 && this.state.seconds !== 0 && (
              <>
                {timeformat === "en"
                  ? <span> {`${this.leading0(Math.abs(this.state.seconds))}s`}&nbsp;</span>
                  : <span> {`${this.leading0(Math.abs(this.state.seconds))}วินาที`}&nbsp;</span>
                }
              </>
            )
          }
          {
            this.props.type === "timeworking" && this.state.seconds === 0 ? "กำลังดำเนินการ" : ""
          }
          <ClockCircleOutlined style={{ fontSize: 16, verticalAlign: "0.1em" }} />


        </Button>
      </>

    );
  }
}
export default Clock;
