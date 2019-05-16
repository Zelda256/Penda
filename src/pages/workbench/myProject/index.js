import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Radio, Select, Input, Row, Col, Modal, Form, Spin, Transfer, DatePicker, InputNumber } from 'antd';
import styles from './index.less';
import Waterfall from './components/Waterfall';
import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const Option = Select.Option;
const { RangePicker } = DatePicker;
const Search = Input.Search;
const Item = Form.Item;

@connect(({ myProjects }) => ({
  projects: myProjects.projects,
  teams: myProjects.teams,
}))
@Form.create()
class MyProject extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showType: 'waterfallType',
      orderType: 'emergency',
      showCreateProj: false,
      projects: [],
      teams: [],
      teamSelected: null,
      budge: null,
    };
  }
  handleShowTypeChange = (e) => {
    this.setState({ showType: e.target.value });
  }
  handleshowOrderChange = (value) => {
    this.setState({ orderType: value });
  }
  handleBudge = (value) => {
    this.setState({ budge: value });
  }
  handleCreateProj = () => {
    this.setState({ showCreateProj: !this.state.showCreateProj });
  }
  validateBudge = (rule, value, callback) => {
    const { form } = this.props;
    const { getFieldValue } = form;
    if (value && value > getFieldValue('projectBudge')) {
      callback('不能超过总预算');
    } else {
      callback();
    }
  }
  createProject = () => {
    const { dispatch } = this.props;
    const { form } = this.props;
    const { getFieldsValue } = form;
    const values = getFieldsValue();
    const { projectBudge, projectDesc, projectLeader, projectName,
      projectPriority, projectRemark, projectTeam, projectTime,
      travelBudge, stuffBudge, publishBudge, laborBudge, consultBudge, deviceBudge
    } = values;
    const currentDate = moment();
    const startDate = projectTime[0], deadLine = projectTime[1];
    const checkStatus = currentDate < moment(startDate) ? 1 : currentDate > moment(deadLine) ? 3 : 2;

    const project = {
      name: projectName,
      creator: projectLeader,
      team: projectTeam,
      startDate: moment(startDate),
      deadLine: moment(deadLine),
      budget: projectBudge ? projectBudge : 0,
      priority: projectPriority ? projectPriority : 1,
      description: projectDesc ? projectDesc : '',
      projectRemark: projectRemark ? projectRemark : '',
      status: checkStatus,
      maxTravel: travelBudge ? travelBudge : 0,
      maxStuff: stuffBudge ? stuffBudge : 0,
      maxPublish: publishBudge ? publishBudge : 0,
      maxLabor: laborBudge ? laborBudge : 0,
      maxConsult: consultBudge ? consultBudge : 0,
      maxDevice: deviceBudge ? deviceBudge : 0,
    };
    // console.log(project);
    dispatch({
      type: 'myProjects/createProject',
      payload: project
    });
    this.handleCreateProj();
  }
  handleTeamsChange = (value) => {
    this.setState({ teamSelected: value });
    const { form } = this.props;
    const { setFieldsValue } = form;
    setFieldsValue({ projectLeader: null });
  }
  leaderOption = () => {
    const { teamSelected, teams } = this.state;
    if (teamSelected) {
      let team = teams.find(team => team._id === teamSelected);
      return team.member.map(member => <Option key={member._id} value={member._id}>{member.name}</Option>);
    }
    return null;
  }
  sortByOrderType = (projects) => {
    const { orderType } = this.state;
    if (orderType === 'emergency') {  // 优先级
      projects.sort((a, b) => {
        return b.priority - a.priority;
      });
    } else if (orderType === 'expireTime') {  // 截止日期
      projects.sort((a, b) => {
        return moment(a.deadLine) - moment(b.deadLine);
      });
    } else if (orderType === 'createTime') { // 开始日期
      projects.sort((a, b) => {
        return moment(b.startDate) - moment(a.startDate);
      });
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.projects && nextProps.projects !== prevState.projects) {
      return {
        projects: nextProps.projects
      };
    }
    if (nextProps.teams && nextProps.teams !== prevState.teams) {
      return {
        teams: nextProps.teams
      };
    }
    return null;
  }
  render() {
    const { showType, orderType, projects, teams, budge } = this.state;
    // console.log(teams);
    const { form } = this.props;
    const { getFieldDecorator } = form;
    // 统计 进行中&未开始&已完成 的项目
    const processing = [], notStarted = [], finished = [];
    projects.forEach(item => {
      switch (item.status) {
      case 1: notStarted.push(item); break;
      case 2: processing.push(item); break;
      case 3: finished.push(item); break;
      default: console.log(`这个item的status出错${item}`);
      }
    });
    // 处理项目的显示顺序
    this.sortByOrderType(processing);
    // console.log('user:::::::', JSON.parse(window.sessionStorage.getItem('user')));
    const userIdentity = JSON.parse(window.sessionStorage.getItem('user')).identity;
    return <>
      <div className={styles.whiteBg}>
        <div className={styles.top}>
          <Row type="flex" justify="space-between" align="middle" style={{ marginTop: 8 }}>
            <Col span={6}>
              <Button type="primary" disabled={userIdentity === 2} onClick={this.handleCreateProj}>新建项目</Button>
            </Col>

            <Col span={6}>
              <Search
                placeholder="项目名称/编号"
                onSearch={this.handleSearchProject}
                size="small"
                style={{ width: 240 }}
              />
            </Col>

            <Col span={6}>
              <span>排列方式：</span>
              <Select
                value={orderType}
                onChange={this.handleshowOrderChange}
                size="small"
              >
                <Option key="emergency" >优先情况</Option>
                <Option key="expireTime">截止日期</Option>
                <Option key="createTime">开始日期</Option>
              </Select>
            </Col>

            {/* <Col span={6}>
              <span>显示方式：</span>
              <Radio.Group value={showType} onChange={this.handleShowTypeChange} size="small">
                <Radio.Button value="waterfallType">瀑布</Radio.Button>
                <Radio.Button value="listType">列表</Radio.Button>
                <Radio.Button value="ganttType">甘特</Radio.Button>
              </Radio.Group>
            </Col> */}
          </Row>
        </div>
        <div className={styles.main}>
          {showType === 'waterfallType' && <Waterfall processing={processing} notStarted={notStarted} finished={finished} />}
        </div>
      </div>
      <Modal
        title="添加项目"
        visible={this.state.showCreateProj}
        onOk={this.createProject}
        onCancel={this.handleCreateProj}
        okText="添加"
        cancelText="取消"
        centered={true}
      >
        <Form
          layout="horizontal"
        >
          <Item label="项目名称" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} style={{ margin: '0 0' }}>
            {getFieldDecorator('projectName', {
              rules: [{ required: true, message: '请输入项目名称' }]
            })(
              <Input
                allowClear
                // onChange={this.handleProcessName}
                size="small"
              />
            )}
          </Item>
          <Item label="执行时间" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} style={{ margin: '0 0' }}>
            {getFieldDecorator('projectTime', {
              rules: [{ required: true }]
            })(
              <RangePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                // width="315px"
                style={{ width: '315px' }}
                // onChange={this.handleProcessTime}
                locale={locale}  // 中文
                size="small"
              />
            )}
          </Item>
          <Item label="执行团队" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} style={{ margin: '0 0' }}>
            {getFieldDecorator('projectTeam', {
              rules: [{ required: true, message: '请选择执行团队' }]
            })(
              <Select
                size="small"
                onChange={this.handleTeamsChange}
              >
                {
                  teams.map(team => {
                    return <Option key={team._id} value={team._id}>{team.name}</Option>;
                  })
                }
              </Select>
            )}
          </Item>
          <Item label="负责人" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} style={{ margin: '0 0' }}>
            {getFieldDecorator('projectLeader', {
              rules: [{ required: true, message: '请选择负责人' }]
            })(
              <Select
                size="small"
              >
                {
                  // var team = teams.find(team => team._id === teamSelected);
                  this.leaderOption()
                }
              </Select>
            )}
          </Item>
          <Item label="优先级" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} style={{ margin: '0 0' }}>
            {getFieldDecorator('projectPriority', {
              // rules: [{ message: '请选择项目的执行优先级' }]
            })(
              <Select
                // onChange={this.handleProcessCost}
                size="small"
              >
                <Option value={1}>普通</Option>
                <Option value={2}>紧急</Option>
                <Option value={3}>非常紧急</Option>
              </Select>
            )}
          </Item>
          <Item label="描述" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} style={{ margin: '0 0' }}>
            {getFieldDecorator('projectDesc', {
              // rules: [{ required: true, message: '请输入项目名称' }]
            })(
              <Input
                allowClear
                // onChange={this.handleProcessName}
                size="small"
              />
            )}
          </Item>
          <Item label="备注" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} style={{ margin: '0 0' }}>
            {getFieldDecorator('projectRemark', {
              // rules: [{ required: true, message: '请输入项目名称' }]
            })(
              <Input
                allowClear
                // onChange={this.handleProcessName}
                size="small"
              />
            )}
          </Item>
          <Item label="总预算" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }} style={{ margin: '0 0' }}>
            {getFieldDecorator('projectBudge', {
            })(
              <InputNumber
                onChange={this.handleBudge}
                size="small"
              />
            )}
          </Item>
          <Item label="差旅费预算" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }} style={{ margin: '0 0' }}>
            {getFieldDecorator('travelBudge', {
              rules: [{ validator: this.validateBudge }]
            })(
              <InputNumber
                disabled={budge ? false : true}
                size="small"
              />
            )}
          </Item>
          <Item label="材料费预算" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }} style={{ margin: '0 0' }}>
            {getFieldDecorator('stuffBudge', {
              rules: [{ validator: this.validateBudge }]
            })(
              <InputNumber
                disabled={budge ? false : true}
                size="small"
              />
            )}
          </Item>
          <Item label="文献出版费预算" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }} style={{ margin: '0 0' }}>
            {getFieldDecorator('publishBudge', {
              rules: [{ validator: this.validateBudge }]
            })(
              <InputNumber
                disabled={budge ? false : true}
                size="small"
              />
            )}
          </Item>
          <Item label="劳务费预算" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }} style={{ margin: '0 0' }}>
            {getFieldDecorator('laborBudge', {
              rules: [{ validator: this.validateBudge }]
            })(
              <InputNumber
                disabled={budge ? false : true}
                size="small"
              />
            )}
          </Item>
          <Item label="专家咨询费预算" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }} style={{ margin: '0 0' }}>
            {getFieldDecorator('consultBudge', {
              rules: [{ validator: this.validateBudge }]
            })(
              <InputNumber
                disabled={budge ? false : true}
                size="small"
              />
            )}
          </Item>
          <Item label="设备费预算" labelCol={{ span: 6 }} wrapperCol={{ span: 12 }} style={{ margin: '0 0' }}>
            {getFieldDecorator('deviceBudge', {
              rules: [{ validator: this.validateBudge }]
            })(
              <InputNumber
                disabled={budge ? false : true}
                size="small"
              />
            )}
          </Item>
        </Form>
      </Modal>
    </>;
  }
}

export default MyProject;
