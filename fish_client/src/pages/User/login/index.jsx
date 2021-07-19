import {
  LockOutlined,
  UserOutlined,
  MobileOutlined,
} from '@ant-design/icons';
import { Alert, notification, Input, Select, Row, Col } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { connect, history } from 'umi';
import styles from './index.less';

const InputGroup = Input.Group;
const { Option } = Select;

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const openNotification = (event) => {
  event.preventDefault();
  const args = {
    message: '忘记密码',
    description: '请联系管理员: 小明哥. 管理员的手机号: 18569063403. 协商后得知新密码',
    duration: 0,
  };
  notification.open(args);
};

const jumpToRegister = (event) => {
  event.preventDefault();
  history.push('/user/register')
}

const Login = (props) => {
  const { userLogin = {}, submitting } = props;
  const { status } = userLogin;
  const [prefix, setprefix] = useState('86');

  const handleSubmit = (values) => {
    const { dispatch } = props;

    let phone = values.phone;
    phone = `+${prefix}${phone}`
    let username = `${values.username}-${phone}`
    dispatch({
      type: 'login/login',
      payload: { ...values, phone, username },
    });
  };

  const changePrefix = (value) => {
    setprefix(value);
  };

  return (
    <div className={styles.main}>
      <ProForm
        initialValues={{
          autoLogin: true,
        }}
        submitter={{
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            loading: submitting,
            size: 'large',
            style: {
              width: '100%',
            },
          },
        }}
        onFinish={(values) => {
          console.log('submit')
          handleSubmit(values);
          return Promise.resolve();
        }}
      >
        {status === 'error' && !submitting && (
          <LoginMessage
            content='账户或密码错误'
          />
        )}
        {(
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              placeholder='真实姓名:'
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder='密码:'
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
            <InputGroup compact size="small" style={{ whiteSpace: 'nowrap', display: 'flex' }}>
              <Select
                size="large"
                value={prefix}
                onChange={changePrefix}
                style={{ flex: 1 }}
              >
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
              </Select>

              <ProFormText
                name="phone"
                style={{ flex: 5 }}
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined className={styles.prefixIcon} />,
                }}
                placeholder='手机号:'
                rules={[
                  {
                    required: true,
                    message: '请输入手机号',
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: '不合法的手机号格式!',
                  },
                ]}
              />
            </InputGroup>

          </>
        )}

        <div
          style={{
            marginBottom: 24,
          }}
        >
          <a
            style={{
              float: 'left',
            }}
            onClick={jumpToRegister}
          >
            还未注册？去注册
          </a>
          <a
            style={{
              float: 'right',
            }}
            onClick={openNotification}
          >
            忘记密码
          </a>
        </div>
      </ProForm>
    </div>
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
