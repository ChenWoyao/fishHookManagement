import { message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import UpdateForm from './components/UpdateForm';
import { queryRule, updateRule } from './service';

const handleUpdate = async (fields) => {
  const hide = message.loading('正在配置');
  try {
    await updateRule({
      nickname: fields.nickname,
      id: fields.id,
      permission: fields.permission,
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


const permissionMap = {
  'user': '普通用户',
  'operator': '生产人员',
  'inspector': '质检员',
  'admin': '管理员',
  'superadmin': '超级管理员',
}

const UserManagement = () => {
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const actionRef = useRef();
  const [rowData, setRowData] = useState({});

  const columns = [
    {
      title: '用户名',
      dataIndex: 'nickname',
      renderText: (val) => val,
      copyable: true,
      hideInForm: true
    },
    {
      title: '权限',
      dataIndex: 'permission',
      hideInForm: true,
      hideInSearch: true,
      renderText: (val) => permissionMap[val],
    },
    {
      title: '电话',
      dataIndex: 'phone',
      hideInForm: true,
      copyable: true,
      renderText: (val) => val,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        record.permission !== 'superadmin' && <a key="config" onClick={() => {
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



export default React.memo(UserManagement);
