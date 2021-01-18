import { createContext } from "react";
import { createReducer } from '@reduxjs/toolkit';

const RicefContext = createContext();

export const ricefState = {
  masterdata: {
    productState: [],
    moduleState: [],
    issueTypeState: [],
    priorityState: [],
    companyState: [],

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
  assignee: [],
  recefdetail: []
}

export const ricefReducer = createReducer(ricefState, {
  SELECT_COMPANY: (state, { payload }) => { state.filter.companyState = payload },
  SELECT_PRODUCT: (state, { payload }) => { state.filter.productState = payload },
  SELECT_MODULE: (state, { payload }) => { state.filter.moduleState = payload },
  SELECT_TYPE: (state, { payload }) => { state.filter.TypeState = payload },
  SELECT_PRIORITY: (state, { payload }) => { state.filter.priorityState = payload },
  SELECT_DATE: (state, { payload }) => { state.filter.date = payload },
  SELECT_KEYWORD: (state, { payload }) => { state.filter.keyword = payload },
  SEARCH: (state, { payload }) => { state.search = payload },

  LOAD_COMPANY: (state, { payload }) => { state.masterdata.companyState = payload },
  LOAD_PRODUCT: (state, { payload }) => { state.masterdata.productState = payload },
  LOAD_MODULE: (state, { payload }) => { state.masterdata.moduleState = payload },
  LOAD_TYPE: (state, { payload }) => { state.masterdata.issueTypeState = payload },
  LOAD_PRIORITY: (state, { payload }) => { state.masterdata.priorityState = payload },

  LOAD_RICEFDETAIL: (state, { payload }) => { state.recefdetail = payload },
  LOAD_TYPE: (state, { payload }) => { state.masterdata.issueTypeState = payload },
  LOAD_PRIORITY: (state, { payload }) => { state.masterdata.priorityState = payload },
  LOAD_MODULE: (state, { payload }) => { state.masterdata.moduleState = payload },
  LOAD_ASSIGNEE: (state, { payload }) => { state.assignee = payload },

});

export default RicefContext;