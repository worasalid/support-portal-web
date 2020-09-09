import React from 'react'
import { createReducer } from '@reduxjs/toolkit';

export const userState = {
  users: "",
}


export const initState = {
  productState: {
    data: [],
    search: ""
  },
  moduleState: {
    data: [],
    search: ""
  },
  issueTypeState: {
    data: [],
    search: ""
  },
  issueState: {
    data: []
  },
  keyword: ""
}


export const userReducer = createReducer(userState, {
  SETUSER: (state, { payload }) => { state.users = payload }
});

export const productReducer = createReducer(initState.productState, {
  SET: (state, { payload }) => {state.data = payload},
  SELECT: (state, { payload }) => {state.search = payload},
  // CLEAR: (state, {payload}) => {return state = payload}
});

export const moduleReducer = createReducer(initState.moduleState, {
  SET: (state, { payload }) => {state.data = payload},
  SELECT: (state, { payload }) => {state.search = payload}
});

export const issueCusReducer = createReducer(initState.issueState, {
  SET: (state, { payload }) => {state.data = payload},
  SELECT: (state, { payload }) => {state.search = payload},
});

export const issueTypeReducer = createReducer(initState.issueTypeState, {
  SET: (state, { payload }) => {state.data = payload},
  SELECT: (state, { payload }) => {state.search = payload},
});

export const keywordReducer = createReducer(initState.keyword, {
  SELECT: (state, { payload }) => {state = payload}
});

export default userReducer;