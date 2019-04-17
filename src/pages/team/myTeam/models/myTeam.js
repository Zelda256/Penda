import { list } from '../../../../servies/myTeam';

export default {
  namespace: 'myTeam',
  state: {
    teams: [],
  },
  reducers: {
    listTeams(state, { payload: { data: teams } }) {
      console.log(teams);
      return { ...state, teams };
    },
  },
  effects: {
    *list({ payload: query }, { call, put }) {
      const result = yield call(list, query);
      if (result && result.status === 1) {
        const data = result.data;
        yield put({
          type: 'listTeams',
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
        if (pathname === '/team/myTeam') {
          dispatch({ type: 'list' });
        }
      });
    }
  }
};
