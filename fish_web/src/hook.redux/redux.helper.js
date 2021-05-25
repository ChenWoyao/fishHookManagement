/*
 * @Author: your name
 * @Date: 2020-12-30 00:27:11
 * @LastEditTime: 2020-12-30 00:49:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /myNote/项目集合/woyao_cli/src/hook.redux/redux.helper.js
 */
import React, {
    createContext
} from 'react'
import ReactDOM from 'react-dom'

export function createStore(initStore = {}) {
    return createContext(initStore)
}

/**
 * @description:
 * @param {*} initState
 * @param {
 * () => (state, action) => {
 *      return {
 *          ["xxxx"](state, action) {
 *              ...state,
 *              xxx: action.payload
 *          }
 *      }
 * }
 * } reducer
 * @param {*} name
 * @return {*}
 */
export function createReducer(initState, reducer, name = '') {
    return function (state, action) {
        const {
            type
        } = action
        const handler = reducer(initState)[type]
        const unHandled = !type || !handler
        if (unHandled) {
            throw new Error('unhandled reducer action' + type)
            return
        }
        const nextState = unHandled ? initState : handler.call(null, state, action)
        return nextState
    }
}
