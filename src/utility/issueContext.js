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
        scene: [],
        TypeState: [],
        priorityState: [],
        progress: [],
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
    taskdata: {
        data: []
    },
    actionflow: [],
    mailbox: [],
    node: {
        input_id: 0,
        output_id: 0,
        output_data: []
    }
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
        scene: [],
        TypeState: [],
        priorityState: [],
        progress: [],
        isReleaseNote: "",
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
    taskdata: {
        data: []
    },
    actionflow: [],
    mailbox: [],
    node: {
        input_id: 0,
        output_id: 0,
        to_node_action_id: 0,
        output_data: []
    }


}

export const customerReducer = createReducer(customerState, {
    SELECT_PRODUCT: (state, { payload }) => { state.filter.productState = payload },
    SELECT_MODULE: (state, { payload }) => { state.filter.moduleState = payload },
    SELECT_TYPE: (state, { payload }) => { state.filter.TypeState = payload },
    SELECT_PRIORITY: (state, { payload }) => { state.filter.priorityState = payload },
    SELECT_DATE: (state, { payload }) => { state.filter.date = payload },
    SELECT_PROGRESS: (state, { payload }) => { state.filter.progress = payload },
    SELECT_SCENE: (state, { payload }) => { state.filter.scene = payload },
    SELECT_KEYWORD: (state, { payload }) => { state.filter.keyword = payload },
    CLEAR_FILTER: (state, { payload }) => { state.filter = payload },
    SEARCH: (state, { payload }) => { state.search = payload },
    //LOADING: (state, { payload }) => { state.loading = payload },
    LOADING: (state, { payload }) => {
        state.loading = payload;
        if (payload) {
            state.issuedata.data = [];
        }
    },
    SELECT_DATAROW: (state, { payload }) => { state.issuedata.datarow = payload },
    SELECT_NODE_OUTPUT: (state, { payload }) => { state.node.output_data = payload },

    LOAD_ISSUE: (state, { payload }) => { state.issuedata.data = payload },
    LOAD_ISSUEDETAIL: (state, { payload }) => { state.issuedata.details = payload },
    LOAD_MAILBOX: (state, { payload }) => { state.mailbox = payload },
    LOAD_TASKDATA: (state, { payload }) => { state.taskdata.data = payload },
    LOAD_PRODUCT: (state, { payload }) => { state.masterdata.productState = payload },
    LOAD_MODULE: (state, { payload }) => { state.masterdata.moduleState = payload },
    LOAD_TYPE: (state, { payload }) => { state.masterdata.issueTypeState = payload },
    LOAD_PRIORITY: (state, { payload }) => { state.masterdata.priorityState = payload },
    LOAD_ACTION_FLOW: (state, { payload }) => { state.actionflow = payload }
});

export const userReducer = createReducer(userState, {
    SELECT_COMPANY: (state, { payload }) => { state.filter.companyState = payload },
    SELECT_PRODUCT: (state, { payload }) => { state.filter.productState = payload },
    SELECT_MODULE: (state, { payload }) => { state.filter.moduleState = payload },
    SELECT_TYPE: (state, { payload }) => { state.filter.TypeState = payload },
    SELECT_PRIORITY: (state, { payload }) => { state.filter.priorityState = payload },
    SELECT_PROGRESS: (state, { payload }) => { state.filter.progress = payload },
    SELECT_SCENE: (state, { payload }) => { state.filter.scene = payload },
    SELECT_DATE: (state, { payload }) => { state.filter.date = payload },
    SELECT_KEYWORD: (state, { payload }) => { state.filter.keyword = payload },
    SELECT_ISRELEASENOTE: (state, { payload }) => { state.filter.isReleaseNote = payload },
    SEARCH: (state, { payload }) => { state.search = payload },
    LOADING: (state, { payload }) => { state.loading = payload },
    SELECT_DATAROW: (state, { payload }) => { state.issuedata.datarow = payload },
    SELECT_NODE_OUTPUT: (state, { payload }) => { state.node.output_data = payload },
    // SELECT_NODE_OUTPUT: (state, { payload }) => { state.node.output_id = payload },

    LOAD_ISSUE: (state, { payload }) => { state.issuedata.data = payload },
    LOAD_ISSUEDETAIL: (state, { payload }) => { state.issuedata.details = payload },
    LOAD_MAILBOX: (state, { payload }) => { state.mailbox = payload },
    LOAD_TASKDATA: (state, { payload }) => { state.taskdata.data = payload },
    LOAD_COMPANY: (state, { payload }) => { state.masterdata.companyState = payload },
    LOAD_PRODUCT: (state, { payload }) => { state.masterdata.productState = payload },
    LOAD_MODULE: (state, { payload }) => { state.masterdata.moduleState = payload },
    LOAD_TYPE: (state, { payload }) => { state.masterdata.issueTypeState = payload },
    LOAD_PRIORITY: (state, { payload }) => { state.masterdata.priorityState = payload },
    LOAD_ACTION_FLOW: (state, { payload }) => { state.actionflow = payload },
    LOAD_COUNT_MYTASK: (state, { payload }) => { state.toolbar.issuecount.mytask = payload },
});

export default IssueContext;