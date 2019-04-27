import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Input, Row, Col, Table, Popconfirm, Form, Modal, Icon, message, Typography  } from 'antd';
import styles from './index.less';

const Search = Input.Search;
const { Text } = Typography;
const FormItem = Form.Item;
const EditableContext = React.createContext();

@Form.create()
@connect(({ contact }) => ({
  contacts: contact.contacts,
}))
class Contact extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      contacts: {},
      editingKey: '',
      addContactModal: false
    };
  }

  handleSearchContact() {

  }

  deleteUser(userId) {
    const curUserId = JSON.parse(window.sessionStorage.getItem('user'))._id;
    if (userId === curUserId) {
      message.error('不能删除自己');
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'contact/removeUserInContact',
      payload: {
        contactId: this.state.contacts._id,
        userId,
      }
    });
  }

  handleAddContactModal = () => {
    this.setState({
      addContactModal: !this.state.addContactModal
    });
  }

  addUserToContact = () => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    const { dispatch } = this.props;
    const userId = getFieldValue('userId');
    dispatch({
      type: 'contact/addUserToConact',
      payload: {
        contactId: this.state.contacts._id,
        userId,
      }
    });
    setFieldsValue({ 'userId': null });
    this.handleAddContactModal();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.contacts && nextProps.contacts !== prevState.contacts) {
      return {
        contacts: nextProps.contacts
      };
    }
    return null;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { contacts } = this.state;
    const { contact } = contacts;
    const columns = [
      {
        title: 'ID',
        dataIndex: '_id',
        align: 'center',
        width: '18%',
        editable: true,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        align: 'center',
        width: '10%',
        editable: true,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        align: 'center',
        width: '18%',
        editable: true,
      },
      {
        title: '号码',
        dataIndex: 'phone',
        align: 'center',
        width: '12%',
        editable: true,
      },
      {
        title: '部门',
        dataIndex: 'department',
        align: 'center',
        editable: true,
        render: (text, record) => record.department ? record.department : '/',
      },
      {
        title: '岗位',
        dataIndex: 'job',
        align: 'center',
        editable: true,
        render: (text, record) => record.job ? record.job : '/',
      },
      {
        title: '操作',
        align: 'center',
        width: '12%',
        render: (text, record) => {
          return (
            <div>
              <Popconfirm
                title="确认删除?"
                okText="确认"
                cancelText="取消"
                onConfirm={() => this.deleteUser(record._id)}
              >
                <Text style={{color: '#40A9FF', cursor: 'pointer'}}>删除</Text>
              </Popconfirm>
            </div>
          );
        }
      }
    ];

    return (
      <>
        <div className={styles.whiteBg}>
          <div className={styles.top}>
            <Row type="flex" justify="space-between" align="middle" style={{ marginTop: 8 }}>
              <Col span={4}>
                <Button type="primary" onClick={this.handleAddContactModal}>新建联系人</Button>
              </Col>
              <Col span={20}>
                <Search
                  placeholder="联系人姓名"
                  onSearch={this.handleSearchContact}
                  size="small"
                  style={{ width: 240 }}
                />
              </Col>
            </Row>
          </div>
          <EditableContext.Provider value={this.props.form}>
            <Table
              bordered
              dataSource={contact}
              rowKey={record => record._id}
              columns={columns}
              rowClassName="editableRow"
              pagination={{
                onChange: this.cancel,
              }}
            />
          </EditableContext.Provider>
        </div>
        <Modal
          title="添加联系人"
          visible={this.state.addContactModal}
          okText="添加"
          cancelText="取消"
          onOk={this.addUserToContact}
          onCancel={this.handleAddContactModal}
        >
          <Form>
            <FormItem
              label="用户 id"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 16 }}
              key='userId'
            >
              {getFieldDecorator('userId', {
                rules: [{ required: true, message: '请输入用户 ID' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }}  />} />
              )}
            </FormItem>
          </Form>
        </Modal>
      </>
    );
  }
}

export default Contact;
