import { stringify } from 'querystring';
import { history } from 'umi';
import { fakeAccountLogin, fakeCurrentUser } from './service';
import { setAuthority, removeAuthority } from '@/utils/authority';
import { setToken, removeToken, getToken } from '@/utils/auth';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';
const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      let response = { status: 'error' }
      try {
        response = yield call(fakeAccountLogin, payload);
        response && (response.status = 'ok')
        const currentUserInfo = yield call(fakeCurrentUser, `JWT ${response.token}`)
        response.permission = currentUserInfo.permission

        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
      } catch (err) {
        message.error("登录失败")
      }

      if (response.status === 'ok') {
        setToken(response.token)
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        message.success('🎉 🎉 🎉  登录成功！');
        let { redirect } = params;

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }

        history.replace(redirect || '/');
      }
    },

    logout() {
      const { redirect } = getPageQuery();
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
        removeAuthority()
        removeToken()
      }
    },
  },
  reducers: {
    // 在这里设置当前用户的权限
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.permission);
      return { ...state, status: payload.status };
    },
  },
};
export default Model;
