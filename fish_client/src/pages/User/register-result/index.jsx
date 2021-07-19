import { Button, Result } from 'antd';
import { Link } from 'umi';
import React from 'react';
import styles from './style.less';

const actions = (
  <div className={styles.actions}>
    <Link to="/user/login">
      <Button size="large">去登录</Button>
    </Link>
  </div>
);

const RegisterResult = ({ location }) => {
  return (
    <Result
      className={styles.registerResult}
      status="success"
      title={<div className={styles.title}>注册成功</div>}
      subTitle={`现在去登录吧，稍后管理员会给你授予权限`}
      extra={actions}
    />
  )
};



export default RegisterResult;
