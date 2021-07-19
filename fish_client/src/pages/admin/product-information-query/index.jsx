import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Image } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { queryRule, createOrUpdateRule } from './service';
import Uploader from '@/components/Uploader';

const handleAdd = async (fields) => {
  const hide = message.loading('正在添加');

  try {
    await createOrUpdateRule({ ...fields, type: fields.name });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
/**
 * 更新节点
 *
 * @param fields
 */

const handleUpdate = async (fields) => {
  const hide = message.loading('正在配置');

  try {
    await createOrUpdateRule({
      name: fields.name,
      type: fields.name,
      image_url: fields.image_url,
      inventory_num: fields.inventory_num,
      unit_price: fields.unit_price,
      total_price: fields.total_price,
      cost_price: fields.cost_price,
      total_make_price: fields.total_make_price,
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

const ProductionInformationQuery = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const actionRef = useRef();
  const [rowData, setRowData] = useState({});
  const log = console.log.bind(console);

  useEffect(() => {
    queryRule().then(response => {
      console.log('查询所有产品:', response)
    })
  }, [])

  const columns = [
    {
      title: '产品型号',
      dataIndex: 'name',
      copyable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项"
          }
        ]
      },
      renderText: (val) => val,
    },
    {
      title: '图片',
      dataIndex: 'image_url',
      hideInSearch: true,
      hideInForm: true, // 图片在编辑的时候在处理
      render: (_, record) => {
        return <Image width={40} src={record.image_url} />
      }
    },
    {
      title: '库存量',
      dataIndex: 'inventory_num',
      hideInSearch: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项"
          }
        ]
      },
      renderText: (val) => val
    },
    {
      title: '单价',
      // sorter: true,
      hideInSearch: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项"
          }
        ]
      },
      dataIndex: 'unit_price',
      renderText: (val) => val
    },
    {
      title: '金额',
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项"
          }
        ]
      },
      hideInSearch: true,
      dataIndex: 'total_price',
      renderText: (_, record) => Number(record.inventory_num) * Number(record.unit_price)
    },
    {
      title: '制作单价',
      // sorter: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项"
          }
        ]
      },
      hideInSearch: true,
      dataIndex: 'cost_price',
      renderText: (val) => val
    },
    {
      title: '制作金额',
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项"
          }
        ]
      },
      hideInSearch: true,
      dataIndex: 'total_make_price',
      renderText: (_, record) => Number(record.inventory_num) * Number(record.cost_price)
    },
    {
      title: '状态',
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项"
          }
        ]
      },
      dataIndex: 'status',
      hideInSearch: true,
      // 值的枚举，会自动转化把值当成 key 来取出要显示的内容
      valueEnum: {
        0: {
          text: '禁用',
          status: 'Default'
        },
        1: {
          text: '启用',
          status: 'Success',
        }
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a key="config" onClick={() => {
          handleUpdateModalVisible(true);
          setRowData(record)
        }}>
          编辑
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
        }}
        options={{ fullScreen: true }}
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
            return {
              data: response.results,
              total: response.count,
              success: true,
            }
          })
        }}
        columns={columns}
      />

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
          rowKey="id"
          type="form"
          columns={columns}
        />
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

export default React.memo(ProductionInformationQuery);
