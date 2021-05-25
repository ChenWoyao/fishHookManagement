import React, { useState } from 'react'
import { Table, PageHeader, Button, Select } from 'antd'

const ProductionTable = (props) => {
    const columns = [
        {
            title: '产品型号',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '产量',
            dataIndex: 'inventory',
            key: 'inventory',
            sorter: {
                compare: (a, b) => a.inventory - b.inventory,
                multiple: 2,
            },
        },
        {
            title: '制作单价',
            dataIndex: 'cost',
            key: 'cost'
        },
        {
            title: '制作金额',
            dataIndex: 'costAmount',
            key: 'costAmount',
            render: (text, record) => {
                return (
                    <div>
                        { record.inventory * record.cost}
                    </div>
                )
            }
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

export default React.memo(ProductionTable)
