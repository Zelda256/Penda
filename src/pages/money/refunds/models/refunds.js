import { list } from '../../../../servies/refunds';

export default {
  namespace: 'refunds',
  state: {
    refund: [],
  },
  reducers: {
    listRefunds(state, { payload: { data: refund } }) {
      console.log(refund);
      return { ...state, refund };
    },
  },
  effects: {
    *list({ payload: query }, { call, put }) {
      const result = yield call(list, query);
      if (result && result.status === 1) {
        const data = result.data;
        yield put({
          type: 'listRefunds',
          payload: {
            data
          }
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/money/refunds') {
          dispatch({ type: 'list' });
        }
      });
    }
  }
};
