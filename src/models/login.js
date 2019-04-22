import { login, logout } from '../servies/login';
import router from 'umi/router';

export default {
  namespace: 'login',
  state: {
    loginRes: null,
  },
  reducers: {
    getLoginRes(state, { payload: { data: loginRes } }) {
      return { ...state, loginRes };
    },
    clearLoginRes(state) {
      return { ...state, loginRes: null };
    }
  },
  effects: {
    *login({ payload }, { call, put }) {
      // console.log('???', payload);
      const result = yield call(login, payload);
      // console.log('result', result);
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
    *logout({ payload }, { call, put }) {
      console.log('???? logout model');
      const result = yield call(logout, payload);
      // console.log(result);
      // console.log('result', result);
      // if (result && result.status === 1) {
      // const data = result.data;
      yield put({
        type: 'clearLoginRes'
      });
      router.push('/login');
      window.sessionStorage['user'] = null;
      // }
    }
  }
};
