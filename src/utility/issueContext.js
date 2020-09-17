import { createContext } from "react";
import { createReducer } from '@reduxjs/toolkit';
// import userReducer from "./reducer";

const IssueContext = createContext();

export const customerState = {
    masterdata: {
        productState: [],
        moduleState: [],
        issueTypeState: []
    },
    filter: {
        productState: [],
        moduleState: [],
        TypeState: [],
        date: {
            startdate: "",
            enddate: ""
        },
        keyword: ""
    },
    search: false,
    loading: false,
    issuedata: {
        data: []
    }
}

export const userState = {
    masterdata: {
        companyState:[],
        productState: [],
        moduleState: [],
        issueTypeState: []
    },
    filter: {
        companyState: [],
        productState: [],
        moduleState: [],
        TypeState: [],
        date: {
            startdate: "",
            enddate: ""
        },
        keyword: ""
    },
    search: false,
    loading: false,
    issuedata: {
        data: []
    }
}

export const customerReducer = createReducer(customerState, {
    SELECT_PRODUCT: (state, { payload }) => { state.filter.productState = payload },
    SELECT_MODULE: (state, { payload }) => { state.filter.moduleState = payload },
    SELECT_TYPE: (state, { payload }) => { state.filter.TypeState = payload },
    SELECT_DATE: (state, { payload }) => { state.filter.date = payload },
    SELECT_KEYWORD: (state, { payload }) => { state.filter.keyword = payload },
    SEARCH: (state, { payload }) => { state.search = payload },
    LOADING: (state, { payload }) => { state.loading = payload },

    LOAD_ISSUE: (state, { payload }) => { state.issuedata.data = payload },
    LOAD_PRODUCT: (state, { payload }) => { state.masterdata.productState = payload },
    LOAD_MODULE: (state, { payload }) => { state.masterdata.moduleState = payload },
    LOAD_TYPE: (state, { payload }) => { state.masterdata.issueTypeState = payload }
});

export const userReducer = createReducer(userState, {
    SELECT_COMPANY: (state, { payload }) => { state.filter.companyState = payload },
    SELECT_PRODUCT: (state, { payload }) => { state.filter.productState = payload },
    SELECT_MODULE: (state, { payload }) => { state.filter.moduleState = payload },
    SELECT_TYPE: (state, { payload }) => { state.filter.TypeState = payload },
    SELECT_DATE: (state, { payload }) => { state.filter.date = payload },
    SELECT_KEYWORD: (state, { payload }) => { state.filter.keyword = payload },
    SEARCH: (state, { payload }) => { state.search = payload },
    LOADING: (state, { payload }) => { state.loading = payload },

    LOAD_ISSUE: (state, { payload }) => { state.issuedata.data = payload },
    LOAD_COMPANY: (state,{payload}) => {state.masterdata.companyState = payload} ,
    LOAD_PRODUCT: (state, { payload }) => { state.masterdata.productState = payload },
    LOAD_MODULE: (state, { payload }) => { state.masterdata.moduleState = payload },
    LOAD_TYPE: (state, { payload }) => { state.masterdata.issueTypeState = payload }
});



export default IssueContext;