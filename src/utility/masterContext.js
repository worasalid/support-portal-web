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
                complete: {
                    count: 0
                }
            },
            report: {
                visible: true
            },
            setting: {
                mapping_company: {
                    visible: true
                }
            }
        }
    }
}

export const masterReducer = createReducer(masterState, {
    COUNT_MYTASK: (state, {payload}) => {state.toolbar.sider_menu.issue.mytask.count = payload}
})

export default MasterContext;