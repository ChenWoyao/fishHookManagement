import React, { useEffect } from 'react';
import { Form, Button, Input, Modal, Select } from 'antd';


const FormItem = Form.Item;
const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const Option = Select.Option;

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
      nickname: props.values.nickname,
      name: props.values.name,
      amount: props.values.amount,
      price: props.values.price,
      total_price: props.values.total_price,
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
        <FormItem name="nickname" label="用户名">
          <Input disabled />
        </FormItem>
        <FormItem name="name" label="产品型号">
          <Input disabled />
        </FormItem>
        <FormItem
          name="amount"
          label="合格数"
          rules={[
            { required: true, message: '请填写' }
          ]}
        >
          <Input placeholder="请输入" onChange={(event) => {
            let sale_num = Number(event.target.value)
            let sale_price = Number(form.getFieldValue('price'))
            form.setFieldsValue({
              ...form.getFieldsValue('make_num'),
              total_price: sale_num * sale_price,
            })
          }} />
        </FormItem>
        <FormItem
          name="price"
          label="制作单价"
        >
          <Input disabled />
        </FormItem>
        <FormItem name="status" label="订单状态">
          <Select>
            <Option value="0">未质检</Option>
            <Option value="1">质检通过</Option>
            <Option value="2">拒绝</Option>
          </Select>
        </FormItem>
        <FormItem name="total_price" label="制作金额">
          <Input placeholder="请输入" disabled />
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
