import React, { useState } from 'react'
import styles from './index.module.scss'
import './index.scss'
import { Table, PageHeader, Button, Select } from 'antd'
import { data } from './data'

const columns = [
    {
        title: '产品型号',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '库存量',
        dataIndex: 'inventory',
        key: 'inventory',
        sorter: {
            compare: (a, b) => a.inventory - b.inventory,
            multiple: 2,
        },
    },
    {
        title: '单价',
        dataIndex: 'price',
        key: 'price',
        sorter: {
            compare: (a, b) => a.price - b.price,
            multiple: 1,
        },
    },
    {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
        render: (text, record) => {
            return (
                <div>
                    { record.inventory * record.price}
                </div>
            )
        }
    },
]

const useSelectChange = () => {

}

const { Option } = Select

const SalerHome = () => {
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 100,
    })

    return (
        <div className={styles['content-container']}>
            <div className={styles['content-box']}>
                <PageHeader
                    className={styles['search']}
                    extra={[
                        <Button key="search" type="primary">search</Button>,
                        <Button key="add" type="add">添加订单</Button>,
                    ]}
                    title={
                        <>
                            <label>产品型号:</label>
                            <Select default="" style={{ width: 120 }} onChange={useSelectChange}>
                                <Option value="jack">Jack</Option>
                                <Option value="lucy">Lucy</Option>
                            </Select>
                        </>
                    }
                >

                </PageHeader>
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={pagination}
                />
            </div>
        </div>
    )
}

export default React.memo(SalerHome)
