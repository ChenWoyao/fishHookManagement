import { PlusOutlined } from '@ant-design/icons';
import { Select, Image, DatePicker, Button, Input, message } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import { queryRule, getProductions, addRule } from './service';

const { RangePicker } = DatePicker;
const Option = Select.Option

const handleAdd = async (fields) => {
  const hide = message.loading('正在添加');

  try {
    await addRule({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

const ProductionOrderStatusQuery = () => {
  const actionRef = useRef();
  const [createModalVisible, handleModalVisible] = useState(false);
  const [selectedRowsState, setSelectedRows] = useState([]);
  const [canSelectProductions, setCanSelectProductions] = useState([])

  useEffect(() => {
    getProductions({ status: "1" }).then(response => {
      setCanSelectProductions(response)
    })
  }, [])

  const columns = [
    {
      title: '产品型号',
      dataIndex: 'name',
      hideInSearch: true,
      copyable: true,
      renderText: (val) => val,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项"
          }
        ]
      },
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return (
          <Select
            onChange={(val) => {
              const production = canSelectProductions.find(production => production.name == val)
              const fields = form.getFieldsValue('name')
              form.setFieldsValue({
                'price': production['cost_price'],
                'name': val,
                'amount': 0,
                'total_price': 0,
              })
            }}
          >
            {
              canSelectProductions.map((production, index) => <Option value={production.name} key={index}>{production.name}</Option>)
            }
          </Select>
        )
      }
    },
    {
      title: '图片',
      dataIndex: 'image_url',
      hideInSearch: true,
      hideInForm: true,
      render: (_, record) => {
        return <Image width={40} src={record.image_url} />
      },
    },
    {
      title: '制作量',
      dataIndex: 'amount',
      sorter: true,
      hideInSearch: true,
      renderText: (val) => val,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项"
          }
        ]
      },
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return <Input onChange={(event) => {
          const make_num = Number(event.target.value);
          const make_price = Number(form.getFieldValue('price'))
          const fields = form.getFieldsValue('name')
          form.setFieldsValue({
            ...fields,
            'amount': make_num,
            'total_price': make_price * make_num,
          })
        }} />
      }
    },
    {
      title: '制作单价',
      sorter: true,
      hideInSearch: true,
      dataIndex: 'price',
      renderText: (val) => val,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return <Input disabled />
      }
    },
    {
      title: '制作金额',
      hideInSearch: true,
      dataIndex: 'total_price',
      renderText: (val) => val,
      renderFormItem: (item, { defaultRender, ...rest }, form) => {
        return <Input disabled />
      }
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      hideInForm: true,
      hideInSearch: true,
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
          text: '被拒绝',
          status: 'Warning',
        }
      },
    },
    {
      title: '订单创建时间',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '选择时间范围',
      dataIndex: 'create_time_range',
      key: 'create_time_range',
      hideInTable: true,
      hideInForm: true,
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
          const { create_time_range, ...others } = params
          if (create_time_range) {
            const [start, end] = create_time_range
            return {
              ...others,
              "create_time_range": `${start.split(' ').join('T')},${end.split(' ').join('T')}`,
            }
          }
          return params
        }}
        toolBarRender={() => [
          <Button
            style={{ minWidth: 200 }}
            type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> 交货
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
              const { product, ...other } = item;
              return {
                ...other,
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
                总生产数量: {selectedRowsState.reduce((pre, item) => pre + Number(item.amount), 0)}&nbsp;&nbsp;
              </span>
              <span>
                总生产产值: {selectedRowsState.reduce((pre, item) => pre + Number(item.total_price), 0)}&nbsp;&nbsp;
              </span>
            </div>
          }
        >
        </FooterToolbar>
      )}
      <CreateForm onCancel={() => handleModalVisible(false)} modalVisible={createModalVisible}>
        <ProTable
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="key"
          type="form"
          columns={columns}
        />
      </CreateForm>
    </PageContainer>
  );
};

export default React.memo(ProductionOrderStatusQuery);
