import React, { PureComponent } from 'react';
import { Modal, Button, Typography, Spin, Avatar, Icon, DatePicker, Progress, Collapse, Input, Form, Select, Transfer, InputNumber, Divider } from 'antd';
import styles from './ProjectModal.less';
import { connect } from 'dva';
import moment from 'moment';
import _ from 'lodash';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { RangePicker } = DatePicker;
const { Item } = Form;
const { Option } = Select;
const { Panel } = Collapse;
// const { Text } = Typography;

@connect(({ myProjects }) => ({
  projects: myProjects.projects,
  refundAmount: myProjects.refundAmount,
}))
@Form.create()
class ProjectModal extends PureComponent {
  constructor() {
    super();
    this.state = {
      project: null,
      visible: true,
      processInputVsb: false,
      refundModal: false,
      refundAmount: null,  // 各项报销限额
      maxRefund: false,  // 剩余报销额度
      refundType: null,  // 报销类型
      refundProcess: null,  // 需报销的过程
      refundValue: null,  // 报销金额
      refundDate: null,
      handleRefundWarn: false,
      newProcess: {
        name: '',
        selectedKeys: [],
        targetKeys: [],
        startDate: null,
        deadLine: null,
        cost: 0,
      }
    };
  }
  handleCancel = () => {
    this.setState({
      visible: false
    });
    this.props.hide();
  }
  handleOk = () => {
    this.setState({
      visible: false
    });
    this.props.hide();
  }
  // 控制添加报销对话框是否显示
  handleRefundModal = () => {
    if (!this.state.refundModal) {
      const { dispatch } = this.props;
      dispatch({
        type: 'myProjects/getRefundAmount',
        payload: this.state.project._id,
      });
    }
    this.setState({
      refundModal: !this.state.refundModal,
    });
  }
  // 添加报销
  addRefund = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'myProjects/createRefund',
      payload: {
        userId: JSON.parse(window.sessionStorage.getItem('user'))._id,
        projectId: this.state.project._id,
        processId: this.state.refundProcess,
        type: this.state.refundType,
        value: this.state.refundValue,
        date: this.state.refundDate
      }
    });
    this.setState({
      refundType: null,  // 报销类型
      refundProcess: null,  // 需报销的过程
      refundValue: null,  // 报销金额
      refundDate: null,
    });
    this.handleRefundModal();
  }
  // 选择报销类型
  handleRufundType = (value) => {
    console.log(value);
    let max = 0;
    const { refundAmount } = this.state;
    switch (value) {
    case 1: {
      max = refundAmount.leftTravel;
      break;
    }
    case 2: {
      max = refundAmount.leftStuff;
      break;
    }
    case 3: {
      max = refundAmount.leftPublish;
      break;
    }
    case 4: {
      max = refundAmount.leftLabor;
      break;
    }
    case 5: {
      max = refundAmount.leftConsult;
      break;
    }
    case 6: {
      max = refundAmount.leftDevice;
      break;
    }
    default:
      max = false;
    }
    if (max) {
      this.setState({
        maxRefund: max,
        refundType: value,
      });
    }
  }
  // 选择报销子任务
  handleRefundProcess = (value) => {
    // console.log('????handleRefundProcess',value);
    this.setState({
      refundProcess: value,
    });
  }
  // 输入报销金额
  handleRufundInput = (value) => {
    console.log(value);
    if (value < 0 || value > this.state.maxRefund) {
      this.setState({
        refundValue: value,
        handleRefundWarn: true,
      });
    } else {
      this.setState({
        refundValue: value,
        handleRefundWarn: false,
      });
    }
  }
  // 输入报销日期
  handleRufundDate = (value, dateString) => {
    console.log(dateString);
    this.setState({
      refundDate: dateString,
    });
  }

  handleProcessInput = () => {
    this.setState({
      processInputVsb: !this.state.processInputVsb,
    });
  }
  // 添加任务/过程
  addProcess = () => {
    const { newProcess, project } = this.state;
    const { name, cost, targetKeys, startDate, deadLine } = newProcess;

    const currentDate = moment();
    const checkStatus = currentDate < moment(startDate) ? 1 : currentDate > moment(deadLine) ? 3 : 2;
    const { dispatch } = this.props;
    dispatch({
      type: 'myProjects/createProcess',
      payload: {
        projectId: project._id,
        process: {
          name,
          cost,
          member: targetKeys,
          startDate,
          deadLine,
          status: checkStatus
        }
      }
    });
    this.handleProcessInput();
  }
  // 更新子任务状态
  processStatusChange = (processId, value) => {
    // console.log(id, value);
    const { dispatch } = this.props;
    dispatch({
      type: 'myProjects/updateProcessStatus',
      payload: {
        processId,
        body: {
          status: value,
          projectId: this.state.project._id,
        }
      }
    });
  }
  // 修改任务名称
  handleProcessName = (e) => {
    const newProcessCopy = _.cloneDeep(this.state.newProcess);  // 深拷贝
    const name = e.target.value;
    newProcessCopy.name = name;
    this.setState({
      newProcess: newProcessCopy
    });
  }
  // 修改任务预算
  handleProcessCost = (value) => {
    const newProcessCopy = _.cloneDeep(this.state.newProcess);  // 深拷贝
    const cost = value;
    newProcessCopy.cost = cost;
    this.setState({
      newProcess: newProcessCopy
    });
  }
  // 修改任务时间
  handleProcessTime = (value, dateString) => {
    const newProcessCopy = _.cloneDeep(this.state.newProcess);  // 深拷贝
    const startDate = dateString[0];
    const deadLine = dateString[1];
    newProcessCopy.startDate = startDate;
    newProcessCopy.deadLine = deadLine;
    this.setState({
      newProcess: newProcessCopy
    });
  }
  // 修改任务执行者
  processMemberSelect = (sourceSelectedKeys, targetSelectedKeys) => {
    const newProcessCopy = _.cloneDeep(this.state.newProcess);  // 深拷贝
    const selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys];
    newProcessCopy.selectedKeys = selectedKeys;
    this.setState({
      newProcess: newProcessCopy
    });
  }
  // 修改任务执行者
  handleprocessMember = (nextTargetKeys) => {
    const newProcessCopy = _.cloneDeep(this.state.newProcess);  // 深拷贝
    const targetKeys = nextTargetKeys;
    newProcessCopy.targetKeys = targetKeys;
    this.setState({
      newProcess: newProcessCopy
    });
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.project && nextProps.project !== prevState.project) {
      return {
        project: nextProps.project,
      };
    }
    if (nextProps.refundAmount && nextProps.refundAmount !== prevState.refundAmount) {
      return {
        refundAmount: nextProps.refundAmount,
      };
    }
    return null;
  }
  render() {
    console.log('project', this.state.project);
    // console.log('refundAmount', this.state.refundAmount);
    // console.log('this.state.handleRefundWarn', this.state.handleRefundWarn.toString());
    const userName = JSON.parse(window.sessionStorage.getItem('user')).name;
    const userId = JSON.parse(window.sessionStorage.getItem('user'))._id;
    const { project, newProcess, refundAmount } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return <>
      <Modal
        visible={this.state.visible}
        title="项目详情"
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width='1080px'
        footer={null}
        centered={true}
        destroyOnClose={true}
      >
        {!this.state.project ? <Spin /> :
          <>
            <div className={styles.modalLeft}>
              <h2>{project.name}</h2>
              <div className={styles.modalLeftRow}>
                <label className={styles.leftLabel}><Icon type="check-square" /><span> 状态</span></label>
                <label className={styles.status}>{
                  project.status !== 3 ?
                    <span><Icon type="border" /> 未完成</span> :
                    <span><Icon type="check-square" /> 已完成</span>}
                </label>
              </div>
              <div className={styles.modalLeftRow}>
                <label className={styles.leftLabel}><Icon type="user" /><span>  负责人</span></label>
                <label style={{ padding: '6px 8px', cursor: 'pointer' }}>
                  <Avatar size="small" src={project.creator.avatar} />
                  <span> {project.creator.name}</span>
                </label>
              </div>
              <div className={styles.modalLeftRow}>
                <label className={styles.leftLabel}><Icon type="calendar" /><span>  时间</span></label>
                <label style={{ paddingLeft: 6 }}>
                  <RangePicker
                    showTime={{ format: 'HH:mm' }}
                    value={[moment(project.startDate), moment(project.deadLine)]}
                  />
                </label>
              </div>
              <div className={styles.modalLeftRow}>
                <label className={styles.leftLabel}><Icon type="profile" /><span>  描述</span></label>
                <div className={styles.remark}>{project.description ? project.description : '无'}</div>
              </div>
              <div className={styles.modalLeftRow}>
                <label className={styles.leftLabel}><Icon type="flag" /><span>  优先级</span></label>
                <div className={project.priority === 1 ? styles.priority1 : project.priority === 2 ? styles.priority2 : styles.priority3}>{
                  project.priority === 1 ? '普通' : project.priority === 2 ? '紧急' : '非常紧急'
                }
                </div>
              </div>
              <div className={styles.modalLeftRow}>
                <label className={styles.leftLabel}><Icon type="money-collect" /><span>  预算</span></label>
                <div className={styles.mind}>
                  <span>￥ </span>
                  {project.leftBudget ? project.leftBudget : '--'}
                  <span> / {project.budget ? project.budget : '--'}</span>
                  <Divider type="vertical" />
                  <a onClick={this.handleRefundModal}> 添加报销</a>
                </div>
              </div>
              <div className={styles.modalLeftRow}>
                <label className={styles.leftLabel}><Icon type="bell" /><span>  提醒</span></label>
                <div >
                  <div className={styles.mind}>
                    <a style={{ color: 'rgba(0, 0, 0, 0.65)' }}><Icon type="eye" /> 中期提醒</a>
                    <Divider type="vertical" />
                    <a style={{ color: 'rgba(0, 0, 0, 0.65)' }}><Icon type="eye" /> 结束提醒</a>
                    <Divider type="vertical" />
                    <a>添加提醒</a>
                  </div>
                </div>
              </div>
              <div className={styles.modalLeftRow}>
                <label className={styles.leftLabel}><Icon type="file-text" /><span>  备注</span></label>
                <div className={styles.remark}>{project.remark ? project.remark : '无'}</div>
              </div>


            </div>
            <div className={styles.modalRight}>
              <div className={styles.modalRightTop}>
                <p><Icon type="team" /> 执行团队 &middot; {project.team.name} ({project.team.member.length}) </p>
                {project.team.member.map(item => <Avatar src={item.avatar} key={item._id} />)}
              </div>
              <div className={styles.modalRightDown}>
                <span><Icon type="schedule" /> 进度</span>
                <div style={{ width: 320, display: 'inline-block', marginLeft: 16 }}>
                  <Progress percent={project.progress} size="small" />
                </div>
                <div className={styles.taskWrap}>
                  <Icon type="solution" /><span>  子任务</span>
                  <span className={styles.addTask} onClick={this.handleProcessInput}>
                    <Icon type="plus-circle" theme="twoTone" /> 添加子任务
                  </span>
                  <div className={styles.taskList}>
                    <Collapse
                      bordered={false}
                    >
                      {project.process.map(process => {
                        return <Panel
                          key={process._id}
                          header={<div>
                            {process.status === 3 ? <Icon type="check-square" /> : <Icon type="border" />}
                            <span> {process.name}</span>
                          </div>}
                        >
                          <div>
                            <span>状态： </span>
                            <a className={styles.taskStatusMask}>{process.status === 1 ? '将进行' : process.status === 2 ? '进行中' : '已完成'}</a>
                            <Select
                              className={styles.taskStatus}
                              value={process.status}
                              style={{ width: 60 }}
                              onChange={(value) => this.processStatusChange(process._id, value)}
                              dropdownMatchSelectWidth={false}
                              size="small"
                            >
                              <Option key={1} value={1}>将进行</Option>
                              <Option key={2} value={2}>进行中</Option>
                              <Option key={3} value={3}>已完成</Option>
                            </Select>
                          </div>
                          <div>
                            <span>时间： </span>
                            <span>{moment(process.startDate).format('YYYY-MM-DD HH:mm')} </span>
                            <span> ：{moment(process.deadLine).format('YYYY-MM-DD HH:mm')}</span>
                          </div>
                          <div>
                            <span>成员： </span>
                            {process.member.map(member => <span key={member._id}><Avatar src={member.avatar} size="small" /> {member.name} </span>)}
                          </div>
                          <div>
                            <span>预算： </span>
                            {process.budge ? <span>{process.budge}</span> : <span>--</span>}
                          </div>
                          <div>
                            <span>支出： </span>
                            {process.cost ? <span>{process.cost}</span> : <span>--</span>}
                          </div>

                        </Panel>;
                      })}
                    </Collapse>
                  </div>
                </div>
              </div>
            </div>
          </>
        }
      </Modal>
      <Modal
        title="添加子任务"
        visible={this.state.processInputVsb}
        onOk={this.addProcess}
        onCancel={this.handleProcessInput}
        okText="添加"
        cancelText="取消"
      >
        <Form
          layout="horizontal"
        >
          <Item label="任务名称" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
            {getFieldDecorator('processName', {
              rules: [{ required: true, message: '请输入任务名称' }]
            })(
              <Input
                allowClear
                onChange={this.handleProcessName}
                size="small"
              />
            )}
          </Item>
          <Item label="执行预算" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
            {getFieldDecorator('processCost', {
              rules: [{ message: '请输入任务的执行预算' }]
            })(
              <InputNumber
                onChange={this.handleProcessCost}
                size="small"
              />
            )}
          </Item>
          <Item label="任务时间" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
            {getFieldDecorator('processTime', {
              rules: [{ required: true }]
            })(
              !project ? <Spin /> : <RangePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                onChange={this.handleProcessTime}
                locale={locale}  // 中文
                disabledDate={current => {  // 禁止选择除项目进行期间以外的日期
                  return current < moment(project.startDate).endOf('day') ||
                    current > moment(project.deadLine).endOf('day');
                }}
                size="small"
              />
            )}
          </Item>
          <Item label="执行者">
            {getFieldDecorator('processMember', {
              rules: [{ required: true, message: '请选择执行者' }]
            })(
              !project ? <Spin /> : <div>
                <Transfer
                  rowKey={record => record._id}
                  dataSource={project.team.member}
                  locale={{ itemUnit: '项', itemsUnit: '项', notFoundContent: '列表为空' }}
                  titles={['项目执行团队', '该任务执行者']}
                  targetKeys={newProcess.targetKeys}
                  selectedKeys={newProcess.selectedKeys}
                  render={item => item.name}
                  onChange={this.handleprocessMember}
                  onSelectChange={this.processMemberSelect}
                />
              </div>
            )}
          </Item>
        </Form>
      </Modal>
      <Modal
        title="添加报销"
        visible={this.state.refundModal}
        onOk={this.addRefund}
        onCancel={this.handleRefundModal}
        okText="添加"
        cancelText="取消"
      >
        {refundAmount === null ?
          <Spin /> :
          <Form layout="horizontal">
            <p>报销人：{userName}</p>
            <Item label="子任务" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
              {getFieldDecorator('refundProcess', {
                rules: [{ required: true, message: '请选择一个需报销的子任务' }]
              })(
                <Select style={{ width: 280 }} onChange={this.handleRefundProcess}>
                  {project.process.map(process => {
                    if (process.member.find(member => member._id === userId)) {
                      return <Option key={process._id} value={process._id}>{process.name}</Option>;
                    }
                  })}
                </Select>
              )}
            </Item>
            <Item label="报销类型" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
              {getFieldDecorator('refundType', {
                rules: [{ required: true, message: '请选择报销类型' }]
              })(
                <Select style={{ width: 280 }} onChange={this.handleRufundType}>
                  <Option key={1} value={1}>差旅费（限额:{refundAmount.maxTravel}、剩余:{refundAmount.leftTravel}）</Option>
                  <Option key={2} value={2}>材料费（限额:{refundAmount.maxStuff}、剩余:{refundAmount.leftStuff}）</Option>
                  <Option key={3} value={3}>文献出版费（限额:{refundAmount.maxPublish}、剩余:{refundAmount.leftPublish}）</Option>
                  <Option key={4} value={4}>劳务费（限额:{refundAmount.maxLabor}、剩余:{refundAmount.leftLabor}）</Option>
                  <Option key={5} value={5}>专家咨询费（限额:{refundAmount.maxConsult}、剩余:{refundAmount.leftConsult}）</Option>
                  <Option key={6} value={6}>设备费（限额:{refundAmount.maxDevice}、剩余:{refundAmount.leftDevice}）</Option>
                </Select>
              )}
            </Item>
            <Item label="报销金额" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
              {getFieldDecorator('refundMoney', {
                rules: [{ required: true, message: '请输入报销金额' }]
              })(
                <span>
                  <InputNumber
                    onChange={this.handleRufundInput}
                  />
                  {this.state.maxRefund === false ? <span></span> :
                    !this.state.refundValue ? <span></span> :
                      this.state.handleRefundWarn ? <Icon type="close-circle" style={{ fontSize: 18, color: '#CC3333', marginLeft: 8 }} /> :
                        <Icon type="check-circle" style={{ fontSize: 18, color: '#99CC66', marginLeft: 8 }} />}
                </span>
              )}
            </Item>
            <Item label="日期" labelCol={{ span: 4 }} wrapperCol={{ span: 16 }}>
              {getFieldDecorator('refundDate', {
                rules: [{ required: true, message: '请输入日期' }]
              })(
                <DatePicker
                  onChange={this.handleRufundDate}
                  locale={locale}  // 中文
                  format="YYYY-MM-DD"
                  disabledDate={current => {  // 禁止选择除项目进行期间以外的日期
                    return current < moment(project.startDate).endOf('day') ||
                      current > moment().endOf('day');
                  }}
                  dateRender={(current) => {
                    return (
                      <div className="ant-calendar-date">
                        {current.date()}
                      </div>
                    );
                  }}
                />
              )}
            </Item>

          </Form>}

      </Modal>
    </>;
  }
}
export default ProjectModal;
