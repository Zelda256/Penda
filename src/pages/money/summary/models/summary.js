import { list } from '../../../../servies/summary';
import { listName } from '../../../../servies/myProject';

export default {
  namespace: 'summarys',
  state: {
    summary: [],
    projects: []
  },
  reducers: {
    listSummary(state, { payload: { data: summary } }) {
      // console.log(summary);
      return { ...state, summary };
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
        yield put({
          type: 'listSummary',
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
        if (pathname === '/money/summary') {
          dispatch({ type: 'list' });
          dispatch({ type: 'listProjects' });
        }
      });
    }
  }
};
