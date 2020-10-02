import React, { useReducer } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import CustomerMytask from './Page/Customer/Issue/MyTask';
import CustomerComplete from './Page/Customer/Issue/Complete';
import CustomerInProgress from './Page/Customer/Issue/InProgress';
import CustomerSubject from './Page/Customer/Issue/Subject';
import Customerlogin from './Page/Customer/login';

import InProgress from './Page/Internal/Issue/InProgress';
import MyTask from './Page/Internal/Issue/MyTask';
import Subject from './Page/Internal/Issue/Subject';
import UnAssign from './Page/Internal/Issue/UnAssign';
import Login from './Page/Internal/Login';
import MappingCompany from './Page/Internal/Setting/MapCompany';
import MappingDeveloper from './Page/Internal/Setting/MapDeveloper';
import Charts from './Page/Internal/Report/charts';

import IssueCreate from "./Page/Customer/ServiceDesk/IssueCreate";
import ServiceDesk from "./Page/Customer/ServiceDesk/Index";
import IssueMenu from "./Page/Customer/ServiceDesk/IssueMenu";
import AuthenContext, { reducer, initState } from "./utility/authenContext";
import MasterContext, { masterReducer, masterState } from "./utility/masterContext";
import CustomerContext, { customerReducer, customerState } from "./utility/issueContext";
import UserContext, { userReducer, userState } from "./utility/issueContext";


export default function Routes() {
    const [state, dispatch] = useReducer(reducer, initState);
    const [masterstate, masterdispatch] = useReducer(masterReducer, masterState);
    const [customerstate, customerdispatch] = useReducer(customerReducer, customerState);
    const [userstate, userdispatch] = useReducer(userReducer, userState);
    return (
        <AuthenContext.Provider value={{ state, dispatch }}>
            <MasterContext.Provider value={{ state: masterstate, dispatch: masterdispatch }}>
                <UserContext.Provider value={{ state: userstate, dispatch: userdispatch }}>
                    <CustomerContext.Provider value={{ state: customerstate, dispatch: customerdispatch }}>
                        <Router>
                            <Switch>
                                <Route path="/" exact component={Login} />
                                <Route path="/Login" exact component={Login} />
                                <Route path="/Internal/Issue" exact component={MyTask} />
                                <Route path="/Internal/Issue/UnAssign" exact component={UnAssign} />
                                <Route path="/internal/issue/setting/mapcompany" exact component={MappingCompany} />
                                <Route path="/internal/issue/setting/mapdeveloper" exact component={MappingDeveloper} />
                                <Route path="/Internal/Issue/MyTask/:id?" exact component={MyTask} />
                                <Route path="/Internal/Issue/InProgress/:id?" exact component={InProgress} />
                                <Route path="/internal/issue/subject/:id?" exact component={Subject} />
                                <Route path="/internal/report/charts" exact component={Charts} />
                               

                                <Route path="/customer/login" exact component={Customerlogin} />
                                <Route path="/customer/servicedesk" exact component={ServiceDesk} />
                                <Route path="/customer/servicedesk/issuemenu" exact component={IssueMenu} />
                                <Route path="/customer/servicedesk/issuecreate/:id?" exact component={IssueCreate} />
                                <Route path="/customer/issue/mytask" exact component={CustomerMytask} />
                                <Route path="/customer/issue/inprogress" exact component={CustomerInProgress} />
                                <Route path="/customer/issue/Subject/:id?" exact component={CustomerSubject} />
                                <Route path="/customer/issue/Complete" exact component={CustomerComplete} />
                            </Switch>
                        </Router>
                    </CustomerContext.Provider>
                </UserContext.Provider>
            </MasterContext.Provider>
        </AuthenContext.Provider>
    )
}
