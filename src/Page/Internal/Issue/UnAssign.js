import React, { Component } from "react";
import Clock from "../../../utility/countdownTimer";


class App extends Component {
    constructor(props) {
      super(props);
      this.state = { deadline: "2020-10-16, 14:00" };
    }
    render() {
      return (

          <Clock deadline={this.state.deadline}   />

      );
    }
  }
  export default App;
  