import { list } from '../../../../servies/refunds';
import { listName } from '../../../../servies/myProject';

export default {
  namespace: 'refunds',
  state: {
    refund: [],
    projects: [],

  },
  reducers: {
    listRefunds(state, { payload: { data: refund } }) {
      return { ...state, refund };
    },
    listProjectName(state, { payload: { data: projects } }) {
      return { ...state, projects };
    }
  },
  effects: {
    *list({ payload: query }, { call, put }) {
      const result = yield call(list, query);
      if (result && result.status === 1) {
        const data = result.data;
        // console.log('list data???', data);
        yield put({
          type: 'listRefunds',
          payload: {
            data
          }
        });
      }
    },
    *listProjects({ payload }, { call, put }) {
      const result = yield call(listName);
      if (result && result.status === 1) {
        const data = result.data;
        // console.log('listProjects data???', data);
        yield put({
          type: 'listProjectName',
          payload: {
            data
          }
        });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/money/refunds') {
          dispatch({ type: 'list' });
          dispatch({ type: 'listProjects' });
        }
      });
    }
  }
};
