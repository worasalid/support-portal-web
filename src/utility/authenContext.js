import { createContext } from "react";
import { createReducer } from '@reduxjs/toolkit';

export const AuthenContext = createContext();

export const initState = {
    authen: false,
    user: null,
    loading: false,
    error: null,
    response: {
        status: null,
        message: ""
    }
}

export const reducer = createReducer(initState, {
    Authen: (state, { payload }) => { state.authen = payload },
    LOADING: (state, { payload }) => { state.loading = payload },
    ERROR: (state, { payload }) => { state.error = payload },
    LOGIN: (state, { payload }) => { state.user = payload},
    CLEAR: (state) => { state = initState },
    SET_RESPONSE_STATUS: (state, { payload }) => { state.response.status = payload }
});

export default AuthenContext;