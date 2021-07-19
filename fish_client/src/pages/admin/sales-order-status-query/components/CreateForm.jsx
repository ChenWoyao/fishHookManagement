import React, { useState, useEffect } from 'react';
import { Form, Button, Input, Modal, Select, message } from 'antd';
import { getProductions, getClients, addRule } from '../service';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const Option = Select.Option
const FormItem = Form.Item;

const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const CreateForm = (props) => {
  const [form] = Form.useForm();
  const [clients, setClients] = useState([])
  const [productions, setProductions] = useState([])
  const [clientValue, setClientValue] = useState({})

  const {
    onCancel,
    modalVisible,
    onReset
  } = props;


  useEffect(() => {
    getProductions().then(response => {
      setProductions(response)
    }).catch(err => { console.log('查询产品信息失败', err) })
  }, [props])


  const handleSubmit = async () => {
    const fieldsValue = await form.validateFields();
    if (fieldsValue) {
      const { products, ...others } = fieldsValue
      let copyProducts
      if (products) {
        copyProducts = products.map(pro => {
          const id = productions.filter(item => item.name === pro.name)[0]?.id
          return {
            ...pro,
            id,
          }
        })
      }
      const data = {
        ...others,
        products: products ? copyProducts : []
      }
      try {
        await addRule({
          ...data,
          client_id: clientValue.id,
        });
        message.success('添加成功');
        form.resetFields()
        onCancel()
        onReset()
      } catch (error) {
        message.error('添加失败请重试！');
      }
    }
  }


  const renderContent = () => {
    return (
      <>
        <FormItem name="company" label="客户名称" rules={[{ required: true, message: '必填' }]}>
          <Select
            showSearch
            placeholder="请选择一个客户"
            onFocus={() => {
              // 这里调用查询所有options的接口
              getClients().then(response => {
                setClients(response)
              })
            }}
            onChange={(value) => {
              // 这里value之发生变化,改变值
              getClients({ company: value }).then(response => {
                const client = response[0]
                setClientValue(client)
                const { contact_user, phone, address } = client
                const fields = form.getFieldsValue(true)
                form.setFieldsValue({ ...fields, contact_user, phone, address })
              })
            }}
          >
            {
              clients.map(client => {
                return <Option key={client.id} value={client.company}>{client.company}</Option>
              })
            }
          </Select>
        </FormItem>
        <FormItem name="contact_user" label="联系人" rules={[{ required: true, message: '必填' }]}>
          <Input disabled />
        </FormItem>
        <FormItem name="phone" label="联系电话" rules={[{ required: true, message: '必填' }]}>
          <Input disabled />
        </FormItem>
        <FormItem name="address" label="联系地址" rules={[{ required: true, message: '必填' }]}>
          <Input disabled />
        </FormItem>
        <Form.List
          name="products"
          classname="formList"
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <div key={key} style={{ border: '1px dashed black', margin: '8px 0', padding: '20px 0' }} align="baseline">
                  <Form.Item
                    {...restField}
                    {...formLayout}
                    label="产品名称"
                    name={[name, 'name']}
                    fieldKey={[fieldKey, 'name']}
                    rules={[{ required: true, message: '请选择' }]}
                  >
                    <Select
                      showSearch
                      placeholder="请选择一个产品"
                    >
                      {
                        productions.map(production => {
                          return (
                            <Option key={production.id} value={production.name}>
                              {production.name}
                            </Option>
                          )
                        })
                      }
                    </Select>
                  </Form.Item>


                  <Form.Item
                    {...restField}
                    {...formLayout}
                    label="销量"
                    name={[name, 'num']}
                    fieldKey={[fieldKey, 'num']}
                    rules={[{ required: true, message: '请输入' }]}
                  >
                    <Input placeholder="请输入销量" />
                  </Form.Item>
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Button type="primary" onClick={() => remove(name)} style={{ width: '80%' }}>
                      <MinusCircleOutlined /> 删除
                    </Button>
                  </div>
                </div>
              ))}
              <Form.Item wrapperCol={{ "span": 20 }}>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加产品
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </>
    )
  }

  const renderFooter = () => {
    return (
      <>
        <Button onClick={() => {
          form.resetFields()
          onCancel()
        }}>取消</Button>
        <Button type="primary" onClick={handleSubmit}>
          提交
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
      visible={modalVisible}
      footer={renderFooter()}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
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

export default React.memo(CreateForm);
