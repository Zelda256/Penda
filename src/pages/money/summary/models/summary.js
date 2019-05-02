import { list } from '../../../../servies/summary';

export default {
  namespace: 'summarys',
  state: {
    summary: [],
  },
  reducers: {
    listSummary(state, { payload: { data: summary } }) {
      console.log(summary);
      return { ...state, summary };
    },
  },
  effects: {
    *list({ payload: query }, { call, put }) {
      const result = yield call(list, query);
      if (result && result.status === 1) {
        const data = result.data;
        yield put({
          type: 'listSummary',
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
        if (pathname === '/money/summary') {
          dispatch({ type: 'list' });
        }
      });
    }
  }
};
