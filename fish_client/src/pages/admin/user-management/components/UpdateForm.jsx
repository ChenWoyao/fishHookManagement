import React, { useEffect } from 'react';
import { Form, Button, Input, Modal, Select } from 'antd';
import { connect } from 'umi';

const FormItem = Form.Item;
const Option = Select.Option;

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
    if (props.values) {
      form.setFieldsValue({
        nickname: props.values.nickname,
        permission: props.values.permission,
      })
    }
  }, [props])


  const handleSubmit = async () => {
    const fieldsValue = await form.validateFields();
    handleUpdate({
      ...fieldsValue,
      id: props.values?.id,
    });
  }

  const renderContent = () => {
    return (
      <>
        <FormItem name="nickname" label="用户名">
          <Input disabled />
        </FormItem>
        <FormItem name="permission" label="权限">
          <Select
            style={{
              width: '100%',
            }}
          >
            <Option value='user'>普通用户</Option>
            <Option value='operator'>生产人员</Option>
            <Option value='inspector'>质检员</Option>
            {
              props.currentUser.permission === 'superadmin' && <Option value='admin'>管理员</Option>
            }
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

export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(UpdateForm);
