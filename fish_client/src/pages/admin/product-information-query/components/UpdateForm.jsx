import React, { useState, useEffect } from 'react';
import { Form, Button, Input, Modal, Select }
  from 'antd';
import Uploader from '@/components/Uploader';

const FormItem = Form.Item;
const { Option } = Select;
const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const UpdateForm = (props) => {
  const [form] = Form.useForm();
  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
  } = props;


  useEffect(() => {
    form.setFieldsValue({
      name: props.values.name,
      image_url: props.values.image_url,
      inventory_num: props.values.inventory_num,
      unit_price: props.values.unit_price,
      total_price: props.values.total_price,
      cost_price: props.values.cost_price,
      total_make_price: props.values.total_make_price,
      status: String(props.values.status),
      id: props.values.id,
    })
  }, [props])


  const handleSubmit = async () => {
    const fieldsValue = await form.validateFields();
    handleUpdate({ ...fieldsValue, id: props.values.id });
  }


  const renderContent = () => {
    return (
      <>
        <FormItem name="name" label="产品型号">
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          name="image_url"
          label="图片"
        >
          <Uploader
            type="icon"
            productId={props.values.id}
            name={props.values.name}
          />
        </FormItem>
        <FormItem
          name="inventory_num"
          label="库存量"

        >
          <Input placeholder="请输入" onChange={(event) => {
            let inventory_num = Number(event.target.value)
            let unit_price = Number(form.getFieldValue('unit_price'))
            let cost_price = Number(form.getFieldValue('cost_price'))
            form.setFieldsValue({
              ...form.getFieldsValue('inventory_num'),
              ...{ total_price: inventory_num * unit_price },
              ...{ total_make_price: inventory_num * cost_price },
            })
          }} />
        </FormItem>
        <FormItem
          name="unit_price"
          label="单价"
        >
          <Input placeholder="请输入" onChange={(event) => {
            let unit_price = Number(event.target.value)
            let inventory_num = Number(form.getFieldValue('inventory_num'))
            form.setFieldsValue({
              ...form.getFieldsValue('inventory_num'),
              ...{ total_price: inventory_num * unit_price },
            })
          }} />
        </FormItem>
        <FormItem name="total_price" label="金额">
          <Input placeholder="请输入" disabled />
        </FormItem>
        <FormItem name="cost_price" label="制作单价">
          <Input placeholder="请输入" onChange={(event) => {
            let cost_price = Number(event.target.value)
            let inventory_num = Number(form.getFieldValue('inventory_num'))
            form.setFieldsValue({
              ...form.getFieldsValue('inventory_num'),
              ...{ total_make_price: inventory_num * cost_price },
            })
          }} />
        </FormItem>
        <FormItem name="total_make_price" label="制作金额">
          <Input placeholder="请输入" disabled />
        </FormItem>
        <FormItem name="status" label="状态" valueType='select'>
          <Select
            style={{
              width: '100%',
            }}
          >
            <Option value="0">禁用</Option>
            <Option value="1">启用</Option>
          </Select>
        </FormItem>
      </>
    )
  }

  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => handleUpdateModalVisible(false, values)}>取消</Button>
        <Button type="primary" onClick={() => handleSubmit()}>
          完成
        </Button>
      </>
    );
  };

  return (
    <Modal
      width={640}
      bodyStyle={{
        padding: '32px 40px 48px',
      }}
      destroyOnClose
      title="表单配置"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
    >
      <Form
        {...formLayout}
        form={form}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default React.memo(UpdateForm);
