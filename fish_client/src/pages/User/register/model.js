import { userRgisterApi } from './service';
import { message } from 'antd';

const Model = {
  namespace: 'userAndregister',
  state: {
    status: undefined,
  },
  effects: {
    *submit({ payload }, { call, put }) {
      let response
      let expectResponse = {
        status: 'error',
      }
      try {
        response = yield call(userRgisterApi, payload);
        if (response.id) {
          expectResponse = {
            status: 'ok',
          }
        }
      } catch (err) {
        console.log(err)
      }
      yield put({
        type: 'registerHandle',
        payload: expectResponse,
      });
    },
  },
  reducers: {
    registerHandle(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

export default Model;
