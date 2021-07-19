import { queryCurrent, query as queryUsers } from '@/services/user';
import { getToken } from '@/utils/auth'

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent, `JWT ${getToken()}`);

      yield put({
        type: 'saveCurrentUser',
        payload: {
          name: response.nickname,
          avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
          userid: response.id,
          phone: response.phone,
          permission: response.permission,
          authority: response.permission,
        },
      });
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },
  },
};
export default UserModel;
