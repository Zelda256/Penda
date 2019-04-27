import { list, addUserToConact, removeUserInContact, updateUser } from '../../../../servies/contact';
import { message } from 'antd';

export default {
  namespace: 'contact',
  state: {
    contacts: {},
  },
  reducers: {
    listContact(state, { payload: { data: contacts } }) {
      console.log('contacts', contacts);
      return { ...state, contacts };
    },
  },
  effects: {
    *list({ payload: query }, { call, put }) {
      const result = yield call(list, query);
      if (result && result.status === 1) {
        const data = result.data;
        console.log('rsult.data', data);
        yield put({
          type: 'listContact',
          payload: {
            data
          }
        });
      }
    },
    *addUserToConact({ payload: { contactId, userId } }, { call, put }) {
      // console.log('4$1413414123^@%@#', contactId, userId);
      const result = yield call(addUserToConact, contactId, userId);
      if (result && result.status === 1) {
        message.success('添加联系人成功');

        yield put({
          type: 'list'
        });
      }
    },
    *removeUserInContact({ payload: { contactId, userId } }, { call, put }) {
      const result = yield call(removeUserInContact, contactId, userId);
      if (result && result.status === 1) {
        message.success('删除联系人成功');
        yield put({
          type: 'list'
        });
      } else {
        message.error('删除联系人失败');
      }
    },
    *updateUser({ payload: { userInfo, userId }  }, { call, put }) {
      const result = yield call(updateUser, userId, userInfo);
      if (result && result.status === 1) {
        message.success('更新成功');
        yield put({
          type: 'list'
        });
      }
    }
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
