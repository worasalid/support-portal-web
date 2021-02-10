import React, { useReducer } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Profile from './Page/Internal/Profile';

import CustomerDashboard from './Page/Customer/Dashboard/MyDashboard';
import CustomerAllMytask from './Page/Customer/Issue/AllMyTask';
import CustomerMytask from './Page/Customer/Issue/MyTask';
import CustomerComplete from './Page/Customer/Issue/Complete';
import CustomerInProgress from './Page/Customer/Issue/InProgress';
import CustomerPass from './Page/Customer/Issue/Pass';
import CustomerCancel from './Page/Customer/Issue/Cancel';
import CustomerSubject from './Page/Customer/Issue/Subject';
import Customerlogin from './Page/Customer/login';

import Dashboard from './Page/Internal/DashBoard/MyDashBoard';
import AllIssue from './Page/Internal/Issue/All';
import AllTask from './Page/Internal/Issue/AllTask';
import MyTask from './Page/Internal/Issue/MyTask';
import InProgress from './Page/Internal/Issue/InProgress';
import Subject from './Page/Internal/Issue/Subject';
import SubTask from './Page/Internal/Issue/SubTask'
import Resolved from './Page/Internal/Issue/Resolved';
import Complete from './Page/Internal/Issue/Complete';
import Cancel from './Page/Internal/Issue/Cancel';
import Ricef from './Page/Internal/Ricef/Ricef';
import RicefHeader from './Page/Internal/Ricef/RicefHeader';
import RicefDetails from './Page/Internal/Ricef/RicefDetails';
import RicefMyTask from './Page/Internal/Ricef/MyTask';
import RicefInProgress from './Page/Internal/Ricef/InProgress';
import RicefSubject from './Page/Internal/Ricef/Subject';

import UnAssign from './Page/Internal/Issue/UnAssign';
import Login from './Page/Internal/Login';
import MasterCompany from './Page/Internal/Setting/MasterCompany';
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
import RicefContext, { ricefReducer, ricefState } from './utility/ricefContext';



export default function Routes() {
    const [state, dispatch] = useReducer(reducer, initState);
    const [masterstate, masterdispatch] = useReducer(masterReducer, masterState);
    const [customerstate, customerdispatch] = useReducer(customerReducer, customerState);
    const [userstate, userdispatch] = useReducer(userReducer, userState);
    const [ricefstate, ricefdispatch] = useReducer(ricefReducer, ricefState)
    return (
        <AuthenContext.Provider value={{ state, dispatch }}>
            <MasterContext.Provider value={{ state: masterstate, dispatch: masterdispatch }}>
                <UserContext.Provider value={{ state: userstate, dispatch: userdispatch }}>
                    <RicefContext.Provider value={{ state: ricefstate, dispatch: ricefdispatch }}>
                        <CustomerContext.Provider value={{ state: customerstate, dispatch: customerdispatch }}>
                            <Router basename="space">
                                <Switch>
                                    <Route path="/" exact component={Login} />
                                    <Route path="/login" exact component={Login} />
                                    <Route path="/internal/user/profile" exact component={Profile} />
                                    <Route path="/internal/issue" exact component={MyTask} />
                                    <Route path="/internal/issue/unassign" exact component={UnAssign} />
                                    <Route path="/internal/issue/setting/mastercompany" exact component={MasterCompany} />
                                    <Route path="/internal/issue/setting/mapcompany" exact component={MappingCompany} />
                                    <Route path="/internal/issue/setting/mapdeveloper" exact component={MappingDeveloper} />
                                    <Route path="/internal/dashboard" exact component={Dashboard} />
                                    <Route path="/internal/issue/all" exact component={AllIssue} />
                                    <Route path="/internal/issue/alltask" exact component={AllTask} />
                                    <Route path="/internal/issue/mytask/:id?" exact component={MyTask} />
                                    <Route path="/internal/issue/inprogress/:id?" exact component={InProgress} />
                                    <Route path="/internal/issue/resolved" exact component={Resolved} />
                                    <Route path="/internal/issue/cancel" exact component={Cancel} />
                                    <Route path="/internal/issue/complete" exact component={Complete} />
                                    <Route path="/internal/issue/subject/:id?" exact component={Subject} />
                                    <Route path="/internal/issue/subject/:id?/task-:task?" exact component={SubTask} />
                                    <Route path="/internal/report/charts" exact component={Charts} />


                                    <Route path="/internal/ricef" exact component={Ricef} />
                                    <Route path="/internal/ricef/comp-:compid?" exact component={RicefHeader} />
                                    <Route path="/internal/ricef/comp-:compid?/batch-:batchid?" exact component={RicefDetails} />
                                    <Route path="/internal/ricef/mytask" exact component={RicefMyTask} />
                                    <Route path="/internal/ricef/inprogress" exact component={RicefInProgress} />
                                    <Route path="/internal/ricef/subject-:ricefid?" exact component={RicefSubject} />


                                    <Route path="/customer/login" exact component={Customerlogin} />
                                    <Route path="/customer/servicedesk" exact component={ServiceDesk} />
                                    <Route path="/customer/servicedesk/issuemenu" exact component={IssueMenu} />
                                    <Route path="/customer/servicedesk/issuecreate/:id?" exact component={IssueCreate} />
                                    <Route path="/customer/dashboard" exact component={CustomerDashboard} />
                                    <Route path="/customer/issue/alltask" exact component={CustomerAllMytask} />
                                    <Route path="/customer/issue/mytask" exact component={CustomerMytask} />
                                    <Route path="/customer/issue/inprogress" exact component={CustomerInProgress} />
                                    <Route path="/customer/issue/pass" exact component={CustomerPass} />
                                    <Route path="/customer/issue/Subject/:id?" exact component={CustomerSubject} />
                                    <Route path="/customer/issue/complete" exact component={CustomerComplete} />
                                    <Route path="/customer/issue/cancel" exact component={CustomerCancel} />
                                </Switch>
                            </Router>
                        </CustomerContext.Provider>
                    </RicefContext.Provider>
                </UserContext.Provider>
            </MasterContext.Provider>
        </AuthenContext.Provider>
    )
}
