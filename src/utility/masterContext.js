import { createContext } from "react";
import { createReducer } from '@reduxjs/toolkit';

const MasterContext = createContext();

export const masterState = {
    toolbar: {
        sider_menu: {
            issue: {
                mytask: {
                    count: 0
                },
                inprogress: {
                    count: 0
                },
                resolved: {
                    count: 0
                },
                pass: {
                    count: 0
                },
                cancel: {
                    count: 0
                },
                complete: {
                    count: 0
                },
                sla_duedate_noti: 0,
                duedate_noti: 0
            },
            report: {
                visible: true
            },
            setting: {
                mapping_company: {
                    visible: true
                }
            }
        },
        top_menu: {
            notification: 0
        }
    }
}

export const masterReducer = createReducer(masterState, {
    COUNT_MYTASK: (state, {payload}) => {state.toolbar.sider_menu.issue.mytask.count = payload},
    COUNT_INPROGRESS: (state, {payload}) => {state.toolbar.sider_menu.issue.inprogress.count = payload},
    COUNT_RESOLVED: (state, {payload}) => {state.toolbar.sider_menu.issue.resolved.count = payload},
    COUNT_PASS: (state, {payload}) => {state.toolbar.sider_menu.issue.pass.count = payload},
    COUNT_CANCEL: (state, {payload}) => {state.toolbar.sider_menu.issue.cancel.count = payload},
    COUNT_COMPLETE: (state, {payload}) => {state.toolbar.sider_menu.issue.complete.count = payload},
    COUNT_NOTI : (state, {payload}) => {state.toolbar.top_menu.notification= payload},
    COUNT_DUEDATE_NOTI : (state, {payload}) => {state.toolbar.sider_menu.issue.duedate_noti= payload},
    COUNT_SLA_DUEDATE_NOTI : (state, {payload}) => {state.toolbar.sider_menu.issue.sla_duedate_noti= payload}

})

export default MasterContext;