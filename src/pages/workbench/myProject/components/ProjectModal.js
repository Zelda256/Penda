import React, { PureComponent } from 'react';
import { Modal, Spin, Avatar, Icon, DatePicker, Progress, Input, Form, Select, Transfer, InputNumber } from 'antd';
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

@connect(({ myProjects }) => ({
  projects: myProjects.projects,
}))
@Form.create()
class ProjectModal extends PureComponent {
  constructor() {
    super();
    this.state = {
      project: null,
      visible: true,
      processInputVsb: false,
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
  showProcessInput = () => {
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
    this.showProcessInput();
  }
  processStatusChange = () => {

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
    return null;
  }
  render() {
    console.log('project', this.state.project);
    const { project, newProcess } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return <>
      <Modal
        visible={this.state.visible}
        title='项目详情'
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width='1200px'
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
                <label className={styles.leftLabel}><Icon type="flag" /><span>  优先级</span></label>
                <div className={project.priority === 1 ? styles.priority1 : project.priority === 2 ? styles.priority2 : styles.priority3}>{
                  project.priority === 1 ? '普通' : project.priority === 2 ? '紧急' : '非常紧急'
                }
                </div>
              </div>
              <div className={styles.modalLeftRow}>
                <label className={styles.leftLabel}><Icon type="profile" /><span>  描述</span></label>
                <div className={styles.remark}>{project.description ? project.description : '无'}</div>
              </div>
              <div className={styles.modalLeftRow}>
                <label className={styles.leftLabel}><Icon type="file-text" /><span>  备注</span></label>
                <div className={styles.remark}>{project.remark ? project.remark : '无'}</div>
              </div>
              <div className={styles.modalLeftRow}>
                <label className={styles.leftLabel}><Icon type="money-collect" /><span>  预算</span></label>
                <div className={styles.mind}>
                  {project.moneyType === 'RMB' ? '￥ ' : project.moneyType === 'Dollar' ? '$ ' : ''}
                  {project.budget ? project.budget : '--'}
                </div>
              </div>
              <div className={styles.modalLeftRow}>
                <label className={styles.leftLabel}><Icon type="bell" /><span>  提醒</span></label>
                <div >
                  <div className={styles.mind}>无</div>
                </div>
              </div>
              <div className={styles.modalLeftTask}>
                <label className={styles.leftLabel}><Icon type="solution" /><span>  子任务</span></label>
                <div className={styles.task}>
                  {project.process.map(process => {
                    return <div key={process._id}>
                      <a className={styles.taskStatusMask}>{process.status === 1 ? '将进行:' : process.status === 2 ? '进行中:' : '已完成:'}</a>
                      <Select
                        className={styles.taskStatus}
                        value={process.status}
                        style={{ width: 60 }}
                        onChange={this.processStatusChange}
                        dropdownMatchSelectWidth={false}
                        size="small"
                      >
                        <Option value={1}>将进行</Option>
                        <Option value={2}>进行中</Option>
                        <Option value={3}>已完成</Option>
                      </Select>
                      <span>[ {moment(process.startDate).format('YYYY-MM-DD HH:mm')} </span>
                      <span> ：{moment(process.deadLine).format('YYYY-MM-DD HH:mm')} ]</span>
                      {process.member.map(member => <span key={member._id}> {member.name} </span>)}
                      <span> 负责 {process.name}</span>

                    </div>;
                  })}
                  <div className={styles.addTask}>
                    <div onClick={this.showProcessInput}>
                      <Icon type="plus-circle" theme="twoTone" /> 添加子任务
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div className={styles.modalRight}>
              <div className={styles.modalRightTop}>
                <p><Icon type="team" /> 执行团队 &middot; {project.team.name} ({project.team.member.length}) </p>
                {project.team.member.map(item => <Avatar src={item.avatar} key={item._id} />)}
              </div>
              <div className={styles.modalRightDown}>
                <span><Icon type="schedule" /> 进度</span>
                <div style={{ width: 300, display: 'inline-block', marginLeft: 16 }}>
                  <Progress percent={project.progress} size="small" />
                </div>
                <div className={styles.process}>
                  {
                    project.process && project.process.length ?
                      project.process.map(item => <div key={item._id}>
                        {item.member.map(member => <span key={member._id}>{member.name} </span>)}
                        {item.status === 1 ? ' 将进行 ' : item.status === 2 ? ' 进行中 ' : ' 已完成 '}
                        {item.name}
                      </div>) :
                      <div>---暂无动态---</div>
                  }
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
        onCancel={this.showProcessInput}
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
    </>;
  }
}
export default ProjectModal;
