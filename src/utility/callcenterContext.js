import { createContext } from "react";
import { createReducer } from '@reduxjs/toolkit';
// import userReducer from "./reducer";

const CallCenterContext = createContext();

export const caseState = {
    masterdata: {
        companyState: [],
        productState: [],
        userState: []
    },
    filter: {
        companyState: [],
        productState: [],
        scene: [],
        users: [],
        date: {
            startdate: "",
            enddate: ""
        },
        keyword: ""
    },
    search: false,
    loading: false,
    casedata: []
}

export const caseReducer = createReducer(caseState, {
    SELECT_COMPANY: (state, { payload }) => { state.filter.companyState = payload },
    SELECT_PRODUCT: (state, { payload }) => { state.filter.productState = payload },
    SELECT_SCENE: (state, { payload }) => { state.filter.scene = payload },
    SELECT_DATE: (state, { payload }) => { state.filter.date = payload },
    SELECT_KEYWORD: (state, { payload }) => { state.filter.keyword = payload },
    SELECT_USERS: (state, { payload }) => { state.filter.users = payload },
    SEARCH: (state, { payload }) => { state.search = payload },
    LOADING: (state, { payload }) => { state.loading = payload },

    LOAD_COMPANY: (state, { payload }) => { state.masterdata.companyState = payload },
    LOAD_PRODUCT: (state, { payload }) => { state.masterdata.productState = payload },
    LOAD_CASE: (state, { payload }) => { state.casedata = payload },
    LOAD_USER: (state, { payload }) => { state.masterdata.userState = payload },



});

export default CallCenterContext;