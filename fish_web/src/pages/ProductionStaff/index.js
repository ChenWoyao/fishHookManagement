import React, { useRef, useEffect, useState } from 'react'
import styles from './index.module.scss'
import './index.css'
import { Form, Input, Button, Select, Row, Col } from 'antd'
import { setLineOption, setPieOption } from './option'
import { parseDate, getCurrentMonthDays, createRandomNums, debounce } from '../../utils/help'
import StatusTable from './statusTable'
import ProductionTable from './productionTable'
import * as echarts from 'echarts'

const log = console.log.bind(console)

const createDateList = () => {
    const days = getCurrentMonthDays()
    const date = new Date()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return Array.from(new Array(days), (day, index) => {
        let value = index + 1
        return `${year}-${month.toString().padStart(2, '0')}-${value.toString().padStart(2, '0')}`
    })
}

const createPieData = () => {
    return [
        {
            name: '苍蝇钩',
            value: 30,
        },
        {
            name: '蚯蚓钩',
            value: 40,
        },
        {
            name: '蚊子钩',
            value: 310,
        },
        {
            name: '蜈蚣钩',
            value: 80,
        },
        {
            name: '虫子钩',
            value: 60,
        },
    ]
}


const ProductionStaffHome = () => {
    const lineRef = useRef()
    const pieRef = useRef()
    const [form] = Form.useForm()
    const { Option } = Select
    const dateList = createDateList()
    const dataList = createRandomNums(getCurrentMonthDays(), 0, 150)
    const pieDataList = createPieData()

    useEffect(() => {
        const lineChart = echarts.init(lineRef.current, null, {
            height: 400,
        })
        const pieChart = echarts.init(pieRef.current, null, {
            height: 300,
        })
        DrawLine(lineChart, dateList, dataList)
        DrawPie(pieChart, pieDataList)

        const withResizeChart = debounce(() => {
            lineChart?.resize({
                width: 'auto',
                height: 'auto',
            })
            pieChart?.resize({
                width: 'auto',
                height: 'auto',
            })
        }, 100, false)

        window.addEventListener('resize', withResizeChart)

        return () => {
            lineChart.dispose()
            pieChart.dispose()
            window.removeEventListener('resize', withResizeChart)
        }
    }, [dateList, dataList])


    const onFinish = (values) => {

    }

    const onReset = () => {
        form.resetFields()
    }

    const DrawLine = (chart, dateList, dataList) => {
        chart.clear()
        chart.setOption(setLineOption(dateList, dataList))
    }

    const DrawPie = (chart, datalist) => {
        chart.clear()
        chart.setOption(setPieOption(datalist))
    }

    const onProductionChange = (value) => {
        switch (value) {
            case 'male':
                // form.setFieldsValue({
                //   note: 'Hi, man!',
                // });
                return;

            case 'female':
                return;

            case 'other':
                return;
        }
    };

    return (
        <div className={styles['container']}>
            <div className={styles['content-container']}>
                <h3 className={styles['chart-label']}>本月的生产数据显示:</h3>
                <div className={styles['linebox']} ref={lineRef}>linebox</div>
                <h3 className={styles['chart-label']} style={{ marginTop: '100px' }}>
                    本月个人生产的产品数据显示:
                </h3>
                <div className={styles['piebox']} ref={pieRef}>piebox</div>
                <h3 className={styles['form-label']} style={{ marginTop: '40px' }}>提交一个产品的生产量:</h3>
                <Form form={form} onFinish={onFinish} className={styles['myForm']}>
                    <Form.Item
                        name="type"
                        label="产品"
                        className={styles['myForm-item']}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select
                            placeholder="选择一个产品"
                            onChange={onProductionChange}
                            className={styles['myForm-item__select']}
                            allowClear
                        >
                            <Option value="male">male</Option>
                            <Option value="female">female</Option>
                            <Option value="other">other</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="count"
                        label="数量"
                        className={styles['myForm-item']}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input className={styles['myForm-item__input']} />
                    </Form.Item>
                    <Form.Item className={styles['myForm-item--last']}>
                        <Button type="primary" htmlType="submit" className={styles['myForm-item__button']}>
                            Submit
                        </Button>
                        <Button htmlType="button" onClick={onReset} className={styles['myForm-item__button']}>
                            Reset
                        </Button>
                    </Form.Item>
                </Form>
                <h3 className={styles['chart-label']}>个人的全部生产数据显示:</h3>
                <div className={styles['production-table']}>
                    <ProductionTable dataSource={[]} />
                </div>
                <h3 className={styles['chart-label']}>个人提交的生产订单日志:</h3>
                <div className={styles['status-table']}>
                    <StatusTable dataSource={[]} />
                </div>
            </div>
        </div>
    )
}

export default React.memo(ProductionStaffHome)
