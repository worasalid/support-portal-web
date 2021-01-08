import { createContext } from "react";
import { createReducer } from '@reduxjs/toolkit';

const RicefContext = createContext();

export const ricefState = {
    masterdata: {
        productState: [],
        moduleState: [],
        issueTypeState: [],
        priorityState: []
    },
    recefdetail: []
}

export const ricefReducer = createReducer(ricefState, {
  LOAD_RICEFDETAIL: (state, { payload }) => { state.recefdetail = payload },
  LOAD_TYPE: (state, { payload }) => { state.masterdata.issueTypeState = payload },
  LOAD_PRIORITY: (state, { payload }) => { state.masterdata.priorityState = payload },
  LOAD_MODULE: (state, { payload }) => { state.masterdata.moduleState = payload },
  
});

export default RicefContext;