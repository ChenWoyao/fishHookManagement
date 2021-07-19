import { Form, Button, Input, Select, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { Link, connect, history } from 'umi';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const Register = ({ submitting, dispatch, userAndregister }) => {
  const [prefix, setprefix] = useState('86');
  const confirmDirty = false;
  const [form] = Form.useForm();

  // 监听submit触发action以后state的变化，做出响应行为
  useEffect(() => {
    if (!userAndregister) {
      return;
    }

    const account = form.getFieldValue('username');

    if (userAndregister.status === 'ok') {
      message.success('注册成功！');
      history.push({
        pathname: '/user/register-result',
        state: {
          account,
        },
      });
    }
    if (userAndregister.status === 'error') {
      message.error(userAndregister.msg || '注册失败! ');
    }

  }, [userAndregister]);

  // 提交订单的处理
  const onFinish = (values) => {
    let phone = values.phone;
    phone = `+${prefix}${phone}`
    dispatch({
      type: 'userAndregister/submit',
      payload: { ...values, phone },
    });
  };

  // 校验第二次密码输入
  const checkConfirm = (_, value) => {
    const promise = Promise;

    if (value && value !== form.getFieldValue('password')) {
      return promise.reject('两次输入的密码不匹配!');
    }

    return promise.resolve();
  };

  // 检查密码输入
  const checkPassword = (_, value) => {
    const promise = Promise; // 没有值的情况
    if (!value) {
      return promise.reject('请输入密码！');
    } // 有值的情况

    if (value.length < 8) {
      return promise.reject('密码长度不能小于8个字符');
    }

    if (value && confirmDirty) {
      form.validateFields(['confirm']);
    }

    return promise.resolve();
  };

  // 设置手机前缀
  const changePrefix = (value) => {
    setprefix(value);
  };

  return (
    <div className={styles.main}>
      <h3>注册</h3>
      <Form form={form} name="UserRegister" onFinish={onFinish}>
        <FormItem
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input size="large" type="text" placeholder="请输入您的真实姓名" />
        </FormItem>
        <FormItem
          name="password"
          className={
            form.getFieldValue('password') &&
            form.getFieldValue('password').length > 0 &&
            styles.password
          }
          rules={[
            {
              validator: checkPassword,
            },
          ]}
        >
          <Input size="large" type="password" placeholder="至少8位密码，区分大小写" />
        </FormItem>
        <FormItem
          name="confirm"
          rules={[
            {
              required: true,
              message: '请确认密码！',
            },
            {
              validator: checkConfirm,
            },
          ]}
        >
          <Input size="large" type="password" placeholder="确认密码" />
        </FormItem>
        <InputGroup compact>
          <Select
            size="large"
            value={prefix}
            onChange={changePrefix}
            style={{
              width: '20%',
            }}
          >
            <Option value="86">+86</Option>
            <Option value="87">+87</Option>
          </Select>
          <FormItem
            style={{
              width: '80%',
            }}
            name="phone"
            rules={[
              {
                required: true,
                message: '请输入手机号！',
              },
              {
                pattern: /^\d{11}$/,
                message: '手机号格式错误！',
              },
            ]}
          >
            <Input size="large" placeholder="手机号" />
          </FormItem>
        </InputGroup>
        <FormItem>
          <Button
            size="large"
            loading={submitting}
            className={styles.submit}
            type="primary"
            htmlType="submit"
          >
            注册
          </Button>
          <Link className={styles.login} to="/user/login">
            使用已有账户登录
          </Link>
        </FormItem>
      </Form>
    </div>
  );
};

// dva会自带一个loading参数,通过loading.effects参数，来监控一个action的触发
export default connect(({ userAndregister, loading }) => ({
  userAndregister,
  submitting: loading.effects['userAndregister/submit'],
}))(Register);
