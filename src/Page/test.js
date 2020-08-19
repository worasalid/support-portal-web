import React, { useState } from 'react';
import MasterPage from './Internal/MasterPage';
import { PageHeader } from 'antd';
import { useHistory } from 'react-router-dom';



///////////////////////////////////// Components and Props
export function MyNameThai(Name, LastName) {
    return <p>{Name} {LastName}</p>
}

export function MyNameEng(props) {
    return <p>{props.Name} {props.LastName}</p>
}

export  function GetName() {
  const history = useHistory();
    return (
      <MasterPage>
        <div style={{marginLeft:50}}>
          <PageHeader title="TEST" onBack={() => history.goBack()} />
            <MyNameEng Name="Worasalid" LastName="Juicharoen" />
        </div>
        </MasterPage>
    )
}

///////////////////////////////////// Handling Events
export function ActionLink() {
    function handleClick() {
        return (console.log('http://www.google.com'), alert())
    }
    return (
        <a href="http://www.google.com" target="_blank" onClick={handleClick}>
            Link
        </a>
    );
}

export class Toggle extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isToggleOn: true };

        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState(state => ({
            isToggleOn: !state.isToggleOn

        }));
        // alert(this.state.isToggleOn)
    }

    render() {
        return (
            <button onClick={this.handleClick}>
                {this.state.isToggleOn ? 'ON' : 'OFF'}
            </button>
        );
    }
}

export class LoggingButton extends React.Component {
    // This syntax ensures `this` is bound within handleClick.
    // Warning: this is *experimental* syntax.
    handleClick = () => {
        console.log('this is:', this);
        alert()
    }

    render() {
        return (
            <div>
            <button onClick={this.handleClick}>
                Click Event
            </button>
            </div>
        );
    }
}

/////////////////////////////////////  Conditional Rendering

////Conditional these two components:
export function Greeting(props) {
    function UserGreeting(props) {
        return <p>{props.data}</p>;
    }
    function GuestGreeting(props) {
        return <p>{props.data}</p>;
    }
    const isLoggedIn = props.isLoggedIn;
    if (isLoggedIn) {
        return <UserGreeting data="Welcome back!" />;
    }
    return <GuestGreeting data="Please sign up." />;
}
/// Conditional Element Variables
 function LoginButton(props) {
    return (
      <button onClick={props.onClick}>
        Login
      </button>
    );
  }
  
   function LogoutButton(props) {
    return (
      <button onClick={props.onClick}>
        Logout
      </button>
    );
  }
export class LoginControl extends React.Component {
    
    constructor(props) {
      super(props);
      this.handleLoginClick = this.handleLoginClick.bind(this);
      this.handleLogoutClick = this.handleLogoutClick.bind(this);
      this.state = {isLoggedIn: false};
    }
  
    handleLoginClick() {
      this.setState({isLoggedIn: true});
    }
  
    handleLogoutClick() {
      this.setState({isLoggedIn: false});
    }
  
    render() {
      const isLoggedIn = this.state.isLoggedIn;
      let button;
      if (isLoggedIn) {
        button = <LogoutButton onClick={this.handleLogoutClick} />;
      } else {
        button = <LoginButton onClick={this.handleLoginClick} />;
      }
  
      return (
        <div style={{marginLeft:20}}>
          <Greeting isLoggedIn={isLoggedIn} />{button}
        </div>
      );
    }
  }

  ///////////////// Lists and Keys /////////
  export function ListItem(){
    const numbers = [1, 2, 3, 4, 5];
    const doubled = numbers.map((number) => number * 2);
    const listItems = numbers.map((number) =>
      <li>{number}</li>
    );
    console.log(doubled)
    return (listItems);
  }


  ////////////// Use State ///////
  export default function State() {
    const history = useHistory();
    const [data, setData] = useState(1);
    return (
        <MasterPage>
            <div style={{ marginLeft: 50 }}>
                <PageHeader title="Test" onBack={() => history.goBack()} />
                <div>จำนวน : {data}</div>
                <button onClick={() => setData(parseFloat(data || 0) + 1)}>Add</button>
                <button onClick={() => setData(parseFloat(data ? data : 0) - 1)}>Cancel</button>

            </div>
        </MasterPage>
    )

    
}
