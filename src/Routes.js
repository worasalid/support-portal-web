import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import CustomerComplete from './Page/Customer/Issue/Complete';
import CustomerInProgress from './Page/Customer/Issue/InProgress';
import CustomerSubject from './Page/Customer/Issue/Subject';
import Customerlogin from './Page/Customer/Login';

import InProgress from './Page/Internal/Issue/InProgress';
import MyTask from './Page/Internal/Issue/MyTask';
import Subject from './Page/Internal/Issue/Subject';
import UnAssign from './Page/Internal/Issue/UnAssign';
import Login from './Page/Internal/Login';
import SendIssue from './Page/SendIssue';

export default function Routes() {
    return (
        <Router>
            <Switch>
                <Route path = "/" exact component={Login} />
                <Route path = "/Login" exact component={Login} />

                <Route path = "/Internal/Issue/UnAssign" exact component={UnAssign} />  
                <Route path = "/Internal/Issue/MyTask/:id?" exact component={MyTask} />
                <Route path = "/Internal/Issue/InProgress/:id?" exact component={InProgress} />
                <Route path = "/Internal/Issue/Subject/:id?" exact component={Subject} />

                <Route path = "/customer/login" exact component={Customerlogin} />
                <Route path = "/customer/issue/create" exact component={SendIssue} />
                <Route path = "/customer/issue/inProgress/:id?" exact component={CustomerInProgress} />
                <Route path = "/customer/issue/Subject/:id?" exact component={CustomerSubject} />
                <Route path = "/customer/issue/Complete" exact component={CustomerComplete} />
            </Switch>
        </Router>
    )
}
