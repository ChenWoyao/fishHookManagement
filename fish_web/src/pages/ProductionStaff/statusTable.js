import React, { useState } from 'react'
import { Table, PageHeader, Button, Select } from 'antd'

const StatusTable = (props) => {
    const columns = [
        {
            title: '产品型号',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '数量',
            dataIndex: 'count',
            key: 'count',
            sorter: {
                compare: (a, b) => a.inventory - b.inventory,
                multiple: 2,
            },
        },
        {
            title: '提交日期',
            dataIndex: 'timedate',
            key: 'timedate'
        },

        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
        }
    ]
    return (
        <Table
            columns={columns}
            dataSource={props.dataSource || []}
            pagination={{
                current: 1,
                pageSize: 10,
                total: 100,
            }}
        />
    )
}

export default React.memo(StatusTable)
