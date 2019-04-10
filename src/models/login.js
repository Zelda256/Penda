import { login } from '../servies/login';

export default {
  namespace: 'login',
  state: {
    loginRes: null,
  },
  reducers: {
    getLoginRes(state, { payload: { data: loginRes } }) {
      return { ...state, loginRes };
    },
  },
  effects: {
    *login({ payload }, { call, put }) {
      console.log('???', payload);
      const result = yield call(login, payload);
      console.log('result', result);
      if (result && result.status === 1) {
        const data = result.data;
        yield put({
          type: 'getLoginRes',
          payload: {
            data
          }
        });
      }
    },
  },
};
