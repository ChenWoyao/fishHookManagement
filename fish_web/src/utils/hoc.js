import React, { useState } from 'react';

const type = (obj) => Object.prototype.toString.call(obj)

export const withLogger = (prefix = "") => (WrappedComponent) => {
    return (props) => {
        if(!props.preloading) {
            console.log(`${prefix}`, props.data)
        }
        return <WrappedComponent {...props} />
    }
}

export const withData = (request, params) => (WrappedComponent) =>{
    return (props) => {
        const [data, setData] = useState({})
        const [preloading, setPreloading] = useState(true)

        return <WrappedComponent {...props} {...{data, preloading}}/>
    }
}

export const withLoading = (Loading) => (WrappedComponent) => {
    return (props) => {
        let length;
        if (type(props.data) === "[object Object]") {
            length = Object.keys(props.data).length
        }
        if (type(props.data) === "[object Array]") {
            length = props.data.length
        }
        return length === 0 ? <Loading/> : <WrappedComponent {...props}/>
    }
}
