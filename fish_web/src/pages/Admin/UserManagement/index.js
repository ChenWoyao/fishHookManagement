import React, { useState } from 'react'
import styles from './index.module.scss'
import './index.scss'
import { Table, PageHeader, Button, Select } from 'antd'
import { data } from './data'

const columns = [
    {
        title: '名字',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '身份',
        dataIndex: 'identity',
        key: 'identity',
    },
    {
        title: '电话',
        dataIndex: 'tel',
        key: 'tel',
    },
    {
        title: '行为',
        dataIndex: '',
        key: 'action',
        render: (text, record) => {
            return (
                <div>
                    <a>编辑</a>
                </div>
            )
        }
    },
]

const useSelectChange = () => {

}

const { Option } = Select


const AdminUserManagement = () => {
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 100,
    })

    function onShowSizeChange(current, pageSize) {
        console.log(current, pageSize);
    }

    return (
        <div className={styles['content-container']}>
            <div className={styles['content-box']}>
                <PageHeader
                    className={styles['search']}
                    extra={[
                        <Button key="search" type="primary">search</Button>,
                        <Button key="add">add</Button>,
                    ]}
                    title={
                        <>
                            <span className={styles['searchLabel']}>名字:</span>
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

export default React.memo(AdminUserManagement)
