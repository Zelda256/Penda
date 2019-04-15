import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Input, Divider, Row, Col, Avatar, Table, Popconfirm, Form, } from 'antd';
import styles from './index.less';

const Search = Input.Search;
// const Panel = Collapse.Panel;
const FormItem = Form.Item;
const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    return <Input />;
  };

  render() {
    const { editing, dataIndex, title, record, index, ...restProps } = this.props;
    return (
      <EditableContext.Consumer>
        {(form) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [{
                      required: true,
                      message: `Please Input ${title}!`,
                    }],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : restProps.children}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}

@Form.create()
@connect(({ contact }) => ({
  contact: contact.contact,
}))
class Contact extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      contact: [],
      editingKey: '',
    };
  }

  isEditing = record => record._id === this.state.editingKey;

  save() {

  }

  cancel() {
    this.setState({ editingKey: '' });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  delete() {

  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.contact && nextProps.contact !== prevState.contact) {
      return {
        contact: nextProps.contact
      };
    }
    return null;
  }
  render() {
    console.log(this.state.contact);
    const { contact } = this.state;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'name',
        align: 'center',
        width: '15%',
        editable: true,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        align: 'center',
        width: '20%',
        editable: true,
      },
      {
        title: '号码',
        dataIndex: 'phone',
        align: 'center',
        width: '20%',
        editable: true,
      },
      {
        title: '部门',
        dataIndex: 'department',
        align: 'center',
        width: '10%',
        editable: true,
        render: (text, record) => record.department ? record.department : '/',
      },
      {
        title: '岗位',
        dataIndex: 'job',
        align: 'center',
        width: '15%',
        editable: true,
        render: (text, record) => record.job ? record.job : '/',
      },
      {
        title: '操作',
        align: 'center',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          // console.log(editable);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {form => (
                      <a
                        href="javascript:;"
                        onClick={() => this.save(form, record._id)}
                      >
                        保存
                      </a>
                    )}
                  </EditableContext.Consumer>
                  <Divider type="vertical" />
                  <Popconfirm
                    title="确认取消?"
                    onConfirm={() => this.cancel(record._id)}
                  >
                    <a>取消</a>
                  </Popconfirm>
                </span>
              ) : (
                <span>
                  <a disabled={editingKey !== ''} onClick={() => this.edit(record._id)}>编辑</a>
                  <Divider type="vertical" />
                  <Popconfirm
                    title="确认删除?"
                    onConfirm={() => this.delete(record._id)}
                  >
                    <a disabled={editingKey !== ''}>删除</a>
                  </Popconfirm>
                </span>
              )}
            </div>
          );
        }
      }
    ];
    const components = {
      body: {
        cell: EditableCell
      }
    };
    const columnsCell = columns.map(col => {
      if (!col.editable) return col;
      return {
        ...col,
        onCell: record => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        })
      };
    });

    return (
      <div className={styles.whiteBg}>
        <div className={styles.top}>
          <Row type="flex" justify="space-between" align="middle" style={{ marginTop: 8 }}>
            <Col span={12}>
              <Button type="primary">新建联系人</Button>
            </Col>
            <Col span={12}>
              <Search
                placeholder="姓名"
                onSearch={this.handleSearchProject}
                size="small"
                style={{ width: 240 }}
              />
            </Col>
          </Row>
        </div>
        <EditableContext.Provider value={this.props.form}>
          <Table
            components={components}
            bordered
            dataSource={contact}
            rowKey="_id"
            columns={columnsCell}
            rowClassName="editableRow"
            pagination={{
              onChange: this.cancel,
            }}
          />
        </EditableContext.Provider>
      </div>
    );
  }
}

export default Contact;
