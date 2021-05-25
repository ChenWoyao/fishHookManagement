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
        title: '入库量',
        dataIndex: 'inboundQuantity',
        key: 'inboundQuantity',
        sorter: {
            compare: (a, b) => a.outboundQuantity - b.outboundQuantity,
            multiple: 1,
        },
    },
    {
        title: '生产人员名字',
        dataIndex: 'staffName',
        key: 'staffName',
    },
    {
        title: '提交时间',
        dataIndex: 'timedate',
        key: 'timedate',
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: '行为',
        dataIndex: '',
        key: 'action',
        render: (text, record) => {
            return record.status === '未批准' ?
                (
                    <div>
                        <a>同意</a>
                        <a>拒绝</a>
                    </div>
                )
                :
                (<></>)
        }
    }
]

const useSelectChange = () => {

}

const { Option } = Select

const QualityInspectorProduction = () => {
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
                            <span className={styles['searchLabel']}>产品型号:</span>
                            <Select default="" className={styles['searchSelect']} onChange={useSelectChange}>
                                <Option value="jack">Jack</Option>
                                <Option value="lucy">Lucy</Option>
                            </Select>
                            <span className={styles['searchLabel']}>生产人员名字:</span>
                            <Select default="" className={styles['searchSelect']} onChange={useSelectChange}>
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

export default React.memo(QualityInspectorProduction)
