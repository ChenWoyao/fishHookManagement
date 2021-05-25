/*
 * @Author: your name
 * @Date: 2020-12-30 00:27:01
 * @LastEditTime: 2020-12-30 11:05:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /myNote/项目集合/woyao_cli/src/hook.redux/global.js
 */
import { useContext, useReducer } from 'react'
import { createStore, createReducer } from './redux.helper'

const initStore = {
    userInfo: {
        name: 'woyao'
    },
    token: '',
}

export const Store = createStore(initStore)

const reducer = createReducer(initStore, function() {
    return {
        ["UPDATE_USER_INFO"](state, action) {
            return {
                ...state,
                userInfo: action.payload
            }
        }
    }
})

export const useReduxHook = () => useReducer(reducer, useContext(Store))
