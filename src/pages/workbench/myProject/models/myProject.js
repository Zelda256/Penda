import { list, read, createProcess, getRefundAmount, createRefund,
  updateProcessStatus, listTeams, createProject } from '../../../../servies/myProject';
import { message } from 'antd';
import ListItem from 'antd-mobile/lib/list/ListItem';

export default {
  namespace: 'myProjects',
  state: {
    projects: [],
    teams: [],
    readProjects: null,
    refundAmount: null
  },
  reducers: {
    listedProjects(state, { payload: { data: projects } }) {
      return { ...state, projects };
    },
    readProjects(state, { payload: { data: project } }) {
      return { ...state, readProjects: project };
    },
    refundAmount(state, { payload: { data: refundAmount } }) {
      return { ...state, refundAmount: refundAmount };
    },
    updateTeams(state, { payload: { data: teams } }) {
      return { ...state, teams: teams };
    },
  },
  effects: {
    *list({ payload: query }, { call, put }) {
      const result = yield call(list, query);
      console.log('project', result);
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
      console.log('???????????????id', id);
      const result = yield call(read, id);
      if (result && result.status === 1) {
        const data = result.data;
        yield put({
          type: 'readProjects',
          payload: {
            data
          }
        });
      }
    },
    *createProject({ payload }, { call, put }) {
      // console.log('createRefund Payload', payload);
      const result = yield call(createProject, payload);
      if (result && result.status === 1) {
        // console.log('createRefund');
        message.success('添加项目成功', 3);
        yield put({
          type: 'list'
        });
      }
    },
    *createProcess({ payload: { projectId, process } }, { call, put }) {
      const result = yield call(createProcess, projectId, process);
      if (result && result.status === 1) {
        console.log('result', result);
        yield put({
          type: 'read',
          payload: projectId
        });
      }
    },
    *getRefundAmount({ payload: id }, { call, put }) {
      const result = yield call(getRefundAmount, id);
      if (result && result.status === 1) {
        const data = result.data;
        yield put({
          type: 'refundAmount',
          payload: {
            data
          }
        });
      }
    },
    *createRefund({ payload }, { call, put }) {
      // console.log('createRefund Payload', payload);
      const result = yield call(createRefund, payload);
      if (result && result.status === 1) {
        // console.log('createRefund');
        message.success('添加报销成功', 3);
        yield put({
          type: 'read',
          payload: payload.projectId
        });
      }
    },
    *updateProcessStatus({ payload: { processId, body } }, { call, put }) {
      console.log('updateProcessStatus Payload', processId, body);
      const result = yield call(updateProcessStatus, processId, body);
      if (result && result.status === 1) {
        console.log('body.projectId', body);
        const id = body.projectId;
        console.log('idididididid', id);
        message.success('修改子任务状态成功');
        // const data = result.data;
        yield put({
          type: 'read',
          payload: id
        });
      }
    },
    *listTeams({ payload }, { call, put }) {
      const result = yield call(listTeams);
      if (result && result.status === 1) {
        const data = result.data;
        yield put({
          type: 'updateTeams',
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
        if (pathname === '/workbench/myProject') {
          dispatch({ type: 'list' });
          dispatch({ type: 'listTeams' });
        }
      });
    }
  }
};
