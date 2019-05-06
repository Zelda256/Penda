import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, Input, Table, Typography, DatePicker, Collapse, Icon, Empty, Select, Modal } from 'antd';
import styles from './index.less';
import moment from 'moment';
import { userInfo } from 'os';
const { Text } = Typography;
const { Panel } = Collapse;
const Option = Select.Option;

const Search = Input.Search;
const { RangePicker } = DatePicker;

@connect(({ summarys }) => ({
  summary: summarys.summary,
  projects: summarys.projects,
  accounts: summarys.accounts,
}))
class Summary extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      summary: [],
      projects: [],
      accounts: [],
      projectSearch: null,
      showAccountTbl: false,
      projectLeader: null,
      projectBudget: null,
      projectName: null,
      projectId: null,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.summary && nextProps.summary !== prevState.summary) {
      return {
        summary: nextProps.summary
      };
    }
    if (nextProps.projects && nextProps.projects !== prevState.projects) {
      return {
        projects: nextProps.projects
      };
    }
    if (nextProps.accounts && nextProps.accounts !== prevState.accounts) {
      return {
        accounts: nextProps.accounts
      };
    }
    return null;
  }
  handleProjectSearch = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'summarys/list',
      payload: {
        project: value,
      }
    });
    this.setState({
      projectSearch: value,
    });
  }
  clearSearch = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'summarys/list' });
    this.setState({
      projectSearch: null,
    });
  }

  genExtra = (projectId) => {
    const { dispatch } = this.props;
    const { summary } = this.state;
    return <span className={styles.exportBtns}>
      <Button
        size="small"
        style={{ marginRight: '16px' }}
        onClick={(event) => {
          event.stopPropagation();
          this.handleAccountTbl();
          dispatch({
            type: 'summarys/listAccounts',
            payload: projectId
          });
          const project = summary.find(item => String(item.project._id) === String(projectId)).project;
          if (project) {
            // console.log('project', project);
            this.setState({
              projectLeader: project.creator.name,
              projectBudget: project.budget,
              projectName: project.name,
              projectId: project._id
            });
          }
        }}
      >
        生成决算表
      </Button>
      <Button
        size="small"
        onClick={(event) => {
          event.stopPropagation();
          window.open('/api/refunds/summary/download/' + projectId);
        }}
      >
        <Icon type="cloud-download" />
        汇总表
      </Button>
    </span>;
  }
  handleAccountTbl = () => {
    this.setState({
      showAccountTbl: !this.state.showAccountTbl
    });
  }
  downloadAccount = ()=> {
    const {projectId} = this.state;
    window.open('/api/refunds/account/download/' + projectId);
  }
  render() {
    const { summary, projects, accounts, projectLeader, projectBudget, projectName } = this.state;
    // console.log('projects', projects);
    // const refundType = ['/', '差旅费', '材料费', '文献出版费', '劳务费', '专家咨询费', '设备费'];
    // console.log('summary', summary);
    console.log('accounts', accounts);
    const columns = [{
      title: '姓名',
      dataIndex: 'user.name',
      align: 'center',
    }, {
      title: '差旅费',
      align: 'center',
      render: ((text, record) => {
        let refund = record.refunds.find(item => item.type === 1);
        if (refund) return refund.value;
        return null;
      })
    }, {
      title: '材料费',
      align: 'center',
      render: ((text, record) => {
        let refund = record.refunds.find(item => item.type === 2);
        if (refund) return refund.value;
        return null;
      })
    }, {
      title: '文献出版费',
      align: 'center',
      render: ((text, record) => {
        let refund = record.refunds.find(item => item.type === 3);
        if (refund) return refund.value;
        return null;
      })
    }, {
      title: '劳务费',
      align: 'center',
      render: ((text, record) => {
        let refund = record.refunds.find(item => item.type === 4);
        if (refund) return refund.value;
        return null;
      })
    }, {
      title: '专家咨询费',
      align: 'center',
      render: ((text, record) => {
        let refund = record.refunds.find(item => item.type === 5);
        if (refund) return refund.value;
        return null;
      })
    }, {
      title: '设备费',
      align: 'center',
      render: ((text, record) => {
        let refund = record.refunds.find(item => item.type === 6);
        if (refund) return refund.value;
        return null;
      })
    }, {
      title: '合计',
      align: 'center',
      width: '18%',
      render: ((text, record) => {
        let result = record.refunds.reduce((sum, item) => sum + item.value, 0);
        return <Text strong>{result}</Text>;
      })
    },
    ];

    const modalColumns = [
      {
        title: '序号',
        key: '00',
        align: 'center',
        render: (text, record, index) => <span>{index + 1}</span>
      }, {
        title: '任务名称',
        dataIndex: 'name',
        align: 'center',
      }, {
        title: '预算数',
        dataIndex: 'budge',
        align: 'center',
      }, {
        title: '累积支出',
        dataIndex: 'cost',
        align: 'center',
      }, {
        title: '支出情况',
        key: '0',
        children: [{
          title: '差旅费',
          key: '1',
          align: 'center',
          render: (text, record) => {
            if (!record.account) return null;
            let account = record.account.find(item => item.type === 1);
            if (account) {
              return <span>{account.value}</span>;
            } else {
              return null;
            }
          }
        }, {
          title: '材料费',
          key: '2',
          align: 'center',
          render: (text, record) => {
            if (!record.account) return null;
            let account = record.account.find(item => item.type === 2);
            if (account) {
              return <span>{account.value}</span>;
            } else {
              return null;
            }
          }
        }, {
          title: '文献出版费',
          key: '3',
          align: 'center',
          render: (text, record) => {
            if (!record.account) return null;
            let account = record.account.find(item => item.type === 3);
            if (account) {
              return <span>{account.value}</span>;
            } else {
              return null;
            }
          }
        }, {
          title: '劳务费',
          key: '4',
          align: 'center',
          render: (text, record) => {
            if (!record.account) return null;
            let account = record.account.find(item => item.type === 4);
            // console.log(account);
            if (account) {
              return <span>{account.value}</span>;
            } else {
              return null;
            }
          }
        }, {
          title: '专家咨询费',
          key: '9999',
          align: 'center',
          render: (text, record) => {
            if (!record.account) return null;
            let account = record.account.find(item => item.type === 5);
            if (account) {
              return <span>{account.value}</span>;
            } else {
              return null;
            }
          }
        }, {
          title: '设备费',
          key: '6',
          align: 'center',
          render: (text, record) => {
            if (!record.account) return null;
            let account = record.account.find(item => item.type === 6);
            if (account) {
              return <span>{account.value}</span>;
            } else {
              return null;
            }
          }
        },
        ]
      }, {
        title: '决算数',
        // dataIndex: 'index',
        align: 'center',
        render: (text, record) => {
          return <span>{record.budge - record.cost}</span>;
        }
      }];

    return (
      <>
        <div className={styles.whiteBg}>
          <div className={styles.top}>
            <Row type="flex" justify="start" align="middle" style={{ marginTop: 8 }}>
              <Col span={5}>
                <span>项目名称：</span>
                <Select
                  placeholder="项目名称"
                  style={{ width: 120 }}
                  size="small"
                  onChange={this.handleProjectSearch}
                  dropdownMatchSelectWidth={false}
                  value={this.state.projectSearch}
                >
                  {
                    projects.map(item => {
                      return <Option key={item._id}>{item.name}</Option>;
                    })
                  }
                </Select>
              </Col>
              <Col span={2}>
                <Button size="small" onClick={this.clearSearch}>重置</Button>
              </Col>
            </Row>
          </div>
          <div className={styles.mainTable}>
            {!summary || !summary.length ? <Empty /> :
              <Collapse
                bordered={false}
                defaultActiveKey={summary.length ? summary[0].project._id : null}
              >
                {summary.map((item) => {
                  return (
                    <Panel
                      header={<Text strong>{item.project.name}</Text>}
                      key={item.project._id}
                      extra={this.genExtra(item.project._id)}
                      className={styles.panel}
                    >
                      <Table
                        columns={columns}
                        dataSource={item.summary}
                        bordered
                        size="small"
                        rowKey={(record) => record.user._id}
                        footer={(currentPageData) => {
                          let traval = 0, stuff = 0, publish = 0, labor = 0, consult = 0, device = 0;
                          currentPageData.forEach(item => {
                            item.refunds.forEach(refund => {
                              switch (refund.type) {
                              case 1: traval += refund.value; break;
                              case 2: stuff += refund.value; break;
                              case 3: publish += refund.value; break;
                              case 4: labor += refund.value; break;
                              case 5: consult += refund.value; break;
                              case 6: device += refund.value; break;
                              }
                            });
                          });
                          return <Text>
                            <Text strong>合计 ( {traval + stuff + publish + labor + consult + device} 元 )： </Text>
                            1. 差旅费：{traval} 元；
                          2. 材料费：{stuff} 元；
                          3. 文献出版费：{publish} 元；
                          4. 劳务费：{labor} 元；
                          5. 专家咨询费：{consult} 元；
                          6. 设备费：{device} 元；
                          </Text>;
                        }}
                      />
                    </Panel>
                  );
                })}
              </Collapse>
            }
          </div>
        </div>
        <Modal
          title="决算表"
          visible={this.state.showAccountTbl}
          centered={true}
          onOk={this.downloadAccount}
          onCancel={this.handleAccountTbl}
          okText="下载"
          cancelText="取消"
          // footer={false}
          width="1080px"
        >
          <Table
            rowKey={row => row.name}
            columns={modalColumns}
            dataSource={accounts}
            bordered
            size="small"
            title={() => <span>
              项目名称：{projectName}
              <span style={{ marginLeft: '32px' }}>项目负责人： {projectLeader}</span>
              <span style={{ marginLeft: '32px' }}>项目总预算： {projectBudget}</span>
              <span style={{ position: 'absolute', right: '16px' }}>金额单位：元</span>
            </span>}

          />
        </Modal>
      </>
    );
  }
}

export default Summary;
