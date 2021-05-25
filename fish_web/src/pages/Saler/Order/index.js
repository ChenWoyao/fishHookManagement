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
        title: '出库量',
        dataIndex: 'outboundQuantity',
        key: 'outboundQuantity',
        sorter: {
            compare: (a, b) => a.outboundQuantity - b.outboundQuantity,
            multiple: 2,
        },
    },
    {
        title: '提交时间',
        dataIndex: 'timedate',
        key: 'timedate',
        sorter: {
            compare: (a, b) => a.timedate - b.timedate,
            multiple: 1,
        },
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
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
