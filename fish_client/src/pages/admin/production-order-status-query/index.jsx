import { Button, Image, DatePicker } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { queryRule } from './service';

const { RangePicker } = DatePicker;

const ProductionOrderStatusQuery = () => {
  const actionRef = useRef();

  const [selectedRowsState, setSelectedRows] = useState([]);

  const columns = [
    {
      title: '生产员名字',
      dataIndex: 'nickname',
      copyable: true,
      renderText: (val) => val
    },
    {
      title: '生产员手机号',
      dataIndex: 'phone',
      copyable: true,
      renderText: (val) => val
    },
    {
      title: '产品型号',
      dataIndex: 'name',
      hideInSearch: true,

      renderText: (val) => val
    },
    {
      title: '图片',
      dataIndex: 'image_url',
      hideInSearch: true,
      render: (_, record) => {
        return <Image width={40} src={record["image_url"]} />
      },
    },
    {
      title: '制作量',
      dataIndex: 'amount',
      sorter: true,
      hideInSearch: true,
      renderText: (val) => val
    },
    {
      title: '制作单价',
      sorter: true,
      hideInSearch: true,
      dataIndex: 'price',
      renderText: (val) => val
    },
    {
      title: '制作金额',
      hideInSearch: true,
      dataIndex: 'total_price',
      renderText: (val) => val

    },
    {
      title: '质检通过时间',
      dataIndex: 'update_time',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '选择时间范围',
      dataIndex: 'update_time_range',
      key: 'update_time_range',
      hideInTable: true,
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        const dateFormat = 'YYYY/MM/DD HH:mm';
        return <RangePicker
          format={dateFormat}
          showTime
        />
      }
    }
  ]

  return (
    <PageContainer>
      <ProTable
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        options={{ fullScreen: true }}
        search={{
          labelWidth: 120,
          defaultCollapsed: false,
          span: {
            xs: 24,
            sm: 24,
            md: 12,
            lg: 12,
            xl: 12,
            xxl: 6,
          },
        }}
        beforeSearchSubmit={(params) => {
          const { update_time_range, ...others } = params
          if (update_time_range) {
            const [start, end] = update_time_range
            return {
              ...others,
              update_time_range: `${start.split(' ').join('T')},${end.split(' ').join('T')}`,
            }
          }
          return params
        }}
        request={(params, sorter, filter) => {
          return queryRule({
            page: params.current,
            page_size: params.pageSize,
            ordering: "-id",
            ...params
          }).then(response => {
            const data = response.results.map(item => {
              const { producer, product, ...other } = item;
              return {
                ...other,
                'nickname': producer.nickname,
                'phone': producer.phone,
                'image_url': product?.image_url,
              }
            })

            return {
              data: data,
              total: response.count,
              success: true,
            }
          })
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项&nbsp;&nbsp;
              <span>
                总生产数量: {selectedRowsState.reduce((pre, item) => pre + Number(item.price), 0)}&nbsp;&nbsp;
              </span>
              <span>
                总生产产值: {selectedRowsState.reduce((pre, item) => pre + Number(item.total_price), 0)}&nbsp;&nbsp;
              </span>
            </div>
          }
        >
        </FooterToolbar>
      )}
    </PageContainer>
  );
};

export default React.memo(ProductionOrderStatusQuery);
