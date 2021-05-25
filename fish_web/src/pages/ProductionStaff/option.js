export const setLineOption = (dateList, dataList) => {
    return {
        // backgroundColor: "#344b58",
        // 提示框组件
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                lineStyle: {
                    color: '#333'
                }
            }
        },
        // 网格线定义图表布局的(就是那个图形不包括标题等插件之类的东东)
        // grid: {
        //     bottom: 50,
        //     top: 10,
        //     left: 20,
        //     right: 20,
        // },
        legend: {
            top: '10',
            textStyle: {
                color: '#7786a2',
                fontSize: 13,
            },
            data: ['生产量']
        },
        // 使用拖拽手柄
        calculable: true,
        /* 'value' 数值轴 适用于连续数据。
        *  'category' 类目轴 适用于离散的类目数据
        *  'time' 时间轴
        *  'log' 对数轴*/
        xAxis: [{
            type: 'category',
            boundaryGap: true,
            axisLine: {
                lineStyle: {
                    color: '#a5b4cb'
                }
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 13,
                    color: '#7786a2'
                }
            },
            axisTick: {
                show: false //隐藏X轴刻度
            },
            data: dateList,
        }],
        yAxis: [{
            type: "value",
            name: '份',
            splitNumber: 5,
            axisLine: {
                lineStyle: {
                    color: '#a5b4cb'
                }
            },
            splitLine: {
                show: true
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                margin: 10,
                textStyle: {
                    fontSize: 13,
                    color: '#7b889f'
                }
            },
        },
        ],
        // 用于区域缩放(插件) slider 滑动条 inside鼠标(看不见隐藏)
        "dataZoom": [{
            type: 'slider',
            show: true,
            height: 15,
            xAxisIndex: [0], // 表示这个 dataZoom 组件控制 第一个 xAxis
            bottom: 15,
            start: 80,
            end: 100,
            handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
            handleSize: '110%',
            handleStyle: {
                color: "#d3dee5",
            },
            textStyle: {
                color: "#7786a2"
            },
            borderColor: "#90979c"
        }],
        "series": [
            {
                name: "生产量",
                type: "line",
                yAxisIndex: 0,
                symbol: 'emptyCircle',
                symbolSize: 10,
                showAllSymbol: true,
                itemStyle: {
                    color: '#FFAB19',
                    borderWidth: 2
                },
                lineStyle: {
                    color: '#FFAB19',
                },
                markLine: {
                    label: {
                        normal: {
                            position: 'end',
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: 'red',
                        }
                    },
                    data: [
                        {
                            name: '平均线',
                            type: 'average',
                            lineStyle: {
                                color: 'red',
                            },
                        },
                    ]
                },
                "data": dataList,
            },
        ]
    }
}

export const setPieOption = (dataList) => {
    return {
        tooltip: {
            trigger: 'item'
        },
        series: [
            {
                name: '产品产量',
                type: 'pie',
                radius: '70%',
                data: dataList,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }
}
