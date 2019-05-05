import { list, readAccounts, } from '../../../../servies/summary';
import { listName } from '../../../../servies/myProject';

export default {
  namespace: 'summarys',
  state: {
    summary: [],
    projects: [],
    accounts: [],
  },
  reducers: {
    updateSummary(state, { payload: { data: summary } }) {
      // console.log(summary);
      return { ...state, summary };
    },
    updateProjectName(state, { payload: { data: projects } }) {
      return { ...state, projects };
    },
    updateAccounts(state, { payload: { data: accounts } }) {
      return { ...state, accounts };
    }
  },
  effects: {
    *list({ payload: query }, { call, put }) {
      const result = yield call(list, query);
      if (result && result.status === 1) {
        const data = result.data;
        yield put({
          type: 'updateSummary',
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
          type: 'updateProjectName',
          payload: {
            data
          }
        });
      }
    },
    *listAccounts({ payload: projectId }, { call, put }) {
      // console.log('call??????????');
      const result = yield call(readAccounts, projectId);
      if (result && result.status === 1) {
        const data = result.data;
        // console.log('listAccounts data???', data);
        yield put({
          type: 'updateAccounts',
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
          dispatch({ type: 'listProjects' });
        }
      });
    }
  }
};
