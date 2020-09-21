import { createContext } from "react";
import { createReducer } from '@reduxjs/toolkit';
// import userReducer from "./reducer";

const IssueContext = createContext();

export const customerState = {
    masterdata: {
        productState: [],
        moduleState: [],
        issueTypeState: [],
        priorityState: []
    },
    filter: {
        productState: [],
        moduleState: [],
        TypeState: [],
        priorityState: [],
        date: {
            startdate: "",
            enddate: ""
        },
        keyword: ""
    },
    search: false,
    loading: false,
    issuedata: {
        data: [],
        datarow: [],
        details: []
    },
    actionflow: []
}

export const userState = {
    masterdata: {
        companyState: [],
        productState: [],
        moduleState: [],
        issueTypeState: [],
        priorityState: []
    },
    filter: {
        companyState: [],
        productState: [],
        moduleState: [],
        TypeState: [],
        priorityState: [],
        date: {
            startdate: "",
            enddate: ""
        },
        keyword: ""
    },
    search: false,
    loading: false,
    issuedata: {
        data: [],
        datarow: [],
        details: []
    },
    actionflow: []
    
}

export const customerReducer = createReducer(customerState, {
    SELECT_PRODUCT: (state, { payload }) => { state.filter.productState = payload },
    SELECT_MODULE: (state, { payload }) => { state.filter.moduleState = payload },
    SELECT_TYPE: (state, { payload }) => { state.filter.TypeState = payload },
    SELECT_PRIORITY: (state, { payload }) => { state.filter.priorityState = payload },
    SELECT_DATE: (state, { payload }) => { state.filter.date = payload },
    SELECT_KEYWORD: (state, { payload }) => { state.filter.keyword = payload },
    SEARCH: (state, { payload }) => { state.search = payload },
    LOADING: (state, { payload }) => { state.loading = payload },
    SELECT_DATAROW: (state, {payload}) => {state.issuedata.datarow = payload},

    LOAD_ISSUE: (state, { payload }) => { state.issuedata.data = payload },
    LOAD_ISSUEDETAIL: (state, {payload}) => {state.issuedata.details = payload},
    LOAD_PRODUCT: (state, { payload }) => { state.masterdata.productState = payload },
    LOAD_MODULE: (state, { payload }) => { state.masterdata.moduleState = payload },
    LOAD_TYPE: (state, { payload }) => { state.masterdata.issueTypeState = payload },
    LOAD_PRIORITY: (state, { payload }) => { state.masterdata.priorityState = payload },
    LOAD_ACTION_FLOW: (state, {payload}) => {state.actionflow = payload}
});

export const userReducer = createReducer(userState, {
    SELECT_COMPANY: (state, { payload }) => { state.filter.companyState = payload },
    SELECT_PRODUCT: (state, { payload }) => { state.filter.productState = payload },
    SELECT_MODULE: (state, { payload }) => { state.filter.moduleState = payload },
    SELECT_TYPE: (state, { payload }) => { state.filter.TypeState = payload },
    SELECT_PRIORITY: (state, { payload }) => { state.filter.priorityState = payload },
    SELECT_DATE: (state, { payload }) => { state.filter.date = payload },
    SELECT_KEYWORD: (state, { payload }) => { state.filter.keyword = payload },
    SEARCH: (state, { payload }) => { state.search = payload },
    LOADING: (state, { payload }) => { state.loading = payload },
    SELECT_DATAROW: (state, {payload}) => {state.issuedata.datarow = payload},

    LOAD_ISSUE: (state, { payload }) => { state.issuedata.data = payload },
    LOAD_ISSUEDETAIL: (state, {payload}) => {state.issuedata.details = payload},
    LOAD_COMPANY: (state, { payload }) => { state.masterdata.companyState = payload },
    LOAD_PRODUCT: (state, { payload }) => { state.masterdata.productState = payload },
    LOAD_MODULE: (state, { payload }) => { state.masterdata.moduleState = payload },
    LOAD_TYPE: (state, { payload }) => { state.masterdata.issueTypeState = payload },
    LOAD_PRIORITY: (state, { payload }) => { state.masterdata.priorityState = payload },
    LOAD_ACTION_FLOW: (state, {payload}) => {state.actionflow = payload},
    LOAD_COUNT_MYTASK: (state, { payload }) => { state.toolbar.issuecount.mytask = payload },
});



export default IssueContext;