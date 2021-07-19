import { Select, Image, message } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import UpdateForm from './components/UpdateForm';
import { queryRule, updateRule } from './service';


const Option = Select.Option

const handleUpdate = async (fields) => {
  const hide = message.loading('正在配置');

  try {
    await updateRule({
      nickname: fields.nickname,
      name: fields.name,
      amount: fields.amount,
      price: fields.price,
      total_price: fields.total_price,
      status: fields.status,
      id: fields.id,
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



const ProductionOrderStatusQuery = () => {
  const actionRef = useRef();
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [rowData, setRowData] = useState({});

  const columns = [
    {
      title: '用户名',
      dataIndex: 'nickname',
      hideInSearch: true,
      copyable: true,
      renderText: (val) => val,
    },
    {
      title: '产品型号',
      dataIndex: 'name',
      hideInSearch: true,
      copyable: true,
      renderText: (val) => val,
    },
    {
      title: '图片',
      dataIndex: 'image_url',
      hideInSearch: true,
      render: (_, record) => {
        return <Image width={40} src={record.image_url} />
      },
    },
    {
      title: '合格数',
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
      title: '订单状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '未质检',
          status: 'Processing',
        },
        1: {
          text: '质检通过',
          status: 'Success',
        },
        2: {
          text: '拒绝',
          status: 'Warning',
        }
      },
    },
    {
      title: '订单更新时间',
      dataIndex: 'update_time',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <span>
          {
            record.status == '0'
              ?
              <a onClick={() => {
                handleUpdateModalVisible(true);
                setRowData(record)
              }}>
                编辑
              </a>
              :
              null
          }
        </span>
      )
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
        columns={columns}
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
                'nickname': producer?.nickname,
                'total_price': Number(other.price) * Number(other.amount),
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
      />

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

export default React.memo(ProductionOrderStatusQuery);
