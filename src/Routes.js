import React, { useReducer } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Login from './Page/Internal/Login';
import LineRegister from './Page/Internal/LineRegister'
import Profile from './Page/Internal/Profile';

import CustomerDashboard from './Page/Customer/Dashboard/MyDashboard';
import CustomerDashboardAll from './Page/Customer/Dashboard/IssueAll';
import CustomerAllIssue from './Page/Customer/Issue/All';
import CustomerAllMytask from './Page/Customer/Issue/AllMyTask';
import CustomerMytask from './Page/Customer/Issue/MyTask';
import CustomerComplete from './Page/Customer/Issue/Complete';
import CustomerInProgress from './Page/Customer/Issue/InProgress';
import CustomerPass from './Page/Customer/Issue/Pass';
import CustomerCancel from './Page/Customer/Issue/Cancel';
import CustomerSubject from './Page/Customer/Issue/Subject';
import Customerlogin from './Page/Customer/login';

import MyDashboard from './Page/Internal/DashBoard/MyDashBoard';
import AllDashBoard from './Page/Internal/DashBoard/AllDashBoard';
import Dashboard1 from './Page/Internal/DashBoard/DashBoard1';
import Dashboard2 from './Page/Internal/DashBoard/Dashboard2';
import DashBoard3 from './Page/Internal/DashBoard/DashBoard3';
import DashBoard4 from './Page/Internal/DashBoard/DashBoard4';

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
import MasterCompany from './Page/Internal/Setting/MasterCompany';
import MappingCompany from './Page/Internal/Setting/MapCompany';
import SupportSiteConfig from './Page/Internal/Setting/SupportSiteConfig';
import CompanySiteConfig from './Page/Internal/Setting/CompanySiteConfig';
import MappingDeveloper from './Page/Internal/Setting/MapDeveloper';
import ConfigDeveloper from './Page/Internal/Setting/ConfigDeveloper';
import IssuePatch from './Page/Internal/PatchUpdate/IssuePatch';
import PatchHeader from './Page/Internal/PatchUpdate/PatchHeader';
import PatchDetails from './Page/Internal/PatchUpdate/PatchDetails';
import MapQA from './Page/Internal/Setting/MapQA';
import ConfigQA from './Page/Internal/Setting/ConfigQA';
import MapSA from './Page/Internal/Setting/MapSA';
import ConfigSA from './Page/Internal/Setting/ConfigSA';

import Charts from './Page/Internal/Report/charts';
import SystemConfig from './Page/Internal/Setting/System/SystemConfig';
import Organization from './Page/Internal/Setting/System/OrgChart';
import MasterProduct from './Page/Internal/Setting/System/MasterProduct';
import MasterModule from './Page/Internal/Setting/System/MasterModule';

// Config
import ConfigReOpen from './Page/Internal/Setting/System/ConfigReOpen';
import ConfigVersion from './Page/Internal/Setting/System/ConfigVersion';
import ConfigEmail from './Page/Internal/Setting/System/ConfigEmail';
import ConfigReOpenEmail from './Page/Internal/Setting/System/ConfigReOpenEmail';
import ConfigEmailPatchVersion from './Page/Internal/Setting/System/ConfigEmail_PatchVersion';
import ConfigReasonCancel from './Page/Internal/Setting/System/ConfigReasonCancel';
import ConfigReasonReject from './Page/Internal/Setting/System/ConfigReasonReject';
import UserManual from './Page/Internal/Setting/System/UserManual';

import Migration from './Page/Internal/Migration/Migration';
import ScriptSQL from './Page/Internal/Migration/ScriptSQL';


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
                                    <Route path="/line/register" component={LineRegister} />
                                    <Route path="/internal/user/profile" exact component={Profile} />
                                    <Route path="/internal/issue" exact component={MyTask} />
                                    <Route path="/internal/issue/unassign" exact component={UnAssign} />
                                    <Route path="/internal/setting/mastercompany" exact component={MasterCompany} />
                                    <Route path="/internal/setting/mapcompany" exact component={MappingCompany} />
                                    <Route path="/internal/setting/support_site_config/userid-:id?" exact component={SupportSiteConfig} />
                                    <Route path="/internal/setting/company_site_config/comid-:id?" exact component={CompanySiteConfig} />
                                    <Route path="/internal/setting/mapdeveloper" exact component={MappingDeveloper} />
                                    <Route path="/internal/setting/config_developer/userid-:id?" exact component={ConfigDeveloper} />
                                    <Route path="/internal/setting/mapqa" exact component={MapQA} />
                                    <Route path="/internal/setting/config_qa/userid-:id?" exact component={ConfigQA} />
                                    <Route path="/internal/setting/mapsa" exact component={MapSA} />
                                    <Route path="/internal/setting/config_sa/userid-:id?" exact component={ConfigSA} />

                                    {/* ตั้งค่าระบบ */}
                                    <Route path="/internal/setting/system" exact component={SystemConfig} />
                                    <Route path="/internal/setting/system/orgchart" exact component={Organization} />
                                    <Route path="/internal/setting/system/product" exact component={MasterProduct} />
                                    <Route path="/internal/setting/system/module" exact component={MasterModule} />
                                    <Route path="/internal/setting/system/reopen" exact component={ConfigReOpen} />
                                    <Route path="/internal/setting/system/version" exact component={ConfigVersion} />
                                    <Route path="/internal/setting/system/email_config" exact component={ConfigEmail} />
                                    <Route path="/internal/setting/system/email_config/reopen" exact component={ConfigReOpenEmail} />
                                    <Route path="/internal/setting/system/email_config/patch" exact component={ConfigEmailPatchVersion} />

                                    <Route path="/internal/setting/system/reason_cancel" exact component={ConfigReasonCancel} />
                                    <Route path="/internal/setting/system/reason_reject" exact component={ConfigReasonReject} />
                                    <Route path="/internal/setting/system/user-manual" exact component={UserManual} />
                                    

                                    {/* dashboard */}
                                    <Route path="/internal/mydashboard" exact component={MyDashboard} />
                                    <Route path="/internal/dashboard" exact component={AllDashBoard} />
                                    <Route path="/internal/dashboard/dashboard1" exact component={Dashboard1} />
                                    <Route path="/internal/dashboard/dashboard2" exact component={Dashboard2} />
                                    <Route path="/internal/dashboard/dashboard3" exact component={DashBoard3} />
                                    <Route path="/internal/dashboard/dashboard4" exact component={DashBoard4} />

                                    <Route path="/internal/issue/other" exact component={AllIssue} />
                                    <Route path="/internal/issue/alltask" exact component={AllTask} />
                                    <Route path="/internal/issue/mytask/:id?" exact component={MyTask} />
                                    <Route path="/internal/issue/inprogress/:id?" exact component={InProgress} />
                                    <Route path="/internal/issue/resolved" exact component={Resolved} />
                                    <Route path="/internal/issue/cancel" exact component={Cancel} />
                                    <Route path="/internal/issue/complete" exact component={Complete} />
                                    <Route path="/internal/issue/subject/:id?" exact component={Subject} />
                                    <Route path="/internal/issue/subject/:id?/task-:task?" exact component={SubTask} />
                                    <Route path="/internal/report/charts" exact component={Charts} />

                                    {/* Patch */}
                                    <Route path="/internal/patch/cut_of_patch" exact component={IssuePatch} />
                                    <Route path="/internal/patch/header" exact component={PatchHeader} />
                                    <Route path="/internal/patch/details/id-:id?" exact component={PatchDetails} />


                                    <Route path="/internal/ricef/all" exact component={Ricef} />
                                    <Route path="/internal/ricef/comp-:compid?" exact component={RicefHeader} />
                                    <Route path="/internal/ricef/comp-:compid?/batch-:batchid?" exact component={RicefDetails} />
                                    <Route path="/internal/ricef/mytask" exact component={RicefMyTask} />
                                    <Route path="/internal/ricef/inprogress" exact component={RicefInProgress} />
                                    <Route path="/internal/ricef/subject-:ricefid?" exact component={RicefSubject} />

                                    {/* Migration */}
                                    <Route path="/internal/migration" exact component={Migration} />
                                    <Route path="/internal/migration/sqlscript/comid-:id?" exact component={ScriptSQL} />

                                    <Route path="/customer/login" exact component={Customerlogin} />
                                    <Route path="/customer/servicedesk" exact component={ServiceDesk} />
                                    <Route path="/customer/servicedesk/issuemenu" exact component={IssueMenu} />
                                    <Route path="/customer/servicedesk/issuecreate/:id?" exact component={IssueCreate} />
                                    <Route path="/customer/dashboard/all" exact component={CustomerDashboardAll} />
                                    <Route path="/customer/dashboard" exact component={CustomerDashboard} />
                                    <Route path="/customer/issue/all-issue" exact component={CustomerAllIssue} />
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
