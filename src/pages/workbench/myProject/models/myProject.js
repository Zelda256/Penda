import { list, read } from '../../../../servies/myProject';

export default {
  namespace: 'myProjects',
  state: {
    projects: [],
    readProject: null
  },
  reducers: {
    listedProjects(state, { payload: { data: projects } }) {
      return { ...state, projects };
    },
    readProjects(state, { payload: { data: project } }) {
      return { ...state, readProject: project };
    }
  },
  effects: {
    *list({ payload: query }, { call, put }) {
      const result = yield call(list, query);
      if (result && result.status === 1) {
        const data = result.data;
        yield put({
          type: 'listedProjects',
          payload: {
            data
          }
        });
      }
    },
    *read({ payload: id }, { call, put }) {
      console.log('-----', id);
      const result = yield call(read, id);
      console.log('??????', result);
      if (result && result.status === 1) {
        const data = result.data;
        yield put({
          type: 'readProjects',
          payload: {
            data
          }
        });
      }
    }
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/workbench/myProject') {
          dispatch({ type: 'list' });
        }
      });
    }
  }
};
