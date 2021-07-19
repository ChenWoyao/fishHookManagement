import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Image, InputNumber, DatePicker } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { queryRule, updateRule, removeRule, queryProductQuantity } from './service';

const { RangePicker } = DatePicker;

const handleUpdate = async (fields) => {
  const hide = message.loading('正在配置');

  try {
    await updateRule({
      ...fields
    });
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

const handleRemove = async (fields) => {
  const hide = message.loading('正在删除');
  try {
    await removeRule({
      ...fields
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const SalesOrderStatusQuery = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const actionRef = useRef();
  const [rowData, setRowData] = useState({});
  const [selectedRowsState, setSelectedRows] = useState([]);

  const columns = [
    {
      title: '客户名称',
      dataIndex: 'client_name',
      copyable: true,
      renderText: (val) => val,
      hideInForm: true
    },
    {
      title: '总销售额',
      dataIndex: 'total_price',
      hideInSearch: true,
      renderText: (val) => val
    },
    {
      title: '总销量',
      hideInSearch: true,
      dataIndex: 'amount',
      renderText: (val) => val
    },
    {
      title: '订单创建时间',
      valueType: 'dateTime',
      dataIndex: 'update_time',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '未确认',
          status: 'Processing',
        },
        1: {
          text: '已确认',
          status: 'Success',
        },
      },
    },
    {
      title: '选择时间范围',
      dataIndex: 'update_time_range',
      key: 'update_time_range',
      hideInTable: true,
      hideInForm: true,
      renderFormItem: (item, { type, defaultRender, ...rest }, form) => {
        const dateFormat = 'YYYY/MM/DD HH:mm';
        return <RangePicker
          format={dateFormat}
          showTime
        />
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        record.status == '0' && <a key="config" onClick={() => {
          handleUpdateModalVisible(true);
          setRowData(record)
        }}>
          编辑
        </a>,
        record.status == '0' && <a key="delete" onClick={async () => {
          await handleRemove({ "id": record.id, "status": 2 })
          actionRef.current?.reload();
        }}>
          删除
        </a>
      ]
    }
  ]

  return (
    <PageContainer>
      <ProTable
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
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
        options={{ fullScreen: true }}
        pagination={{
          pageSizeOptions: [50, 100, 200, 500, 1000],
          defaultPageSize: 50,
        }}
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={(params, sorter, filter) => {
          return queryRule({
            page: params.current,
            page_size: params.pageSize,
            ordering: "-id",
            ...params
          }).then(response => {
            const data = response.results.map(item => {
              const { client, products_detail, ...other } = item;
              return {
                ...other,
                products_detail,
                client,
                'client_name': client?.company,
                'total_price': products_detail.reduce((acc, item) => {
                  return acc + Number(item.num) * Number(item.unit_price)
                }, 0),
                'amount': products_detail.reduce((acc, item) => {
                  return acc + Number(item.num)
                }, 0),
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
                总销售量: {selectedRowsState.reduce((pre, item) => pre + Number(item.amount), 0)}&nbsp;&nbsp;
              </span>
              <span>
                总销售额: {selectedRowsState.reduce((pre, item) => pre + Number(item.total_price), 0)}&nbsp;&nbsp;
              </span>
            </div>
          }
        >
        </FooterToolbar>
      )}
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        onReset={() => actionRef.current.reload()}
        modalVisible={createModalVisible}
      >
      </CreateForm>

      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);

          if (success) {
            handleUpdateModalVisible(false);
            setRowData({});

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setRowData({});
        }}
        updateModalVisible={updateModalVisible}
        values={rowData}
      />

    </PageContainer>
  );
};



export default React.memo(SalesOrderStatusQuery);
