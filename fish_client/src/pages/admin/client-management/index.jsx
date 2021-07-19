import { message, Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import { queryRule, createOrUpdateRule } from './service';

const handleAdd = async (fields) => {
  const hide = message.loading('正在添加');

  try {
    await createOrUpdateRule({ ...fields, phone: `+86${fields.phone}` });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

const UserManagement = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [dataSource, setDataSource] = useState([])
  const [editableKeys, setEditableRowKeys] = useState([])
  const actionRef = useRef();
  const [form] = Form.useForm();

  const columns = [
    {
      title: '联系人',
      dataIndex: 'contact_user',
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项"
          }
        ]
      },
      copyable: true,
      renderText: (val) => val,
    },
    {
      title: '客户名称',
      dataIndex: 'company',
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项"
          }
        ]
      },
      hideInSearch: true,
      renderText: (val) => val,
    },
    {
      title: '电话',
      dataIndex: 'phone',
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项"
          }
        ]
      },
      hideInSearch: true,
      renderText: (val) => val,
    },
    {
      title: '地址',
      dataIndex: 'address',
      formItemProps: {
        rules: [
          {
            required: true,
            message: "此项为必填项"
          }
        ]
      },
      hideInSearch: true,
      renderText: (val) => val
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
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
        options={{ fullScreen: true }}
        editable={{
          form,
          editableKeys,
          onSave: (key, row, originRow, newLine) => {
            createOrUpdateRule(row).then(_ => {
              message.success('保存成功')
              actionRef.current.reload();
            })
              .catch(err => message.error('保存失败'))
          },
          onChange: setEditableRowKeys,
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
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
    </PageContainer>
  );
};



export default React.memo(UserManagement);
