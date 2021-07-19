import { Image } from 'antd';
import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { queryRule } from './service';

const ProductionInformationQuery = () => {
  const actionRef = useRef();

  const columns = [
    {
      title: '产品型号',
      dataIndex: 'name',
      copyable: true,
      renderText: (val) => val
    },
    {
      title: '图片',
      dataIndex: 'image_url',
      hideInSearch: true,
      render: (_, record) => {
        return <Image width={40} src={record.image_url} />
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
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
    </PageContainer>
  );
};

export default React.memo(ProductionInformationQuery);
