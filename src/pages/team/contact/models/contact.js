import { list } from '../../../../servies/contact';

export default {
  namespace: 'contact',
  state: {
    contact: [],
  },
  reducers: {
    listContact(state, { payload: { data: contact } }) {
      return { ...state, contact };
    },
  },
  effects: {
    *list({ payload: query }, { call, put }) {
      const result = yield call(list, query);
      if (result && result.status === 1) {
        const data = result.data;
        yield put({
          type: 'listContact',
          payload: {
            data
          }
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/team/contact') {
          dispatch({ type: 'list' });
        }
      });
    }
  }
};
